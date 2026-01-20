
import mongoose from "mongoose";
import Student from "./models/Student.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/face-recognition")
    .then(async () => {
        console.log("Connected to MongoDB");

        const registerNo = "1RV24BCS423";
        console.log(`\nSearching for student with registerNo: ${registerNo}`);

        const student = await Student.findOne({ registerNo: registerNo });

        if (!student) {
            console.log("Student not found!");

            // Try searching by name just in case
            const byName = await Student.findOne({ name: /Vijay/i });
            if (byName) {
                console.log("Found student by name 'Vijay':");
                console.log(`ID: ${byName._id}`);
                console.log(`Name: ${byName.name}`);
                console.log(`RegisterNo: ${byName.registerNo}`);
                console.log(`Photo Path in DB: ${byName.photo}`);
            } else {
                console.log("Student also not found by name 'Vijay'");
            }
        } else {
            console.log("\n=== STUDENT INFO ===");
            console.log(`ID: ${student._id}`);
            console.log(`Name: ${student.name}`);
            console.log(`RegisterNo: ${student.registerNo}`);
            console.log(`Photo Path in DB: ${student.photo}`);
        }

        process.exit(0);
    })
    .catch((err) => {
        console.error("Error:", err);
        process.exit(1);
    });
