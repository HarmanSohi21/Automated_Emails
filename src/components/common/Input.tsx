import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerWidth?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerWidth = 'auto',
  className = '',
  ...props
}) => {
  const containerStyle = containerWidth === 'auto' ? {} : { width: containerWidth };

  return (
    <div className="flex flex-col items-start gap-4" style={containerStyle}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-12 py-8 text-sm border border-slate-300 bg-white text-slate-900 
          placeholder-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
          focus:border-indigo-500 transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-xs text-slate-500">{helperText}</span>
      )}
    </div>
  );
};