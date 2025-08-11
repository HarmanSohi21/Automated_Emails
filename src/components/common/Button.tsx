import React, { ButtonHTMLAttributes } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'ghost' | 'accept' | 'partial' | 'reject' | 'primary-solid' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  fullWidth = false,
  ...props
}) => {
  // Map variants to CSS classes
  const getVariantClass = () => {
    switch (variant) {
      case 'primary-solid':
      case 'primary':
        return 'btn-primary-solid';
      case 'tertiary':
        return 'btn-tertiary';
      case 'cta':
        return 'btn-primary-solid btn-cta';
      case 'accept':
        return 'btn-accept';
      case 'partial':
        return 'btn-partial';
      case 'reject':
        return 'btn-reject';
      case 'secondary':
      case 'ghost':
      default:
        return 'btn-compact';
    }
  };

  const classes = [
    getVariantClass(),
    fullWidth ? 'w-full' : '',
    disabled || isLoading ? 'disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};