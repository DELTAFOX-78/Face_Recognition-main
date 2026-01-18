import { chatService } from "../services/chatService.js";
import { handleAsync } from "../utils/asyncHandler.js";

export const chatController = {
  getMessages: handleAsync(async (req, res) => {
    const { receiverId } = req.params;
    const senderId = req.user.id;

    const messages = await chatService.getMessages(senderId, receiverId);
    res.json(messages);
  }),

  sendMessage: handleAsync(async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    const message = await chatService.createMessage({
      sender: senderId,
      receiver: receiverId,
      content,
      timestamp: new Date(),
      senderModel: req.user.role === "student" ? "Student" : "Teacher",
      receiverModel: req.user.role === "student" ? "Teacher" : "Student",
    });

    const messageToSend = {
      id: message._id.toString(),
      content: message.content,
      sender: message.sender.toString(),
      receiver: message.receiver.toString(),
      timestamp: message.timestamp,
      senderModel: message.senderModel,
      receiverModel: message.receiverModel,
    };

    // Emit to both sender and receiver rooms
    if (req.io) {
      req.io.to(receiverId).emit("receive_message", messageToSend);
      req.io.to(senderId).emit("receive_message", messageToSend);
    }

    res.status(201).json(messageToSend);
  }),

  getTeachersWithMessages: handleAsync(async (req, res) => {
    const studentId = req.user.id;
    const teachers = await chatService.getTeachersWithMessages(studentId);
    res.json(teachers);
  }),

  getStudentsWithMessages: handleAsync(async (req, res) => {
    const teacherId = req.user.id;
    const students = await chatService.getStudentsWithMessages(teacherId);
    res.json(students);
  }),

  markMessagesAsRead: handleAsync(async (req, res) => {
    const { receiverId } = req.params;
    const senderId = req.user.id;

    await chatService.markMessagesAsRead(receiverId, senderId);

    res.status(200).json({ message: "Messages marked as read" });
  }),
};
