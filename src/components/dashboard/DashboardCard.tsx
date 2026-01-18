import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to?: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon: Icon,
  title,
  description,
  to,
  onClick
}) => {
  const content = (
    <div className="relative overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-center space-x-4">
        {/* Icon Container */}
        <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50 group-hover:shadow-indigo-300/60 transition-shadow duration-300">
          <Icon className="h-7 w-7 text-white" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Arrow Icon */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );

  const className = `
    group relative glass-card p-6 
    hover:shadow-xl hover:shadow-indigo-100/50 
    transform hover:-translate-y-1 
    transition-all duration-300 ease-out
    cursor-pointer
    border border-white/40 hover:border-indigo-200/60
  `;

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${className} w-full text-left`}>
      {content}
    </button>
  );
};

export default DashboardCard;