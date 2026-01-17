import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";
import {
  login,
  addStudent,
  markAttendance,
  downloadAttendanceReport,
  stopAttendance,
} from "../controllers/teacher.controller.js";
import Teacher from "../models/Teacher.js";
import { getStudentStatistics } from "../controllers/statisticsController.js";
import {
  getStudentById,
  updateStudent,
  deleteStudent,
  getTeacherClasses,
  getTeacherBranchClassSection,
} from "../controllers/teacher.controller.js";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const customName = req.body.registerNo || "no-name";
    const extension = path.extname(file.originalname);
    cb(null, `${customName}${extension}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/login", login);
router.post("/add-student", verifyToken, upload.single("photo"), addStudent);
router.post("/mark-attendance", verifyToken, markAttendance);
router.get("/attendance-report", verifyToken, downloadAttendanceReport);
router.post("/stop-attendance", verifyToken, stopAttendance);
router.get("/classes", verifyToken, getTeacherClasses);
router.get("/filter-options", verifyToken, getTeacherBranchClassSection);
// Add this new route to existing routes
router.get("/students", verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).populate("students");
    res.json({ students: teacher.students });
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

router.get("/get-statistics/:studentId", verifyToken, getStudentStatistics);
router.get("/edit-student/:id", verifyToken, getStudentById);
router.put(
  "/edit-student/:id",
  verifyToken,
  upload.single("photo"),
  updateStudent
);
router.delete("/edit-student/:id", verifyToken, deleteStudent);

export default router;
