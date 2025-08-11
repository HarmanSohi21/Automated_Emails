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
  const baseClasses = "w-full px-12 py-8 text-sm border border-slate-300 bg-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const textColor = "text-dark-grey";
  
  const classes = `${baseClasses} ${textColor} ${error ? 'border-red-500' : ''} ${className}`;

  return (
    <div className="flex flex-col items-start gap-4" style={containerStyle}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        className={classes}
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