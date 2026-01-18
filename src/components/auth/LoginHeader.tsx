import React from 'react';
import { User, GraduationCap } from 'lucide-react';

interface LoginHeaderProps {
  role: 'student' | 'teacher';
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ role }) => {
  return (
    <div className="text-center">
      {/* Icon with Gradient Background */}
      <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-300/50 transform hover:scale-105 transition-transform duration-300">
        {role === 'teacher' ? (
          <GraduationCap className="h-10 w-10 text-white" />
        ) : (
          <User className="h-10 w-10 text-white" />
        )}
      </div>

      {/* Title */}
      <h2 className="mt-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
        {role === 'teacher' ? 'Teacher' : 'Student'} Login
      </h2>

      {/* Subtitle */}
      <p className="mt-3 text-sm text-gray-500">
        Welcome back! Please enter your credentials to continue.
      </p>
    </div>
  );
};