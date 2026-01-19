/**
 * Migration script to create Enrollment records from existing Student data.
 * 
 * Run this script once to migrate existing data:
 * node server/utils/migrateEnrollments.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Enrollment from "../models/Enrollment.js";

async function migrateEnrollments() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/attendance-system";
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");

        // Get all teachers with their students
        const teachers = await Teacher.find({}).populate("students");
        console.log(`Found ${teachers.length} teachers`);

        let createdCount = 0;
        let skippedCount = 0;

        for (const teacher of teachers) {
            console.log(`Processing teacher: ${teacher.username}`);

            for (const student of teacher.students) {
                // Check if enrollment already exists
                const existingEnrollment = await Enrollment.findOne({
                    teacher: teacher._id,
                    student: student._id,
                });

                if (existingEnrollment) {
                    console.log(`  Skipping ${student.name} - enrollment already exists`);
                    skippedCount++;
                    continue;
                }

                // Create enrollment with student's current class/branch/section
                const enrollment = new Enrollment({
                    teacher: teacher._id,
                    student: student._id,
                    class: student.class,
                    branch: student.branch,
                    section: student.section,
                });

                await enrollment.save();
                console.log(`  Created enrollment for ${student.name}: ${student.class} ${student.branch} ${student.section}`);
                createdCount++;
            }
        }

        console.log("\n=== Migration Complete ===");
        console.log(`Created: ${createdCount} enrollments`);
        console.log(`Skipped: ${skippedCount} (already existed)`);

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrateEnrollments();
