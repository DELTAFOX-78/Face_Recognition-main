// Script to fix missing enrollment for Harsha G Gowda
// Run with: node fixHarshaEnrollment.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import Teacher from './models/Teacher.js';
import Enrollment from './models/Enrollment.js';

dotenv.config({ path: '../.env' });

const fixEnrollment = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/face-recognition');
        console.log('Connected to MongoDB');

        // Find the student Harsha G Gowda
        const student = await Student.findOne({ registerNo: '1RV24CS406' });
        if (!student) {
            console.log('Student not found');
            process.exit(1);
        }
        console.log('Found student:', student.name);

        // Find the teacher (Chethan)
        const teacher = await Teacher.findOne({ username: 'Chethan' });
        if (!teacher) {
            // Try to get teacher from student's teachers array
            if (student.teachers && student.teachers.length > 0) {
                const teacherId = student.teachers[0];
                console.log('Using teacher ID from student:', teacherId);

                // Check if enrollment already exists
                const existingEnrollment = await Enrollment.findOne({
                    teacher: teacherId,
                    student: student._id
                });

                if (existingEnrollment) {
                    console.log('Enrollment already exists:', existingEnrollment);
                } else {
                    // Create new enrollment using student's data
                    const enrollment = new Enrollment({
                        teacher: teacherId,
                        student: student._id,
                        class: student.class,
                        branch: student.branch,
                        section: student.section,
                        subject: student.class // Use class as subject (DBMS)
                    });

                    await enrollment.save();
                    console.log('Created enrollment:', enrollment);
                }
            } else {
                console.log('No teacher found and student has no teachers assigned');
            }
        } else {
            console.log('Found teacher:', teacher.username);

            // Check if enrollment already exists
            const existingEnrollment = await Enrollment.findOne({
                teacher: teacher._id,
                student: student._id
            });

            if (existingEnrollment) {
                console.log('Enrollment already exists:', existingEnrollment);
            } else {
                // Create new enrollment
                const enrollment = new Enrollment({
                    teacher: teacher._id,
                    student: student._id,
                    class: student.class,
                    branch: student.branch,
                    section: student.section,
                    subject: student.class // Use class as subject (DBMS)
                });

                await enrollment.save();
                console.log('Created enrollment:', enrollment);
            }
        }

        // Show all enrollments for this teacher
        const allEnrollments = await Enrollment.find().populate('student', 'name registerNo');
        console.log('\nAll Enrollments:', allEnrollments.length);
        allEnrollments.forEach(e => {
            console.log(`- ${e.student?.name} (${e.student?.registerNo}): ${e.class} - ${e.section} - Subject: ${e.subject}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
};

fixEnrollment();
