import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.join(__dirname, "..", "reports");

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

export const generateAttendanceReport = async (attendanceData, teacherId) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendance Report");

  // Add headers
  worksheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Student Name", key: "studentName", width: 20 },
    { header: "Class", key: "class", width: 10 },
    { header: "Section", key: "section", width: 10 },
    { header: "Register No", key: "registerNo", width: 15 },
    { header: "Subject", key: "subject", width: 15 },
    { header: "Status", key: "status", width: 10 },
  ];

  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Add data
  attendanceData.forEach((record) => {
    worksheet.addRow({
      date: new Date(record.attendance.date).toLocaleDateString(),
      studentName: record.name,
      class: record.class,
      section: record.section,
      registerNo: record.registerNo,
      subject: record.attendance.subject,
      status: record.attendance.present ? "Present" : "Absent",
    });
  });

  // Generate filename with date
  const date = new Date().toISOString().split("T")[0];
  const filename = `attendance_report_${teacherId}_${date}.xlsx`;
  const filepath = path.join(REPORTS_DIR, filename);

  // Save the workbook
  await workbook.xlsx.writeFile(filepath);
  return filepath;
};
