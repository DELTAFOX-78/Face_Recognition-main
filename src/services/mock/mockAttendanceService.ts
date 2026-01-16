import { AttendanceStats } from '../../types/attendance';
import { mockAttendanceData } from './mockData';

// Simulates API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAttendanceService = {
  getStudentAttendance: async (): Promise<AttendanceStats> => {
    // Simulate API call delay
    await delay(800);
    return mockAttendanceData;
  }
};