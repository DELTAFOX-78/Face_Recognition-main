import React from "react";

interface PopupProps {
  student: {
    id: string;
    name: string;
    photo: string;
    class: string;
    section: string;
    registerNo: string;
  };
  onAdd: () => void;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ student, onAdd, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-6 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Student Already Exists</h2>
        <div className="flex items-center mb-4">
          <img
            src={`/${student.photo}`}
            alt={student.name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{student.name}</h3>
            <p className="text-gray-500">Class: {student.class}</p>
            <p className="text-gray-500">Section: {student.section}</p>
            <p className="text-gray-500">Register No: {student.registerNo}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 mr-2"
            onClick={onAdd}
          >
            Add to My Students
          </button>
          <button
            className="bg-gray-500 text-white rounded-lg px-4 py-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
