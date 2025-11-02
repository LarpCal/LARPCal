import { Newsletter } from "@prisma/client";
import { prisma } from "../prismaSingleton";
import { omitKeys } from "../utils/helpers";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/expressError";

export class NewsletterManager {
  public constructor(private orgId: number | null = null) {}

  public async getNewsletters() {
    const newsletters = await prisma.newsletter.findMany({
      where: { orgId: this.orgId },
      orderBy: { createdAt: "desc" },
    });
    return Promise.all(newsletters.map((nl) => this.cleanOutput(nl)));
  }

  public async getNewsletter(newsletterId: number) {
    const newsletter = await prisma.newsletter.findFirst({
      where: { id: newsletterId, orgId: this.orgId },
    });
    if (!newsletter) {
      throw new NotFoundError("Newsletter not found");
    }
    return this.cleanOutput(newsletter);
  }

  public async createNewsletter(subject: string, text: string) {
    return this.cleanOutput(
      prisma.newsletter.create({
        data: {
          orgId: this.orgId,
          subject,
          text,
        },
      }),
    );
  }

  public async updateNewsletter(
    newsletterId: number,
    subject: string,
    text: string,
  ) {
    if (this.orgId) {
      this.verifyNewsletterBelongsToOrg(newsletterId);
    }
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
    if (this.orgId) {
      this.verifyNewsletterBelongsToOrg(newsletterId);
    }
    const newsletter = await this.getNewsletter(newsletterId);
    if (newsletter.sentAt) {
      throw new BadRequestError(
        "Cannot delete a newsletter that has been sent",
      );
    }
    await prisma.newsletter.delete({
      where: { id: newsletterId },
    });
  }

  public async sendNewsletter(newsletterId: number, force = false) {
    let emails: string[];

    const newsletter = await this.getNewsletter(newsletterId);
    if (newsletter.sentAt) {
      throw new BadRequestError("Newsletter has already been sent");
    }

    if (this.orgId) {
      if (force) {
        throw new BadRequestError(
          "Organizations cannot force send newsletters",
        );
      }
      this.verifyNewsletterBelongsToOrg(newsletterId);

      emails = await prisma.user
        .findMany({
          where: {
            following: {
              some: { orgId: this.orgId },
            },
          },
          select: { email: true },
        })
        .then((users) => users.map((user) => user.email));
    } else {
      emails = await prisma.user
        .findMany({
          // Only send to users who are subscribed unless force is true.
          where: force ? {} : { newsletterSubscribed: true },
          select: { email: true },
        })
        .then((users) => users.map((user) => user.email));
    }

    // TODO: Send newsletter here.
    console.log("Sending newsletter to emails:", emails);

    const now = new Date();
    await prisma.newsletter.update({
      where: { id: newsletterId },
      data: { sentAt: now },
    });
  }

  protected async verifyNewsletterBelongsToOrg(newsletterId: number) {
    if (this.orgId === null) {
      throw new BadRequestError("Organization ID is null");
    }
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
    });
    if (!newsletter) {
      throw new NotFoundError("Newsletter not found");
    }
    if (newsletter.orgId !== this.orgId) {
      throw new UnauthorizedError("Newsletter does not belong to organization");
    }
    return true;
  }

  protected async cleanOutput(newsletter: Newsletter | Promise<Newsletter>) {
    const nl = await newsletter;
    if (this.orgId) {
      return omitKeys(nl, "orgId", "forceSend");
    }
    return nl;
  }
}
