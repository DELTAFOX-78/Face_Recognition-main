import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
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
    } = req.body;
    const photo = req.file?.path;

    if (!photo) {
      return res.status(400).json({ message: "Student photo is required" });
    }

    // Check if student with the given register number already exists
    let student = await Student.findOne({ registerNo });

    if (student) {
      // Ensure student.teachers is defined
      if (!student.teachers) {
        student.teachers = [];
      }

      // Student already exists, add teacher reference if not already present
      if (!student.teachers.includes(req.user.id)) {
        student.teachers.push(req.user.id);
        await student.save();
      }

      // Add student to teacher's students array if not already present
      await Teacher.findByIdAndUpdate(req.user.id, {
        $addToSet: { students: student._id },
      });

      return res.status(200).json({
        message: "Student already exists, added to your students list",
        student: {
          id: student._id,
          name: student.name,
          registerNo: student.registerNo,
          photo: student.photo,
          class: student.class,
          branch: student.branch,
          section: student.section,
        },
        exists: true,
      });
    }

    // Check if username already exists
    const existingStudent = await Student.findOne({ username });

    if (existingStudent) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    student = new Student({
      name,
      class: className,
      branch,
      section,
      registerNo,
      username,
      password: hashedPassword,
      photo,
      teachers: [req.user.id],
    });

    await student.save();

    // Add student to teacher's students array
    await Teacher.findByIdAndUpdate(req.user.id, {
      $push: { students: student._id },
    });

    res.status(201).json({
      message: "Student added successfully",
      student: {
        id: student._id,
        name: student.name,
        registerNo: student.registerNo,
        photo: student.photo,
        class: student.class,
        branch: student.branch,
        section: student.section,
      },
      exists: false,
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

    const teacher = await Teacher.findById(req.user.id);
    const sub = teacher.subject;

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

    const teacher = await Teacher.findById(req.user.id).populate('students');

    // Filter students by the selected class and section
    const filteredStudents = teacher.students
      .filter(student =>
        student.class === currentAttendanceSession.class &&
        student.section === currentAttendanceSession.section
      )
      .map(student => student._id);

    const stopped = await stopPythonScript(filteredStudents, teacher.subject);

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

    // Get all students for this teacher
    const teacher = await Teacher.findById(teacherId).populate("students");

    // Filter students based on provided filters
    let filteredStudents = teacher.students;
    if (branch) {
      filteredStudents = filteredStudents.filter(s => s.branch === branch);
    }
    if (className) {
      filteredStudents = filteredStudents.filter(s => s.class === className);
    }
    if (section) {
      filteredStudents = filteredStudents.filter(s => s.section === section);
    }

    const studentIds = filteredStudents.map(s => s._id);

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
          class: 1,
          branch: 1,
          section: 1,
          registerNo: 1,
          "attendance.date": 1,
          "attendance.subject": 1,
          "attendance.present": 1,
        },
      },
    ]);

    // Generate Excel file
    const filePath = await generateAttendanceReport(
      attendanceRecords,
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
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      class: className,
      branch,
      section,
      registerNo,
      username,
      photo,
    } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        class: className,
        branch,
        section,
        registerNo,
        username,
        photo: req.file ? req.file.filename : photo,
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error updating student" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Remove student reference from teacher
    await Teacher.updateMany(
      { students: req.params.id },
      { $pull: { students: req.params.id } }
    );

    res.json({ message: "Student deleted successfully" });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student" });
  }
};

export const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await Teacher.findById(teacherId).populate('students', 'class section');

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Extract unique classes and sections
    const uniqueClasses = [];
    const classMap = new Map(); // class -> Set(sections)

    teacher.students.forEach(student => {
      if (student.class && student.section) {
        if (!classMap.has(student.class)) {
          classMap.set(student.class, new Set());
        }
        classMap.get(student.class).add(student.section);
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
    const teacher = await Teacher.findById(teacherId).populate('students', 'branch class section');

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Build nested structure: branch -> class -> sections
    const branchMap = new Map(); // branch -> Map(class -> Set(sections))

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

