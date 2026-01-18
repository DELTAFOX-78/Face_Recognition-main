import React, { useState } from "react";
import { User, KeyRound, ArrowRight } from "lucide-react";
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
      <div className="space-y-5">
        <FormField
          id="username"
          name="username"
          type="text"
          label="Username"
          value={username}
          onChange={setUsername}
          icon={<User className="h-5 w-5 text-indigo-400" />}
        />

        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={password}
          onChange={setPassword}
          icon={<KeyRound className="h-5 w-5 text-indigo-400" />}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="group relative w-full flex items-center justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:shadow-indigo-300/50"
      >
        <span>Sign in</span>
        <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </form>
  );
};
