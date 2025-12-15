import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export const Card = ({ children, className = '', title, action }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    direction: 'up' | 'down';
    value: string;
    label: string;
  };
}

export const StatCard = ({ title, value, subtitle, icon: Icon, trend }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="ml-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-2">
          <span
            className={`text-sm font-medium ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-sm text-gray-500 ml-1">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
