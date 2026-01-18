import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

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
    <div className="relative h-full flex flex-col">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <ArrowRight className="h-5 w-5 text-blue-600 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm flex-1 group-hover:text-gray-700 transition-colors">{description}</p>
      </div>

      {/* Bottom accent */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left mt-4"></div>
    </div>
  );

  const className = "group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 h-full transform hover:-translate-y-1 cursor-pointer";

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
};

export default DashboardCard;