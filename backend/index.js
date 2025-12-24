// index.js (Integrated Express and Socket.IO Server)

<<<<<<< HEAD
import { app } from "./Middlewares/app.js";
=======
import app from "./Middlewares/app.js";
>>>>>>> frontendv1
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

<<<<<<< HEAD
=======
// ⭐ ADDED — to fetch saved notifications
import  prisma  from './db.config.js';

>>>>>>> frontendv1
dotenv.config();

const PORT = process.env.PORT || 8000;

<<<<<<< HEAD
=======


>>>>>>> frontendv1
// 1. Setup Combined HTTP/WS Server
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
<<<<<<< HEAD
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
=======
        origin: process.env.FRONTEND_URL || "http://localhost:8080",
>>>>>>> frontendv1
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Store connected users for direct addressing
const connectedUsers = new Map();

// 2. Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
        return next(new Error("Auth Error: No token provided"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
<<<<<<< HEAD
        socket.userId = decoded.userId;
        socket.userType = decoded.userType || "user";
=======
        socket.userId = decoded.id;
        socket.userType = decoded.type || "user";
>>>>>>> frontendv1
        next();
    } catch (err) {
        return next(new Error("Auth Error: Invalid token"));
    }
});

// 3. WebSocket Connection Handler
<<<<<<< HEAD
io.on("connection", (socket) => {
=======
io.on("connection", async (socket) => {   // ⭐ CHANGED → made async
>>>>>>> frontendv1
    console.log(`🔌 User ${socket.userId} (${socket.userType}) connected`);
    
    // Store active connection
    connectedUsers.set(socket.userId, socket.id);
    
    // Join personal room for targeted notifications
    socket.join(`user_${socket.userId}`);
    
    // Join specific type room (e.g., for broadcast messages to all companies)
    if (socket.userType === "company") {
        socket.join("all_companies");
    }
<<<<<<< HEAD
    
=======

    // ⭐⭐⭐ ADDED — Deliver pending notifications (offline → now online)
    try {
        const pending = await prisma.notification.findMany({
            where: { userId: Number(socket.userId), delivered: false }
        });

        if (pending.length > 0) {
            console.log(`📨 Delivering ${pending.length} pending notifications to user_${socket.userId}`);

            for (const n of pending) {
                socket.emit(n.type, n.data);
            }

            await prisma.notification.updateMany({
                where: { userId: Number(socket.userId), delivered: false },
                data: { delivered: true },
            });
        }
    } catch (err) {
        console.error("⚠ Error sending pending notifications:", err);
    }
    // ⭐⭐⭐ END OF ADDED BLOCK

>>>>>>> frontendv1
    // Disconnection logic
    socket.on("disconnect", () => {
        console.log(`🔌 User ${socket.userId} disconnected`);
        connectedUsers.delete(socket.userId);
    });
});

// 4. Global Access and Export
// Attaching to 'app' allows your Express controllers to access the Socket.IO instance
app.set("io", io); 

// Start the server (listening on the HTTP server which includes Express and Socket.IO)
httpServer.listen(PORT, () => {
    console.log(`✅ Server is running on: http://localhost:${PORT}`);
});

// Optional: Export for use in other modules
<<<<<<< HEAD
export { io, connectedUsers };
=======
export { io, connectedUsers };
>>>>>>> frontendv1
