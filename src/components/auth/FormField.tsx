import React from 'react';

interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type,
  label,
  value,
  onChange,
  icon,
  placeholder
}) => {
  const isFilled = value.trim().length > 0;

  return (
    <div className="group">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-300 mb-2 group-hover:text-blue-300 transition-colors flex items-center">
        {label}
        {isFilled && <span className="ml-1 text-green-400">✓</span>}
      </label>
      <div className="mt-1 relative">
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
          isFilled ? 'text-blue-400' : 'text-slate-500 group-focus-within:text-blue-400'
        }`}>
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          required
          className={`pl-12 appearance-none block w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-0 bg-slate-800 text-white placeholder-slate-500 ${
            isFilled
              ? 'border-blue-500 bg-blue-900/20 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/20'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
          }`}
          placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};