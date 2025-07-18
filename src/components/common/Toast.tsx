import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  const bgColor = type === 'success' ? 'bg-success-50' : 'bg-error-50';
  const textColor = type === 'success' ? 'text-success-700' : 'text-error-700';
  const borderColor = type === 'success' ? 'border-success-200' : 'border-error-200';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed bottom-16 right-16 ${bgColor} ${textColor} p-16 rounded-lg border ${borderColor} shadow-lg z-50 flex items-center space-x-8`}>
      <Icon size={20} className="flex-shrink-0" />
      <span className="body1-regular">{message}</span>
    </div>
  );
};