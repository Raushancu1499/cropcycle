import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import {
  createItem,
  listMyInventory,
  getMyItem,
  updateMyItem,
  removeMyItem
} from "../controllers/inventoryController.js";

const router = express.Router();

// All routes here are for FARMER only
router.use(requireAuth, requireRole("FARMER"));

router.post("/", createItem);
router.get("/", listMyInventory);
router.get("/:id", getMyItem);
router.put("/:id", updateMyItem);
router.delete("/:id", removeMyItem);

export default router;
