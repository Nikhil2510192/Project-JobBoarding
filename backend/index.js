// backend/index.js
// Integrated Express + Socket.IO Server (FIXED)

import { app } from "./Middlewares/app.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "./db.config.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

// 1. Create HTTP server
const httpServer = createServer(app);

// 2. Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Track connected users
const connectedUsers = new Map();

// 3. Socket Authentication Middleware ✅ FIXED
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Auth Error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FIX: match JWT payload
    socket.userId = decoded.id;
    socket.userType = decoded.type || "user";

    next();
  } catch (err) {
    return next(new Error("Auth Error: Invalid token"));
  }
});

// 4. Socket Connection Handler
io.on("connection", async (socket) => {
  console.log(`🔌 User ${socket.userId} (${socket.userType}) connected`);

  connectedUsers.set(socket.userId, socket.id);

  // Personal room
  socket.join(`user_${socket.userId}`);

  // Company broadcast room
  if (socket.userType === "company") {
    socket.join("all_companies");
  }

  // Deliver pending notifications
  try {
    const pending = await prisma.notification.findMany({
      where: {
        userId: Number(socket.userId),
        delivered: false
      }
    });

    for (const n of pending) {
      socket.emit(n.type, n.data);
    }

    if (pending.length > 0) {
      await prisma.notification.updateMany({
        where: {
          userId: Number(socket.userId),
          delivered: false
        },
        data: { delivered: true }
      });

      console.log(`📨 Delivered ${pending.length} pending notifications`);
    }
  } catch (err) {
    console.error("⚠ Notification delivery error:", err);
  }

  socket.on("disconnect", () => {
    console.log(`🔌 User ${socket.userId} disconnected`);
    connectedUsers.delete(socket.userId);
  });
});

// 5. Make io available to Express
app.set("io", io);

// 6. Start server
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Optional exports
export { io, connectedUsers };