import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "../services/attendanceService";
import { AttendanceStats } from "../types/attendance";

export const useAttendance = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery<AttendanceStats>({
    queryKey: ["attendance"],
    queryFn: () => attendanceService.getStudentAttendance(),
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};
