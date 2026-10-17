import bcrypt from "bcrypt";
import { Prisma } from "../generated/prisma/client.ts";

import { prisma } from "../prismaSingleton.ts";
import { BCRYPT_WORK_FACTOR } from "../config.ts";
import type {
  PublicUser,
  UserForCreate,
  UserForUpdate,
  UserLarpVisibility,
} from "../types/index.ts";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/expressError.ts";
import { omitKeys } from "../utils/helpers.ts";
import { NewsletterManager } from "./NewsletterManager.ts";
import {
  ATTENDANCE_VISIBILITY_FUTURE,
  ATTENDANCE_VISIBILITY_LISTED,
  ATTENDANCE_VISIBILITY_NONE,
  ATTENDANCE_VISIBILITY_PAST,
  userVisibility,
} from "../utils/attendance.ts";
import { randomUUID } from "node:crypto";

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
      await newsletterManager.subscribeUser(savedUser);
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

  static async findForListingPage(
    page = 0,
    maxPerPage = 50,
  ): Promise<{ users: PublicUser[]; total: number }> {
    const [listedUsers, countRows] = await Promise.all([
      prisma.$queryRaw<{ id: number }[]>`
        SELECT "id"
        FROM "users"
        WHERE ("eventVisibility" & ${ATTENDANCE_VISIBILITY_LISTED}) <> 0
        ORDER BY "id" ASC
        LIMIT ${maxPerPage}
        OFFSET ${page * maxPerPage}
      `,
      prisma.$queryRaw<{ total: bigint }[]>`
        SELECT COUNT(*) AS "total"
        FROM "users"
        WHERE ("eventVisibility" & ${ATTENDANCE_VISIBILITY_LISTED}) <> 0
      `,
    ]);
    const total = Number(countRows[0].total);

    if (!listedUsers.length) {
      return { users: [], total };
    }

    const users = await prisma.user.findMany({
      where: { id: { in: listedUsers.map(({ id }) => id) } },
      include: USER_INCLUDE_OBJ,
      orderBy: { id: "asc" },
    });
    return { users: users.map(userToPublicUser), total };
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

  static async getUserLarpVisibility(username: string) {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { username },
        include: USER_INCLUDE_OBJ,
      });
      return userVisibility(user.eventVisibility);
    } catch {
      throw new NotFoundError("User not found");
    }
  }

  static async getUserCalendarKey(username: string) {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: { username },
        include: USER_INCLUDE_OBJ,
      });
      return user.calendarKey;
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
      // Get existing user data.
      const oldUser = await prisma.user.findUniqueOrThrow({
        where: { username },
      });

      // Only act if subscription status is changing.
      const newsletterManager = new NewsletterManager();
      if (
        userData.subscribed !== undefined &&
        userData.subscribed !== oldUser.newsletterSubscribed
      ) {
        console.log(
          `Setting user ${oldUser.username} subscription to`,
          userData.subscribed,
        );

        if (userData.subscribed) {
          await newsletterManager.subscribeUser(oldUser);
        } else {
          await newsletterManager.unsubscribeUser(oldUser);
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

      // Update the email in Brevo if it has changed.
      if (oldUser.email !== updatedUser.email) {
        await newsletterManager.updateUserEmail(updatedUser);
      }

      return userToPublicUser(updatedUser);
    } catch (err) {
      console.log(err);
      throw new NotFoundError("User not found");
    }
  }

  static async updateUserLarpVisibility({
    username,
    listing,
    past,
    future,
  }: {
    username: string;
    listing: boolean;
  } & UserLarpVisibility) {
    let eventVisibility = ATTENDANCE_VISIBILITY_NONE;
    if (listing) {
      eventVisibility |= ATTENDANCE_VISIBILITY_LISTED;
    }
    if (past) {
      eventVisibility |= ATTENDANCE_VISIBILITY_PAST;
    }
    if (future) {
      eventVisibility |= ATTENDANCE_VISIBILITY_FUTURE;
    }

    const user = await prisma.user.update({
      where: { username },
      data: { eventVisibility },
      include: USER_INCLUDE_OBJ,
    });

    return userVisibility(user.eventVisibility);
  }

  static async generateUserCalendarKey(username: string) {
    try {
      const calendarKey = randomUUID();
      await prisma.user.update({ where: { username }, data: { calendarKey } });
      return calendarKey;
    } catch (err) {
      console.log(err);
      throw new NotFoundError("User not found");
    }
  }

  static async deleteUserCalendarKey(username: string) {
    try {
      await prisma.user.update({
        where: { username },
        data: { calendarKey: null },
      });
    } catch (err) {
      console.log(err);
      throw new NotFoundError("User not found");
    }
  }

  /** Delete given user from database */
  static async deleteUser(username: string) {
    try {
      // Remove user contact on deletion.
      const newsletters = new NewsletterManager();
      await newsletters.deleteUser(username);

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
    ...omitKeys(
      user,
      "password",
      "newsletterRemoteId",
      "newsletterSubscribed",
      "eventVisibility",
    ),
    subscribed: user.newsletterSubscribed,
  };
}

export default UserManager;
