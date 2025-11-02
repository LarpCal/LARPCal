import { prisma } from "../prismaSingleton";

export class NewsletterManager {
  public constructor(private orgId: number | null = null) {}

  public async getNewsletters() {
    return prisma.newsletter.findMany({
      where: { orgId: this.orgId },
      orderBy: { createdAt: "desc" },
    });
  }

  public async getNewsletter(newsletterId: number) {
    return prisma.newsletter.findFirstOrThrow({
      where: { id: newsletterId, orgId: this.orgId },
    });
  }

  public async createNewsletter(subject: string, text: string) {
    return prisma.newsletter.create({
      data: {
        orgId: this.orgId,
        subject,
        text,
      },
    });
  }

  public async verifyNewsletterBelongsToOrg(newsletterId: number) {
    if (this.orgId === null) {
      throw new Error("Organization ID is null");
    }
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
    });
    if (!newsletter || newsletter.orgId !== this.orgId) {
      throw new Error("Newsletter does not belong to organization");
    }
    return true;
  }

  public async updateNewsletter(
    newsletterId: number,
    subject: string,
    text: string,
  ) {
    if (this.orgId) {
      this.verifyNewsletterBelongsToOrg(newsletterId);
    }
    return prisma.newsletter.update({
      where: { id: newsletterId },
      data: {
        subject,
        text,
      },
    });
  }

  public async sendNewsletter(newsletterId: number, force = false) {
    let emails: string[];

    if (this.orgId) {
      if (force) {
        throw new Error("Organizations cannot force send newsletters");
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
}
