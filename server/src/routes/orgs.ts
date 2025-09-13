import express from 'express';
import { Request, Response, NextFunction } from 'express';
import {
  ensureAdmin,
  ensureLoggedIn,
  ensureOrganizer,
  ensureMatchingOrganizerOrAdmin,
  ensureOwnerOrAdmin,
} from '../middleware/auth';
import readMultipart from '../middleware/multer';
const router = express.Router();

import { BadRequestError } from '../utils/expressError';

import jsonschema from 'jsonschema';
import orgForCreateSchema from '../schemas/orgForCreate.json';
import orgForUpdateSchema from '../schemas/orgForUpdate.json';
import orgApprovalSchema from '../schemas/orgApproval.json';
import OrgManager from '../models/OrgManager';

/** POST /
 *  Creates and returns a new org record
 *
 * @returns orgs: [Org,...]
 * @auth admin
 */
router.post(
  '/',
  ensureLoggedIn,
  // readMultipart("image"),

  async function (req: Request, res: Response, next: NextFunction) {
    const validator = jsonschema.validate(req.body, orgForCreateSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs: (string | undefined)[] = validator.errors.map(
        (e: Error) => e.stack,
      );
      throw new BadRequestError(errs.join(', '));
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
router.get(
  '/:id',
  async function (req: Request, res: Response, next: NextFunction) {
    const org = await OrgManager.getOrgById(+req.params.id);
    return res.json({ org });
  },
);

/** GET /
 *  Returns a list of all orgs without submodel data
 *
 * @returns orgs: [Organization,...]
 */

router.get(
  '/',
  async function (req: Request, res: Response, next: NextFunction) {
    const orgs = await OrgManager.getAllOrgs();
    return res.json({ orgs });
  },
);

/** DELETE /[id]
 *  Deletes an org
 *
 * @returns {deleted: Organization}
 *
 */

router.delete(
  '/:id',
  ensureMatchingOrganizerOrAdmin,
  async function (req: Request, res: Response, next: NextFunction) {
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
  '/:id',
  ensureLoggedIn,
  ensureMatchingOrganizerOrAdmin,
  async function (req: Request, res: Response, next: NextFunction) {
    const validator = jsonschema.validate(req.body, orgForUpdateSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs: (string | undefined)[] = validator.errors.map(
        (e: Error) => e.stack,
      );
      throw new BadRequestError(errs.join(', '));
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
  '/:id/approval',
  ensureLoggedIn,
  ensureAdmin,
  async function (req: Request, res: Response, next: NextFunction) {
    const validator = jsonschema.validate(req.body, orgApprovalSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs: (string | undefined)[] = validator.errors.map(
        (e: Error) => e.stack,
      );
      throw new BadRequestError(errs.join(', '));
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
  '/:id/image',
  ensureMatchingOrganizerOrAdmin,
  readMultipart('image'),
  async function (req: Request, res: Response, next: NextFunction) {
    //TODO: test middleware

    if (!req.file) {
      throw new BadRequestError('Please attach an image');
    }
    const larp = await OrgManager.updateOrgImage(req.file, +req.params.id);

    return res.json(larp);
  },
);

export default router;
