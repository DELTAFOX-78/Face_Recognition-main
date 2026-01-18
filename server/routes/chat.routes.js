import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { chatController } from "../controllers/chat.controller.js";

const {
  getMessages,
  sendMessage,
  getTeachersWithMessages,
  getStudentsWithMessages,
  markMessagesAsRead,
} = chatController;

const router = express.Router();

router.get("/messages/:receiverId", verifyToken, getMessages);
router.post("/messages", verifyToken, sendMessage);
router.get("/teachers", verifyToken, getTeachersWithMessages);
router.get("/students", verifyToken, getStudentsWithMessages);
router.post("/mark-read/:receiverId", verifyToken, markMessagesAsRead);

export default router;
