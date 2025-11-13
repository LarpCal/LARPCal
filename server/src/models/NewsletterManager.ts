import * as Brevo from "@getbrevo/brevo";
import { Newsletter, Prisma } from "@prisma/client";
import { AxiosError } from "axios";
import { marked } from "marked";

import {
  BREVO_ADMIN_SEGMENT_ID,
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
    await marked.parse(text, { async: true });
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
    await marked.parse(text, { async: true });
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

  public async createContact(userId: number, email: string) {
    const instance = new Brevo.ContactsApi();
    instance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, this.getApiKey());

    const { body } = await instance.createContact({
      email,
      listIds: [],
    });
    if (!body.id) {
      throw new Error("Failed to create contact in Brevo");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { newsletterRemoteId: body.id.toString() },
    });
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
      return omitKeys(nl, "forceSend", "campaignId");
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

      markdown += `\n\nSent for ${org.orgName} via LARPCal.`;
    } else {
      params.name = `LARPCal - ${newsletter.subject} (${newsletter.id})`;
      params.subject = `${newsletter.subject} - LARPCal`;
      params.recipients!.segmentIds = [BREVO_ADMIN_SEGMENT_ID];

      markdown += `\n\nSent by LARPCal.`;
    }

    markdown += ` View this email online by [clicking here](${CORS_URL}/newsletters/${newsletter.id}).

    Manage your [newsletter subscriptions here](${CORS_URL}/auth/login?redirect=/following).`;

    params.htmlContent = await marked.parse(markdown, { async: true });

    return params;
  }

  private async getSubscribedUserEmails(force = false) {
    let where: Prisma.UserWhereInput = {};
    if (this.orgId) {
      where = {
        following: {
          some: { orgId: this.orgId },
          every: { emails: true },
        },
      };
    } else if (!force) {
      where = { newsletterSubscribed: true };
    }
    const users = await prisma.user.findMany({
      where,
      select: { email: true },
    });
    return users.map((user) => user.email);
  }

  private getApiKey() {
    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not set");
    }
    return BREVO_API_KEY;
  }

  private async orgListId() {
    if (this.orgId === null) {
      throw new BadRequestError("Organization ID is null");
    }
    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: this.orgId },
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
      where: { id: this.orgId },
      data: { listId: list.id.toString() },
    });

    return list.id;
  }
}
