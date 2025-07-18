import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'info' | 'warning' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  variant = 'default',
  size = 'md',
  delay = 200,
  disabled = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate optimal position after showing
      setTimeout(() => {
        calculatePosition();
      }, 0);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const calculatePosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPosition = position;

    // Check if tooltip fits in the preferred position
    switch (position) {
      case 'top':
        if (triggerRect.top - tooltipRect.height < 10) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewport.height - 10) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (triggerRect.left - tooltipRect.width < 10) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewport.width - 10) {
          newPosition = 'left';
        }
        break;
    }

    setActualPosition(newPosition);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Variant styles
  const variantStyles = {
    default: 'bg-slate-800 text-white border-slate-700',
    info: 'bg-blue-600 text-white border-blue-500',
    warning: 'bg-amber-600 text-white border-amber-500',
    error: 'bg-red-600 text-white border-red-500',
    success: 'bg-emerald-600 text-white border-emerald-500'
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-8 py-4 text-xs max-w-160',
    md: 'px-12 py-6 text-sm max-w-200',
    lg: 'px-16 py-8 text-base max-w-280'
  };

  // Position styles
  const positionStyles = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-8',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-8',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-8',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-8'
  };

  // Arrow styles
  const arrowStyles = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent'
  };

  const arrowColors = {
    default: 'border-t-slate-800 border-b-slate-800 border-l-slate-800 border-r-slate-800',
    info: 'border-t-blue-600 border-b-blue-600 border-l-blue-600 border-r-blue-600',
    warning: 'border-t-amber-600 border-b-amber-600 border-l-amber-600 border-r-amber-600',
    error: 'border-t-red-600 border-b-red-600 border-l-red-600 border-r-red-600',
    success: 'border-t-emerald-600 border-b-emerald-600 border-l-emerald-600 border-r-emerald-600'
  };

  return (
    <div 
      className="relative inline-block"
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 rounded-lg border shadow-lg
            transition-all duration-200 ease-out
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${positionStyles[actualPosition]}
            ${className}
          `}
          style={{
            animation: 'tooltipFadeIn 0.2s ease-out forwards'
          }}
        >
          {/* Tooltip Content */}
          <div className="relative z-10">
            {typeof content === 'string' ? (
              <span className="font-medium leading-tight">{content}</span>
            ) : (
              content
            )}
          </div>

          {/* Arrow */}
          <div 
            className={`
              absolute w-0 h-0
              ${arrowStyles[actualPosition]}
              ${arrowColors[variant]}
            `}
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: ${actualPosition === 'top' ? 'translateY(4px) translateX(-50%)' :
                       actualPosition === 'bottom' ? 'translateY(-4px) translateX(-50%)' :
                       actualPosition === 'left' ? 'translateX(4px) translateY(-50%)' :
                       'translateX(-4px) translateY(-50%)'};
          }
          to {
            opacity: 1;
            transform: ${actualPosition === 'top' || actualPosition === 'bottom' ? 'translateY(0) translateX(-50%)' :
                       'translateX(0) translateY(-50%)'};
          }
        }
      `}</style>
    </div>
  );
};