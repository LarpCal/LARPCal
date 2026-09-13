import express, { type Request, type Response } from "express";
const router = express.Router();

import jsonschema from "jsonschema";
import userForCreateSchema from "../schemas/userForCreate.json" with { type: "json" };
import userUpdateSchema from "../schemas/userUpdate.json" with { type: "json" };

import { BadRequestError } from "../utils/expressError.ts";
import { createToken } from "../utils/tokens.ts";
import {
  ensureAdmin,
  ensureCorrectUserOrAdmin,
  ensureLoggedIn,
} from "../middleware/auth.ts";
import UserManager from "../models/UserManager.ts";
import LarpManager from "../models/LarpManager.ts";

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

router.get("/", ensureAdmin, async function (req: Request, res: Response) {
  const users = await UserManager.findAll();
  return res.json({ users });
});

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

router.get(
  "/:username/larps",
  ensureLoggedIn,
  async (req: Request<{ username: string }>, res) => {
    const larps = await LarpManager.getAllLarps();
    const future = [];
    const past = [];

    const now = new Date();
    for (const larp of larps) {
      if (larp.end >= now) {
        future.push(larp);
      } else {
        past.push(larp);
      }
    }

    res.json({
      future,
      past,
    });
  },
);

router.put(
  "/:username/larps",
  ensureCorrectUserOrAdmin,
  async (req: Request<{ username: string }>, res) => {
    return res.json({
      future: false,
      past: true,
    });
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
