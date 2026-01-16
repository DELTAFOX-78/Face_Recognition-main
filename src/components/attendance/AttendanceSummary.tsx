import React from 'react';
import { AttendanceStats } from '../../types/attendance';

interface AttendanceSummaryProps {
  stats: AttendanceStats;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Classes</h3>
        <p className="text-2xl font-semibold text-gray-900">{stats.totalClasses}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500">Classes Attended</h3>
        <p className="text-2xl font-semibold text-gray-900">{stats.totalPresent}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500">Overall Attendance</h3>
        <p className="text-2xl font-semibold text-gray-900">
          {stats.overallPercentage.toFixed(1)}%
        </p>
      </div>
    </div>
  );
};

export default AttendanceSummary;