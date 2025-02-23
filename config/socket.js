import { Server } from "socket.io";
import http from "http";
import express from "express";
import Discount from "../models/discount.model.js";
const app = express();
const server = http.createServer(app);
const frontendUrl = "http://localhost:5173";
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected");

  socket.on("check_discount", async (code) => {
    try {
      const discount = await Discount.findOne({ code });

      if (discount) {
        socket.emit("discount_valid", {
          valid: true,
          discountPercentage: discount.discountPercentage,
        });
        console.log("discount valid");
      } else {
        socket.emit("discount_invalid", { valid: false });
        console.log("discount not valid");
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", async () => {
    console.log("a user disconnected", socket.id);
  });
});

export { io, app, server };
