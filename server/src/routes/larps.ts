import express from "express";
import { type Request, type Response } from "express";
import {
  ensureLoggedIn,
  ensureOrganizer,
  ensureOwnerOrAdmin,
  protectUnpublished,
} from "../middleware/auth.ts";
import readMultipart from "../middleware/multer.ts";
const router = express.Router();

import {
  BadRequestError,
  ExpressError,
  ForbiddenError,
} from "../utils/expressError.ts";

import LarpManager from "../models/LarpManager.ts";

import jsonschema from "jsonschema";
import larpForCreateSchema from "../schemas/larpForCreate.json" with { type: "json" };
import larpForUpdateSchema from "../schemas/larpForUpdate.json" with { type: "json" };
import { toValidId } from "../utils/helpers.ts";
import UserManager from "../models/UserManager.ts";
import { isValidAttendanceStatus } from "../utils/attendance.ts";

/** POST /
 *  Creates and returns a new larp record
 *
 * @returns larps: [Larp,...]
 * @auth organizer
 */
router.post(
  "/",
  ensureLoggedIn,
  ensureOrganizer,
  // readMultipart("image"),

  async function (req: Request, res: Response) {
    const validator = jsonschema.validate(req.body, larpForCreateSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs: (string | undefined)[] = validator.errors.map(
        (e: Error) => e.stack,
      );
      console.error("failed validation", errs.join(", "));
      throw new BadRequestError(errs.join(", "));
    }

    const larp = await LarpManager.createLarp(req.body);
    return res.status(201).json({ larp });
  },
);

/** POST /{id}/publish
 *  Creates and returns a new larp record
 *
 * @returns larps: [Larp,...]
 * @auth organizer
 */
router.post(
  "/:id/publish",
  ensureLoggedIn,
  ensureOwnerOrAdmin,
  // readMultipart("image"),

  async function (req: Request, res: Response) {
    const larp = await LarpManager.publishLarp(+req.params.id);
    return res.status(200).json({ larp });
  },
);

/** GET /id
 *  Returns a the larp with the given id
 *
 * @returns larps: [Larp,...]
 * @auth none
 */
router.get(
  "/:id",
  protectUnpublished,
  async function (req: Request<{ id: string }>, res: Response) {
    const id = toValidId(req.params.id);
    const [larp, attendance] = await Promise.all([
      LarpManager.getLarpById(id),
      LarpManager.getLarpAttendanceCountsById(id),
    ]);
    return res.json({ larp, attendance });
  },
);

/**
 * GET /[id]/attendees
 * Returns a list of attendees for a LARP.
 */
router.get(
  "/:id/attendees",
  ensureOwnerOrAdmin,
  async (req: Request<{ id: string }>, res: Response) => {
    const id = toValidId(req.params.id);
    const attendees = await LarpManager.getLarpAttendance(id);

    return res.json({ attendees });
  },
);

/** GET /
 *  Returns a list of all larps without submodel data
 * @query a LarpQuery object encoded in Base64
 * @returns larps: [Larp,...]
 */

router.get("/", async function (req: Request, res: Response) {
  if (req.query && req.query.q) {
    const q = req.query.q as string;
    const decodedQuery = atob(q);
    const query = JSON.parse(decodedQuery);
    const larps = await LarpManager.getAllLarps(query);
    res.json({ larps, query });
  } else {
    const larps = await LarpManager.getAllLarps();
    res.json({ larps });
  }
});

/** DELETE /[id]
 *  Deletes a larp and its submodel data
 *
 * @returns {deleted: Larp}
 *
 */

router.delete(
  "/:id",
  ensureOwnerOrAdmin,
  async function (req: Request<{ id: string }>, res: Response) {
    const id = toValidId(req.params.id);
    const deleted = await LarpManager.deleteLarpById(id);
    return res.json({ deleted });
  },
);

/** PUT /[id]
 * Updates a larp and its submodel data
 *
 * @returns {larp: Larp}
 */
router.put(
  "/:id",
  ensureOwnerOrAdmin,
  async function (req: Request, res: Response) {
    const validator = jsonschema.validate(req.body, larpForUpdateSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs: (string | undefined)[] = validator.errors.map(
        (e: Error) => e.stack,
      );
      console.error("validation error", errs.join(", "));
      throw new BadRequestError(errs.join(", "));
    }
    const larp = await LarpManager.updateLarp(req.body);
    return res.json({ larp });
  },
);

/** PUT /[id]/image
 * Expects a Content:multipart/form-data
 * Stores the attached image in s3 and updates the imageUrl accordingly
 * Returns the updated larp record
 */

router.put(
  "/:id/image",
  ensureOwnerOrAdmin,
  readMultipart("image"),
  async function (req: Request<{ id: string }>, res: Response) {
    if (!req.file) {
      throw new BadRequestError("Please attach an image");
    }

    const id = toValidId(req.params.id);

    try {
      const larp = await LarpManager.updateLarpImage(req.file, id);
      return res.json(larp);
    } catch {
      throw new ExpressError("Image upload failed");
    }
  },
);

/**
 * PUT /[id]/attend
 * Updates attendance for a LARP for the current user.
 */
router.put(
  "/:id/attend",
  ensureLoggedIn,
  protectUnpublished,
  async (req: Request<{ id: string }>, res: Response) => {
    const id = toValidId(req.params.id);
    const username = res.locals.user?.username;
    if (!username) {
      throw new ForbiddenError();
    }

    const status = req.body.status;
    if (!isValidAttendanceStatus(status)) {
      throw new BadRequestError("Invalid status provided");
    }

    try {
      const user = await UserManager.getUser(username);
      const attendees = await LarpManager.updateLarpAttendance({
        userId: user.id,
        larpId: id,
        status,
      });

      return res.json({
        id,
        attendance: status,
        attendees,
      });
    } catch {
      throw new ExpressError("Could not change attendance");
    }
  },
);

/**
 * PUT /[id]/attend/[username]
 * Allows LARP organizers to modify user attendance.
 */
router.put(
  "/:id/attend/:username",
  ensureOwnerOrAdmin,
  async (req: Request<{ username: string; id: string }>, res: Response) => {
    const larpId = toValidId(req.params.id);
    const username = req.params.username;

    const status = req.body.status;
    if (!isValidAttendanceStatus(status)) {
      throw new BadRequestError("Invalid attendance status");
    }

    try {
      const user = await UserManager.getUser(username);
      const attendees = await LarpManager.updateLarpAttendance({
        userId: user.id,
        larpId,
        status,
      });

      return res.json({
        id: larpId,
        attendance: status,
        attendees,
      });
    } catch {
      throw new ExpressError("Could not change attendance");
    }
  },
);

/** DELETE /[id]/image
 * Deletes the image associated with the recipeId in params from s3
 * and updates the imageUrl accordingly.
 */
// router.delete(
//   "/:id/image",
//   ensureOwnerOrAdmin,
//   async function (req: Request, res: Response) {

//     const larp = await LarpManager.deleteLarpImage(+req.params.id);
//     return res.json({ larp });
//   }
// );

export default router;
