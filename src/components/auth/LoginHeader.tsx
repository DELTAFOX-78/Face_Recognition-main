import React from 'react';
import { User } from 'lucide-react';

interface LoginHeaderProps {
  role: 'student' | 'teacher';
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ role }) => {
  return (
    <div className="text-center">
      <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
        <User className="h-8 w-8 text-indigo-600" />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900 capitalize">
        {role} Login
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Welcome back! Please enter your credentials to continue.
      </p>
    </div>
  );
};