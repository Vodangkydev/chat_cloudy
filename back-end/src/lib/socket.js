
import {Server} from "socket.io";
import http from "http";  
import express from "express"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173","https://fe-cloudy.vercel.app"],
    },
  });
  export function getReceiverSocketId(userId) {
    return userSocketMap[userId]; 
} 
const userSocketMap = {}; 
io.on("connection", (socket) => {
    console.log("Người dùng đã kết nối", socket.id);
    const userId = socket.handshake.query.userId; 
    if (userId) userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("video:call", ({ to, roomId, callerInfo }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("video:incoming", { roomId, callerInfo });
      }
    });

    socket.on("video:accept", ({ to, roomId }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("video:accepted", { roomId });
      }
    });

    socket.on("video:reject", ({ to, roomId }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("video:rejected", { roomId });
      }
    });

    socket.on("video:end", ({ to, roomId }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("video:ended", { roomId });
      }
    });

 socket.on("disconnect", () => {
    console.log("Người dùng đã đăng xuất", socket.id)
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
});
});
export { io, app, server };
