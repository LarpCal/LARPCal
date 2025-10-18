import express from "express";
import { Request, Response } from "express";
import {
  ensureLoggedIn,
  ensureOrganizer,
  ensureOwnerOrAdmin,
  protectUnpublished,
} from "../middleware/auth";
import readMultipart from "../middleware/multer";
const router = express.Router();

import { BadRequestError, ExpressError } from "../utils/expressError";

import LarpManager from "../models/LarpManager";

import jsonschema from "jsonschema";
import larpForCreateSchema from "../schemas/larpForCreate.json";
import larpForUpdateSchema from "../schemas/larpForUpdate.json";

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

  async function (req: Request, res: Response) {
    const larp = await LarpManager.getLarpById(+req.params.id);
    return res.json({ larp });
  },
);

/** GET /
 *  Returns a list of all larps without submodel data
 * @query a LarpQuery object encoded in Base64
 * @returns larps: [Larp,...]
 */

router.get("/", async function (req: Request, res: Response) {
  if (req.query && req.query.q) {
    const q: string = req.query.q as string;
    const decodedQuery = atob(q);
    const query = JSON.parse(decodedQuery);
    const larps = await LarpManager.getAllLarps(query);
    res.json({ larps });
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
  async function (req: Request, res: Response) {
    const deleted = await LarpManager.deleteLarpById(+req.params.id);
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
  async function (req, res) {
    if (!req.file) {
      throw new BadRequestError("Please attach an image");
    }
    try {
      const larp = await LarpManager.updateLarpImage(req.file, +req.params.id);
      return res.json(larp);
    } catch {
      throw new ExpressError("Image upload failed");
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
