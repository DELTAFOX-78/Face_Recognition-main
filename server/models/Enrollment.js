import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound unique index: one enrollment per teacher-student pair
enrollmentSchema.index({ teacher: 1, student: 1 }, { unique: true });

// Index for faster queries by teacher
enrollmentSchema.index({ teacher: 1, class: 1, section: 1 });

export default mongoose.model("Enrollment", enrollmentSchema);
