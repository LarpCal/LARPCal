import express from "express";
import { NewsletterManager } from "../models/NewsletterManager";
import { ensureAdmin } from "../middleware/auth";
import { toValidId } from "../utils/helpers";

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

router.get("/:id", ensureAdmin, async (req, res) => {
  const newsletterId = toValidId(req.params.id);
  const newsletter = await manager.getNewsletter(newsletterId);
  res.json({ newsletter });
});

router.put("/:id", ensureAdmin, async (req, res) => {
  const newsletterId = toValidId(req.params.id);
  const { subject, text } = req.body;
  const newsletter = await manager.updateNewsletter(
    newsletterId,
    subject,
    text,
  );
  res.json({ newsletter });
});

router.delete("/:id", ensureAdmin, async (req, res) => {
  const newsletterId = toValidId(req.params.id);
  const deleted = await manager.deleteNewsletter(newsletterId);
  res.json({ deleted });
});

router.post("/:id/send", ensureAdmin, async (req, res) => {
  const newsletterId = toValidId(req.params.id);
  const result = await manager.sendNewsletter(newsletterId);
  res.json({ result });
});

export default router;
