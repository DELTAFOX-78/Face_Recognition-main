import mongoose from "mongoose";
import Teacher from "../models/Teacher.js";
import Enrollment from "../models/Enrollment.js";

// Connect to MongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/face-recognition")
    .then(async () => {
        console.log("Connected to MongoDB");
        console.log("\n=== MIGRATING TEACHER SUBJECTS ===\n");

        try {
            // Step 1: Get all teachers
            const teachers = await Teacher.find({});
            console.log(`Found ${teachers.length} teachers to migrate\n`);

            for (const teacher of teachers) {
                console.log(`\nMigrating teacher: ${teacher.username}`);

                // Check if teacher already has subjects array
                if (Array.isArray(teacher.subjects)) {
                    console.log(`  ✓ Already has subjects array:`, teacher.subjects);
                    continue;
                }

                // Convert single subject to array
                if (teacher.subject) {
                    teacher.subjects = [teacher.subject];
                    console.log(`  → Converted subject "${teacher.subject}" to array`);

                    // Add additional subjects based on known mappings
                    if (teacher.username === "Chethan" && !teacher.subjects.includes("DBMS")) {
                        teacher.subjects.push("DBMS");
                        console.log(`  → Added DBMS for teacher Chethan`);
                    }

                    if (teacher.username === "sathish" && !teacher.subjects.includes("CN")) {
                        teacher.subjects.push("CN");
                        console.log(`  → Added CN for teacher sathish`);
                    }

                    // Remove old subject field (will be done by schema)
                    teacher.subject = undefined;

                    await teacher.save();
                    console.log(`  ✓ Teacher saved with subjects:`, teacher.subjects);
                }
            }

            // Step 2: Drop old unique index before migrating enrollments
            console.log("\n\n=== DROPPING OLD INDEX ===\n");

            try {
                await Enrollment.collection.dropIndex("teacher_1_student_1");
                console.log("✓ Dropped old unique index (teacher_1_student_1)\n");
            } catch (error) {
                if (error.code === 27) {
                    console.log("✓ Old index doesn't exist (already dropped)\n");
                } else {
                    console.log("⚠ Could not drop old index:", error.message, "\n");
                }
            }

            // Step 3: Update enrollments to include subject field
            console.log("=== MIGRATING ENROLLMENTS ===\n");

            const enrollments = await Enrollment.find({}).populate("teacher");
            console.log(`Found ${enrollments.length} enrollments to migrate\n`);

            for (const enrollment of enrollments) {
                console.log(`\nMigrating enrollment for student ${enrollment.student}`);

                // Check if enrollment already has subject
                if (enrollment.subject) {
                    console.log(`  ✓ Already has subject: ${enrollment.subject}`);
                    continue;
                }

                // Get the teacher's first subject (the original one)
                if (enrollment.teacher && enrollment.teacher.subjects && enrollment.teacher.subjects.length > 0) {
                    // For existing enrollments, use the first subject (the original one)
                    enrollment.subject = enrollment.teacher.subjects[0];
                    console.log(`  → Added subject: ${enrollment.subject} (from teacher ${enrollment.teacher.username})`);

                    await enrollment.save();
                    console.log(`  ✓ Enrollment saved`);
                } else {
                    console.log(`  ⚠ Could not determine subject for this enrollment`);
                }
            }

            // Step 4: Create new enrollments for additional subjects
            console.log("\n\n=== CREATING NEW ENROLLMENTS FOR ADDITIONAL SUBJECTS ===\n");

            // Find teacher Chethan
            const chethan = await Teacher.findOne({ username: "Chethan" });
            // Find teacher sathish
            const sathish = await Teacher.findOne({ username: "sathish" });

            // Find student Chethan Gowda
            const Student = (await import("../models/Student.js")).default;
            const student = await Student.findOne({ name: /Chethan/i });

            if (chethan && student) {
                // Create DBMS enrollment for Chethan Gowda with teacher Chethan
                const existingDBMS = await Enrollment.findOne({
                    teacher: chethan._id,
                    student: student._id,
                    subject: "DBMS",
                });

                if (!existingDBMS) {
                    const dbmsEnrollment = new Enrollment({
                        teacher: chethan._id,
                        student: student._id,
                        class: "DBMS",
                        branch: "CSE",
                        section: "B",
                        subject: "DBMS",
                    });
                    await dbmsEnrollment.save();
                    console.log(`✓ Created DBMS enrollment for ${student.name} with teacher ${chethan.username}`);
                } else {
                    console.log(`✓ DBMS enrollment already exists`);
                }
            }

            if (sathish && student) {
                // Create CN enrollment for Chethan Gowda with teacher sathish
                const existingCN = await Enrollment.findOne({
                    teacher: sathish._id,
                    student: student._id,
                    subject: "CN",
                });

                if (!existingCN) {
                    const cnEnrollment = new Enrollment({
                        teacher: sathish._id,
                        student: student._id,
                        class: "CN",
                        branch: "CSE",
                        section: "B",
                        subject: "CN",
                    });
                    await cnEnrollment.save();
                    console.log(`✓ Created CN enrollment for ${student.name} with teacher ${sathish.username}`);
                } else {
                    console.log(`✓ CN enrollment already exists`);
                }
            }

            console.log("\n\n=== MIGRATION COMPLETE ===\n");
            console.log("Summary:");
            console.log(`  - Migrated ${teachers.length} teachers to use subjects array`);
            console.log(`  - Updated ${enrollments.length} enrollments with subject field`);
            console.log(`  - Created new enrollments for additional subjects`);

            process.exit(0);
        } catch (error) {
            console.error("\n❌ Migration failed:", error);
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });
