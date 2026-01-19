import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";
import { generateAttendanceReport } from "../services/excelService.js";
import { io } from "../index.js";
import {
  runPythonScripts,
  stopPythonScript,
} from "../controllers/pythonScripts.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const teacher = await Teacher.findOne({ username });

    if (!teacher || !(await bcrypt.compare(password, teacher.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: teacher._id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: teacher._id, name: teacher.username } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addStudent = async (req, res) => {
  try {
    const {
      name,
      class: className,
      branch,
      section,
      registerNo,
      username,
      password,
      mobileNumber,
    } = req.body;
    const photo = req.file?.path;

    if (!photo) {
      return res.status(400).json({ message: "Student photo is required" });
    }

    // Check if student with the given register number already exists
    let student = await Student.findOne({ registerNo });
    let isNewStudent = false;

    if (student) {
      // Student already exists - check if already enrolled with this teacher
      const existingEnrollment = await Enrollment.findOne({
        teacher: req.user.id,
        student: student._id,
      });

      if (existingEnrollment) {
        return res.status(400).json({
          message: "Student is already enrolled in your class",
        });
      }

      // Ensure student.teachers is defined
      if (!student.teachers) {
        student.teachers = [];
      }

      // Add teacher reference if not already present
      if (!student.teachers.includes(req.user.id)) {
        student.teachers.push(req.user.id);
        await student.save();
      }

      // Add student to teacher's students array if not already present
      await Teacher.findByIdAndUpdate(req.user.id, {
        $addToSet: { students: student._id },
      });
    } else {
      // Check if username already exists
      const existingStudent = await Student.findOne({ username });

      if (existingStudent) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new student (keep class/branch/section for backward compatibility)
      student = new Student({
        name,
        class: className,
        branch,
        section,
        registerNo,
        username,
        password: hashedPassword,
        photo,
        mobileNumber,
        teachers: [req.user.id],
      });

      await student.save();
      isNewStudent = true;

      // Add student to teacher's students array
      await Teacher.findByIdAndUpdate(req.user.id, {
        $push: { students: student._id },
      });
    }

    // Create enrollment for this teacher-student pair with specific class/section
    const enrollment = new Enrollment({
      teacher: req.user.id,
      student: student._id,
      class: className,
      branch,
      section,
    });

    await enrollment.save();

    res.status(201).json({
      message: isNewStudent
        ? "Student added successfully"
        : "Existing student enrolled in your class successfully",
      student: {
        id: student._id,
        name: student.name,
        registerNo: student.registerNo,
        photo: student.photo,
        class: className,
        branch: branch,
        section: section,
        mobileNumber: student.mobileNumber,
      },
      exists: !isNewStudent,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Failed to add student" });
  }
};

let isCapturing = false;
let currentAttendanceSession = {
  class: null,
  section: null,
};

export const markAttendance = async (req, res) => {
  try {
    if (isCapturing) {
      return res
        .status(400)
        .json({ message: "Attendance capture already running" });
    }

    const { class: className, section } = req.body;

    if (!className || !section) {
      return res
        .status(400)
        .json({ message: "Class and section are required" });
    }

    // Get the enrollment to find the subject being taught for this class/section
    const enrollment = await Enrollment.findOne({
      teacher: req.user.id,
      class: className,
      section: section,
    });

    if (!enrollment || !enrollment.subject) {
      return res.status(400).json({
        message: "No subject found for this class/section combination"
      });
    }

    const sub = enrollment.subject;

    // Store current session info
    currentAttendanceSession = {
      class: className,
      section: section,
    };

    isCapturing = true;
    io.emit("capture-status", { capturing: true });

    // Start process in background
    runPythonScripts(sub).catch((error) => {
      console.error("Error in Python process:", error);
      isCapturing = false;
      currentAttendanceSession = { class: null, section: null };
      io.emit("error", error.message);
      io.emit("capture-status", { capturing: false });
    });

    res.json({ message: `Attendance capture started for ${className} - Section ${section}` });
  } catch (error) {
    isCapturing = false;
    currentAttendanceSession = { class: null, section: null };
    res.status(500).json({ message: "Failed to start attendance capture" });
  }
};

export const stopAttendance = async (req, res) => {
  try {
    if (!isCapturing) {
      return res.status(400).json({ message: "No capture process running" });
    }

    const teacherId = req.user.id;

    // Get enrollments for this teacher matching the current attendance session
    const enrollments = await Enrollment.find({
      teacher: teacherId,
      class: currentAttendanceSession.class,
      section: currentAttendanceSession.section,
    }).populate('student');

    if (enrollments.length === 0) {
      return res.status(400).json({
        message: "No students found for this class/section"
      });
    }

    // Get student IDs from enrollments
    const filteredStudents = enrollments.map(enrollment => enrollment.student._id);

    // Get subject from the first enrollment (they all have the same subject for this class/section)
    const subject = enrollments[0].subject;

    const stopped = await stopPythonScript(filteredStudents, subject);

    isCapturing = false;
    const sessionInfo = `${currentAttendanceSession.class} - Section ${currentAttendanceSession.section}`;
    currentAttendanceSession = { class: null, section: null };

    io.emit("capture-status", { capturing: false });
    res.json({
      message: stopped
        ? `Capture stopped successfully for ${sessionInfo}`
        : "No process to stop",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to stop capture" });
  }
};

export const downloadAttendanceReport = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { date, branch, class: className, section } = req.query;

    // Build enrollment query based on filters
    const enrollmentQuery = { teacher: teacherId };
    if (branch) enrollmentQuery.branch = branch;
    if (className) enrollmentQuery.class = className;
    if (section) enrollmentQuery.section = section;

    // Get enrollments for this teacher with the specified filters
    const enrollments = await Enrollment.find(enrollmentQuery).populate("student");

    // Extract student IDs and create a map of enrollment data
    const studentIds = enrollments.map(enrollment => enrollment.student._id);
    const enrollmentMap = new Map();
    enrollments.forEach(enrollment => {
      enrollmentMap.set(enrollment.student._id.toString(), {
        class: enrollment.class,
        branch: enrollment.branch,
        section: enrollment.section
      });
    });

    if (studentIds.length === 0) {
      // No students found for the given filters
      const filePath = await generateAttendanceReport([], teacherId);
      return res.download(filePath);
    }

    // Get attendance records for filtered students
    const attendanceRecords = await Student.aggregate([
      {
        $match: {
          _id: { $in: studentIds },
        },
      },
      {
        $unwind: "$attendance",
      },
      {
        $match: {
          "attendance.date": date,
        },
      },
      {
        $project: {
          name: 1,
          registerNo: 1,
          "attendance.date": 1,
          "attendance.subject": 1,
          "attendance.present": 1,
        },
      },
    ]);

    // Add enrollment-specific class/branch/section to each record
    const enrichedRecords = attendanceRecords.map(record => {
      const enrollmentData = enrollmentMap.get(record._id.toString());
      return {
        ...record,
        class: enrollmentData?.class || '',
        branch: enrollmentData?.branch || '',
        section: enrollmentData?.section || ''
      };
    });

    // Generate Excel file
    const filePath = await generateAttendanceReport(
      enrichedRecords,
      teacherId
    );

    // Send file
    res.download(filePath);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate attendance report" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get the enrollment for this teacher-student pair
    const enrollment = await Enrollment.findOne({
      teacher: teacherId,
      student: studentId,
    });

    // Return student with enrollment-specific class/section
    res.json({
      _id: student._id,
      name: student.name,
      registerNo: student.registerNo,
      username: student.username,
      photo: student.photo,
      class: enrollment ? enrollment.class : student.class,
      branch: enrollment ? enrollment.branch : student.branch,
      section: enrollment ? enrollment.section : student.section,
      mobileNumber: student.mobileNumber,
      attendance: student.attendance,
      enrollmentId: enrollment ? enrollment._id : null,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Error fetching student" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const studentId = req.params.id;
    const {
      name,
      class: className,
      branch,
      section,
      registerNo,
      username,
      photo,
      mobileNumber,
    } = req.body;

    // Update student's basic info (name, registerNo, username, photo, mobileNumber)
    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        name,
        registerNo,
        username,
        photo: req.file ? req.file.filename : photo,
        mobileNumber,
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update the enrollment for this teacher-student pair (class/branch/section)
    const enrollment = await Enrollment.findOneAndUpdate(
      { teacher: teacherId, student: studentId },
      { class: className, branch, section },
      { new: true }
    );

    // Return updated data with enrollment-specific values
    res.json({
      _id: student._id,
      name: student.name,
      registerNo: student.registerNo,
      username: student.username,
      photo: student.photo,
      mobileNumber: student.mobileNumber,
      class: enrollment ? enrollment.class : className,
      branch: enrollment ? enrollment.branch : branch,
      section: enrollment ? enrollment.section : section,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Error updating student" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const studentId = req.params.id;

    // First, delete only the enrollment for this teacher-student pair
    const enrollment = await Enrollment.findOneAndDelete({
      teacher: teacherId,
      student: studentId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Student not enrolled in your class" });
    }

    // Remove student reference from this teacher's students array
    await Teacher.findByIdAndUpdate(teacherId, {
      $pull: { students: studentId },
    });

    // Remove this teacher from student's teachers array
    await Student.findByIdAndUpdate(studentId, {
      $pull: { teachers: teacherId },
    });

    // Check if student has any remaining enrollments
    const remainingEnrollments = await Enrollment.countDocuments({ student: studentId });

    // If no remaining enrollments, optionally delete the student entirely
    // (Keeping for now - only deleting if student has no teachers left)
    const student = await Student.findById(studentId);
    if (student && (!student.teachers || student.teachers.length === 0)) {
      await Student.findByIdAndDelete(studentId);
    }

    res.json({ message: "Student removed from your class successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Error deleting student" });
  }
};

export const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Get enrollments for this teacher
    const enrollments = await Enrollment.find({ teacher: teacherId });

    // Extract unique classes and sections from enrollments
    const uniqueClasses = [];
    const classMap = new Map(); // class -> Set(sections)

    enrollments.forEach(enrollment => {
      if (enrollment.class && enrollment.section) {
        if (!classMap.has(enrollment.class)) {
          classMap.set(enrollment.class, new Set());
        }
        classMap.get(enrollment.class).add(enrollment.section);
      }
    });

    // Convert map to array structure
    classMap.forEach((sections, className) => {
      uniqueClasses.push({
        className,
        sections: Array.from(sections).sort()
      });
    });

    // Sort classes
    uniqueClasses.sort((a, b) => a.className.localeCompare(b.className));

    res.json(uniqueClasses);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Error fetching classes" });
  }
};

export const getTeacherBranchClassSection = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Get enrollments for this teacher
    const enrollments = await Enrollment.find({ teacher: teacherId });

    // Build nested structure: branch -> class -> sections
    const branchMap = new Map(); // branch -> Map(class -> Set(sections))

    enrollments.forEach(enrollment => {
      if (enrollment.branch && enrollment.class && enrollment.section) {
        if (!branchMap.has(enrollment.branch)) {
          branchMap.set(enrollment.branch, new Map());
        }
        const classMap = branchMap.get(enrollment.branch);
        if (!classMap.has(enrollment.class)) {
          classMap.set(enrollment.class, new Set());
        }
        classMap.get(enrollment.class).add(enrollment.section);
      }
    });

    // Convert to array structure for frontend
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

    // Sort by branch name
    result.sort((a, b) => a.branch.localeCompare(b.branch));

    res.json(result);
  } catch (error) {
    console.error("Error fetching branch/class/section:", error);
    res.status(500).json({ message: "Error fetching filter options" });
  }
};

