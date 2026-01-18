import React from "react";
import { Teacher } from "../../types/teacherMsg";
import { User } from "lucide-react";

interface TeacherCardProps {
  teacher: Teacher;
  onClick: () => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onClick }) => {
  return (
    <div
      className="flex items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <User className="h-8 w-8 text-gray-400" />
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{teacher.name}</h3>
          {teacher.newMessagesCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {teacher.newMessagesCount}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm">{teacher.recentMessage.content}</p>
      </div>
    </div>
  );
};

export default TeacherCard;
