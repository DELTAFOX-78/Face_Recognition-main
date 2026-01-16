import { AttendanceRecord, AttendanceStats } from '../types/attendance';

export const calculateAttendanceStats = (records: AttendanceRecord[]): AttendanceStats => {
  const totalPresent = records.reduce((sum, record) => sum + record.present, 0);
  const totalClasses = records.reduce((sum, record) => sum + record.total, 0);
  
  return {
    records: records.map(record => ({
      ...record,
      percentage: (record.present / record.total) * 100
    })),
    totalPresent,
    totalClasses,
    overallPercentage: (totalPresent / totalClasses) * 100
  };
};

export const getAttendanceStatus = (percentage: number): {
  color: string;
  status: string;
} => {
  if (percentage >= 90) {
    return { color: 'text-green-600', status: 'Excellent' };
  } else if (percentage >= 75) {
    return { color: 'text-blue-600', status: 'Good' };
  } else if (percentage >= 60) {
    return { color: 'text-yellow-600', status: 'Average' };
  } else {
    return { color: 'text-red-600', status: 'Poor' };
  }
};