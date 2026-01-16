import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AttendanceChart from "../../components/attendance/AttendanceChart";
import AttendanceSummary from "../../components/attendance/AttendanceSummary";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAttendance } from "../../hooks/useAttendance";
import { ErrorMessage } from "../../components/common/ErrorMessage";

const Statistics = () => {
  const { stats, isLoading, error } = useAttendance();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage message="Failed to load attendance data" />
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500">
          No attendance records found
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Attendance Statistics</h2>
          <span className="text-sm text-gray-500">
            Last Updated: {new Date().toLocaleDateString()}
          </span>
        </div>

        <AttendanceSummary stats={stats} />

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Subject-wise Attendance
          </h3>
          <AttendanceChart data={stats.records} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
