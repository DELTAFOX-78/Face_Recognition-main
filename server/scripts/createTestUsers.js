import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const createTestUsers = async () => {
  try {
    await connectDB();

    // Create test teacher
    const teacherExists = await Teacher.findOne({ username: "teacher1" });
    if (!teacherExists) {
      const hashedTeacherPassword = await bcrypt.hash("password123", 10);
      const teacher = new Teacher({
        username: "teacher1",
        password: hashedTeacherPassword,
        subject: "Mathematics",
        students: [],
      });
      await teacher.save();
      console.log("✅ Test teacher created:");
      console.log("   Username: teacher1");
      console.log("   Password: password123");
    } else {
      console.log("ℹ️  Teacher 'teacher1' already exists");
    }

    // Create test student
    const studentExists = await Student.findOne({ username: "student1" });
    if (!studentExists) {
      const hashedStudentPassword = await bcrypt.hash("password123", 10);
      const student = new Student({
        name: "John Doe",
        class: "10",
        section: "A",
        registerNo: "STU001",
        username: "student1",
        password: hashedStudentPassword,
        photo: "test-photo.jpg",
        teachers: [],
        attendance: [],
      });
      await student.save();
      console.log("✅ Test student created:");
      console.log("   Username: student1");
      console.log("   Password: password123");
    } else {
      console.log("ℹ️  Student 'student1' already exists");
    }

    console.log("\n✅ Test users setup complete!");
    console.log("\nYou can now login with:");
    console.log("Teacher - Username: teacher1, Password: password123");
    console.log("Student - Username: student1, Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test users:", error);
    process.exit(1);
  }
};

createTestUsers();
