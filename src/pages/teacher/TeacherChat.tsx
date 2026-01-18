import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import StudentCard from "../../components/chat/StudentChatCard";
import ChatSection from "../../components/chat/ChatSection";
import api from "../../utils/api";
import { Student } from "../../types/studentMsg";
import { MessageCircle } from "lucide-react";

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
      <div className="flex h-screen bg-slate-900 relative overflow-hidden">
        {/* Animated Background Globs */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-40 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, delay: 1 }}
          className="absolute bottom-40 left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"
        />

        {/* Students Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/3 bg-slate-800/50 backdrop-blur-xl rounded-lg shadow-xl p-6 overflow-y-auto h-full border border-white/10 m-4 relative z-10"
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div 
              className="p-2 bg-blue-500/20 rounded-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <MessageCircle className="w-5 h-5 text-blue-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Students</h2>
          </div>
          <motion.div 
            className="space-y-4"
            variants={{ container: { staggerChildren: 0.05 } }}
            initial="hidden"
            animate="visible"
          >
            {students
              .sort(
                (a, b) =>
                  new Date(b.recentMessage.timestamp).getTime() -
                  new Date(a.recentMessage.timestamp).getTime()
              )
              .map((student, idx) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <StudentCard
                    student={student}
                    onClick={() => handleStudentClick(student)}
                  />
                </motion.div>
              ))}
          </motion.div>
        </motion.div>

        {/* Chat Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-2/3 bg-slate-800/50 backdrop-blur-xl rounded-lg shadow-xl flex flex-col h-full border border-white/10 m-4 relative z-10 overflow-hidden"
        >
          {selectedStudent ? (
            <>
              <motion.div 
                className="flex items-center p-4 border-b border-white/10 bg-slate-800/80"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.img
                  src={`/${selectedStudent.photo}`}
                  alt={selectedStudent.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-blue-500"
                  whileHover={{ scale: 1.1 }}
                />
                <h3 className="ml-4 text-lg font-semibold text-white">
                  {selectedStudent.name}
                </h3>
              </motion.div>
              <ChatSection receiverId={selectedStudent.id} />
            </>
          ) : (
            <motion.div 
              className="flex items-center justify-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <motion.div 
                  className="p-4 bg-blue-500/20 rounded-full mx-auto mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageCircle className="w-12 h-12 text-blue-400" />
                </motion.div>
                <p className="text-slate-300">
                  Select a student to start chatting
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherChat;
