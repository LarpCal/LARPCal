import express, { type Request } from "express";
import { NewsletterManager } from "../models/NewsletterManager.ts";
import { ensureAdmin } from "../middleware/auth.ts";
import { isEmailArray, toValidId } from "../utils/helpers.ts";
import OrgManager from "../models/OrgManager.ts";
import { UnauthorizedError } from "../utils/expressError.ts";

const router = express.Router();

const manager = new NewsletterManager();

router.get("/", ensureAdmin, async (req, res) => {
  const newsletters = await manager.getNewsletters();
  res.json({ newsletters });
});

router.post("/", ensureAdmin, async (req, res) => {
  const { subject, text } = req.body;
  const newsletter = await manager.createNewsletter(subject, text);
  res.status(201).json({ newsletter });
});

router.get("/:id", async (req, res) => {
  const newsletterId = toValidId(req.params.id);
  const newsletter = await manager.getNewsletter(newsletterId);
  const org = newsletter.orgId
    ? await OrgManager.getOrgById(newsletter.orgId)
    : null;
  if (!newsletter.sentAt) {
    const user = res.locals.user;
    if (!user) {
      throw new UnauthorizedError(
        "Must be logged in to view draft newsletters",
      );
    }
    if (org && user.isAdmin !== true) {
      if (user.username !== org.username) {
        throw new UnauthorizedError(
          "Not authorized to view this draft newsletter",
        );
      }
    }
  }
  const ret = org ? { ...newsletter, orgName: org.orgName } : newsletter;
  res.json(ret);
});

router.put("/:id", ensureAdmin, async (req: Request<{ id: string }>, res) => {
  const newsletterId = toValidId(req.params.id);
  const { subject, text } = req.body;
  const newsletter = await manager.updateNewsletter(
    newsletterId,
    subject,
    text,
  );
  res.json({ newsletter });
});

router.delete(
  "/:id",
  ensureAdmin,
  async (req: Request<{ id: string }>, res) => {
    const newsletterId = toValidId(req.params.id);
    const deleted = await manager.deleteNewsletter(newsletterId);
    res.json({ deleted });
  },
);

router.post(
  "/:id/test",
  ensureAdmin,
  async (req: Request<{ id: string }>, res) => {
    const newsletterId = toValidId(req.params.id);
    const { testEmails } = req.body;
    if (!isEmailArray(testEmails)) {
      throw new UnauthorizedError("Invalid test email addresses");
    }
    const result = await manager.sendTestNewsletter(newsletterId, testEmails);
    res.json({ result });
  },
);

router.post(
  "/:id/send",
  ensureAdmin,
  async (req: Request<{ id: string }>, res) => {
    const newsletterId = toValidId(req.params.id);
    const result = await manager.sendNewsletter(newsletterId);
    res.json({ result });
  },
);

export default router;
