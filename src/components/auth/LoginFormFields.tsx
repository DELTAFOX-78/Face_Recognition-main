import React, { useState } from "react";
import { User, KeyRound } from "lucide-react";
import { FormField } from "./FormField";

interface LoginFormFieldsProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
}

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  onSubmit,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    onSubmit({ username, password });
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <FormField
          id="username"
          name="username"
          type="text"
          label="Username"
          value={username}
          onChange={setUsername}
          icon={<User className="h-5 w-5 text-gray-400" />}
        />

        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={password}
          onChange={setPassword}
          icon={<KeyRound className="h-5 w-5 text-gray-400" />}
        />
      </div>

      <button
        type="submit"
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
      >
        Sign in
      </button>
    </form>
  );
};
