import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  headerAction?: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  headerAction,
}) => {
  return (
    <div className={`joveo-card overflow-hidden ${className}`}>
      {title && (
        <div className="px-24 py-20 border-b border-slate-100 joveo-header-gradient">
          <div className="flex justify-between items-center">
            <h3 className="subtitle1-semibold text-slate-900">{title}</h3>
            {headerAction && (
              <div className="flex items-center space-x-12">{headerAction}</div>
            )}
          </div>
        </div>
      )}
      <div className="px-24 py-24">{children}</div>
    </div>
  );
};