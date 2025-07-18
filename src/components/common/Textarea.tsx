import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerWidth?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
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
        <label className="body1-medium text-text-primary">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-12 py-12 body1-regular border border-neutral-300 bg-white text-text-primary 
          placeholder-text-disabled rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 
          focus:border-primary-700 transition-colors duration-200 resize-vertical min-h-24
          ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-200' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="caption-regular text-error-500">{error}</span>
      )}
      {helperText && !error && (
        <span className="caption-regular text-text-secondary">{helperText}</span>
      )}
    </div>
  );
};