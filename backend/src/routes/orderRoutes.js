import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { placeOrder, listOrders,getOrdersForFarmer } from "../controllers/orderController.js";

const router = express.Router();

// Buyer only
router.use(requireAuth, requireRole("BUYER"));

router.post("/", placeOrder);
router.get("/", listOrders);

router.get("/farmer", requireAuth, requireRole("FARMER"), getOrdersForFarmer);


export default router;
