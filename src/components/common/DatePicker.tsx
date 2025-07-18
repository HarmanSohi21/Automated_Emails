import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  containerWidth?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  label,
  error,
  containerWidth = 'auto'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [tempDate, setTempDate] = useState<Date | null>(value);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const containerStyle = containerWidth === 'auto' ? {} : { width: containerWidth };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return;
    
    const newDate = new Date(currentYear, currentMonth, day);
    setTempDate(newDate);
  };

  const handleApply = () => {
    onChange?.(tempDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempDate(value);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-32 h-32" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected = tempDate && 
        date.getDate() === tempDate.getDate() &&
        date.getMonth() === tempDate.getMonth() &&
        date.getFullYear() === tempDate.getFullYear();
      const isToday = date.toDateString() === new Date().toDateString();
      const isDisabled = isDateDisabled(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={`
            w-32 h-32 flex items-center justify-center rounded-md body2-regular transition-colors
            ${isSelected 
              ? 'bg-primary-700 text-white' 
              : isToday && !isDisabled
                ? 'bg-primary-100 text-primary-700 font-medium'
                : isDisabled
                  ? 'text-neutral-400 cursor-not-allowed'
                  : 'text-text-primary hover:bg-neutral-100 cursor-pointer'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative" style={containerStyle} ref={containerRef}>
      {label && (
        <label className="block body1-medium text-text-primary mb-8">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={formatDate(value)}
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full pl-12 pr-40 py-12 body1-regular border border-neutral-300 bg-white text-text-primary 
            placeholder-text-disabled rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 
            focus:border-primary-700 transition-colors duration-200 cursor-pointer
            ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-200' : ''}
          `}
        />
        <Calendar 
          className="absolute right-12 top-1/2 transform -translate-y-1/2 w-20 h-20 text-text-secondary pointer-events-none" 
        />
      </div>

      {error && (
        <span className="mt-4 caption-regular text-error-500">{error}</span>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-4 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 min-w-320">
          <div className="p-16">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-16">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-4 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <ChevronLeft size={16} className="text-text-secondary" />
              </button>
              
              <h3 className="subtitle2-medium text-text-primary">
                {MONTHS[currentMonth]} {currentYear}
              </h3>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-4 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <ChevronRight size={16} className="text-text-secondary" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-4 mb-8">
              {DAYS.map((day) => (
                <div key={day} className="w-32 h-24 flex items-center justify-center">
                  <span className="caption-medium text-text-secondary">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-4 mb-16">
              {renderCalendar()}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-8 pt-12 border-t border-neutral-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApply}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};