import Student from "../models/Student.js";

export const attendanceService = {
  async getStudentAttendance(studentId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
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

    return {
      records,
      totalPresent,
      totalClasses,
      overallPercentage:
        totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0,
    };
  },

  async getClassAttendance(teacherId, classId, sectionId) {
    const students = await Student.find({
      teacher: teacherId,
      class: classId,
      section: sectionId,
    });

    return Promise.all(
      students.map(async (student) => {
        const stats = await this.getStudentAttendance(student._id);
        return {
          studentId: student._id,
          name: student.name,
          registerNo: student.registerNo,
          ...stats,
        };
      })
    );
  },

  // async markAttendance(studentId, subject, present) {
  //   await Student.findByIdAndUpdate(studentId, {
  //     $push: {
  //       attendance: {
  //         date: new Date(),
  //         subject,
  //         present,
  //       },
  //     },
  //   });
  // },
};
