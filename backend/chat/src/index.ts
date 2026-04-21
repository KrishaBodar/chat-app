import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import chatRoutes from './routes/chat.js';
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1", chatRoutes);

// ✅ create http server
const server = createServer(app);

// ✅ socket setup
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on ${port}`);
});