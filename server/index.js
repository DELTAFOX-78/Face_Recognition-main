import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import { scheduleAttendanceReports } from "./cron/attendanceReport.js";
import { attachSocketIO } from "./middleware/socketMiddleware.js";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import quizRoutes from "./routes/quiz.routes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Initialize cron jobs
scheduleAttendanceReports();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/reports", express.static("reports"));

// Attach Socket.IO to request object - IMPORTANT: This must come before routes
app.use(attachSocketIO(io));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/quiz", quizRoutes);

// Socket.IO chat implementation
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  }

  socket.on("send_message", async (data) => {
    if (data.receiver) {
      // Emit only to the receiver
      socket.to(data.receiver).emit("receive_message", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
