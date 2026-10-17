import express, { type Request, type Response } from "express";
import jsonschema from "jsonschema";
import ical from "ical-generator";

import userForCreateSchema from "../schemas/userForCreate.json" with { type: "json" };
import userUpdateSchema from "../schemas/userUpdate.json" with { type: "json" };
import userUpdateVisibilitySchema from "../schemas/userUpdateVisibility.json" with { type: "json" };

import { BadRequestError } from "../utils/expressError.ts";
import { createToken } from "../utils/tokens.ts";
import {
  ensureAdmin,
  ensureCorrectUserOrAdmin,
  ensureLoggedIn,
} from "../middleware/auth.ts";
import UserManager from "../models/UserManager.ts";
import LarpManager from "../models/LarpManager.ts";
import type { Larp, PublicUser, UserLarpVisibility } from "../types/index.ts";
import {
  ATTENDANCE_STATUS_GOING,
  keyToCalendarUrl,
  larpsToPastOrFuture,
} from "../utils/attendance.ts";
import { larpIdToUrl } from "../utils/larps.ts";
import { toInt } from "../utils/helpers.ts";

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { userId, username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req: Request, res: Response) {
  const validator = jsonschema.validate(req.body, userForCreateSchema, {
    required: true,
  });
  if (!validator.valid) {
    const errs = validator.errors.map((e: Error) => e.stack);
    console.log("validation failed", errs.join(", "));
    throw new BadRequestError(errs.join(", "));
  }

  const user = await UserManager.register(req.body);
  const token = createToken(user);
  return res.status(201).json({ user, token });
});

/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async (_req: Request, res: Response) => {
  const users = await UserManager.findAll();
  return res.json({ users });
});

router.get(
  "/larps",
  ensureLoggedIn,
  async (
    req: Request<
      never,
      { users: PublicUser[]; pages: number },
      never,
      { page?: string }
    >,
    res: Response,
  ) => {
    const { page: pageRaw } = req.query;
    const page = toInt(pageRaw);
    const { users, total } = await UserManager.findForListingPage(page, 50);
    res.json({ users, pages: Math.ceil(total / 50) });
  },
);

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get(
  "/:username",
  ensureCorrectUserOrAdmin,
  async (req: Request<{ username: string }>, res) => {
    const user = await UserManager.getUser(req.params.username);
    const following = await UserManager.getUserFollows(req.params.username);
    res.json({
      user: {
        ...user,
        following,
      },
    });
  },
);

/**
 * GET /[username]/larps
 * Gets a user's LARP attendance
 */
router.get(
  "/:username/larps",
  ensureLoggedIn,
  async (
    req: Request<
      { username: string },
      {
        visibility: UserLarpVisibility;
        past: Larp[] | null;
        future: Larp[] | null;
      },
      never,
      { showAll?: boolean }
    >,
    res,
  ) => {
    const { username } = req.params;
    const { showAll = false } = req.query;
    const includeAll = username === res.locals.user?.username && showAll;
    const larpVisibility = await UserManager.getUserLarpVisibility(username);

    if (!includeAll && !larpVisibility.past && !larpVisibility.future) {
      return res.json({
        visibility: larpVisibility,
        past: null,
        future: null,
      });
    }

    const larps = await LarpManager.getLarpsByUsername(
      includeAll
        ? {
            username,
            past: true,
            future: true,
          }
        : {
            username,
            ...larpVisibility,
            status: ATTENDANCE_STATUS_GOING,
          },
    );

    const { past, future } = larpsToPastOrFuture(larps);

    res.json({
      visibility: larpVisibility,
      past: larpVisibility.past || includeAll ? past : null,
      future: larpVisibility.future || includeAll ? future : null,
    });
  },
);

/**
 * PUT /[username]/larps
 * Updates a user's attendance visibility.
 */
router.put(
  "/:username/larps",
  ensureCorrectUserOrAdmin,
  async (
    req: Request<{ username: string }, UserLarpVisibility, UserLarpVisibility>,
    res: Response,
  ) => {
    const validator = jsonschema.validate(
      req.body,
      userUpdateVisibilitySchema,
      {
        required: true,
      },
    );
    if (!validator.valid) {
      const errs = validator.errors.map((e: Error) => e.stack);
      throw new BadRequestError(errs.join(", "));
    }

    const {
      params: { username },
      body,
    } = req;
    const larpVisibility = await UserManager.updateUserLarpVisibility({
      username,
      ...body,
    });

    return res.json(larpVisibility);
  },
);

router.get(
  "/:username/calendar",
  ensureCorrectUserOrAdmin,
  async (req: Request<{ username: string }>, res: Response) => {
    const { username } = req.params;

    const userKey = await UserManager.getUserCalendarKey(username);
    if (!userKey) {
      return res.json({ url: null });
    }

    res.json({ url: keyToCalendarUrl(username, userKey) });
  },
);

router.post(
  "/:username/calendar",
  ensureCorrectUserOrAdmin,
  async (req: Request<{ username: string }>, res: Response) => {
    const { username } = req.params;

    const userKey = await UserManager.generateUserCalendarKey(username);
    res.json({ url: keyToCalendarUrl(username, userKey) });
  },
);

router.delete(
  "/:username/calendar",
  ensureCorrectUserOrAdmin,
  async (req: Request<{ username: string }>, res: Response) => {
    const { username } = req.params;

    await UserManager.deleteUserCalendarKey(username);

    res.sendStatus(200);
  },
);

router.get(
  "/:username/calendar/share",
  async (
    req: Request<{ username: string }, unknown, never, { key: string }>,
    res: Response,
  ) => {
    const { key } = req.query;
    const { username } = req.params;
    if (!username || !key) {
      throw new BadRequestError("Missing username or key");
    }

    const userKey = await UserManager.getUserCalendarKey(username);
    if (userKey !== key) {
      throw new BadRequestError("Invalid key provided");
    }

    const larps = await LarpManager.getLarpsByUsername({
      username,
      past: true,
      future: true,
      status: ATTENDANCE_STATUS_GOING,
    });

    const calendar = ical({
      events: larps.map((larp) => ({
        id: larp.id,
        summary: larp.title,
        start: larp.start,
        end: larp.end,
        description: larp.description,
        organizer: larp.organization
          ? {
              email: larp.organization.email,
              name: larp.organization.orgName,
            }
          : null,
        location: `${larp.city}, ${larp.country}`,
        url: larpIdToUrl(larp.id),
      })),
      prodId: "-//larpcal.com//larp-feed//EN",
    });

    res.writeHead(200, {
      "Content-Disposition": 'attachment; filename="calendar.ics"',
      "Content-Type": "text/calendar; charset=utf-8",
    });

    res.end(calendar.toString());
  },
);

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch(
  "/:username",
  ensureCorrectUserOrAdmin,
  async (req: Request<{ username: string }>, res) => {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e: Error) => e.stack);
      throw new BadRequestError(errs.join(", "));
    }

    const user = await UserManager.updateUser(req.params.username, req.body);
    return res.json({ user });
  },
);

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req: Request<{ username: string }>, res: Response) {
    const deletedUser = await UserManager.deleteUser(req.params.username);
    return res.json({ deleted: deletedUser });
  },
);

export default router;
