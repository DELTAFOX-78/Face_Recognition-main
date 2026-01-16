import express from "express";
import { attendanceController } from "../controllers/attendanceController.js";
import { authMiddleware, roleCheck } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

// Student routes
router.get(
  "/student/stats",
  roleCheck(["student"]),
  attendanceController.getStudentAttendance
);

// Teacher routes
router.get(
  "/class/:classId/:sectionId",
  roleCheck(["teacher"]),
  attendanceController.getClassAttendance
);

router.post(
  "/mark",
  roleCheck(["teacher"]),
  attendanceController.markAttendance
);

export default router;
