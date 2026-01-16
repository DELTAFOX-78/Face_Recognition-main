import React from "react";
import { Student } from "../../types/studentMsg";

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  return (
    <div
      className="flex items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <img
        src={`/${student.photo}`}
        alt={student.name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{student.name}</h3>
          {student.newMessagesCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {student.newMessagesCount}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm">{student.recentMessage.content}</p>
      </div>
    </div>
  );
};

export default StudentCard;
