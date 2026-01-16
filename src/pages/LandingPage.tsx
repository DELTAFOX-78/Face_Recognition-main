import React from "react";
import { Link } from "react-router-dom";
import { School, Users } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Smart Attendance System
          </h1>
          <p className="text-xl text-white opacity-90">
            Facial Recognition Based Attendance Management
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to="/student/login"
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center">
              <Users className="w-16 h-16 text-blue-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Student Portal
              </h2>
              <p className="text-gray-600 text-center">
                Mark attendance and view your records
              </p>
            </div>
          </Link>

          <Link
            to="/teacher/login"
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center">
              <School className="w-16 h-16 text-purple-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Teacher Portal
              </h2>
              <p className="text-gray-600 text-center">
                Manage students and monitor attendance
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
