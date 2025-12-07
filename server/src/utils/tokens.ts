import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { PublicUser, UserToken } from "../types";

/** return signed JWT {username, isAdmin} from user data. */

export function createToken(user: PublicUser) {
  console.assert(
    user.isAdmin !== undefined,
    "createToken passed user without isAdmin property",
  );
  console.assert(
    !user.organization?.isApproved,
    "createToken passed user without an approved organizer",
  );

  const payload = {
    username: user.username,
    isOrganizer: !!user.organization,
    isApprovedOrganizer: user.organization?.isApproved,
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

export function isValidToken(
  token: string | jwt.JwtPayload,
): token is jwt.JwtPayload & UserToken {
  return (
    typeof token === "object" &&
    token !== null &&
    "username" in token &&
    "isOrganizer" in token &&
    "isAdmin" in token
  );
}
