import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { browseMarketplace, listItem, unlistItem } from "../controllers/marketplaceController.js";

const router = express.Router();

// Public browsing (no login required)
router.get("/", browseMarketplace);

// Listing actions require FARMER
router.put("/:id/list", requireAuth, requireRole("FARMER"), listItem);
router.put("/:id/unlist", requireAuth, requireRole("FARMER"), unlistItem);

export default router;
