import Announcement from '../models/Announcement.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Enrollment from '../models/Enrollment.js';

// Teacher: Create a new announcement
export const createAnnouncement = async (req, res) => {
    try {
        const { message, branch, class: className, section } = req.body;

        if (!message || !branch || !className || !section) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const teacher = await Teacher.findById(req.user.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const announcement = new Announcement({
            teacher: req.user.id,
            teacherName: teacher.username,
            message,
            branch,
            class: className,
            section
        });

        await announcement.save();

        res.status(201).json({
            message: 'Announcement created successfully',
            announcement
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Failed to create announcement' });
    }
};

// Teacher: Get all announcements with replies
export const getTeacherAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ teacher: req.user.id })
            .sort({ createdAt: -1 })
            .lean();

        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Failed to fetch announcements' });
    }
};

// Teacher: Delete an announcement
export const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findOneAndDelete({
            _id: req.params.id,
            teacher: req.user.id
        });

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Failed to delete announcement' });
    }
};

// Teacher: Get unique branch/class/section combinations from students
export const getTeacherBranchClassSection = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.user.id).populate('students', 'branch class section');

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Build hierarchical structure: branch -> class -> sections
        const branchMap = new Map();

        teacher.students.forEach(student => {
            if (student.branch && student.class && student.section) {
                if (!branchMap.has(student.branch)) {
                    branchMap.set(student.branch, new Map());
                }

                const classMap = branchMap.get(student.branch);
                if (!classMap.has(student.class)) {
                    classMap.set(student.class, new Set());
                }

                classMap.get(student.class).add(student.section);
            }
        });

        // Convert to array structure
        const result = [];
        branchMap.forEach((classMap, branch) => {
            const classes = [];
            classMap.forEach((sections, className) => {
                classes.push({
                    className,
                    sections: Array.from(sections).sort()
                });
            });
            classes.sort((a, b) => a.className.localeCompare(b.className));
            result.push({ branch, classes });
        });

        result.sort((a, b) => a.branch.localeCompare(b.branch));

        res.json(result);
    } catch (error) {
        console.error('Error fetching branch/class/section:', error);
        res.status(500).json({ message: 'Failed to fetch options' });
    }
};

// Student: Get announcements for student's enrolled classes/sections
export const getStudentAnnouncements = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Get all enrollments for this student
        const enrollments = await Enrollment.find({ student: req.user.id });

        // Build query conditions for all enrolled branch/class/section combinations
        const enrollmentConditions = enrollments.map(enrollment => ({
            branch: enrollment.branch,
            class: enrollment.class,
            section: enrollment.section
        }));

        // Also include the student's primary branch/class/section as fallback
        enrollmentConditions.push({
            branch: student.branch,
            class: student.class,
            section: student.section
        });

        // Remove duplicate conditions
        const uniqueConditions = [];
        const seen = new Set();
        for (const condition of enrollmentConditions) {
            const key = `${condition.branch}-${condition.class}-${condition.section}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueConditions.push(condition);
            }
        }

        // Find announcements matching any of the student's enrollments
        const announcements = await Announcement.find({
            $or: uniqueConditions
        })
            .sort({ createdAt: -1 })
            .lean();

        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Failed to fetch announcements' });
    }
};

// Student: Reply to an announcement
export const replyToAnnouncement = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Reply message is required' });
        }

        const student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Get all enrollments for this student
        const enrollments = await Enrollment.find({ student: req.user.id });

        // Build conditions for all enrolled branch/class/section combinations
        const enrollmentConditions = enrollments.map(enrollment => ({
            branch: enrollment.branch,
            class: enrollment.class,
            section: enrollment.section
        }));

        // Include the student's primary branch/class/section as fallback
        enrollmentConditions.push({
            branch: student.branch,
            class: student.class,
            section: student.section
        });

        // Remove duplicate conditions
        const uniqueConditions = [];
        const seen = new Set();
        for (const condition of enrollmentConditions) {
            const key = `${condition.branch}-${condition.class}-${condition.section}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueConditions.push(condition);
            }
        }

        // Verify the announcement is targeted at one of the student's enrolled sections
        const announcement = await Announcement.findOne({
            _id: req.params.id,
            $or: uniqueConditions
        });

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        announcement.replies.push({
            student: req.user.id,
            studentName: student.name,
            message
        });

        await announcement.save();

        res.json({
            message: 'Reply added successfully',
            announcement
        });
    } catch (error) {
        console.error('Error adding reply:', error);
        res.status(500).json({ message: 'Failed to add reply' });
    }
};
