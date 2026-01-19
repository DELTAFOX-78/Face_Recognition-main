import React from "react";
import { AttendanceRecord } from "../../types/attendance";

interface AttendanceChartProps {
  data: AttendanceRecord[];
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  console.log(data);
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No attendance records available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((record) => {
        const hasAttendance = record.total > 0;

        return (
          <div key={record.subject} className="space-y-2">
            <div className="flex justify-between">
              <span className={`font-medium ${!hasAttendance ? 'text-gray-400' : ''}`}>
                {record.subject}
              </span>
              <span className={`${hasAttendance ? 'text-gray-600' : 'text-gray-400 text-sm'}`}>
                {hasAttendance ? `${record.percentage?.toFixed(1)}%` : 'No classes yet'}
              </span>
            </div>
            {hasAttendance ? (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${record.percentage}%`,
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500">
                  Present: {record.present} / {record.total} classes
                </div>
              </>
            ) : (
              <>
                <div className="w-full bg-gray-100 rounded-full h-2.5 border border-dashed border-gray-300">
                  <div className="bg-gray-300 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-sm text-gray-400 italic">
                  Attendance not yet started
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceChart;
