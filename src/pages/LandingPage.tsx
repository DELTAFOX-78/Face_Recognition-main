import React from "react";
import { Link } from "react-router-dom";
import { School, Users, Sparkles, ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-200" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in">
            {/* Logo Icon */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Smart Attendance
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-white/60">
                System
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              AI-Powered Facial Recognition for seamless and secure attendance management
            </p>
          </div>

          {/* Portal Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Student Portal */}
            <Link
              to="/student/login"
              className="group relative overflow-hidden glass-card p-8 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-slide-up"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex flex-col items-center text-center">
                {/* Icon */}
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-300/40 mb-6 group-hover:shadow-blue-400/50 transition-shadow duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Student Portal
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  View your attendance records, take quizzes, and chat with teachers
                </p>

                {/* Action */}
                <div className="flex items-center text-blue-600 font-semibold">
                  <span>Enter Portal</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>

            {/* Teacher Portal */}
            <Link
              to="/teacher/login"
              className="group relative overflow-hidden glass-card p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-slide-up animation-delay-100"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex flex-col items-center text-center">
                {/* Icon */}
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-300/40 mb-6 group-hover:shadow-purple-400/50 transition-shadow duration-300">
                  <School className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  Teacher Portal
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  Manage students, mark attendance, and monitor class performance
                </p>

                {/* Action */}
                <div className="flex items-center text-purple-600 font-semibold">
                  <span>Enter Portal</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom Badge */}
          <div className="mt-16 text-center animate-fade-in animation-delay-300">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/80 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>AI Face Recognition Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
