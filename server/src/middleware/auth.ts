'use strict';

export {};
import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from '../config';
import jwt from 'jsonwebtoken';
import { NotFoundError, UnauthorizedError } from '../utils/expressError';
import LarpManager from '../models/LarpManager';
import OrgManager from '../models/OrgManager';

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers?.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^[Bb]earer /, '').trim();

    try {
      res.locals.user = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      /* ignore invalid tokens (but don't store user!) */
    }
  }
  return next();
}

/** Middleware to use when user must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (res.locals.user?.username) return next();
  throw new UnauthorizedError();
}

/** Middleware to use when user must be logged in to an organizer account.
 *
 *  If not, raises Unauthorized.
 */

function ensureOrganizer(req: Request, res: Response, next: NextFunction) {
  if (res.locals.user?.username && res.locals.user?.isOrganizer === true) {
    return next();
  }

  throw new UnauthorizedError(
    'This account is not an approved organizer.  If you have recently been approved, you may need to log out and log back in to access organizer functionality',
  );
}

/** Middleware to use when user must be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req: Request, res: Response, next: NextFunction) {
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

function ensureCorrectUserOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = res.locals.user;
  const username = res.locals.user?.username;
  if (username && (username === req.params.username || user.isAdmin === true)) {
    return next();
  }

  console.log('unauth');
  throw new UnauthorizedError();
}

/** Middleware to use when they must provide a valid token & be the registered
 * owner of the Larp found in the url params.
 *
 *  If not, raises Unauthorized.
 */
async function ensureOwnerOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = res.locals.user;
  const username = res.locals.user?.username;
  const larp = await LarpManager.getLarpById(+req.params.id);
  if (
    username &&
    (username === larp.organization?.username || user.isAdmin === true)
  ) {
    return next();
  }

  console.log('unauth');
  throw new UnauthorizedError();
}

/** Middleware to use when a record may or may not be protected based on its
 * publication status.
 *
 *  If unpublished and user is not an owner or admin, returns 404.
 */
async function protectUnpublished(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = res.locals.user;
  const username = res.locals.user?.username;
  const larp = await LarpManager.getLarpById(+req.params.id);
  if (larp.isPublished === true) return next();
  if (
    username &&
    (username === larp.organization?.username || user.isAdmin === true)
  ) {
    return next();
  }

  console.log('unauth');
  throw new NotFoundError();
}

/** Middleware to use when they must provide a valid token & username must
 * match the username on the Organizer record being accessed
 *
 *  If not, raises Unauthorized.
 */
async function ensureMatchingOrganizerOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = res.locals.user;
  const username = res.locals.user?.username;
  const org = await OrgManager.getOrgById(+req.params.id);
  if (username && (username === org.username || user.isAdmin === true)) {
    return next();
  }

  console.log('unauth');
  throw new UnauthorizedError();
}

export {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureOrganizer,
  protectUnpublished,
  ensureCorrectUserOrAdmin,
  ensureOwnerOrAdmin,
  ensureMatchingOrganizerOrAdmin,
};
