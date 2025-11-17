import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import { io } from "./server.js";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

import authRoutes from "./routes/authRoutes.js";
app.use("/auth", authRoutes);

import userRoutes from "./routes/userRoutes.js";
app.use("/user", userRoutes);

import inventoryRoutes from "./routes/inventoryRoutes.js";
app.use("/inventory", inventoryRoutes);

import marketplaceRoutes from "./routes/marketplaceRoutes.js";
app.use("/marketplace", marketplaceRoutes);

import orderRoutes from "./routes/orderRoutes.js";
app.use("/orders", orderRoutes);

import chatRoutes from "./routes/chatRoutes.js";
app.use("/chat", chatRoutes);


app.get("/test-ws", (req, res) => {
  io.emit("test-event", { message: "WebSocket alive!" });
  res.json({ status: "WS event emitted" });
});

export default app;
