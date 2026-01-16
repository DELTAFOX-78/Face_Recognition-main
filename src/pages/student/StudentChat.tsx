import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TeacherCard from "../../components/chat/TeacherChatCard";
import ChatSection from "../../components/chat/ChatSection";
import api from "../../utils/api";
import { Teacher } from "../../types/teacherMsg";
import { User } from "lucide-react";

const StudentChat = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/chat/teachers");
        setTeachers(response.data);
      } catch (err) {
        console.error("Failed to load teachers", err);
      }
    };
    fetchTeachers();
  }, []);

  const handleTeacherClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  useEffect(() => {
    if (selectedTeacher) {
      // Mark messages as read when a teacher is selected
      api.post(`/chat/mark-read/${selectedTeacher.id}`);
    }
  }, [selectedTeacher]);

  return (
    <DashboardLayout>
      <div className="flex h-screen">
        <div className="w-1/3 bg-white rounded-lg shadow p-6 overflow-y-auto h-full">
          <h2 className="text-2xl font-bold mb-6">Teachers</h2>
          <div className="space-y-4">
            {teachers
              .sort(
                (a, b) =>
                  new Date(b.recentMessage.timestamp).getTime() -
                  new Date(a.recentMessage.timestamp).getTime()
              )
              .map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onClick={() => handleTeacherClick(teacher)}
                />
              ))}
          </div>
        </div>
        <div className="w-2/3 bg-white rounded-lg shadow flex flex-col h-full">
          {selectedTeacher ? (
            <>
              <div className="flex items-center p-4 border-b">
                <User className="h-8 w-8 text-gray-400" />
                <h3 className="ml-4 text-lg font-semibold">
                  {selectedTeacher.name}
                </h3>
              </div>
              <ChatSection receiverId={selectedTeacher.id} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Select a teacher to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentChat;
