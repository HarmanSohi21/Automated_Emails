import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface CalendarProps {
  selectedDate?: string;
  selectedEndDate?: string;
  onDateSelect: (date: string) => void;
  onEndDateSelect?: (date: string) => void;
  condition?: 'after' | 'before' | 'on';
  onConditionChange?: (condition: 'after' | 'before' | 'on') => void;
  onCancel?: () => void;
  onApply?: () => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate = '',
  selectedEndDate = '',
  onDateSelect,
  onEndDateSelect,
  condition = 'after',
  onConditionChange,
  onCancel,
  onApply
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedPreset, setSelectedPreset] = useState('Custom range');
  
  const presetOptions = [
    'Today',
    'Yesterday', 
    'This week',
    'Last week',
    'This month',
    'Last month',
    'Last 30 days',
    'Custom range'
  ];

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    switch (preset) {
      case 'Today':
        onDateSelect(formatDate(today));
        break;
      case 'Yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        onDateSelect(formatDate(yesterday));
        break;
      case 'This week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        onDateSelect(formatDate(startOfWeek));
        onEndDateSelect?.(formatDate(endOfWeek));
        break;
      case 'Last week':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        onDateSelect(formatDate(lastWeekStart));
        onEndDateSelect?.(formatDate(lastWeekEnd));
        break;
      case 'This month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        onDateSelect(formatDate(startOfMonth));
        onEndDateSelect?.(formatDate(endOfMonth));
        break;
      case 'Last month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        onDateSelect(formatDate(lastMonthStart));
        onEndDateSelect?.(formatDate(lastMonthEnd));
        break;
      case 'Last 30 days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        onDateSelect(formatDate(thirtyDaysAgo));
        onEndDateSelect?.(formatDate(today));
        break;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderMonth = (monthOffset: number = 0) => {
    const targetMonth = new Date(currentMonth);
    targetMonth.setMonth(currentMonth.getMonth() + monthOffset);
    
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    const monthName = targetMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    const today = new Date().toISOString().split('T')[0];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const isSelected = dateStr === selectedDate || dateStr === selectedEndDate;
      const isToday = dateStr === today;
      
      let className = "w-8 h-8 flex items-center justify-center text-sm cursor-pointer transition-all duration-200 rounded-full ";
      
      if (isSelected) {
        className += "bg-indigo-600 text-white font-medium ";
      } else if (isToday) {
        className += "font-medium text-indigo-600 hover:bg-indigo-100 ";
      } else {
        className += "text-gray-700 hover:bg-gray-100 ";
      }
      
      days.push(
        <div
          key={`${monthOffset}-${day}`}
          className={className}
          onClick={() => onDateSelect(dateStr)}
        >
          {day}
        </div>
      );
    }
    
    return (
      <div className="flex-1">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-4">
          {monthOffset === 0 && (
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
          )}
          <h3 className="text-sm font-medium text-gray-900 flex-1 text-center">
            {monthName}
          </h3>
          {monthOffset === 1 && (
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          )}
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const getSelectedRangeText = () => {
    if (selectedDate && selectedEndDate) {
      const start = new Date(selectedDate).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
      const end = new Date(selectedEndDate).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${start} - ${end}`;
    }
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-w-4xl w-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Date Range Picker</h2>
      </div>
      
      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar - Presets */}
        <div className="w-40 bg-gray-50 border-r border-gray-200 p-4">
          <div className="space-y-1">
            {presetOptions.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetSelect(preset)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedPreset === preset
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{preset}</span>
                  {selectedPreset === preset && (
                    <Check size={12} className="text-indigo-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Right Side - Calendar */}
        <div className="flex-1 p-6">
          {/* Dual Month View */}
          <div className="flex gap-8 mb-6">
            {renderMonth(0)}
            {renderMonth(1)}
          </div>
          
          {/* Selected Range Display */}
          {getSelectedRangeText() && (
            <div className="mb-6 p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-600">Selected range:</div>
              <div className="text-sm font-medium text-gray-900">{getSelectedRangeText()}</div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium border border-indigo-300 rounded-md text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              Clear
            </button>
            <button 
              onClick={onApply}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 