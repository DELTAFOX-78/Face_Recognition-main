import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import StudentCard from "../../components/chat/StudentChatCard";
import ChatSection from "../../components/chat/ChatSection";
import api from "../../utils/api";
import { Student } from "../../types/studentMsg";

const TeacherChat = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/chat/students");
        setStudents(response.data);
      } catch (err) {
        console.error("Failed to load students", err);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  useEffect(() => {
    if (selectedStudent) {
      // Mark messages as read when a student is selected
      api.post(`/chat/mark-read/${selectedStudent.id}`);
    }
  }, [selectedStudent]);

  return (
    <DashboardLayout>
      <div className="flex h-screen">
        <div className="w-1/3 bg-white rounded-lg shadow p-6 overflow-y-auto h-full">
          <h2 className="text-2xl font-bold mb-6">Students</h2>
          <div className="space-y-4">
            {students
              .sort(
                (a, b) =>
                  new Date(b.recentMessage.timestamp).getTime() -
                  new Date(a.recentMessage.timestamp).getTime()
              )
              .map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onClick={() => handleStudentClick(student)}
                />
              ))}
          </div>
        </div>
        <div className="w-2/3 bg-white rounded-lg shadow flex flex-col h-full">
          {selectedStudent ? (
            <>
              <div className="flex items-center p-4 border-b">
                <img
                  src={`/${selectedStudent.photo}`}
                  alt={selectedStudent.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <h3 className="ml-4 text-lg font-semibold">
                  {selectedStudent.name}
                </h3>
              </div>
              <ChatSection receiverId={selectedStudent.id} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Select a student to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherChat;
