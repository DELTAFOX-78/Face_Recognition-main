import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import api from "../../utils/api";

interface StudentStatisticsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

interface Record {
  subject: string;
  present: number;
  total: number;
  percentage: number;
}

interface Statistics {
  records: Record[];
  totalPresent: number;
  totalClasses: number;
  overallPercentage: number;
}

const StudentStatisticsPopup: React.FC<StudentStatisticsPopupProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        console.log("Fetching statistics for student", studentId);
        setIsLoading(true);
        setError(null);
        const response = await api.get(`/teacher/get-statistics/${studentId}`);
        const { records, totalPresent, totalClasses, overallPercentage } =
          response.data;
        setStatistics({
          records,
          totalPresent,
          totalClasses,
          overallPercentage,
        });
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchStatistics();
    }
  }, [isOpen, studentId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Statistics">
      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-red-600">
          Error loading statistics : {error.message}
        </div>
      ) : statistics ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {statistics.records.map((record) => (
              <div key={record.subject} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  {record.subject}
                </p>
                <p className="text-sm text-gray-500">
                  Present: {record.present}
                </p>
                <p className="text-sm text-gray-500">Total: {record.total}</p>
                <p className="text-sm text-gray-500">
                  Percentage: {record.percentage.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-700">
              Overall Attendance
            </p>
            <p className="text-sm text-blue-500">
              Total Present: {statistics.totalPresent}
            </p>
            <p className="text-sm text-blue-500">
              Total Classes: {statistics.totalClasses}
            </p>
            <p className="text-sm text-blue-500">
              Overall Percentage: {statistics.overallPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      ) : (
        <div className="text-red-600">No statistics available</div>
      )}
    </Modal>
  );
};

export default StudentStatisticsPopup;
