import React, { useState } from "react";
import { Edit, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Student } from "../../types/student";
import { getImageUrl } from "../../utils/imageUtils";
import StudentStatisticsPopup from "../Popup/StudentStatisticsPopup";

interface StudentCardProps {
  student: Student;
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={getImageUrl(student.photo)}
              alt={student.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{student.name}</h3>
            <p className="text-sm text-gray-500">#{student.registerNo}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {student.class}-{student.section}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/teacher/edit-student/${student._id}`}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors duration-200"
          >
            <Edit className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setShowStats(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors duration-200"
          >
            <BarChart2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <StudentStatisticsPopup
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        studentId={student._id}
      />
    </div>
  );
};

export default StudentCard;
