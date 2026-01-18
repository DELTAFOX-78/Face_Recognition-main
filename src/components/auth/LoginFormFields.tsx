import React, { useState } from "react";
import { User, KeyRound, LogIn, Loader, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { FormField } from "./FormField";

interface LoginFormFieldsProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
}

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  onSubmit,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ username, password });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = username.trim() && password.trim();

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      <motion.div 
        className="space-y-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <FormField
          id="username"
          name="username"
          type="text"
          label="Username"
          value={username}
          onChange={setUsername}
          icon={<User className="h-5 w-5" />}
          placeholder="Enter your username"
        />

        <div className="relative">
          <FormField
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={setPassword}
            icon={<KeyRound className="h-5 w-5" />}
            placeholder="Enter your password"
          />
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-10 text-slate-400 hover:text-blue-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Remember Me & Forgot Password */}
      <motion.div 
        className="flex items-center justify-between text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <label className="flex items-center cursor-pointer group">
          <input 
            type="checkbox" 
            className="h-4 w-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500 cursor-pointer bg-slate-700 accent-blue-500"
          />
          <span className="ml-2 text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
        </label>
        <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Forgot password?
        </a>
      </motion.div>

      <motion.button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50"
        whileHover={isFormValid ? { scale: 1.02 } : {}}
        whileTap={isFormValid ? { scale: 0.98 } : {}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {isLoading ? (
          <>
            <Loader className="h-5 w-5 animate-spin mr-2" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5 mr-2" />
            <span>Sign in</span>
          </>
        )}
      </motion.button>
    </form>
  );
};
