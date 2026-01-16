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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <LoginHeader role={role} />
        <LoginFormFields onSubmit={onSubmit} />
        {error && <ErrorMessage message={error} />}
      </div>
    </div>
  );
};
