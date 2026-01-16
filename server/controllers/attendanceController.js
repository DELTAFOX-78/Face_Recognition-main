import { attendanceService } from "../services/attendanceService.js";
import { handleAsync } from "../utils/asyncHandler.js";

export const attendanceController = {
  getStudentAttendance: handleAsync(async (req, res) => {
    const studentId = req.user.id;
    const stats = await attendanceService.getStudentAttendance(studentId);
    console.log(stats);
    res.json(stats);
  }),

  getClassAttendance: handleAsync(async (req, res) => {
    const { classId, sectionId } = req.params;
    const teacherId = req.user.id;

    const stats = await attendanceService.getClassAttendance(
      teacherId,
      classId,
      sectionId
    );
    res.json(stats);
  }),

  markAttendance: handleAsync(async (req, res) => {
    const { studentId, subject, present } = req.body;
    const teacherId = req.user.id;

    // Verify student belongs to teacher
    const student = await Student.findOne({
      _id: studentId,
      teacher: teacherId,
    });

    if (!student) {
      return res.status(403).json({
        message: "Unauthorized to mark attendance for this student",
      });
    }

    // Add attendance record
    student.attendance.push({
      date: new Date().toISOString().split("T")[0],
      subject,
      present,
    });

    await student.save();
    res.json({ message: "Attendance marked successfully" });
  }),
};
