import  prisma  from '../db.config.js';

export const notifyUser = async (io, userId, event, data) => {
  try {
    if (!io) throw new Error("WebSocket not initialized");
    if (!event || typeof event !== "string") throw new Error("Invalid event name");
    const uid = Number(userId);
    if (Number.isNaN(uid)) throw new Error("Invalid userId");

    // Check if any socket is present in the user's room
    const room = io.sockets.adapter.rooms.get(`user_${uid}`);

    if (room && room.size > 0) {
      // User online — emit to the room (reaches all connected sockets)
      io.to(`user_${uid}`).emit(event, data);
      console.log(`WebSocket sent to user_${uid}`, { event, sockets: room.size });
      return { delivered: true };
    }

    // User offline — persist notification to DB for later delivery
    const created = await prisma.notification.create({
      data: {
        userId: uid,
        type: event,
        data,
        delivered: false
      }
    });

    console.log(`User ${uid} offline. Notification saved to DB. id=${created.id}`);
    return { delivered: false };
  } catch (error) {
    console.error("notifyUser error:", error);
    return { delivered: false, error: error.message };
  }
};
