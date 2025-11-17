import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";

const router = express.Router();

// test: only logged in users
router.get("/me", requireAuth, (req, res) => {
  res.json({ message: `Hi ${req.user.role}, your ID is ${req.user.id}` });
});

// test: farmers only
router.get("/farmer-zone", requireAuth, requireRole("FARMER"), (req, res) => {
  res.json({ secret: "This is farmer territory" });
});

// test: buyers only
router.get("/buyer-zone", requireAuth, requireRole("BUYER"), (req, res) => {
  res.json({ secret: "Buyers only. Farmers go away." });
});

export default router;
