import { Server } from "socket.io";

import http from "http";

import app from "../app.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});


// STORE ONLINE USERS
// { userId : socketId }

const userSocketMap = {};


// GET RECEIVER SOCKET ID

export const getReceiverSocketId = (
  userId
) => {
  return userSocketMap[userId];
};


// SOCKET CONNECTION

io.on("connection", (socket) => {
  console.log(
    "A user connected",
    socket.id
  );

  const userId =
    socket.handshake.query.userId;

  // STORE USER SOCKET

  if (userId) {
    userSocketMap[userId] =
      socket.id;
  }

  // SEND ONLINE USERS

  io.emit(
    "getOnlineUsers",
    Object.keys(userSocketMap)
  );


  // DISCONNECT

  socket.on("disconnect", () => {
    console.log(
      "User disconnected",
      socket.id
    );

    delete userSocketMap[userId];

    io.emit(
      "getOnlineUsers",
      Object.keys(userSocketMap)
    );
  });
});

export { io, server };