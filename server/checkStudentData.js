import mongoose from "mongoose";
import Student from "./models/Student.js";
import Enrollment from "./models/Enrollment.js";
import Teacher from "./models/Teacher.js";

// Connect to MongoDB (use the same database as the main server)
mongoose
    .connect("mongodb://127.0.0.1:27017/face-recognition")
    .then(async () => {
        console.log("Connected to MongoDB");

        // First, list all students to find the exact name
        console.log("\n=== ALL STUDENTS ===");
        const allStudents = await Student.find({});
        console.log("Total students:", allStudents.length);
        allStudents.forEach((s, i) => {
            console.log(`${i + 1}. ${s.name} (USN: ${s.registerNo}) - ID: ${s._id}`);
        });

        // Find the student "Chethan Gowda" (try different variations)
        let student = await Student.findOne({ name: /Chethan/i });

        if (!student) {
            console.log("\n\nStudent with 'Chethan' in name not found!");
            process.exit(1);
        }

        console.log("\n=== STUDENT INFO ===");
        console.log("ID:", student._id);
        console.log("Name:", student.name);
        console.log("Register No:", student.registerNo);
        console.log("Class:", student.class);
        console.log("Branch:", student.branch);
        console.log("Section:", student.section);

        // Find all enrollments for this student
        const enrollments = await Enrollment.find({ student: student._id }).populate("teacher");

        console.log("\n=== ENROLLMENTS ===");
        console.log("Total enrollments:", enrollments.length);

        if (enrollments.length === 0) {
            console.log("NO ENROLLMENTS FOUND! This is the problem.");
            console.log("\nThe student needs to be enrolled with teachers for each subject.");
        } else {
            console.log("\nEnrollment details:");
            enrollments.forEach((enrollment, index) => {
                console.log(`\n${index + 1}. Enrollment:`);
                console.log("   Teacher:", enrollment.teacher.username);
                console.log("   Subject:", enrollment.teacher.subject);
                console.log("   Class:", enrollment.class);
                console.log("   Branch:", enrollment.branch);
                console.log("   Section:", enrollment.section);
            });
        }

        // Check attendance records
        console.log("\n=== ATTENDANCE RECORDS ===");
        console.log("Total attendance records:", student.attendance.length);

        const subjectCounts = {};
        student.attendance.forEach((record) => {
            if (!subjectCounts[record.subject]) {
                subjectCounts[record.subject] = 0;
            }
            subjectCounts[record.subject]++;
        });

        console.log("\nAttendance by subject:");
        Object.entries(subjectCounts).forEach(([subject, count]) => {
            console.log(`  ${subject}: ${count} records`);
        });

        // List all teachers and their subjects
        console.log("\n=== ALL TEACHERS ===");
        const teachers = await Teacher.find({});
        console.log("Total teachers:", teachers.length);
        teachers.forEach((teacher) => {
            console.log(`  ${teacher.username}: ${teacher.subjects ? teacher.subjects.join(', ') : 'No subjects'}`);
        });

        process.exit(0);
    })
    .catch((err) => {
        console.error("Error:", err);
        process.exit(1);
    });
