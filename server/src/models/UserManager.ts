import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

import { prisma } from "../prismaSingleton";
import { BCRYPT_WORK_FACTOR } from "../config";
import { PublicUser, UserForCreate, UserForUpdate } from "../types";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/expressError";
import { omitKeys } from "../utils/helpers";
import { NewsletterManager } from "./NewsletterManager";

const USER_INCLUDE_OBJ = {
  organization: {
    include: {
      imgUrl: true,
    },
  },
};

class UserManager {
  /**Authenticate a user with username/password
   * Returns User
   * Throws UnauthorizedError is user not found or wrong password.
   */
  static async authenticate(
    username: string,
    password: string,
  ): Promise<PublicUser> {
    const fullUserData = await prisma.user.findUnique({
      where: { username: username },
      include: USER_INCLUDE_OBJ,
    });

    if (fullUserData) {
      const isValid = await bcrypt.compare(password, fullUserData.password);
      if (isValid === true) {
        return userToPublicUser(fullUserData);
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register a user with userdata
   * Returns User
   * Throws BadRequestError on duplicates
   */
  static async register(userData: UserForCreate): Promise<PublicUser> {
    const user = await prisma.user.findUnique({
      where: { username: userData.username },
    });
    if (user) {
      throw new BadRequestError(`Username ${user.username} already exists`);
    }
    const email = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (email)
      throw new BadRequestError(
        "An account with that email address already exists",
      );

    const hashedPassword = await bcrypt.hash(
      userData.password,
      BCRYPT_WORK_FACTOR,
    );
    userData.password = hashedPassword;

    const savedUser = await prisma.user.create({
      data: {
        firstName: "",
        lastName: "",
        ...omitKeys(userData, "subscribed"),
        newsletterSubscribed: userData.subscribed,
        isAdmin: userData.isAdmin ?? false,
      },
      include: USER_INCLUDE_OBJ,
    });

    if (userData.subscribed) {
      const newsletterManager = new NewsletterManager();
      await newsletterManager.subscribeUser(savedUser.id);
    }

    return userToPublicUser(savedUser);
  }

  /** Returns a list of userData without passwords */
  static async findAll(): Promise<PublicUser[]> {
    const users = await prisma.user.findMany({
      include: USER_INCLUDE_OBJ,
    });
    return users.map(userToPublicUser);
  }

  /** Fetches a User by username.
   * Returns {username, firstName, lastName, email, isAdmin}
   * Throws NotFoundError on missing record
   */
  static async getUser(username: string): Promise<PublicUser> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { username },
        include: USER_INCLUDE_OBJ,
      });
      return userToPublicUser(user);
    } catch {
      throw new NotFoundError("User not found");
    }
  }

  static async getUserFollows(username: string) {
    try {
      const userFollows = await prisma.userFollow.findMany({
        where: { user: { username } },
        include: {
          org: {
            select: {
              id: true,
              orgName: true,
            },
          },
        },
      });
      return userFollows.map((follow) => ({
        email: follow.emails,
        ...follow.org,
      }));
    } catch {
      throw new NotFoundError("User not found");
    }
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */
  static async updateUser(
    username: string,
    userData: UserForUpdate,
  ): Promise<PublicUser> {
    if (userData.password) {
      userData.password = await bcrypt.hash(
        userData.password,
        BCRYPT_WORK_FACTOR,
      );
    }

    if (!userData || !Object.keys(userData).length) {
      throw new BadRequestError("No data provided");
    }

    try {
      // If we're setting user's subscription status, handle that first
      if (userData.subscribed !== undefined) {
        const user = await prisma.user.findUniqueOrThrow({
          where: { username },
        });

        // Only act if subscription status is changing
        if (userData.subscribed !== user.newsletterSubscribed) {
          const newsletterManager = new NewsletterManager();
          console.log(
            `Setting user ${user.username} subscription to`,
            userData.subscribed,
          );

          if (userData.subscribed) {
            await newsletterManager.subscribeUser(user.id);
          } else {
            await newsletterManager.unsubscribeUser(user.id);
          }
        }
      }

      const updatedUser = await prisma.user.update({
        where: { username },
        data: {
          ...omitKeys(userData, "subscribed"),
          newsletterSubscribed: userData.subscribed,
        },
        include: USER_INCLUDE_OBJ,
      });
      return userToPublicUser(updatedUser);
    } catch (err) {
      console.log(err);
      throw new NotFoundError("User not found");
    }
  }

  /** Delete given user from database; returns undefined. */
  static async deleteUser(username: string) {
    try {
      const deleted = await prisma.user.delete({
        where: { username },
      });
      return deleted.username;
    } catch {
      throw new NotFoundError("User not found");
    }
  }

  // end class
}

function userToPublicUser(
  user: Prisma.UserGetPayload<{
    include: { organization: { include: { imgUrl: true } } };
  }>,
): PublicUser {
  return {
    ...omitKeys(user, "password", "newsletterRemoteId", "newsletterSubscribed"),
    subscribed: user.newsletterSubscribed,
  };
}

export default UserManager;
