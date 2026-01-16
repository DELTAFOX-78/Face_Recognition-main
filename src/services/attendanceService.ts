// import { AttendanceStats } from '../types/attendance';
// import { config } from '../config/constants';
// import { mockAttendanceService } from './mock/mockAttendanceService';
// import api from './api';

// const realAttendanceService = {
//   getStudentAttendance: async (): Promise<AttendanceStats> => {
//     const { data } = await api.get('/student/attendance');

//     // Transform and calculate statistics
//     const records = data.map((record: any) => ({
//       subject: record.subject,
//       present: record.present,
//       total: record.total,
//       percentage: (record.present / record.total) * 100
//     }));

//     const totalPresent = records.reduce((sum, record) => sum + record.present, 0);
//     const totalClasses = records.reduce((sum, record) => sum + record.total, 0);

//     return {
//       records,
//       totalPresent,
//       totalClasses,
//       overallPercentage: (totalPresent / totalClasses) * 100
//     };
//   }
// };

// // Export either mock or real service based on configuration
// export const attendanceService = config.USE_MOCK_SERVICES
//   ? mockAttendanceService
//   : realAttendanceService;

import api from "../utils/api";
import { AttendanceStats } from "../types/attendance";

export const attendanceService = {
  async getStudentAttendance(): Promise<AttendanceStats> {
    const { data } = await api.get("/attendance/student/stats");
    return data;
  },

  async getClassAttendance(classId: string, sectionId: string) {
    const { data } = await api.get(`/attendance/class/${classId}/${sectionId}`);
    return data;
  },

  async markAttendance(studentId: string, subject: string, present: boolean) {
    const { data } = await api.post("/attendance/mark", {
      studentId,
      subject,
      present,
    });
    return data;
  },
};
