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
    <div className="group glass-card p-5 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 transform hover:-translate-y-1 border border-white/40 hover:border-indigo-200/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Avatar with Gradient Ring */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            <img
              src={getImageUrl(student.photo)}
              alt={student.name}
              className="relative h-14 w-14 rounded-full object-cover ring-3 ring-white shadow-md"
            />
            {/* Online Indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-green-500 shadow-sm" />
          </div>

          {/* Student Info */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300 truncate">
              {student.name}
            </h3>
            <p className="text-sm text-gray-500">#{student.registerNo}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100">
              {student.branch}-{student.section}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <Link
            to={`/teacher/edit-student/${student._id}`}
            className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 group/edit"
          >
            <Edit className="h-5 w-5 transform group-hover/edit:scale-110 transition-transform duration-200" />
          </Link>
          <button
            onClick={() => setShowStats(true)}
            className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 group/stats"
          >
            <BarChart2 className="h-5 w-5 transform group-hover/stats:scale-110 transition-transform duration-200" />
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
