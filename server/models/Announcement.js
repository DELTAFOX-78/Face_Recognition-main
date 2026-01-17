import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const announcementSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    replies: [replySchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
announcementSchema.index({ teacher: 1, createdAt: -1 });
announcementSchema.index({ branch: 1, class: 1, section: 1, createdAt: -1 });

export default mongoose.model('Announcement', announcementSchema);
