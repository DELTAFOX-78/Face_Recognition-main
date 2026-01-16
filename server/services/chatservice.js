import Chat from "../models/Chat.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

export const chatService = {
  async getMessages(senderId, receiverId) {
    return Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });
  },

  async createMessage(messageData) {
    const message = new Chat(messageData);
    await message.save();
    return message;
  },

  async getTeachersWithMessages(studentId) {
    const student = await Student.findById(studentId).populate("teachers");
    const teacherIds = student.teachers.map((teacher) => teacher._id);

    const messages = await Chat.aggregate([
      {
        $match: {
          $or: [
            { sender: { $in: teacherIds }, receiver: studentId },
            { sender: studentId, receiver: { $in: teacherIds } },
          ],
        },
      },
      {
        $group: {
          _id: "$sender",
          recentMessage: { $last: "$$ROOT" },
          newMessagesCount: {
            $sum: { $cond: [{ $eq: ["$receiver", studentId] }, 1, 0] },
          },
        },
      },
    ]);

    return student.teachers.map((teacher) => {
      const messageData = messages.find((msg) => msg._id.equals(teacher._id));
      return {
        id: teacher._id,
        name: teacher.username,
        photo: teacher.photo,
        recentMessage: messageData
          ? messageData.recentMessage
          : { content: "", timestamp: new Date() },
        newMessagesCount: messageData ? messageData.newMessagesCount : 0,
      };
    });
  },

  async getStudentsWithMessages(teacherId) {
    const teacher = await Teacher.findById(teacherId).populate("students");
    const studentIds = teacher.students.map((student) => student._id);

    const messages = await Chat.aggregate([
      {
        $match: {
          $or: [
            { sender: { $in: studentIds }, receiver: teacherId },
            { sender: teacherId, receiver: { $in: studentIds } },
          ],
        },
      },
      {
        $group: {
          _id: "$sender",
          recentMessage: { $last: "$$ROOT" },
          newMessagesCount: {
            $sum: { $cond: [{ $eq: ["$receiver", teacherId] }, 1, 0] },
          },
        },
      },
    ]);

    return teacher.students.map((student) => {
      const messageData = messages.find((msg) => msg._id.equals(student._id));
      return {
        id: student._id,
        name: student.username,
        photo: student.photo,
        recentMessage: messageData
          ? messageData.recentMessage
          : { content: "", timestamp: new Date() },
        newMessagesCount: messageData ? messageData.newMessagesCount : 0,
      };
    });
  },

  async markMessagesAsRead(senderId, receiverId) {
    await Chat.updateMany(
      { sender: senderId, receiver: receiverId, read: false },
      { $set: { read: true } }
    );
  },
};
