import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  containerWidth?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  containerWidth = 'auto',
  className = '',
  ...props
}) => {
  const containerStyle = containerWidth === 'auto' ? {} : { width: containerWidth };

  const baseClasses = "w-full pl-12 pr-32 py-8 text-sm border border-slate-300 bg-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none";
  const textColor = "text-dark-grey";
  
  const classes = `${baseClasses} ${textColor} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`;

  return (
    <div className="flex flex-col items-start gap-4" style={containerStyle}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          className={classes}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
          <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  );
};