import React from "react";
import { LoginFormProps } from "./types";
import { LoginHeader } from "./LoginHeader";
import { LoginFormFields } from "./LoginFormFields";
import { ErrorMessage } from "../common/ErrorMessage";

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  error,
  role,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-200" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        <div className="glass-card p-10 shadow-2xl">
          <LoginHeader role={role} />
          <LoginFormFields onSubmit={onSubmit} />
          {error && (
            <div className="mt-4 animate-slide-down">
              <ErrorMessage message={error} />
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-20" />
      </div>
    </div>
  );
};
