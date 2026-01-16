export interface AttendanceRecord {
  subject: string;
  present: number;
  total: number;
  percentage?: number;
}

export interface AttendanceStats {
  records: AttendanceRecord[];
  totalPresent: number;
  totalClasses: number;
  overallPercentage: number;
}