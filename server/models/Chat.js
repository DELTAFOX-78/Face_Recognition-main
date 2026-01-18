import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderModel",
  },
  senderModel: {
    type: String,
    required: true,
    enum: ["Student", "Teacher"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "receiverModel",
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ["Student", "Teacher"],
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.model("Chat", chatSchema);
