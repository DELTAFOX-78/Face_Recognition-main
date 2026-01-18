import mongoose from "mongoose";
import dotenv from "dotenv";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully\n");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const checkUsers = async () => {
  try {
    await connectDB();

    console.log("📋 Checking existing users...\n");

    // Check teachers
    const teachers = await Teacher.find({}).select("username subject -_id");
    console.log(`👨‍🏫 Teachers (${teachers.length}):`);
    if (teachers.length === 0) {
      console.log("   No teachers found in database");
    } else {
      teachers.forEach((teacher, index) => {
        console.log(`   ${index + 1}. Username: ${teacher.username}, Subject: ${teacher.subject}`);
      });
    }

    console.log("");

    // Check students
    const students = await Student.find({}).select("username name registerNo class section -_id");
    console.log(`👨‍🎓 Students (${students.length}):`);
    if (students.length === 0) {
      console.log("   No students found in database");
    } else {
      students.forEach((student, index) => {
        console.log(`   ${index + 1}. Username: ${student.username}, Name: ${student.name}, Register No: ${student.registerNo}, Class: ${student.class}-${student.section}`);
      });
    }

    console.log("\n💡 To create test users, run: node scripts/createTestUsers.js");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking users:", error);
    process.exit(1);
  }
};

checkUsers();
