import express from "express";
import { Request, Response } from "express";
import {
  ensureAdmin,
  ensureLoggedIn,
  ensureMatchingOrganizerOrAdmin,
} from "../middleware/auth";
import readMultipart from "../middleware/multer";
import { BadRequestError } from "../utils/expressError";

import jsonschema from "jsonschema";
import orgForCreateSchema from "../schemas/orgForCreate.json";
import orgForUpdateSchema from "../schemas/orgForUpdate.json";
import orgApprovalSchema from "../schemas/orgApproval.json";
import OrgManager from "../models/OrgManager";
import UserManager from "../models/UserManager";
import { NewsletterManager } from "../models/NewsletterManager";
import { toValidId } from "../utils/helpers";

const router = express.Router();

/** POST /
 *  Creates and returns a new org record
 *
 * @returns orgs: [Org,...]
 * @auth admin
 */
router.post(
  "/",
  ensureLoggedIn,
  // readMultipart("image"),

  async function (req, res) {
    const validator = jsonschema.validate(req.body, orgForCreateSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs: (string | undefined)[] = validator.errors.map(
        (e: Error) => e.stack,
      );
      throw new BadRequestError(errs.join(", "));
    }

    const org = await OrgManager.createOrg(req.body);
    return res.status(201).json({ org });
  },
);

/** GET /id
 *  Returns a the org with the given id
 *
 * @returns org: Organization
 * @auth none
 */
router.get("/:id", async function (req: Request, res: Response) {
  const { followers, ...org } = await OrgManager.getOrgById(+req.params.id);
  const username = res.locals.user?.username;
  return res.json({
    org: {
      ...org,
      followerCount: followers.length,
      isFollowedByUser: username
        ? followers.some((f) => f.user.username === username)
        : false,
    },
  });
});

/** GET /
 *  Returns a list of all orgs without submodel data
 *
 * @returns orgs: [Organization,...]
 */

router.get("/", async function (req: Request, res: Response) {
  const orgs = await OrgManager.getAllOrgs();
  return res.json({ orgs });
});

/** DELETE /[id]
 *  Deletes an org
 *
 * @returns {deleted: Organization}
 *
 */

router.delete(
  "/:id",
  ensureMatchingOrganizerOrAdmin,
  async function (req: Request, res: Response) {
    const deleted = await OrgManager.deleteOrgById(+req.params.id);
    return res.json({ deleted });
  },
);

/** PATCH /[id]
 * Updates a larp and its submodel data
 *
 * @returns {org: Organization}
 */
router.patch(
  "/:id",
  ensureLoggedIn,
  ensureMatchingOrganizerOrAdmin,
  async function (req: Request, res: Response) {
    const validator = jsonschema.validate(req.body, orgForUpdateSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs: (string | undefined)[] = validator.errors.map(
        (e: Error) => e.stack,
      );
      throw new BadRequestError(errs.join(", "));
    }
    const org = await OrgManager.updateOrg(req.body);
    return res.json({ org });
  },
);

/** PATCH /[id]/approval
 *  Sets the isApproval property for an organization.  Used by admins to set
 *  account permissions
 *
 * @returns {org: Organization}
 */
router.patch(
  "/:id/approval",
  ensureLoggedIn,
  ensureAdmin,
  async function (req: Request, res: Response) {
    const validator = jsonschema.validate(req.body, orgApprovalSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs: (string | undefined)[] = validator.errors.map(
        (e: Error) => e.stack,
      );
      throw new BadRequestError(errs.join(", "));
    }
    const org = await OrgManager.setApproved(req.body.id, req.body.isApproved);
    return res.json({ org });
  },
);

/** PUT /[id]/image
 * Expects a Content:multipart/form-data
 * Stores the attached image in s3 and updates the imageUrl accordingly
 * Returns the updated larp record
 */

router.put(
  "/:id/image",
  ensureMatchingOrganizerOrAdmin,
  readMultipart("image"),
  async function (req: Request, res: Response) {
    //TODO: test middleware

    if (!req.file) {
      throw new BadRequestError("Please attach an image");
    }
    const larp = await OrgManager.updateOrgImage(req.file, +req.params.id);

    return res.json(larp);
  },
);

router.put("/:id/follow", ensureLoggedIn, async (req, res) => {
  const username = res.locals.user.username as string;
  const user = await UserManager.getUser(username);

  const following = await OrgManager.follow(+req.params.id, user.id);

  res.json({ following });
});

/** Newsletters */

router.get(
  "/:id/newsletters",
  ensureMatchingOrganizerOrAdmin,
  async (req, res) => {
    const orgId = toValidId(req.params.id);

    const manager = new NewsletterManager(orgId);
    const newsletters = await manager.getNewsletters();

    res.json({ newsletters });
  },

  router.post(
    "/:id/newsletters",
    ensureMatchingOrganizerOrAdmin,
    async (req, res) => {
      const orgId = toValidId(req.params.id);

      const { subject, text } = req.body;
      if (!subject || !text) {
        throw new BadRequestError("Missing subject or text");
      }

      const manager = new NewsletterManager(orgId);
      const newsletter = await manager.createNewsletter(subject, text);

      res.status(201).json({ newsletter });
    },
  ),

  router.get(
    "/:id/newsletters/:newsletterId",
    ensureMatchingOrganizerOrAdmin,
    async (req, res) => {
      const orgId = toValidId(req.params.id);
      const newsletterId = toValidId(req.params.newsletterId);

      const manager = new NewsletterManager(orgId);
      const newsletter = await manager.getNewsletter(newsletterId);

      res.json({ newsletter });
    },
  ),

  router.put(
    "/:id/newsletters/:newsletterId",
    ensureMatchingOrganizerOrAdmin,
    async (req, res) => {
      const orgId = toValidId(req.params.id);
      const newsletterId = toValidId(req.params.newsletterId);

      const { subject, text } = req.body;
      if (!subject || !text) {
        throw new BadRequestError("Missing subject or text");
      }

      const manager = new NewsletterManager(orgId);
      const newsletter = await manager.updateNewsletter(
        newsletterId,
        subject,
        text,
      );

      res.json({ newsletter });
    },
  ),

  router.put(
    "/:id/newsletters/:newsletterId/send",
    ensureMatchingOrganizerOrAdmin,
    async (req, res) => {
      const orgId = toValidId(req.params.id);
      const newsletterId = toValidId(req.params.newsletterId);

      const manager = new NewsletterManager(orgId);
      await manager.sendNewsletter(newsletterId);

      res.json({ sent: true });
    },
  ),
);

export default router;
