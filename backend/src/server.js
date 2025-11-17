import { createServer } from "http";
import { Server } from "socket.io";
import Redis from "ioredis";
import jwt from "jsonwebtoken";

import { createAdapter } from "@socket.io/redis-adapter";

import app from "./app.js";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

// Minimal Socket.IO for testing
export const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000",
    methods: ["GET", "POST"]
   },
  transports: ["websocket"]
});

// Redis Pub/Sub connections
const pub = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

const sub = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

pub.on("connect", () => console.log("Redis Pub connected"));
sub.on("connect", () => console.log("Redis Sub connected"));

// Attach adapter
io.adapter(createAdapter(pub, sub));

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Missing token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;  // attach user info to socket
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`AUTH SOCKET CONNECTED: ${socket.user.id} as ${socket.user.role}`);

  // Personal room for notifications
  const userRoom = `user:${socket.user.id}`;
  socket.join(userRoom);
console.log(`User ${socket.user.id} joined room ${userRoom}`);


  // Safe test response
  socket.emit("test-event", { 
    message: `Socket alive for ${socket.user.role}`, 
    userId: socket.user.id 
  });

  // Join order room
  socket.on("join-order", (orderId) => {
    const orderRoom = `order:${orderId}`;
    socket.join(orderRoom);
    console.log(`User ${socket.user.id} joined ${orderRoom}`);
  });

  // Chat messaging for the order room
  socket.on("chat-message", async ({ orderId, message }) => {
  const orderRoom = `order:${orderId}`;

  // Store message in DB
  await prisma.chatMessage.create({
    data: {
      orderId: Number(orderId),
      senderId: socket.user.id,
      message
    }
  });

  io.to(orderRoom).emit("chat-message", {
    orderId,
    from: socket.user.id,
    message,
    timestamp: Date.now()
  });
});


  socket.on("disconnect", () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});

app.get("/ping", (req, res) => {
  res.json({ pong: true });
});


httpServer.listen(PORT, () => {
  console.log(`WS + HTTP server running on ${PORT}`);
});
