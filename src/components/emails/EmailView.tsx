import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Plus, Minus, Send, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { EmailTemplate, Priority } from '../../types';
import { useApp } from '../../context/AppContext';

const priorityOptions: { value: Priority; label: string; icon: React.ComponentType<any>; color: string }[] = [
  { value: 'Urgent', label: 'Urgent / Critical — Immediate attention', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'High', label: 'High — Action within 2 business days', icon: AlertCircle, color: 'text-orange-500' },
  { value: 'Medium', label: 'Medium — Action within 3–5 business days', icon: Clock, color: 'text-yellow-500' },
  { value: 'Low', label: 'Low — Action within 7 days (as bandwidth allows)', icon: Minus, color: 'text-gray-500' },
];

// Priority Dropdown Component with Icons (no search)
const PriorityDropdown: React.FC<{
  options: { value: Priority; label: string; icon: React.ComponentType<any>; color: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-full pl-16 pr-40 py-10 text-sm border bg-white rounded-lg cursor-pointer transition-all duration-200
          ${isOpen 
            ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20' 
            : 'border-neutral-300 hover:border-neutral-400'
          }
        `}
      >
        <div className="flex items-center gap-8">
          {selectedOption && (
            <selectedOption.icon size={16} className={selectedOption.color} />
          )}
          <span className={`block truncate ${selectedOption ? 'text-neutral-900' : 'text-neutral-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div className="absolute inset-y-0 right-12 flex items-center pointer-events-none">
          <svg 
            className={`w-16 h-16 text-neutral-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full bg-white border border-neutral-200 rounded-lg shadow-xl max-h-240 overflow-hidden top-full mt-4">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                flex items-center justify-between px-16 py-10 text-sm cursor-pointer transition-colors
                ${option.value === value
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-900 hover:bg-neutral-50'
                }
              `}
            >
              <div className="flex items-center gap-8">
                <option.icon size={16} className={option.color} />
                <span className="truncate">{option.label}</span>
              </div>
              {option.value === value && (
                <svg className="w-16 h-16 text-primary-600 flex-shrink-0 ml-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface EmailViewProps {
  template: EmailTemplate & {
    recipients: string[];
    entityType: string;
    entityName: string;
  };
  onClose?: () => void;
}

// Duration Dropdown Component
const DurationDropdown: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  customStartDate?: string;
  customEndDate?: string;
}> = ({ options, value, onChange, placeholder, customStartDate, customEndDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  // Format custom date range for display
  const formatCustomDateRange = () => {
    if (value === 'Custom' && customStartDate) {
      const startDate = new Date(customStartDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (customEndDate) {
        const endDate = new Date(customEndDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        return `Custom (${startDate} - ${endDate})`;
      } else {
        return `Custom (${startDate})`;
      }
    }
    return selectedOption ? selectedOption.label : placeholder;
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-full pl-16 pr-40 py-10 text-sm border bg-white rounded-lg cursor-pointer transition-all duration-200
          ${isOpen 
            ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20' 
            : 'border-neutral-300 hover:border-neutral-400'
          }
        `}
      >
        <span className={`block truncate ${selectedOption ? 'text-neutral-900' : 'text-neutral-500'}`}>
          {formatCustomDateRange()}
        </span>
        <div className="absolute inset-y-0 right-12 flex items-center pointer-events-none">
          <svg 
            className={`w-16 h-16 text-neutral-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full bg-white border border-neutral-200 rounded-lg shadow-xl max-h-240 overflow-hidden top-full mt-4">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                flex items-center justify-between px-16 py-10 text-sm cursor-pointer transition-colors
                ${option.value === value
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-900 hover:bg-neutral-50'
                }
              `}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && (
                <svg className="w-16 h-16 text-primary-600 flex-shrink-0 ml-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Toast Component (matching Recommendations design)
const EnhancedToast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-end justify-center z-50 pointer-events-none">
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className={`flex items-center gap-12 px-12 py-8 rounded-4 shadow-lg border ${
          type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`} style={{ width: '360px' }}>
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white">
            {type === 'success' ? (
              <Check size={12} className="text-green-600" />
            ) : (
              <X size={12} className="text-red-600" />
            )}
          </div>
          <span className="text-12 font-normal flex-1">{message}</span>
          <button
            onClick={onClose}
            className="w-20 h-20 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors"
          >
            <X size={10} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced EmailView with Clean Email Preview - V13
export const EmailView: React.FC<EmailViewProps> = ({ template, onClose }) => {
  /* -------------------- STATE -------------------- */
  const { user } = useApp();
  const [cc, setCc] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Use authenticated user from context
  const currentUser = user || {
    name: 'Harman Sohi',
    email: 'harman@joveo.com'
  };
  
  // Form fields
  const [budget, setBudget] = useState(template.budget?.toString() || '1150');
  const [duration, setDuration] = useState((template as any).duration || 'Monthly');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customDurationStart, setCustomDurationStart] = useState('');
  const [customDurationEnd, setCustomDurationEnd] = useState('');
  const customDurationRef = useRef<HTMLDivElement>(null);
  const [cpcBid, setCpcBid] = useState((template as any).cpcBid?.toString() || '2.5');
  
  // Handle click outside to close custom duration picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customDurationRef.current && !customDurationRef.current.contains(event.target as Node)) {
        setShowCustomDuration(false);
      }
    };

    if (showCustomDuration) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomDuration]);
  const [cpaGoal, setCpaGoal] = useState((template as any).cpaGoal?.toString() || '45.00');
  const [feedUrl, setFeedUrl] = useState(template.feedUrl || '');
  const [landingPage, setLandingPage] = useState((template as any).landingPageUrl || 'https://careers.acmecorp.com/jobs');
  
  // Optional fields state
  const [showGoLive, setShowGoLive] = useState(false);
  const [goLiveDate, setGoLiveDate] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState('');
  const [showLocations, setShowLocations] = useState(false);
  const [locations, setLocations] = useState('');
  const [showPriority, setShowPriority] = useState(false);
  const [priority, setPriority] = useState('');

  /* -------------------- HELPERS ------------------ */
  const formatCurrency = (value: string, type: 'budget' | 'cpc' | 'cpa') => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    
    switch (type) {
      case 'budget':
        // Budget: No decimals, rounded values
        return `$${Math.round(num).toLocaleString()}`;
      case 'cpc':
        // CPC: Single digit with decimals
        return `$${num.toFixed(1)}`;
      case 'cpa':
        // CPA: Double digit with decimals  
        return `$${num.toFixed(2)}`;
      default:
        return `$${num.toLocaleString()}`;
    }
  };
  
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  const handleSend = async () => {
    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
        onClose?.();
      }, 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setIsSending(false);
    }
  };

  const isClient = template.entityType === 'Client';

  return (
    <>
      <div className="p-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-32">
          <div>
            <h2 className="text-2xl font-semibold text-dark-grey">Email Notification</h2>
            <p className="text-sm text-gray-600 mt-4">
              {isClient ? 'Client Onboarding' : `${template.entityType} Setup`} - {template.entityName}
            </p>
          </div>
          {onClose && (
            <Button variant="secondary" icon={<X size={16} />} onClick={onClose} />
          )}
        </div>

        {/* Email Form */}
        <div className="space-y-24">
          {/* Recipients */}
          <div className="grid grid-cols-1 gap-16">
            <div className="space-y-8">
              <label className="block text-14 font-semibold text-dark-grey">
                <span className="text-red-500 mr-4">*</span>To:
              </label>
              <Input
                value={template.recipients?.join(', ') || 'partner@indeed.com'}
                className="bg-gray-50"
                readOnly
              />
            </div>

            <div className="space-y-8">
              <label className="block text-14 font-semibold text-dark-grey">
                Cc:
              </label>
              <Input
            placeholder="Enter email addresses (comma-separated)"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
          />
        </div>

            <div className="space-y-8">
              <label className="block text-14 font-semibold text-dark-grey">
                <span className="text-red-500 mr-4">*</span>Subject:
              </label>
              <Input
                value={`${(priority && priority !== 'Low') ? `[${priority} Priority] ` : ''}${isClient ? `New Client Onboarding - ${template.entityName} - Request for Feed Indexing & Goal Validation` : template.entityType === 'Campaign' ? `New Campaign Setup for ${template.clientName} – ${template.entityName}` : `New Job Group Setup for ${template.clientName} – ${template.entityName}`}`}
                className="bg-gray-50"
                readOnly
              />
            </div>
        </div>

          {/* Email Content */}
          <div className="border-t pt-24">
            <h3 className="text-16 font-semibold text-dark-grey mb-16">Email Content</h3>
            
            {/* Feed URL and Client Application URL - Only show for Client entity type */}
            {isClient && (
              <div className="grid grid-cols-2 gap-16 mb-16">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <label className="block text-14 font-semibold text-dark-grey">
                      <span className="text-red-500 mr-4">*</span>Feed URL
                    </label>
                    {feedUrl && (
                      <button
                        type="button"
                        onClick={() => setFeedUrl('')}
                        className="text-12 font-normal text-blue-600 hover:text-blue-800 transition-colors"
                        style={{ color: '#303F9F' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <Input
                    placeholder="Enter feed URL"
                    value={feedUrl}
                    onChange={(e) => setFeedUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <label className="block text-14 font-semibold text-dark-grey">
                      <span className="text-red-500 mr-4">*</span>Client application URL
                    </label>
                    {landingPage && (
                      <button
                        type="button"
                        onClick={() => setLandingPage('')}
                        className="text-12 font-normal text-blue-600 hover:text-blue-800 transition-colors"
                        style={{ color: '#303F9F' }}
                      >
                        Clear
                      </button>
                    )}
              </div>
                  <Input
                    placeholder="Fetched from MOJO"
                    value={landingPage}
                    onChange={(e) => setLandingPage(e.target.value)}
                    required
                />
              </div>
            </div>
            )}

            {/* Optional Fields */}
            <div className="grid grid-cols-2 gap-16 mb-16">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <label className="block text-14 font-semibold text-dark-grey">
                    <span className="text-red-500 mr-4">*</span>Budget
                  </label>
                  {budget && (
                    <button
                      type="button"
                      onClick={() => setBudget('')}
                      className="text-12 font-normal text-blue-600 hover:text-blue-800 transition-colors"
                      style={{ color: '#303F9F' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    placeholder="Enter budget value"
                  value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    style={{ paddingLeft: '45px !important' }}
                    className="!pl-45"
                    required
                  />
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 text-14 text-gray-500 pointer-events-none">
                    $
                  </span>
              </div>
            </div>

              <div className="space-y-8 relative">
                <div className="flex items-center justify-between">
                  <label className="block text-14 font-semibold text-dark-grey">
                    <span className="text-red-500 mr-4">*</span>Duration
                  </label>
                </div>
                <DurationDropdown
                  options={[
                    { value: 'Daily', label: 'Daily' },
                    { value: 'Weekly', label: 'Weekly' },
                    { value: 'Monthly', label: 'Monthly' },
                    { value: 'Lifetime', label: 'Lifetime' },
                    { value: 'Custom', label: 'Custom' },
                  ]}
                  value={duration}
                  onChange={(value) => {
                    setDuration(value);
                    if (value === 'Custom') {
                      setShowCustomDuration(true);
                    } else {
                      setShowCustomDuration(false);
                    }
                  }}
                  placeholder="Select duration"
                  customStartDate={customDurationStart}
                  customEndDate={customDurationEnd}
                />
                
                {/* Custom Duration Date Picker - Overlay */}
                {showCustomDuration && (
                  <div ref={customDurationRef} className="absolute top-full left-0 mt-8 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-16">
                    <div className="space-y-12">
                      <div className="text-14 font-medium text-gray-700 mb-8">
                        Select Custom Duration
                      </div>
                      
                      <div className="grid grid-cols-2 gap-12">
                        <div>
                          <label className="block text-12 font-medium text-gray-600 mb-4">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={customDurationStart}
                            onChange={(e) => setCustomDurationStart(e.target.value)}
                            className="w-full px-12 py-8 text-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-12 font-medium text-gray-600 mb-4">
                            End Date (Optional)
                          </label>
                          <input
                            type="date"
                            value={customDurationEnd}
                            onChange={(e) => setCustomDurationEnd(e.target.value)}
                            min={customDurationStart}
                            placeholder="Leave empty for single day"
                            className="w-full px-12 py-8 text-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-8 pt-8">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomDuration(false);
                            setCustomDurationStart('');
                            setCustomDurationEnd('');
                          }}
                          className="px-12 py-6 text-12 font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCustomDuration(false)}
                          className="px-12 py-6 text-12 font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-2 gap-16 mb-16">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <label className="block text-14 font-semibold text-dark-grey">
                    CPC Bid
                  </label>
                  {cpcBid && (
                    <button
                      type="button"
                      onClick={() => setCpcBid('')}
                      className="text-12 font-normal text-blue-600 hover:text-blue-800 transition-colors"
                      style={{ color: '#303F9F' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    placeholder="Enter CPC bid value"
                    value={cpcBid}
                    onChange={(e) => setCpcBid(e.target.value)}
                    style={{ paddingLeft: '45px !important' }}
                    className="!pl-45"
                  />
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 text-14 text-gray-500 pointer-events-none">
                    $
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <label className="block text-14 font-semibold text-dark-grey">
                    CPA Goal
                  </label>
                  {cpaGoal && (
                    <button
                      type="button"
                      onClick={() => setCpaGoal('')}
                      className="text-12 font-normal text-blue-600 hover:text-blue-800 transition-colors"
                      style={{ color: '#303F9F' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    placeholder="Enter CPA goal value"
                    value={cpaGoal}
                    onChange={(e) => setCpaGoal(e.target.value)}
                    style={{ paddingLeft: '45px !important' }}
                    className="!pl-45"
                  />
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 text-14 text-gray-500 pointer-events-none">
                    $
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="mt-24">
              <h4 className="text-sm font-medium text-dark-grey mb-12">Optional & Additional Fields</h4>
              
              {/* Additional Notes */}
              <div className="flex items-center gap-8 mb-12">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center gap-4 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showNotes ? <Minus size={16} /> : <Plus size={16} />}
                  Additional Notes
                </button>
              </div>
              {showNotes && (
                <div className="mb-16">
                  <Textarea
                    placeholder="Enter additional notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
              />
            </div>
              )}

              {/* Top Categories */}
              <div className="flex items-center gap-8 mb-12">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex items-center gap-4 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showCategories ? <Minus size={16} /> : <Plus size={16} />}
                  Top Categories
                </button>
              </div>
              {showCategories && (
                <div className="mb-16">
                  <Input
                    placeholder="Enter top categories"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
              />
            </div>
              )}

              {/* Top Locations */}
              <div className="flex items-center gap-8 mb-12">
                <button
                  onClick={() => setShowLocations(!showLocations)}
                  className="flex items-center gap-4 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showLocations ? <Minus size={16} /> : <Plus size={16} />}
                  Top Locations
                </button>
            </div>
              {showLocations && (
                <div className="mb-16">
                  <Input
                    placeholder="Enter top locations"
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
              />
            </div>
              )}

              {/* Priority */}
              <div className="flex items-center gap-8 mb-12">
                <button
                  onClick={() => setShowPriority(!showPriority)}
                  className="flex items-center gap-4 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showPriority ? <Minus size={16} /> : <Plus size={16} />}
                  Priority
                </button>
              </div>
              {showPriority && (
                <div className="mb-16">
                  <PriorityDropdown
                    options={priorityOptions}
                    value={priority}
                    onChange={(value) => setPriority(value)}
                    placeholder="Select priority"
                  />
                </div>
              )}

              {/* Go Live Date */}
              <div className="flex items-center gap-8 mb-12">
                <button
                  onClick={() => setShowGoLive(!showGoLive)}
                  className="flex items-center gap-4 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showGoLive ? <Minus size={16} /> : <Plus size={16} />}
                  Go Live Date
                </button>
              </div>
              {showGoLive && (
                <div className="mb-16">
                  <div className="flex items-center justify-between mb-8">
                    <label className="block text-14 font-medium text-dark-grey">
                      Go Live Date
                    </label>
                    {goLiveDate && (
                      <button
                        type="button"
                        onClick={() => setGoLiveDate('')}
                        className="text-12 font-normal text-blue-600 hover:text-blue-800 transition-colors"
                        style={{ color: '#303F9F' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="date"
                value={goLiveDate}
                    onChange={(e) => setGoLiveDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // Only allow future dates
                    className="w-full px-16 py-10 text-14 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="Select go live date"
              />
            </div>
              )}
            </div>
          </div>

          {/* Email Preview */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-24">
            <div className="max-w-2xl mx-auto bg-white rounded-8 shadow-sm overflow-hidden">
              {/* Email Header with Joveo Logo */}
              <div style={{ backgroundColor: '#303F9F' }} className="h-12 rounded-t-8"></div>
              
              <div className="p-32">
                {/* Joveo Logo */}
                <div className="mb-32">
                  <img 
                    src="/Joveo.png" 
                    alt="Joveo Logo" 
                    className="h-40 object-contain"
                  />
                </div>

                {/* Email Content */}
                <div className="space-y-24" style={{ color: '#374151' }}>
                  {/* Greeting */}
                  <div className="space-y-16">
                    <p className="text-14 leading-relaxed">
                      Dear {template.clientName || 'Partner'} Team,
                    </p>
                    
                    <p className="text-14 leading-relaxed">
                      Hope you're doing well!
                    </p>

                    {isClient ? (
                      <p className="text-14 leading-relaxed">
                        We're pleased to inform you that Joveo has onboarded a new client <strong>{template.entityName}</strong> and would appreciate your support with the next steps. The feed has been attached and will be populated shortly. We request you to index it accordingly and validate the associated goals.
                      </p>
                    ) : (
                      <p className="text-14 leading-relaxed">
                        We wanted to inform you that a new <strong>{template.entityType === 'Campaign' ? 'campaign' : 'job group'}</strong> has been set up for <strong>{template.clientName}</strong> – <strong>{template.entityName}</strong>.
                      </p>
                    )}
                  </div>

                  {/* Combined Content Box */}
                  <div style={{ backgroundColor: '#E8EAF6' }} className="border rounded-8 p-24">
                    {/* Entity Details Section */}
                    <div className="mb-24">
                      <h3 className="text-16 font-semibold mb-16" style={{ color: '#374151' }}>
                        📋 {isClient ? 'Client Setup Details' : template.entityType === 'Campaign' ? 'Campaign Setup Details' : 'Job Group Setup Details'}
                      </h3>

                      <div className="grid grid-cols-1 gap-16">
                        {isClient ? (
                          <>
                            <div>
                              <span className="font-medium block mb-4" style={{ color: '#374151' }}>Client:</span>
                              <span className="text-14">{template.entityName}</span>
                            </div>
                            <div>
                              <span className="font-medium block mb-4" style={{ color: '#374151' }}>Feed URL:</span>
                              <span className="text-14">{feedUrl}</span>
                            </div>
                            <div>
                              <span className="font-medium block mb-4" style={{ color: '#374151' }}>Client Landing Page:</span>
                              <span className="text-14">{landingPage}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="font-medium block mb-4" style={{ color: '#374151' }}>Client:</span>
                              <span className="text-14">{template.clientName}</span>
                            </div>
                            <div>
                              <span className="font-medium block mb-4" style={{ color: '#374151' }}>{template.entityType === 'Campaign' ? 'Campaign:' : 'Job Group:'}</span>
                              <span className="text-14">{template.entityName}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Current Performance Metrics */}
                    <div>
                      <h3 className="text-16 font-semibold mb-16" style={{ color: '#374151' }}>
                        📊 Current Performance Metrics
                      </h3>

                      <div className="grid grid-cols-3 gap-16">
                        {cpcBid && (
                          <div>
                            <span className="font-medium block mb-4" style={{ color: '#374151' }}>Current CPC Bid</span>
                            <span className="text-14">{formatCurrency(cpcBid, 'cpc')}</span>
                          </div>
                        )}
                        
                        {cpaGoal && (
                          <div>
                            <span className="font-medium block mb-4" style={{ color: '#374151' }}>Current CPA Goal</span>
                            <span className="text-14">{formatCurrency(cpaGoal, 'cpa')}</span>
                          </div>
                        )}
                        
                        <div>
                          <span className="font-medium block mb-4" style={{ color: '#374151' }}>Current Budget</span>
                          <span className="text-14">{formatCurrency(budget, 'budget')}</span>
                        </div>
                      </div>

                      <div className="mt-16">
                        <span className="font-medium block mb-4" style={{ color: '#374151' }}>Duration:</span>
                        <span className="text-14">
                          {duration === 'Custom' && customDurationStart ? (
                            (() => {
                              const startDate = new Date(customDurationStart).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              });
                              
                              if (customDurationEnd) {
                                const endDate = new Date(customDurationEnd).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                });
                                return `Custom (${startDate} - ${endDate})`;
                              } else {
                                return `Custom (${startDate})`;
                              }
                            })()
                          ) : (
                            duration
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps Section */}
                  <div>
                    <h3 className="text-16 font-semibold mb-16" style={{ color: '#374151' }}>
                      Next Steps
                    </h3>

                    <p className="mb-12 text-14 leading-relaxed" style={{ color: '#374151' }}>
                      <strong>Deadline:</strong> Please submit your recommendation using the Partner Insights platform by <strong>{dueDate}</strong>
                    </p>

                    <div className="flex items-center gap-8">
                      <span style={{ color: '#303F9F' }}>🔗</span>
                      <a 
                        href="#"
                        className="font-medium underline"
                        style={{ color: '#303F9F' }}
              target="_blank"
              rel="noopener noreferrer"
            >
                        Submit Recommendation on Partner Insights
                      </a>
                    </div>
                  </div>

                  {/* Additional Information - Separate Box if Needed */}
                  {((showNotes && notes) || (showCategories && categories) || (showLocations && locations) || (showPriority && priority) || (showGoLive && goLiveDate)) && (
                    <div style={{ backgroundColor: '#FFFBEB' }} className="border border-amber-200 rounded-8 p-20">
                      <h3 className="text-16 font-semibold mb-16" style={{ color: '#374151' }}>
                        Additional Information
                      </h3>
                      <div className="space-y-12 text-14">
                        {(showCategories && categories) && (
                          <div>
                            <span className="font-medium block mb-4" style={{ color: '#374151' }}>Top Categories:</span>
                            <span className="text-14">{categories}</span>
                          </div>
                        )}
                        
                        {(showLocations && locations) && (
                          <div>
                            <span className="font-medium block mb-4" style={{ color: '#374151' }}>Top Locations:</span>
                            <span className="text-14">{locations}</span>
                          </div>
                        )}
                        
                        {(showPriority && priority) && (
                          <div>
                            <span className="font-medium block mb-4" style={{ color: '#374151' }}>Priority Level:</span>
                            <div className="flex items-center gap-8">
                              {(() => {
                                const selectedPriority = priorityOptions.find(opt => opt.value === priority);
                                return selectedPriority ? (
                                  <>
                                    <selectedPriority.icon size={16} className={selectedPriority.color} />
                                    <span className="text-14">{selectedPriority.label}</span>
                                  </>
                                ) : (
                                  <span className="text-14">{priority}</span>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                        
                        {(showGoLive && goLiveDate) && (
                          <div>
                            <span className="font-medium block mb-4" style={{ color: '#374151' }}>Go Live Date:</span>
                            <span className="text-14">{new Date(goLiveDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        )}
                        
                        {(showNotes && notes) && (
                          <div>
                            <span className="font-medium block mb-4" style={{ color: '#374151' }}>Additional Notes:</span>
                            <span className="text-14">{notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Email Signature */}
                  <div className="space-y-12 border-t border-gray-200 pt-20" style={{ color: '#374151' }}>
                    <p className="text-14">
                      We value your partnership and look forward to your suggestions.
                    </p>

                    <div className="space-y-4">
                      <p className="text-14">Thanks and best regards,</p>
                      <p className="font-medium text-14">{currentUser?.name}</p>
                      <p className="text-12 text-gray-500">Client Success Executive, Joveo</p>
                      <p className="text-12 text-gray-500">{currentUser?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Footer */}
              <div style={{ backgroundColor: '#303F9F' }} className="p-16 text-center">
                <p className="text-12 text-white">
                  © 2025{' '}
                  <a 
                    href="https://www.joveo.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:underline"
                  >
                    Joveo.com
                  </a>
                  {' | '}
                  <a 
                    href="https://www.joveo.com/terms-of-use/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:underline"
                  >
                    Terms of Service
                  </a>
                  {' | '}
                  <a 
                    href="https://www.joveo.com/privacy-policy/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-32 border-t mt-32">
          <div className="text-sm text-gray-600">
            Recipients: {template.recipients.length} publisher{template.recipients.length !== 1 ? 's' : ''}
      </div>
          <div className="flex gap-12">
      {onClose && (
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            )}
          <Button
               variant="primary"
            icon={<Send size={16} />}
               onClick={handleSend}
               disabled={isSending || !budget || !duration || !feedUrl}
            isLoading={isSending}
          >
               {isSending ? 'Sending...' : 'Send Email'}
          </Button>
          </div>
        </div>
      </div>

      {showToast && (
         <EnhancedToast
          message="Email sent successfully!"
          type="success"
           onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};