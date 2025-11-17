import express from "express";
import prisma from "../config/prisma.js";

import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET chat history for an order
router.get("/:orderId", requireAuth, async (req, res) => {
  const orderId = Number(req.params.orderId);

  const messages = await prisma.chatMessage.findMany({
    where: { orderId },
    include: { sender: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" }
  });

  res.json({ messages });
});

export default router;
