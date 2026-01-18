// import mongoose from 'mongoose';

// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   class: { type: String, required: true },
//   section: { type: String, required: true },
//   registerNo: { type: String, required: true, unique: true },
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   photo: { type: String, required: true },
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
//   attendance: [{
//     date: { type: Date, required: true },
//     subject: { type: String, required: true },
//     present: { type: Boolean, default: false }
//   }]
// });

// export default  mongoose.model('Student', studentSchema);

import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    present: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  registerNo: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, required: true },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],

  attendance: [attendanceRecordSchema],
});

// Add index for faster queries
studentSchema.index({ teacher: 1, class: 1, section: 1 });

export default mongoose.model("Student", studentSchema);
