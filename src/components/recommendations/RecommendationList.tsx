import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Dropdown } from '../common/Dropdown';
import { StatusBadge } from '../common/StatusBadge';
import { PublisherBadge } from '../common/PublisherBadge';
import { EntityTypeBadge } from '../common/EntityTypeBadge';
import { Search, TrendingUp, DollarSign, Target, Zap, Check, X, AlertCircle, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronRight, Plus, Filter, SlidersHorizontal, Users, BarChart3, Briefcase, AlertTriangle, MoreHorizontal, ChevronUp, ChevronDown as ChevronDownIcon, Minus, MessageSquare } from 'lucide-react';
import { RecommendationStatus } from '../../types';
import { PartialAcceptModal } from './PartialAcceptModal';
import { RequestRecommendationForm } from './RequestRecommendationForm';
import { useApp } from '../../context/AppContext';
import { Tooltip } from '../common/Tooltip';

interface FilterChip {
  id: string;
  type: 'publisher' | 'client' | 'status' | 'requestType' | 'recommendationLevel' | 'date';
  label: string;
  values: string[];
  displayText: string;
}

export const RecommendationList: React.FC = () => {
  const { 
    recommendations, 
    publishers, 
    isLoading, 
    updateRecommendationStatus,
    selectedClientIds,
    setSelectedClients,
    getSelectedClients,
    getAvailableClients
  } = useApp();

  const [activeTab, setActiveTab] = useState<'logs' | 'request'>('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPartialAcceptModal, setShowPartialAcceptModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [actionDropdown, setActionDropdown] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // New Filter System State with default "This week" date filter
  const [appliedFilters, setAppliedFilters] = useState<FilterChip[]>(() => {
    // Initialize with default "This week" date filter
    return [{
      id: 'date-default',
      type: 'date',
      label: 'Requested Date',
      values: ['This week'],
      displayText: 'Requested Date: This week'
    }];
  });
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState<string | null>(null);
  const [editingFilterId, setEditingFilterId] = useState<string | null>(null);
  const [tempFilterSelections, setTempFilterSelections] = useState<{[key: string]: string[]}>({});
  const [searchFilters, setSearchFilters] = useState<{[key: string]: string}>({});

  // Filter Options
  const publisherOptions = ['ZipRecruiter', 'Monster', 'Snagajob', 'Indeed', 'LinkedIn', 'Glassdoor', 'CareerBuilder', 'AngelList'];
  const statusOptions = ['Pending', 'Accepted', 'Partially accepted', 'Rejected', 'Sent', 'Expired'];
  const requestTypeOptions = ['CSE Requested', 'Publisher Requested'];
  const recommendationLevelOptions = ['Client', 'Campaign', 'Job Group'];
  const dateOptions = ['Today', 'Yesterday', 'This week', 'Last week', 'This month', 'Last month', 'Last 30 days'];
  
     // Get available filter types (exclude already applied ones)
   const getAvailableFilterTypes = () => {
     const appliedTypes = appliedFilters.map(f => f.type);
     const allTypes = [
       { id: 'publisher', label: 'Publisher' },
       { id: 'client', label: 'Client name' },
       { id: 'status', label: 'Status' },
       { id: 'requestType', label: 'Request Type' },
       { id: 'recommendationLevel', label: 'Recommendation Level' },
       { id: 'date', label: 'Requested Date' }
     ];
     return allTypes.filter(type => !appliedTypes.includes(type.id as any));
   };

  // Truncate text for chips
  const truncateChipText = (text: string, limit: number = 30): string => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  // Create display text for filter chips
  const createChipDisplayText = (type: string, values: string[]): string => {
    if (values.length === 0) return '';
    
    const prefix = type.charAt(0).toUpperCase() + type.slice(1) + ': ';
    const joinedValues = values.join(', ');
    const fullText = prefix + joinedValues;
    
    if (fullText.length <= 30) {
      return fullText;
    }
    
    // Calculate how many items we can fit
    let displayText = prefix;
    let remainingLength = 30 - prefix.length - 3; // -3 for "..."
    let includedCount = 0;
    
    for (let i = 0; i < values.length; i++) {
      const addition = (i > 0 ? ', ' : '') + values[i];
      if (displayText.length + addition.length <= remainingLength) {
        displayText += addition;
        includedCount++;
      } else {
        break;
      }
    }
    
    if (includedCount < values.length) {
      const remaining = values.length - includedCount;
      displayText += `..+${remaining}`;
    }
    
    return displayText;
  };

  // Handle adding a new filter
  const handleAddFilter = (filterType: string) => {
    setShowFilterDropdown(filterType);
    setEditingFilterId(null);
    setTempFilterSelections({ ...tempFilterSelections, [filterType]: [] });
    setShowAddFilter(false);
  };

  // Handle editing an existing filter
  const handleEditFilter = (filter: FilterChip) => {
    setShowFilterDropdown(filter.type);
    setEditingFilterId(filter.id);
    setTempFilterSelections({ ...tempFilterSelections, [filter.type]: filter.values });
    setShowAddFilter(false);
  };

  // Handle filter selection
  const handleFilterSelection = (filterType: string, value: string) => {
    const current = tempFilterSelections[filterType] || [];
    
    if (filterType === 'requestType') {
      // Single select for request type
      setTempFilterSelections({
        ...tempFilterSelections,
        [filterType]: [value]
      });
    } else {
      // Multi-select for others
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      setTempFilterSelections({
        ...tempFilterSelections,
        [filterType]: updated
      });
    }
  };

     // Apply filter (handles both new and edited filters)
   const applyFilter = (filterType: string) => {
     if (filterType === 'date') {
       // For date filter, create chip with date range
       if (!tempFilterSelections[filterType] || tempFilterSelections[filterType].length === 0) {
         setShowFilterDropdown(null);
         setEditingFilterId(null);
         return;
       }
       
       const dateValue = tempFilterSelections[filterType]![0];
       
       const filterData = {
         type: 'date' as const,
         label: 'Requested Date',
         values: [dateValue],
         displayText: `Requested Date: ${dateValue}`
       };

       if (editingFilterId) {
         // Update existing filter
         setAppliedFilters(appliedFilters.map(f => 
           f.id === editingFilterId ? { ...f, ...filterData } : f
         ));
       } else {
         // Add new filter
         const newFilter: FilterChip = {
           id: `date-${Date.now()}`,
           ...filterData
         };
         setAppliedFilters([...appliedFilters, newFilter]);
       }

       setShowFilterDropdown(null);
       setEditingFilterId(null);
       setTempFilterSelections({}); // Clear temp selections after applying
       return;
     }

     const selections = tempFilterSelections[filterType] || [];
     if (selections.length === 0) {
       setShowFilterDropdown(null);
       setEditingFilterId(null);
       return;
     }

     const displayText = createChipDisplayText(filterType, selections);
     const label = filterType === 'requestType' ? 'Request Type' : 
                  filterType === 'recommendationLevel' ? 'Recommendation Level' :
                  filterType === 'client' ? 'Client name' :
                  filterType.charAt(0).toUpperCase() + filterType.slice(1);
     
     const filterData = {
       type: filterType as any,
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

     setShowFilterDropdown(null);
     setEditingFilterId(null);
     setTempFilterSelections({});
   };

  // Remove filter chip
  const removeFilter = (filterId: string) => {
    setAppliedFilters(appliedFilters.filter(f => f.id !== filterId));
  };

    // Filter recommendations based on applied filters
  const getFilteredRecommendations = () => {
    let filtered = recommendations;

    appliedFilters.forEach(filter => {
      switch (filter.type) {
        case 'publisher':
          filtered = filtered.filter(rec => filter.values.includes(rec.publisherName));
          break;
        case 'client':
          filtered = filtered.filter(rec => {
            const client = getAvailableClients().find(c => filter.values.includes(c.name));
            return client && rec.entityName.includes(client.name);
          });
          break;
        case 'status':
          filtered = filtered.filter(rec => filter.values.includes(rec.status));
          break;
        case 'requestType':
          const requestTypeMap = {
            'CSE Requested': 'CSE_REQUEST',
            'Publisher Requested': 'PROACTIVE_PUBLISHER'
          };
          filtered = filtered.filter(rec => 
            filter.values.some(v => rec.requestType === requestTypeMap[v as keyof typeof requestTypeMap])
          );
          break;
        case 'recommendationLevel':
          filtered = filtered.filter(rec => {
            // Map the recommendation level to the actual data structure
            const levelMap = {
              'Client': 'Client',
              'Campaign': 'Campaign', 
              'Job Group': 'JobGroup' // Note: data uses 'JobGroup' but UI shows 'Job Group'
            };
            return filter.values.some(v => rec.level === levelMap[v as keyof typeof levelMap]);
          });
          break;
        case 'date':
          // Date filtering logic - filter.values[0] contains the selected date
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
                // Get start of this week (Monday)
                startDate = new Date(now);
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                startDate.setDate(diff);
                startDate.setHours(0, 0, 0, 0);
                
                // Get end of this week (Sunday)
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
                
              case 'Last week':
                // Get start of last week (Monday)
                startDate = new Date(now);
                const lastWeekDay = now.getDay();
                const lastWeekDiff = now.getDate() - lastWeekDay + (lastWeekDay === 0 ? -6 : 1) - 7;
                startDate.setDate(lastWeekDiff);
                startDate.setHours(0, 0, 0, 0);
                
                // Get end of last week (Sunday)
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
                // If no match, skip filtering
                return;
            }
            
            filtered = filtered.filter(rec => {
              const requestedDate = new Date(rec.requestedAt);
              return requestedDate >= startDate && requestedDate <= endDate;
            });
          }
          break;
      }
    });

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(rec =>
        rec.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.publisherName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredRecommendations = getFilteredRecommendations();

  // Pagination logic
  const totalPages = Math.ceil(filteredRecommendations.length / itemsPerPage);
  const paginatedRecommendations = filteredRecommendations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRowExpansion = (recommendationId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(recommendationId)) {
      newExpandedRows.delete(recommendationId);
    } else {
      newExpandedRows.add(recommendationId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Calculate percentage change between current and recommended values
  const calculatePercentageChange = (current: number, recommended: number): { direction: 'increase' | 'decrease' | 'neutral', percentage: string } => {
    const change = ((recommended - current) / current) * 100;
    const isPositive = change > 0;
    const absChange = Math.abs(change);
    
    return {
      direction: isPositive ? 'increase' : 'decrease',
      percentage: absChange.toFixed(0)
    };
  };

  // Check if recommendation is expiring soon (less than 2 days)
  const checkExpiringSoon = (expiresAt?: string): boolean => {
    if (!expiresAt) return false;
    const recommendationExpiresAt = new Date(expiresAt);
    const now = new Date();
    const diffTime = recommendationExpiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 2 && diffDays > 0;
  };

  // Check if recommendation has expired (> 7 days since requested)
  const checkExpired = (requestedAt: string): boolean => {
    const requestedDate = new Date(requestedAt);
    const now = new Date();
    const diffTime = now.getTime() - requestedDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 7;
  };

  // Determine if change is good or bad for cost metrics
  const isChangeGood = (metricType: string, changeDirection: 'increase' | 'decrease' | 'neutral'): boolean => {
    // For cost metrics (CPC Bid, CPA Goal, Budget), decreases are good (green)
    // For revenue/efficiency metrics, increases would be good
    const isCostMetric = ['CPC Bid', 'CPA Goal', 'Budget'].includes(metricType);
    
    if (isCostMetric) {
      return changeDirection === 'decrease'; // Lower cost is better
    } else {
      return changeDirection === 'increase'; // Higher value is better (for efficiency metrics)
    }
  };

  const handlePartialAccept = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setShowPartialAcceptModal(true);
  };

  const handleAcceptAll = (recommendationId: string) => {
    updateRecommendationStatus(recommendationId, 'Accepted');
  };

  const handleReject = (recommendationId: string) => {
    updateRecommendationStatus(recommendationId, 'Rejected');
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `$${value.toFixed(2)}`;
  };

  const renderFilterDropdown = (filterType: string) => {
    // Special handling for date filter
    if (filterType === 'date') {
      const selections = tempFilterSelections[filterType] || [];
      
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
                    checked={selections.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTempFilterSelections({
                          ...tempFilterSelections,
                          [filterType]: [option]
                        });
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
                  setTempFilterSelections({
                    ...tempFilterSelections,
                    [filterType]: []
                  });
                }}
                className="px-16 py-8 text-14 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => applyFilter('date')}
                disabled={selections.length === 0}
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
         options = getSelectedClients().map(c => c.name).filter(name =>
           name.toLowerCase().includes(searchTerm.toLowerCase())
         );
         hasSearch = true;
         break;
       case 'status':
         options = statusOptions;
         hasSearch = false;
         break;
       case 'requestType':
         options = requestTypeOptions;
         hasSearch = false;
         break;
       case 'recommendationLevel':
         options = recommendationLevelOptions;
         hasSearch = false;
         break;
     }

     return (
       <div className="w-full bg-white border border-gray-200 rounded-12 shadow-xl overflow-hidden" style={{
         maxHeight: '80vh'
       }}>
         {hasSearch && (
           <div className="px-16 py-12 border-b border-gray-100 bg-gray-50">
             <div className="flex items-center gap-8 px-12 py-8 bg-white border border-gray-200 rounded-8">
               <Search size={16} className="text-gray-400 flex-shrink-0" />
               <input
                 type="text"
                 placeholder={`Search ${filterType}...`}
                 value={searchTerm}
                 onChange={(e) => setSearchFilters({
                   ...searchFilters,
                   [filterType]: e.target.value
                 })}
                 className="flex-1 bg-transparent text-14 text-gray-900 placeholder-gray-500 border-none outline-none"
               />
             </div>
           </div>
         )}
         
         <div className="max-h-280 overflow-y-auto">
           <div className="py-8">
             {options.length === 0 ? (
               <div className="px-20 py-16 text-center">
                 <div className="text-14 font-medium text-gray-900 mb-4">No results found</div>
                 <div className="text-12 text-gray-500">Try a different search term</div>
               </div>
             ) : (
               options.map(option => (
                 <div
                   key={option}
                   className="flex items-center justify-between px-16 py-10 hover:bg-gray-50 transition-colors cursor-pointer group"
                   onClick={() => handleFilterSelection(filterType, option)}
                 >
                   <span className="text-14 font-medium text-gray-900 group-hover:text-gray-700">{option}</span>
                   <label className="flex items-center cursor-pointer">
                     <input
                       type={filterType === 'requestType' ? 'radio' : 'checkbox'}
                       checked={selections.includes(option)}
                       onChange={() => {}} // Handled by parent click
                       className="h-16 w-16 rounded-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                     />
                   </label>
                 </div>
               ))
             )}
           </div>
         </div>

         <div className="flex justify-end gap-12 p-16 border-t border-gray-100 bg-gray-50">
           <button
             type="button"
             onClick={() => setShowFilterDropdown(null)}
             className="px-16 py-8 text-14 font-medium text-gray-700 bg-white border border-gray-300 rounded-8 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
           >
             Cancel
           </button>
           <button
             type="button"
             onClick={() => applyFilter(filterType)}
             className="px-16 py-8 text-14 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-8 transition-all duration-200 shadow-sm"
           >
             Apply
           </button>
         </div>
       </div>
     );
   };

  return (
    <>
      {/* Recommendations Content Header */}
      <div className="p-24">
                  <div className="flex items-center gap-12 mb-20">
            <div className="w-40 h-40 bg-indigo-100 rounded-8 flex items-center justify-center">
            <TrendingUp className="w-20 h-20 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-18 font-semibold text-gray-900 mb-2">Recommendations</h1>
            <p className="text-14 text-gray-600">Request optimization recommendations from publishers or review received suggestions for your campaigns.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-16">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-12 py-8 text-13 font-medium border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Recommendation Logs
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`px-12 py-8 text-13 font-medium border-b-2 transition-colors ${
              activeTab === 'request'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Request Recommendations
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'logs' ? (
        <div className="px-24 pb-24">
          <Card className="mb-24">
            {/* Header with title */}
            <div className="border-b border-gray-200 px-24 py-16">
              <h2 className="text-16 font-medium text-gray-900 mb-4">Recommendation Logs</h2>
              <p className="text-14 text-gray-600">Track all recommendation-related emails, including pending, sent, and expired communications.</p>
            </div>

            {/* Compact Search Bar */}
            <div className="mb-12 px-20 pt-12">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-10 top-1/2 transform -translate-y-1/2 h-14 w-14 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search recommendations..."
                  className="w-full pl-32 pr-10 py-8 border border-gray-300 rounded-6 text-13 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>
          
                         {/* Enhanced Filter System */}
             <div className="px-20 mb-16 pt-8">
               {/* Filter Header with Icon and Clear All */}
               <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-6">
                   <SlidersHorizontal size={14} className="text-gray-500" />
                   <span className="text-13 font-medium text-gray-900">Filters</span>
                   {appliedFilters.length > 0 && (
                     <span className="inline-flex items-center px-6 py-2 bg-gray-100 text-gray-600 text-11 font-medium rounded-full">
                       {appliedFilters.length} active
                     </span>
                   )}
        </div>

                 {/* Clear All Button - Always visible */}
                 <button
                   onClick={() => setAppliedFilters([])}
                   className="text-14 font-medium text-red-600 hover:text-red-700 transition-colors"
                 >
                   Clear All
                 </button>
                        </div>
                        
               {/* Filter Controls */}
               <div className="flex flex-wrap items-center gap-12">
                 {/* Applied Filter Chips */}
                 {appliedFilters.map((filter) => (
                   <Tooltip key={filter.id} content={`${filter.label}: ${filter.values.join(', ')}`}>
                     <div className="relative inline-flex items-center gap-8 px-16 py-8 bg-white border border-gray-200 rounded-8 text-14 shadow-sm hover:shadow-md transition-all duration-200">
                       <button
                         onClick={() => handleEditFilter(filter)}
                         className="text-gray-900 font-medium hover:text-indigo-600 transition-colors"
                       >
                         {filter.displayText}
                       </button>
                       <button
                         onClick={() => removeFilter(filter.id)}
                         className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
                       >
                         <X size={12} />
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
                   </Tooltip>
                 ))}

                 {/* Add Filter Button */}
                 <div className="relative">
                   <button
                     onClick={() => setShowAddFilter(!showAddFilter)}
                     className="inline-flex items-center gap-8 px-16 py-8 text-14 font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300 rounded-8 transition-all duration-200"
                   >
                     <Plus size={16} />
                     Add Filter
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
                          </div>
                          
                        {/* Modern Expandable Recommendations List */}
            <div className="px-24 pb-24">
              {isLoading ? (
                <div className="text-center py-40">
                  <div className="text-16 text-gray-500">Loading recommendations...</div>
                </div>
              ) : paginatedRecommendations.length === 0 ? (
                <div className="text-center py-40">
                  <div className="text-16 text-gray-500 mb-8">No recommendations found</div>
                  <div className="text-14 text-gray-400">Try adjusting your filters or search terms</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {paginatedRecommendations.map((rec) => {
                    const isExpanded = expandedRows.has(rec.id);
                    const isExpiringSoon = checkExpiringSoon(rec.expiresAt);
                    
                    return (
                      <div key={rec.id} className="border-b border-gray-100 last:border-b-0">
                        {/* Main Row - Click to Expand */}
                        <div 
                          className="p-16 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => toggleRowExpansion(rec.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {/* Title Row */}
                              <div className="flex items-center gap-8 mb-6">
                                <div className="flex-shrink-0">
                                  {isExpanded ? (
                                    <ChevronDown size={16} className="text-gray-400" />
                                  ) : (
                                    <ChevronRight size={16} className="text-gray-400" />
                                  )}
                                </div>
                                <EntityTypeBadge type={rec.entityType} />
                                <h3 className="text-14 font-semibold text-dark-grey">
                                  {rec.entityName}
                                </h3>
                              </div>
                              
                              {/* Badge Row */}
                              <div className="flex items-center gap-12 mb-8">
                                <PublisherBadge name={rec.publisherName} type="Job" />
                                <StatusBadge 
                                  status={checkExpired(rec.requestedAt) ? 'Expired' : rec.status} 
                                  type="recommendation" 
                                />
                                {isExpiringSoon && !checkExpired(rec.requestedAt) && (
                                  <span className="joveo-badge bg-orange-50 text-orange-600 border border-orange-200">
                                    <AlertTriangle size={10} />
                                    Expiring Soon
                                  </span>
                                )}
                                <span className="text-11 text-gray-500">
                                  {new Date(rec.requestedAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {/* Metrics Summary */}
                              <div className="text-12 text-gray-600">
                                {rec.metrics.filter(m => m.recommendedValue !== undefined).length} metrics • 
                                {rec.metrics.filter(m => m.isRequested).length} requested
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-6 ml-12">
                              {rec.status === 'Pending' && !checkExpired(rec.requestedAt) && (
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    variant="primary"
                                    onClick={() => setActionDropdown(actionDropdown === rec.id ? null : rec.id)}
                                    icon={<MoreHorizontal size={14} />}
                                  >
                                    Actions
                                  </Button>
                                  
                                  {actionDropdown === rec.id && (
                                    <div className="absolute right-0 top-full mt-4 w-44 bg-white border border-gray-200 rounded-6 shadow-lg z-10">
                                      <div className="py-4">
                                        <button
                                          onClick={() => {
                                            handleAcceptAll(rec.id);
                                            setActionDropdown(null);
                                          }}
                                          className="flex items-center gap-8 w-full px-12 py-6 text-12 font-medium text-green-700 hover:bg-green-50 transition-colors"
                                        >
                                          <Check size={12} />
                                          Accept All
                                        </button>
                                        {rec.metrics.length > 1 && (
                                          <button
                                            onClick={() => {
                                              handlePartialAccept(rec);
                                              setActionDropdown(null);
                                            }}
                                            className="flex items-center gap-8 w-full px-12 py-6 text-12 font-medium text-orange-700 hover:bg-orange-50 transition-colors"
                                          >
                                            <Minus size={12} />
                                            Partial Accept
                                          </button>
                                        )}
                                        <button
                                          onClick={() => {
                                            handleReject(rec.id);
                                            setActionDropdown(null);
                                          }}
                                          className="flex items-center gap-8 w-full px-12 py-6 text-12 font-medium text-red-700 hover:bg-red-50 transition-colors"
                                        >
                                          <X size={12} />
                                          Reject
                                        </button>
                          </div>
                        </div>
                                  )}
                          </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded Metrics Table */}
                        {isExpanded && (
                          <div className="bg-primary-lighter border-t border-gray-200">
                            <div className="px-16 py-12">
                              <div className="overflow-hidden">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="text-left py-8 px-12 text-11 font-semibold text-gray-600 uppercase tracking-wide">
                                        Metric
                                      </th>
                                      <th className="text-right py-8 px-12 text-11 font-semibold text-gray-600 uppercase tracking-wide">
                                        CSE Value
                                      </th>
                                      {rec.status !== 'Sent' && (
                                        <>
                                          <th className="text-right py-8 px-12 text-11 font-semibold text-gray-600 uppercase tracking-wide">
                                            PUB Value
                                          </th>
                                          <th className="text-right py-8 px-12 text-11 font-semibold text-gray-600 uppercase tracking-wide">
                                            Change
                                          </th>
                                        </>
                                      )}
                                      {rec.status === 'Sent' && (
                                        <th className="text-center py-8 px-12 text-11 font-semibold text-gray-600 uppercase tracking-wide">
                                          Status
                                        </th>
                                      )}
                                      {rec.status === 'Partially accepted' && (
                                        <th className="text-center py-8 px-12 text-11 font-semibold text-gray-600 uppercase tracking-wide">
                                          Status
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rec.metrics.filter(metric => 
                                      rec.status === 'Sent' ? true : metric.recommendedValue !== undefined
                                    ).map((metric, index) => {
                                      const change = rec.status !== 'Sent' ? calculatePercentageChange(
                                        metric.currentValue, 
                                        metric.recommendedValue || metric.currentValue
                                      ) : null;
                                      const isGoodChange = change ? isChangeGood(metric.type, change.direction) : false;
                                      
                                      return (
                                        <React.Fragment key={index}>
                                          <tr className="border-b border-gray-100 last:border-b-0 hover:bg-white transition-colors">
                                            <td className="py-8 px-12">
                                              <div className="flex items-center gap-6">
                                                <span className="text-12 font-medium text-dark-grey">
                                                  {metric.type}
                                                </span>
                                                {metric.isRequested && (
                                                  <span className="joveo-badge-sm bg-blue-50 text-blue-600 border border-blue-200">
                                                    Requested
                            </span>
                                                )}
                                              </div>
                                            </td>
                                            <td className="py-8 px-12 text-right text-12 font-medium text-dark-grey">
                                              {formatCurrency(metric.currentValue)}
                                            </td>
                                            {rec.status !== 'Sent' && (
                                              <>
                                                <td className="py-8 px-12 text-right text-12 font-semibold text-blue-600">
                                                  {formatCurrency(metric.recommendedValue)}
                                                </td>
                                                <td className="py-8 px-12 text-right">
                                                  {change && (
                                                    <div className={`flex items-center justify-end gap-4 text-12 font-medium ${
                                                      isGoodChange ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                      {change.direction === 'increase' ? (
                                                        <ChevronUp size={12} />
                                                      ) : (
                                                        <ChevronDown size={12} />
                                                      )}
                                                      {change.direction === 'increase' ? '+' : ''}{change.percentage}%
                                                    </div>
                                                  )}
                                                </td>
                                              </>
                                            )}
                                            {rec.status === 'Sent' && (
                                              <td className="py-8 px-12 text-center">
                                                <span className="joveo-badge-sm bg-blue-50 text-blue-600 border border-blue-200">
                                                  Waiting for Publisher
                                                </span>
                                              </td>
                                            )}
                                            {rec.status === 'Partially accepted' && (
                                              <td className="py-8 px-12 text-center">
                                                {metric.acceptanceStatus === 'accepted' ? (
                                                  <span className="joveo-badge-sm bg-green-50 text-green-600 border border-green-200">
                                                    <Check size={10} className="mr-2" />
                                                    Accepted
                                                  </span>
                                                ) : metric.acceptanceStatus === 'rejected' ? (
                                                  <span className="joveo-badge-sm bg-red-50 text-red-600 border border-red-200">
                                                    <X size={10} className="mr-2" />
                                                    Rejected
                                                  </span>
                                                ) : (
                                                  <span className="joveo-badge-sm bg-gray-50 text-gray-600 border border-gray-200">
                                                    Pending
                                                  </span>
                                                )}
                                              </td>
                                            )}
                                          </tr>
                                        </React.Fragment>
                                      );
                                    })}
                                  </tbody>
                                </table>
                                
                                {/* Publisher Notes Section - Overall */}
                                {rec.notes && rec.notes.trim() && (
                                  <div className="mt-12 pt-8 border-t border-gray-200">
                                    <div className="flex items-start gap-8">
                                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-1">
                                        <MessageSquare size={10} className="text-primary-main" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="text-11 font-semibold text-dark-grey mb-4">Publisher Note:</div>
                                        <div className="text-12 text-gray-700 leading-relaxed">{rec.notes}</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
              )}

              {/* Modern Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-24 px-20 py-16 bg-white border border-gray-200 rounded-8">
                  {/* Items per page selector */}
                  <div className="flex items-center gap-12">
                    <span className="text-14 text-gray-600">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-12 py-6 border border-gray-300 rounded-6 text-14 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <span className="text-14 text-gray-600">
                    Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                      <strong>{Math.min(currentPage * itemsPerPage, filteredRecommendations.length)}</strong> of{' '}
                      <strong>{filteredRecommendations.length}</strong> results
                  </span>
                </div>

                  {/* Pagination controls */}
                  <div className="flex items-center gap-8">
                    <button
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="px-12 py-6 text-14 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      ‹
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-12 py-6 text-14 rounded-6 transition-colors ${
                            pageNum === currentPage
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                      className="px-12 py-6 text-14 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
              </div>
      ) : (
        <RequestRecommendationForm />
        )}

             {/* Modals */}
       {showPartialAcceptModal && selectedRecommendation && (
        <PartialAcceptModal
           onClose={() => setShowPartialAcceptModal(false)}
           onAccept={(selectedMetrics, rejectionReasons) => {
             updateRecommendationStatus(selectedRecommendation.id, 'Partially accepted');
             setShowPartialAcceptModal(false);
           }}
          metrics={{
            cpc: {
              currentValue: 2.50,
              recommendedValue: 3.25
            },
            cpa: {
              currentValue: 45.00,
              recommendedValue: 38.50
            },
            budget: {
              currentValue: 15000,
              recommendedValue: 18000
            }
          }}
        />
      )}
    </>
  );
};