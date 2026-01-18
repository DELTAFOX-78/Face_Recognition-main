import cron from "node-cron";
import { generateAttendanceReport } from "../services/excelService.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

// Schedule task to run at 5:00 PM IST every day
// Note: Cron is in UTC, so adjust accordingly (11:30 UTC = 17:00 IST)
export const scheduleAttendanceReports = () => {
  cron.schedule("30 11 * * *", async () => {
    try {
      console.log("Starting daily attendance report generation...");

      // Get all teachers
      const teachers = await Teacher.find();

      for (const teacher of teachers) {
        // Get attendance data for teacher's students
        const attendanceData = await Student.aggregate([
          {
            $match: {
              _id: { $in: teacher.students },
            },
          },
          {
            $unwind: "$attendance",
          },
          {
            $match: {
              "attendance.date": {
                $gte: new Date().toISOString().split("T")[0],
              },
            },
          },
          {
            $project: {
              name: 1,
              class: 1,
              section: 1,
              registerNo: 1,
              "attendance.date": 1,
              "attendance.subject": 1,
              "attendance.present": 1,
            },
          },
        ]);

        // Generate report if there's data
        if (attendanceData.length > 0) {
          const reportData = attendanceData.map((record) => ({
            student: {
              name: record.name,
              class: record.class,
              section: record.section,
              registerNo: record.registerNo,
            },
            date: record.attendance.date,
            subject: record.attendance.subject,
            present: record.attendance.present,
          }));

          await generateAttendanceReport(reportData, teacher._id);
          console.log(`Generated report for teacher ${teacher._id}`);
        }
      }

      console.log("Daily attendance report generation completed");
    } catch (error) {
      console.error("Error generating daily reports:", error);
    }
  });
};
