import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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

const updatePasswords = async () => {
  try {
    await connectDB();

    // Update teacher1 password
    const teacher = await Teacher.findOne({ username: "teacher1" });
    if (teacher) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      teacher.password = hashedPassword;
      await teacher.save();
      console.log("✅ Updated password for teacher1");
      console.log("   Username: teacher1");
      console.log("   New Password: password123");
    } else {
      console.log("❌ Teacher 'teacher1' not found");
    }

    // Update student1 password
    const student = await Student.findOne({ username: "student1" });
    if (student) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      student.password = hashedPassword;
      await student.save();
      console.log("✅ Updated password for student1");
      console.log("   Username: student1");
      console.log("   New Password: password123");
    } else {
      console.log("❌ Student 'student1' not found");
    }

    console.log("\n✅ Password update complete!");
    console.log("\nYou can now login with:");
    console.log("Teacher - Username: teacher1, Password: password123");
    console.log("Student - Username: student1, Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating passwords:", error);
    process.exit(1);
  }
};

updatePasswords();
