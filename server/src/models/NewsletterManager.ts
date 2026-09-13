import * as Brevo from "@getbrevo/brevo";
import { Newsletter, User } from "@prisma/client";
import { AxiosError } from "axios";
import markdownit from "markdown-it";

import {
  BREVO_ADMIN_LIST_ID,
  BREVO_API_KEY,
  BREVO_SENDER_EMAIL,
  CORS_URL,
} from "../config";
import { prisma } from "../prismaSingleton";
import { omitKeys, toValidId } from "../utils/helpers";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/expressError";

type AnyUserId = number | string | User;

const md = markdownit();

export class NewsletterManager {
  public constructor(private orgId: number | null = null) {}

  public async getNewsletters() {
    const newsletters = await prisma.newsletter.findMany({
      where: { orgId: this.orgId || undefined },
      orderBy: { createdAt: "desc" },
    });
    return Promise.all(newsletters.map((nl) => this.cleanOutput(nl)));
  }

  public async getNewsletter(newsletterId: number) {
    return this.cleanOutput(this.loadNewsletter(newsletterId, false));
  }

  public async createNewsletter(
    subject: string,
    text: string,
    forceSend = false,
  ) {
    md.render(text);
    return this.cleanOutput(
      prisma.newsletter.create({
        data: {
          orgId: this.orgId,
          subject,
          text,
          forceSend,
        },
      }),
    );
  }

  public async updateNewsletter(
    newsletterId: number,
    subject: string,
    text: string,
  ) {
    await this.loadNewsletter(newsletterId);
    md.render(text);
    return this.cleanOutput(
      prisma.newsletter.update({
        where: { id: newsletterId },
        data: {
          subject,
          text,
        },
      }),
    );
  }

  public async deleteNewsletter(newsletterId: number) {
    await this.loadNewsletter(newsletterId, true, true);
    await prisma.newsletter.delete({
      where: { id: newsletterId },
    });
  }

  public async sendTestNewsletter(newsletterId: number, testEmails: string[]) {
    const newsletter = await this.loadNewsletter(newsletterId, true, true);

    const params = await this.getCampaignParams(newsletter);

    const instance = new Brevo.EmailCampaignsApi();
    instance.setApiKey(Brevo.EmailCampaignsApiApiKeys.apiKey, this.getApiKey());

    try {
      const res = await instance.createEmailCampaign(params);
      const campaignId = res.body.id;
      await instance.sendTestEmail(campaignId, { emailTo: testEmails });
      await instance.deleteEmailCampaign(campaignId);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Error sending test newsletter via Brevo:",
          error.response?.data,
        );
      } else {
        console.error("Unknown error sending test newsletter:", error);
      }
    }
  }

  public async sendNewsletter(newsletterId: number) {
    const newsletter = await this.loadNewsletter(newsletterId, true, true);

    if (this.orgId && newsletter.forceSend) {
      throw new BadRequestError("Organizations cannot force send newsletters");
    }

    const instance = new Brevo.EmailCampaignsApi();
    instance.setApiKey(Brevo.EmailCampaignsApiApiKeys.apiKey, this.getApiKey());

    const sentAt = new Date(Date.now() + 60 * 1000); // 1 minutes from now for processing time.

    const params = await this.getCampaignParams(newsletter);
    params.scheduledAt = sentAt.toISOString();

    try {
      const res = await instance.createEmailCampaign(params);
      console.log("Sent Brevo campaign with ID:", res.body.id);

      return prisma.newsletter.update({
        where: { id: newsletterId },
        data: { sentAt },
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Error sending newsletter via Brevo:",
          error.response?.data,
        );
      } else {
        console.error("Unknown error sending newsletter:", error);
      }
    }
  }

  public async deleteList() {
    if (!this.orgId) {
      throw new Error("Organization ID is required to delete list");
    }
    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: this.orgId },
    });

    if (!org.listId) {
      return;
    }

    const instance = new Brevo.ContactsApi();
    instance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, this.getApiKey());

    await instance.deleteList(toValidId(org.listId));
  }

  public async subscribeUser(userId: AnyUserId) {
    const user = await this.toUser(userId);

    await this.createOrUpdateContact(user, {
      listIds: [this.orgId ? await this.orgListId() : BREVO_ADMIN_LIST_ID],
    });
  }

  public async unsubscribeUser(userId: AnyUserId) {
    const user = await this.toUser(userId);

    if (!user.newsletterRemoteId) {
      return;
    }

    await this.createOrUpdateContact(user, {
      unlinkListIds: [
        this.orgId ? await this.orgListId() : BREVO_ADMIN_LIST_ID,
      ],
    });
  }

  public async updateUserEmail(userId: AnyUserId) {
    const user = await this.toUser(userId);

    await this.createOrUpdateContact(user, {
      emailBlacklisted: false, // Unblock the email if it's being updated.
      attributes: {
        EMAIL: user.email,
      },
    });
  }

  public async deleteUser(username: string) {
    const user = await this.toUser(username);

    if (!user.newsletterRemoteId) {
      return;
    }

    const instance = new Brevo.ContactsApi();
    instance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, this.getApiKey());

    try {
      await instance.deleteContact(user.newsletterRemoteId);
      await prisma.user.update({
        where: { username },
        data: { newsletterRemoteId: null },
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        // Contact not found, ignore
        return;
      }
      console.error("Error deleting contact from Brevo:", error);
    }
  }

  private async loadNewsletter(
    newsletterId: number,
    verify = true,
    unsent = false,
  ) {
    const newsletter = await prisma.newsletter.findFirst({
      where: { id: newsletterId },
    });
    if (!newsletter) {
      throw new NotFoundError("Newsletter not found");
    }
    if (verify && this.orgId !== null && newsletter.orgId !== this.orgId) {
      throw new UnauthorizedError("Newsletter does not belong to organization");
    }
    if (unsent && newsletter.sentAt) {
      throw new BadRequestError("Newsletter has already been sent");
    }

    return newsletter;
  }

  private async cleanOutput(newsletter: Newsletter | Promise<Newsletter>) {
    const nl = await newsletter;
    if (this.orgId) {
      return omitKeys(nl, "forceSend");
    }
    return nl;
  }

  private async getCampaignParams(
    newsletter: Newsletter,
  ): Promise<Brevo.CreateEmailCampaign> {
    const params: Brevo.CreateEmailCampaign = {
      sender: {
        name: "LARPCal",
        email: BREVO_SENDER_EMAIL ?? "noreply@larpcal.com",
      },
      name: "",
      recipients: {},
      utmCampaign: `newsletter-${newsletter.id}`,
    };

    let markdown = newsletter.text;

    if (this.orgId) {
      const org = await prisma.organization.findUniqueOrThrow({
        where: { id: this.orgId },
      });

      params.sender.name = org.orgName;
      params.replyTo = org.email;
      params.subject = `${newsletter.subject} - ${org.orgName} via LARPCal`;
      params.name = `${org.orgName} - ${newsletter.subject} (${newsletter.id})`;
      params.recipients!.listIds = [await this.orgListId()];

      markdown += `\n\nSent for ${org.orgName} via LARPCal. `;
    } else {
      params.name = `LARPCal - ${newsletter.subject} (${newsletter.id})`;
      params.subject = `${newsletter.subject} - LARPCal`;
      params.recipients!.listIds = [BREVO_ADMIN_LIST_ID];

      markdown += `\n\nSent by LARPCal. `;
    }

    markdown += `View this email online by [clicking here](${CORS_URL}/newsletters/${newsletter.id}).\n\n`;
    markdown += `Manage your [newsletter subscriptions here](${CORS_URL}/auth/login?redirect=/following).`;

    params.htmlContent = md.render(markdown);

    return params;
  }

  private getApiKey() {
    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not set");
    }
    return BREVO_API_KEY;
  }

  private async orgListId(orgId?: number) {
    orgId ??= this.orgId ?? undefined;
    if (!orgId) {
      throw new Error(
        "Organization ID is required to get organization list ID",
      );
    }
    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: orgId },
    });

    if (org.listId) {
      const listId = toValidId(org.listId);
      return listId;
    }

    const instance = new Brevo.ContactsApi();
    instance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, this.getApiKey());

    const {
      body: { folders },
    } = await instance.getFolders(1, 0);
    const folderId = folders?.at(0)?.id;
    if (!folderId) {
      throw new Error("No folder found in Brevo account");
    }

    const { body: list } = await instance.createList({
      name: `${org.orgName} Subscribers`,
      folderId,
    });

    await prisma.organization.update({
      where: { id: orgId },
      data: { listId: list.id.toString() },
    });

    return list.id;
  }

  private async toUser(user: AnyUserId): Promise<User> {
    if (typeof user === "number") {
      return prisma.user.findUniqueOrThrow({
        where: { id: user },
      });
    } else if (typeof user === "string") {
      return prisma.user.findUniqueOrThrow({
        where: { username: user },
      });
    }
    return user;
  }

  private async createOrUpdateContact(user: User, data: Brevo.UpdateContact) {
    const instance = new Brevo.ContactsApi();
    instance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, this.getApiKey());

    if (!user.newsletterRemoteId) {
      const { body } = await instance.createContact({
        email: user.email,
        extId: user.id.toString(),
        ...data,
      });
      const remoteId = body.id;
      if (!remoteId) {
        throw new Error("Failed to create contact in Brevo");
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { newsletterRemoteId: remoteId.toString() },
      });
    } else {
      await instance.updateContact(user.newsletterRemoteId, data);
    }
  }
}
