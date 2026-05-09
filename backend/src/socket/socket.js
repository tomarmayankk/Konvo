import { Server } from "socket.io";
import http from "http";

import app from "../app.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});


// STORE ONLINE USERS
// { userId : socketId }

const userSocketMap = {};


// GET RECEIVER SOCKET ID
export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};


io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // SEND ONLINE USERS TO ALL CLIENTS
  io.emit("getOnlineUsers", Object.keys(userSocketMap));



  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server };