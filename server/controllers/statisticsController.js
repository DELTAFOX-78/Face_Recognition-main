import Student from "../models/Student.js";

export const getStudentStatistics = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Group attendance by subject
    const subjectAttendance = student.attendance.reduce((acc, record) => {
      if (!acc[record.subject]) {
        acc[record.subject] = {
          present: 0,
          total: 0,
        };
      }
      acc[record.subject].total++;
      if (record.present) {
        acc[record.subject].present++;
      }

      return acc;
    }, {});

    // Calculate statistics
    const records = Object.entries(subjectAttendance).map(
      ([subject, stats]) => ({
        subject,
        present: stats.present,
        total: stats.total,
        percentage: (stats.present / stats.total) * 100,
      })
    );

    const totalPresent = records.reduce(
      (sum, record) => sum + record.present,
      0
    );
    const totalClasses = records.reduce((sum, record) => sum + record.total, 0);

    res.json({
      records,
      totalPresent,
      totalClasses,
      overallPercentage:
        totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics" });
  }
};
