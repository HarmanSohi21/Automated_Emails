import React from 'react';
import { Settings, Users } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  showSelectionPrompt?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  description = "Get started by adding some data.",
  icon,
  actionText,
  onAction,
  showSelectionPrompt = false
}) => {
  if (showSelectionPrompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 px-24 py-32 text-center">
        <div className="flex items-center gap-16 mb-24">
          <div className="w-48 h-48 bg-indigo-100 rounded-full flex items-center justify-center">
            <Settings size={24} className="text-indigo-600" />
          </div>
          <div className="w-6 h-0.5 bg-gray-300"></div>
          <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
            <Users size={24} className="text-gray-400" />
          </div>
        </div>
        
        <h2 className="text-24 font-semibold text-gray-900 mb-8">
          Welcome to Email Manager
        </h2>
        
        <p className="text-16 text-gray-600 mb-16 max-w-md">
          To get started, please select an account instance and the clients you want to manage.
        </p>
        
        <div className="flex flex-col gap-8 text-14 text-gray-500">
          <div className="flex items-center gap-8">
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-12 font-bold">1</span>
            </div>
            <span>Select an account instance from the dropdown above</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-white text-12 font-bold">2</span>
            </div>
            <span>Choose one or more clients to manage</span>
          </div>
        </div>
        
        <div className="mt-24 px-16 py-8 bg-blue-50 rounded-8 border border-blue-200">
          <p className="text-12 text-blue-700">
            💡 Your selections will be saved and remembered for future sessions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-96 px-24 py-32 text-center">
      {icon && (
        <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-16">
          {icon}
        </div>
      )}
      
      <h3 className="text-18 font-medium text-gray-900 mb-8">{title}</h3>
      <p className="text-14 text-gray-600 mb-16 max-w-md">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-16 py-8 bg-indigo-600 text-white text-14 font-medium rounded-4 hover:bg-indigo-700 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};