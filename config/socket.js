import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const frontendUrl = 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: [frontendUrl],
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.on('connection', (socket) => {
  socket.on("connect", async () => {
    console.log("a user connected", socket.id);
  })
  socket.on("disconnect", async () => {
    console.log("a user disconnected", socket.id);
  });
});

export { io, app, server };
