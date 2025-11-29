import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { SECRET_KEY } from "../config";
import LarpManager from "../models/LarpManager";
import OrgManager from "../models/OrgManager";
import { NotFoundError, UnauthorizedError } from "../utils/expressError";
import { toValidId, toValidUsername } from "../utils/helpers";
import { isValidToken } from "../utils/tokens";

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers?.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^[Bb]earer /, "").trim();

    try {
      const payload = jwt.verify(token, SECRET_KEY);
      if (!isValidToken(payload)) {
        return next();
      }

      res.locals.user = payload;
    } catch {
      /* ignore invalid tokens (but don't store user!) */
    }
  }
  return next();
}

/** Middleware to use when user must be logged in.
 *
 * If not, raises Unauthorized.
 */
export function ensureLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.locals.user?.username) return next();
  throw new UnauthorizedError();
}

/** Middleware to use when user must be logged in to an organizer account.
 *
 *  If not, raises Unauthorized.
 */
export function ensureOrganizer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.locals.user?.username && res.locals.user?.isOrganizer === true) {
    return next();
  }

  throw new UnauthorizedError(
    "This account is not an approved organizer.  If you have recently been approved, you may need to log out and log back in to access organizer functionality",
  );
}

/** Middleware to use when user must be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */
export function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  if (res.locals.user?.username && res.locals.user?.isAdmin === true) {
    return next();
  }

  throw new UnauthorizedError();
}

/** Middleware to use when user must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */
export function ensureCorrectUserOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isAdmin = res.locals.user?.isAdmin;
  const username = toValidUsername(res);
  if (username === req.params.username || isAdmin) {
    return next();
  }

  throw new UnauthorizedError();
}

/** Middleware to use when they must provide a valid token & be the registered
 * owner of the Larp found in the url params.
 *
 *  If not, raises Unauthorized.
 */
export async function ensureOwnerOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isAdmin = res.locals.user?.isAdmin;
  const username = toValidUsername(res);
  const larpId = toValidId(req.params.id);
  const larp = await LarpManager.getLarpById(larpId);
  if (username === larp.organization?.username || isAdmin) {
    return next();
  }

  throw new UnauthorizedError();
}

/** Middleware to use when a record may or may not be protected based on its
 * publication status.
 *
 *  If unpublished and user is not an owner or admin, returns 404.
 */
export async function protectUnpublished(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isAdmin = res.locals.user?.isAdmin;
  const username = toValidUsername(res);
  const larpId = toValidId(req.params.id);
  const larp = await LarpManager.getLarpById(larpId);
  if (larp.isPublished === true) return next();
  if (username === larp.organization?.username || isAdmin) {
    return next();
  }

  throw new NotFoundError();
}

/** Middleware to use when they must provide a valid token & username must
 * match the username on the Organizer record being accessed
 *
 *  If not, raises Unauthorized.
 */
export async function ensureMatchingOrganizerOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = res.locals.user;
  const username = user?.username;
  const org = await OrgManager.getOrgById(+req.params.id);
  if (username && (username === org.username || user.isAdmin === true)) {
    return next();
  }

  throw new UnauthorizedError();
}
