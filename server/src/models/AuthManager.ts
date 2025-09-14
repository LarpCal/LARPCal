import { prisma } from "../prismaSingleton";
import { PasswordResetRequest } from "../types";
import { NotFoundError } from "../utils/expressError";

class AuthManager {
  static async createPasswordResetRequest(
    username: string,
  ): Promise<PasswordResetRequest> {
    const passwordResetRequest = await prisma.passwordResetRequest.create({
      data: {
        user: { connect: { username: username } },
        createdAt: new Date(),
      },
      include: { user: { select: { email: true } } },
    });

    return passwordResetRequest;
  }

  static async getPasswordResetRequest(id: number) {
    const passwordResetRequest = prisma.passwordResetRequest.findUniqueOrThrow({
      where: { id: id },
      include: { user: { select: { email: true } } },
    });

    return passwordResetRequest;
  }

  static async clearPasswordResetRequests(username: string) {
    try {
      const passwordResetRequest = await prisma.passwordResetRequest.deleteMany(
        {
          where: { username: username },
        },
      );
      return passwordResetRequest;
    } catch (e) {
      throw new NotFoundError("Record not found");
    }
  }
}

export default AuthManager;
