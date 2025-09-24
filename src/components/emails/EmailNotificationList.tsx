import React, { useState, useEffect } from 'react';
import { Mail, Search, SlidersHorizontal, Plus, Check, X, ChevronDown, Send, Eye, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { EntityTypeBadge } from '../common/EntityTypeBadge';
import { PublisherBadge } from '../common/PublisherBadge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmailView } from './EmailView';
import { Input } from '../common/Input';
import { Dropdown } from '../common/Dropdown';
import { SendAllWarningModal } from './SendAllWarningModal';
import { EmailNotification, FilterChip } from '../../types';

// Enhanced Toast Component (matching Recommendations design)
const EnhancedToast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none" style={{ left: '248px' }}>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className={`flex items-center gap-12 px-12 py-8 rounded-4 shadow-lg border ${
          type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="w-20 h-20 flex items-center justify-center">
            {type === 'success' ? (
              <Check size={12} className="text-green-600" />
            ) : (
              <AlertCircle size={12} className="text-red-600" />
            )}
          </div>
          <span className="text-12 font-normal">{message}</span>
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

export const EmailNotificationList: React.FC = () => {
  const { 
    emailNotifications, 
    isLoading, 
    sendEmail,
    selectedClientIds,
    getAvailableClients
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // New Filter System State with default "Ready" status filter
  const [appliedFilters, setAppliedFilters] = useState<FilterChip[]>(() => {
    return [{
      id: 'status-default',
      type: 'status',
      label: 'Status',
      values: ['Ready'],
      displayText: 'Status: Ready'
    }];
  });
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState<string | null>(null);
  const [editingFilterId, setEditingFilterId] = useState<string | null>(null);
  const [tempFilterSelections, setTempFilterSelections] = useState<{[key: string]: string[]}>({});
  const [searchFilters, setSearchFilters] = useState<{[key: string]: string}>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [dateCondition, setDateCondition] = useState<'after' | 'before' | 'on'>('after');

  // Modal and toast state
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  const [showEmailView, setShowEmailView] = useState(false);
  const [showAllEmailsView, setShowAllEmailsView] = useState(false);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [selectedEntityType, setSelectedEntityType] = useState<'Client' | 'Campaign' | 'JobGroup' | null>('Client');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());
  const [showSendAllWarning, setShowSendAllWarning] = useState(false);

  // Check for failed emails and show notification
  useEffect(() => {
    const failedEmails = emailNotifications.filter(email => email.status === 'Failed');
    const expiredEmails = emailNotifications.filter(email => 
      email.status === 'Ready' && isEmailExpired(email)
    );
    
    if (failedEmails.length > 0) {
      setToastMessage(`Failed to send ${failedEmails.length} email${failedEmails.length > 1 ? 's' : ''}. Use "Try Again" button to send it.`);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } else if (expiredEmails.length > 0) {
      setToastMessage(`${expiredEmails.length} email${expiredEmails.length > 1 ? 's' : ''} expired (older than 7 days).`);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  }, [emailNotifications]);

  // Reset currentEmailIndex when selectedEntityType changes
  useEffect(() => {
    setCurrentEmailIndex(0);
  }, [selectedEntityType]);

  // Filter options
  const publisherOptions = ['ZipRecruiter', 'Monster', 'Snagajob', 'Indeed', 'LinkedIn', 'Glassdoor', 'CareerBuilder', 'AngelList'];
  const statusOptions = ['Processing', 'Ready', 'Sent', 'Failed', 'Expired'];
  const entityTypeOptions = ['Client', 'Campaign', 'JobGroup'];
  const dateOptions = ['Today', 'Yesterday', 'This week', 'Last week', 'This month', 'Last month', 'Last 30 days'];

  // Filter helper functions
  const getAvailableFilterTypes = () => {
    const allTypes = [
      { id: 'publisher', label: 'Publisher' },
      { id: 'client', label: 'Client name' },
      { id: 'status', label: 'Status' },
      { id: 'entityType', label: 'Entity Type' },
      { id: 'date', label: 'Created Date' }
    ];
    
    const appliedTypes = appliedFilters.map(f => f.type);
    return allTypes.filter(type => !appliedTypes.includes(type.id));
  };

  const createChipDisplayText = (filterType: string, selections: string[]): string => {
    if (selections.length === 0) return '';
    
    const label = filterType === 'entityType' ? 'Entity Type' : 
                  filterType === 'client' ? 'Client name' :
                  filterType.charAt(0).toUpperCase() + filterType.slice(1);
    
    if (selections.length === 1) {
      return `${label}: ${selections[0]}`;
    }
    
    const maxLength = 30;
    const joined = selections.join(', ');
    
    if (joined.length <= maxLength) {
      return `${label}: ${joined}`;
    }
    
    let truncated = selections[0];
    let count = 1;
    
    while (count < selections.length && (truncated + ', ' + selections[count]).length <= maxLength - 4) {
      truncated += ', ' + selections[count];
      count++;
    }
    
    const remaining = selections.length - count;
    return `${label}: ${truncated}..+${remaining}`;
  };

  // Filter management functions
  const handleAddFilter = (filterType: string) => {
    setShowAddFilter(false);
    setShowFilterDropdown(filterType);
    setEditingFilterId(null);
    setTempFilterSelections({ ...tempFilterSelections, [filterType]: [] });
  };

  // Handle editing an existing filter
  const handleEditFilter = (filter: FilterChip) => {
    setShowFilterDropdown(filter.type);
    setEditingFilterId(filter.id);
    setTempFilterSelections({ ...tempFilterSelections, [filter.type]: filter.values });
    setShowAddFilter(false);
  };

  const handleFilterSelection = (filterType: string, value: string, isMultiSelect: boolean = true) => {
    const currentSelections = tempFilterSelections[filterType] || [];
    
    if (isMultiSelect) {
      const newSelections = currentSelections.includes(value)
        ? currentSelections.filter(v => v !== value)
        : [...currentSelections, value];
      
      setTempFilterSelections({
        ...tempFilterSelections,
        [filterType]: newSelections
      });
    } else {
      setTempFilterSelections({
        ...tempFilterSelections,
        [filterType]: [value]
      });
    }
  };

  const applyFilter = (filterType: string) => {
    const selections = tempFilterSelections[filterType] || [];
    
    if (filterType === 'date') {
      if (selectedDate) {
        const displayText = createChipDisplayText('date', [selectedDate]);
        const filterData = {
          type: filterType,
          label: 'Created Date',
          values: [selectedDate],
          displayText
        };

        if (editingFilterId) {
          // Update existing filter
          setAppliedFilters(appliedFilters.map(f => 
            f.id === editingFilterId ? { ...f, ...filterData } : f
          ));
        } else {
          // Add new filter
          const newFilter: FilterChip = {
            id: `${filterType}-${Date.now()}`,
            ...filterData
          };
          setAppliedFilters([...appliedFilters, newFilter]);
        }
      }
    } else if (selections.length > 0) {
      const displayText = createChipDisplayText(filterType, selections);
      const label = filterType === 'entityType' ? 'Entity Type' : 
                    filterType === 'client' ? 'Client name' :
                    filterType.charAt(0).toUpperCase() + filterType.slice(1);
      
      const filterData = {
        type: filterType,
        label,
        values: selections,
        displayText
      };

      if (editingFilterId) {
        // Update existing filter
        setAppliedFilters(appliedFilters.map(f => 
          f.id === editingFilterId ? { ...f, ...filterData } : f
        ));
      } else {
        // Add new filter
        const newFilter: FilterChip = {
          id: `${filterType}-${Date.now()}`,
          ...filterData
        };
        setAppliedFilters([...appliedFilters, newFilter]);
      }
    }
    
    setShowFilterDropdown(null);
    setEditingFilterId(null);
    setTempFilterSelections({ ...tempFilterSelections, [filterType]: [] });
    setSelectedDate('');
  };

  const removeFilter = (filterId: string) => {
    setAppliedFilters(appliedFilters.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
  };

  // Helper function to check if email is expired (> 7 days old)
  const isEmailExpired = (email: EmailNotification): boolean => {
    const createdDate = new Date(email.createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff > 7;
  };

  // Filtering logic
  const getFilteredNotifications = () => {
    // First, update status for expired emails
    let filtered = emailNotifications.map(email => {
      // Only mark as expired if currently Ready and > 7 days old
      if (email.status === 'Ready' && isEmailExpired(email)) {
        return { ...email, status: 'Expired' as const };
      }
      return email;
    });

    // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(email => {
        const matches = [
          email.entityName,
          email.clientName,
          email.publisherName,
          email.subject,
          email.entityType
        ].some(field => field?.toLowerCase().includes(searchLower));
        return matches;
      });
    }

    // Apply each filter
    appliedFilters.forEach(filter => {
      switch (filter.type) {
        case 'status':
          filtered = filtered.filter(email => 
            filter.values.includes(email.status)
          );
          break;
        case 'publisher':
          filtered = filtered.filter(email => 
            filter.values.includes(email.publisherName)
          );
          break;
        case 'client':
          // Get selected client names from global filter
          const selectedClientNames = selectedClientIds.map(clientId => {
            const client = getAvailableClients().find(c => c.id === clientId);
            return client?.name;
          }).filter(name => name);
          
          filtered = filtered.filter(email => 
            filter.values.some(clientName => 
              selectedClientNames.includes(clientName) && 
              (email.clientName === clientName || email.entityName.includes(clientName))
            )
          );
          break;
        case 'entityType':
          filtered = filtered.filter(email => 
            filter.values.includes(email.entityType)
          );
          break;
        case 'date':
          if (filter.values.length > 0) {
            const dateValue = filter.values[0];
            const now = new Date();
            let startDate: Date;
            let endDate: Date;
            
            switch (dateValue) {
              case 'Today':
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(now);
                endDate.setHours(23, 59, 59, 999);
                break;
                
              case 'Yesterday':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 1);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(now);
                endDate.setDate(now.getDate() - 1);
                endDate.setHours(23, 59, 59, 999);
                break;
                
              case 'This week':
                startDate = new Date(now);
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                startDate.setDate(diff);
                startDate.setHours(0, 0, 0, 0);
                
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
                
              case 'Last week':
                startDate = new Date(now);
                const lastWeekDay = now.getDay();
                const lastWeekDiff = now.getDate() - lastWeekDay + (lastWeekDay === 0 ? -6 : 1) - 7;
                startDate.setDate(lastWeekDiff);
                startDate.setHours(0, 0, 0, 0);
                
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
                
              case 'This month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
                
              case 'Last month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                endDate.setHours(23, 59, 59, 999);
                break;
                
              case 'Last 30 days':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 30);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(now);
                endDate.setHours(23, 59, 59, 999);
                break;
                
              default:
                return;
            }
            
            filtered = filtered.filter(email => {
              const emailDate = new Date(email.createdAt);
              return emailDate >= startDate && emailDate <= endDate;
            });
          }
          break;
      }
    });

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

  // Bulk actions logic
  const readyNotifications = filteredNotifications.filter(email => email.status === 'Ready');
  const entityTypeCounts = readyNotifications.reduce((acc, email) => {
    acc[email.entityType] = (acc[email.entityType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Filter ready notifications by selected entity type for banner
  const bannerReadyNotifications = selectedEntityType 
    ? readyNotifications.filter(email => email.entityType === selectedEntityType)
    : readyNotifications;
  
  const showBanner = bannerReadyNotifications.length > 0;

  const handleViewAll = () => {
    if (bannerReadyNotifications.length > 0) {
    setCurrentEmailIndex(0);
      setSelectedEmail(bannerReadyNotifications[0]);
    setShowAllEmailsView(true);
    }
  };

  const handleSendAllReady = () => {
    // Show warning modal instead of directly sending
    setShowSendAllWarning(true);
  };

  const handleConfirmSendAll = async () => {
    const notificationsToSend = bannerReadyNotifications;
    setShowSendAllWarning(false);

    try {
      for (const email of notificationsToSend) {
        await handleSendEmail(email);
      }
      setToastMessage(`Successfully sent ${notificationsToSend.length} email${notificationsToSend.length > 1 ? 's' : ''}.`);
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      setToastMessage('Failed to send some emails.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const handleNextEmail = () => {
    if (currentEmailIndex < bannerReadyNotifications.length - 1) {
      setCurrentEmailIndex(prev => prev + 1);
      setSelectedEmail(bannerReadyNotifications[currentEmailIndex + 1]);
    }
  };

  const handlePreviousEmail = () => {
    if (currentEmailIndex > 0) {
      setCurrentEmailIndex(prev => prev - 1);
      setSelectedEmail(bannerReadyNotifications[currentEmailIndex - 1]);
    }
  };

  // Handle email actions
  const handleSendEmail = async (email: EmailNotification) => {
    setSendingEmails(prev => new Set(prev).add(email.id));
    try {
      await sendEmail({
        entityId: email.entityId,
        recipients: email.recipients,
        subject: email.subject,
        body: 'Email notification body'
      });
      setToastMessage('Email sent successfully!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      setToastMessage('Failed to send email. Use "Try Again" button to send it.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(email.id);
        return newSet;
      });
    }
  };

  // Handle retry for failed emails
  const handleRetryEmail = async (email: EmailNotification) => {
    setSendingEmails(prev => new Set(prev).add(email.id));
    try {
      await sendEmail({
        entityId: email.entityId,
        recipients: email.recipients,
        subject: email.subject,
        body: 'Email notification body'
      });
      setToastMessage('Email sent successfully!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      setToastMessage('Failed to send email again. Please try again later.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(email.id);
        return newSet;
      });
    }
  };

  // Render filter dropdown
  const renderFilterDropdown = (filterType: string) => {
    // Special handling for date filter
    if (filterType === 'date') {
    return (
        <div className="w-full bg-white border border-gray-200 rounded-12 shadow-xl overflow-hidden">
          <div className="p-16">
            <h4 className="text-14 font-semibold text-gray-900 mb-12">Select Date Range</h4>
            
            <div className="space-y-8">
              {dateOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    id={`date-${option}`}
                    name="dateRange"
                    value={option}
                    checked={selectedDate === option}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDate(option);
                      }
                    }}
                    className="h-16 w-16 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`date-${option}`} className="ml-8 text-14 text-gray-700 cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-8 mt-16 pt-16 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowFilterDropdown(null);
                  setSelectedDate('');
                }}
                className="px-16 py-8 text-14 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => applyFilter('date')}
                disabled={selectedDate === ''}
                className="px-16 py-8 bg-primary-600 text-white text-14 rounded-6 hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
      </div>
    );
  }

    const selections = tempFilterSelections[filterType] || [];
    const searchTerm = searchFilters[filterType] || '';
    
    let options: string[] = [];
    let hasSearch = false;
    
    switch (filterType) {
      case 'publisher':
        options = publisherOptions.filter(p => 
          p.toLowerCase().includes(searchTerm.toLowerCase())
        );
        hasSearch = true;
        break;
      case 'client':
        // Only show clients that are globally selected
        const availableClientNames = selectedClientIds.map(clientId => {
          const client = getAvailableClients().find(c => c.id === clientId);
          return client?.name;
        }).filter((name): name is string => name !== undefined);
        
        options = availableClientNames.filter(name => 
          name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        hasSearch = true;
        break;
      case 'status':
        options = statusOptions;
        break;
      case 'entityType':
        options = entityTypeOptions;
        break;
    }

  return (
      <div className="w-full bg-white border border-gray-200 rounded-12 shadow-xl overflow-hidden" style={{
        maxHeight: '80vh'
      }}>
        {hasSearch && (
          <div className="px-16 py-12 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-8 px-12 py-8 bg-white border border-gray-200 rounded-8">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchFilters({ ...searchFilters, [filterType]: e.target.value })}
                className="flex-1 outline-none text-14"
              />
            </div>
          </div>
        )}

        <div className="max-h-240 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-12 px-16 py-12 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selections.includes(option)}
                  onChange={() => handleFilterSelection(filterType, option)}
                  className="w-16 h-16 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-14 text-gray-700">{option}</span>
              </label>
            ))
          ) : (
            <div className="px-16 py-24 text-14 text-gray-500 text-center">
              No options available
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-8 px-16 py-12 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => setShowFilterDropdown(null)}
            className="px-16 py-8 text-14 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => applyFilter(filterType)}
            disabled={selections.length === 0}
            className="px-16 py-8 text-14 bg-indigo-600 text-white rounded-8 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-24">
      {/* Header Section */}
      <div className="flex items-center gap-12 mb-20">
        <div className="flex items-center justify-center w-40 h-40 bg-indigo-100 rounded-8">
          <Mail size={20} className="text-indigo-600" />
            </div>
            <div>
          <h1 className="text-18 font-semibold text-gray-900">New Entity Notification</h1>
          <p className="text-14 text-gray-600 mt-2">
            Manage and track email notifications sent to publishers for newly setup entities in MOJO.
              </p>
            </div>
          </div>

      {/* Bulk Actions Banner */}
      {showBanner && (
        <div className="mb-16 p-16 bg-indigo-50 border border-indigo-200 rounded-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex items-center justify-center w-32 h-32 bg-indigo-100 rounded-6">
                <Mail size={16} className="text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-8 mb-1">
                  <span className="text-13 font-semibold text-gray-900">
                    {bannerReadyNotifications.length} email{bannerReadyNotifications.length > 1 ? 's are' : ' is'} ready to be sent
                  </span>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-11 text-gray-600">Filter by entity type:</span>
                  <Dropdown
                    options={[
                      { value: '', label: `All Types (${readyNotifications.length})` },
                      ...Object.entries(entityTypeCounts).map(([type, count]) => ({
                        value: type,
                        label: `${type} (${count})`
                      }))
                    ]}
                    value={selectedEntityType || ''}
                    onChange={(value) => setSelectedEntityType(value as 'Client' | 'Campaign' | 'JobGroup' || null)}
                    placeholder="Select entity type"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
            <Button
                variant="secondary"
              onClick={handleViewAll}
                disabled={bannerReadyNotifications.length === 0}
                className="px-12 py-6 text-12"
            >
                <Eye size={14} />
                Preview All
            </Button>
            <Button
              onClick={handleSendAllReady}
                disabled={sendingEmails.size > 0 || bannerReadyNotifications.length === 0}
                className="px-12 py-6 text-12"
            >
                {sendingEmails.size > 0 ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Send size={14} />
              Send All
                  </>
                )}
            </Button>
            </div>
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        {/* Search Bar */}
        <div className="px-20 pt-12">
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-32 pr-10 py-8 border border-gray-300 rounded-6 text-13 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-20 pb-16 pt-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-8">
              <SlidersHorizontal size={14} className="text-gray-600" />
              <span className="text-13 font-medium text-gray-700">Filters</span>
              {appliedFilters.length > 0 && (
                <span className="text-11 text-gray-500">({appliedFilters.length} active)</span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-12 text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="flex items-center gap-8 flex-wrap">
            {/* Applied Filter Chips */}
            {appliedFilters.map((filter) => (
              <div
                key={filter.id}
                className="relative inline-flex items-center gap-6 px-10 py-6 bg-white border border-gray-200 rounded-6 shadow-sm hover:shadow-md transition-shadow"
                title={filter.displayText}
              >
                <button
                  onClick={() => handleEditFilter(filter)}
                  className="text-12 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  {filter.displayText}
                </button>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="flex items-center justify-center w-14 h-14 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={10} className="text-gray-400" />
                </button>

                {/* Individual Filter Dropdown */}
                {showFilterDropdown && editingFilterId === filter.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setShowFilterDropdown(null);
                        setEditingFilterId(null);
                      }}
                    />
                    <div className="absolute top-full mt-8 left-0 z-50">
                      <div className="w-full max-w-sm">
                        {renderFilterDropdown(showFilterDropdown)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Add Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowAddFilter(!showAddFilter)}
                className="inline-flex items-center gap-6 px-10 py-6 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-6 transition-colors"
              >
                <Plus size={12} className="text-indigo-600" />
                <span className="text-12 font-medium text-indigo-700">Add Filter</span>
              </button>

              {showAddFilter && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAddFilter(false)}
                  />
                  <div className="absolute top-full mt-8 left-0 w-240 bg-white border border-gray-200 rounded-12 shadow-xl z-50 overflow-hidden">
                    <div className="py-8">
                      {getAvailableFilterTypes().map((filterType) => (
                        <button
                          key={filterType.id}
                          onClick={() => handleAddFilter(filterType.id)}
                          className="w-full px-16 py-12 text-left text-14 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          {filterType.label}
                        </button>
                      ))}
                      {getAvailableFilterTypes().length === 0 && (
                        <div className="px-16 py-12 text-14 text-gray-500 text-center">
                          All filters applied
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Filter Dropdowns - Popover Overlay (only for new filters) */}
          {showFilterDropdown && !editingFilterId && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowFilterDropdown(null)}
              />
              
              {/* Centered Overlay Dropdown */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-16">
                <div className="w-full max-w-sm">
                  {renderFilterDropdown(showFilterDropdown)}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications List */}
        <div className="border-t border-gray-200">
          {filteredNotifications.length === 0 ? (
                          <EmptyState />
        ) : (
          <>
              {paginatedNotifications.map((notification) => (
                <div key={notification.id} className="border-b border-gray-100 p-16 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-8 mb-6">
                        <EntityTypeBadge type={notification.entityType} />
                        <h3 className="text-14 font-semibold text-dark-grey">{notification.entityName}</h3>
                        <span className="text-12 text-gray-500">•</span>
                        <span className="text-12 text-gray-600">{notification.clientName}</span>
                      </div>
                      
                      <div className="flex items-center gap-12 mb-8">
                        <PublisherBadge name={notification.publisherName} type="Job" />
                        <StatusBadge status={notification.status} />
                        <span className="text-11 text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-12 text-gray-600">{notification.subject}</p>
                    </div>
                    
                    <div className="flex items-center gap-6 ml-12">
                      <Button 
                        variant="secondary"
                        onClick={() => {
                          setSelectedEmail(notification);
                          setShowEmailView(true);
                        }}
                        className="min-w-20 px-8 py-4 text-12"
                      >
                        <Eye size={14} />
                        Preview
                      </Button>
                      
                      {notification.status === 'Ready' && (
                        <Button
                          onClick={() => handleSendEmail(notification)}
                          disabled={sendingEmails.has(notification.id)}
                          className="min-w-20 px-8 py-4 text-12"
                        >
                          {sendingEmails.has(notification.id) ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <Send size={14} />
                              Send
                            </>
                          )}
                        </Button>
                      )}

                      {notification.status === 'Failed' && (
                        <Button
                          onClick={() => handleRetryEmail(notification)}
                          disabled={sendingEmails.has(notification.id)}
                          className="min-w-20 px-8 py-4 text-12"
                        >
                          {sendingEmails.has(notification.id) ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <Send size={14} />
                              Try Again
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between px-16 py-12 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-12">
                  <span className="text-12 text-gray-600">Items per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-4 text-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                <div className="flex items-center gap-12">
                  <span className="text-12 text-gray-600">
                    {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length}
                  </span>
                  
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-8 py-4 border border-gray-300 rounded-4 text-12 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (page > totalPages) return null;
                      
                      return (
                        <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                          className={`w-24 h-24 rounded-4 text-12 font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-indigo-600 text-white'
                              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-8 py-4 border border-gray-300 rounded-4 text-12 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
          </>
        )}
        </div>
      </Card>

      {/* Preview All Modal */}
      {showAllEmailsView && selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-8 shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between p-16 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-12">
                <button
                  onClick={handlePreviousEmail}
                  disabled={currentEmailIndex === 0}
                  className="px-8 py-4 text-12 border border-gray-300 rounded-4 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-12 text-gray-600">
                  {currentEmailIndex + 1} of {bannerReadyNotifications.length}
                </span>
                <button
                  onClick={handleNextEmail}
                  disabled={currentEmailIndex === bannerReadyNotifications.length - 1}
                  className="px-8 py-4 text-12 border border-gray-300 rounded-4 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowAllEmailsView(false)}
                className="px-8 py-4 text-12"
              >
                Close
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-64px)]">
              <EmailView
                template={{
                  ...selectedEmail.template,
                  recipients: selectedEmail.recipients,
                  entityType: selectedEmail.entityType,
                  entityName: selectedEmail.entityName
                }}
                onClose={() => setShowAllEmailsView(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Single Email View Modal */}
      {showEmailView && selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-8 shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              <EmailView
                template={{
                  ...selectedEmail.template,
                  recipients: selectedEmail.recipients,
                  entityType: selectedEmail.entityType,
                  entityName: selectedEmail.entityName
                }}
                onClose={() => {
                  setShowEmailView(false);
                  setSelectedEmail(null);
                }}
              />
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <EnhancedToast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Send All Warning Modal */}
      <SendAllWarningModal
        isOpen={showSendAllWarning}
        onClose={() => setShowSendAllWarning(false)}
        onPreviewAll={handleViewAll}
        onConfirmSendAll={handleConfirmSendAll}
        publisherCount={bannerReadyNotifications.length}
      />
    </div>
  );
};