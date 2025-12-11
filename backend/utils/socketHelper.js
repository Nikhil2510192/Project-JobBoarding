import { io } from "../index.js";

export const notifyUser = (userId, event, data) => {
  try {
    if (!io) throw new Error("WebSocket not initialized");
    
    io.to(`user_${userId}`).emit(event, data);
    console.log(`WebSocket sent to user_${userId}`, event);
    return true;
  } catch (error) {
    console.error("WebSocket error:", error);
    return false;
  }
};