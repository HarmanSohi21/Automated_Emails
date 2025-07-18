import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { EntityTypeBadge } from '../common/EntityTypeBadge';
import { PublisherBadge } from '../common/PublisherBadge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { Dropdown } from '../common/Dropdown';
import { Search, TrendingUp, DollarSign, Target, Zap, Check, X, AlertCircle, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { RecommendationStatus } from '../../types';
import { PartialAcceptModal } from './PartialAcceptModal';
import { Toast } from '../common/Toast';

export const RecommendationList: React.FC = () => {
  const { recommendations, publishers, isLoading, updateRecommendationStatus } = useApp();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [publisherFilter, setPublisherFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value >= 100 ? 0 : 2,
      maximumFractionDigits: value >= 100 ? 0 : 2,
    }).format(value);
  };

  const calculatePercentageChange = (current: number, recommended: number) => {
    const change = ((recommended - current) / current) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isIncrease: change > 0,
      isDecrease: change < 0
    };
  };

  const handleAccept = async (recommendationId: string) => {
    try {
      await updateRecommendationStatus(recommendationId, 'Accepted');
      setToastMessage('Selected metrics have been updated in MOJO');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error accepting recommendation:', error);
    }
  };

  const handleReject = async (recommendationId: string) => {
    try {
      await updateRecommendationStatus(recommendationId, 'Rejected');
      setToastMessage('Recommendation has been rejected');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
    }
  };

  const handlePartialAccept = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setShowPartialModal(true);
  };

  const handlePartialAcceptSubmit = async (selectedMetrics: string[]) => {
    try {
      await updateRecommendationStatus(selectedRecommendation.id, 'Accepted');
      setToastMessage(`Selected metrics (${selectedMetrics.join(', ')}) have been updated in MOJO`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error partially accepting recommendation:', error);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (statusFilter !== 'all' && rec.status !== statusFilter) {
      return false;
    }
    
    if (publisherFilter !== 'all' && rec.publisherId !== publisherFilter) {
      return false;
    }
    
    // Date filtering
    if (dateFilter !== 'all') {
      const requestedDate = new Date(rec.requestedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const last7Days = new Date(today);
      last7Days.setDate(last7Days.getDate() - 7);
      
      const last30Days = new Date(today);
      last30Days.setDate(last30Days.getDate() - 30);
      
      switch (dateFilter) {
        case 'today':
          if (requestedDate.toDateString() !== today.toDateString()) {
            return false;
          }
          break;
        case 'yesterday':
          if (requestedDate.toDateString() !== yesterday.toDateString()) {
            return false;
          }
          break;
        case 'last7days':
          if (requestedDate < last7Days) {
            return false;
          }
          break;
        case 'last30days':
          if (requestedDate < last30Days) {
            return false;
          }
          break;
        case 'custom':
          if (customStartDate && customEndDate) {
            const startDate = new Date(customStartDate);
            const endDate = new Date(customEndDate);
            endDate.setHours(23, 59, 59, 999); // Include the entire end date
            
            if (requestedDate < startDate || requestedDate > endDate) {
              return false;
            }
          }
          break;
      }
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        rec.entityName.toLowerCase().includes(searchLower) ||
        rec.publisherName.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecommendations.length / itemsPerPage);
  const paginatedRecommendations = filteredRecommendations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, publisherFilter, searchTerm, itemsPerPage, dateFilter, customStartDate, customEndDate]);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Response Received', label: 'Response Received' },
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Sent', label: 'Sent' }
  ];

  const publisherOptions = [
    { value: 'all', label: 'All Publishers' },
    ...publishers.map(publisher => ({
      value: publisher.id,
      label: publisher.name
    }))
  ];

  const itemsPerPageOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '15', label: '15' }
  ];

  const dateFilterOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Card className="mb-24">
        <div className="mb-24">
          <h2 className="heading-h5 text-neutral-900 mb-8">Recommendations</h2>
          <p className="body2-regular text-neutral-600">
            Review and manage optimization recommendations received from publishers for your campaigns and job groups.
          </p>
        </div>

        <div className="flex justify-between items-start mb-24">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-12 top-1/2 transform -translate-y-1/2 h-16 w-16 text-neutral-400" />
              <input
                type="text"
                placeholder="Search recommendations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-40 pr-16 py-12 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-12 ml-20">
            <div className="flex space-x-12">
              <Dropdown
                options={publisherOptions}
                value={publisherFilter}
                onChange={setPublisherFilter}
                containerWidth="160px"
              />
              
              <Dropdown
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                containerWidth="160px"
              />
              
              <Dropdown
                options={dateFilterOptions}
                value={dateFilter}
                onChange={setDateFilter}
                containerWidth="160px"
              />
            </div>
            
            {dateFilter === 'custom' && (
              <div className="flex items-center space-x-12 bg-neutral-50 border border-neutral-200 rounded-lg p-12">
                <Calendar className="h-16 w-16 text-neutral-400" />
                <div className="flex items-center space-x-8">
                  <div className="flex flex-col">
                    <label className="text-xs text-neutral-500 mb-4">From</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="px-8 py-6 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <span className="text-neutral-400 mt-16">—</span>
                  <div className="flex flex-col">
                    <label className="text-xs text-neutral-500 mb-4">To</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="px-8 py-6 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {filteredRecommendations.length === 0 ? (
          <EmptyState
            title="No recommendations"
            description="No recommendations have been received from publishers yet."
            icon={<TrendingUp className="mx-auto h-48 w-48 text-neutral-400" />}
          />
        ) : (
          <>
            <div className="space-y-24">
              {paginatedRecommendations.map((recommendation) => {
                // Mock detailed recommendation data
                const mockMetrics = {
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
                };

                const cpcChange = calculatePercentageChange(mockMetrics.cpc.currentValue, mockMetrics.cpc.recommendedValue);
                const cpaChange = calculatePercentageChange(mockMetrics.cpa.currentValue, mockMetrics.cpa.recommendedValue);
                const budgetChange = calculatePercentageChange(mockMetrics.budget.currentValue, mockMetrics.budget.recommendedValue);

                return (
                  <div 
                    key={recommendation.id} 
                    className="bg-white border border-neutral-200 rounded-xl p-24 hover:shadow-md transition-all duration-200"
                  >
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-20">
                      <div className="flex-1 min-w-0">
                        {/* Badges Row */}
                        <div className="flex items-center gap-8 mb-12 flex-wrap">
                          <EntityTypeBadge type={recommendation.entityType} />
                          <PublisherBadge name={recommendation.publisherName} type="Job" />
                          <span className="inline-flex items-center gap-4 px-8 py-4 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                            ID: {recommendation.id.slice(0, 8)}
                          </span>
                        </div>
                        
                        {/* Title and Meta */}
                        <h3 className="subtitle1-semibold text-neutral-900 mb-6">
                          {recommendation.entityName}
                        </h3>
                        <p className="body2-regular text-neutral-600">
                          Requested: {new Date(recommendation.requestedAt).toLocaleDateString()}
                          {recommendation.respondedAt && ` • Responded: ${new Date(recommendation.respondedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      {recommendation.status === 'Response Received' && (
                        <div className="flex items-center gap-8 ml-16 flex-shrink-0">
                          <Button
                            variant="reject"
                            size="sm"
                            icon={<X size={14} />}
                            onClick={() => handleReject(recommendation.id)}
                          >
                            Decline
                          </Button>
                          <Button
                            variant="partial"
                            size="sm"
                            icon={<AlertCircle size={14} />}
                            onClick={() => handlePartialAccept(recommendation)}
                          >
                            Partial Accept
                          </Button>
                          <Button
                            variant="accept"
                            size="sm"
                            icon={<Check size={14} />}
                            onClick={() => handleAccept(recommendation.id)}
                          >
                            Accept All
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                      {/* CPC Bid Card */}
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-20">
                        <div className="flex items-center gap-12 mb-16">
                          <div className="w-32 h-32 rounded-lg bg-primary-100 flex items-center justify-center">
                            <DollarSign className="h-16 w-16 text-primary-700" />
                          </div>
                          <span className="subtitle2-medium text-neutral-700">CPC Bid</span>
                        </div>
                        
                        <div className="space-y-12">
                          <div className="flex justify-between items-center">
                            <span className="body2-regular text-neutral-500">Current:</span>
                            <span className="body1-semibold text-neutral-900">
                              {formatCurrency(mockMetrics.cpc.currentValue)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="body2-regular text-neutral-500">Recommended:</span>
                            <div className="flex items-center gap-8">
                              <span className="body1-semibold text-primary-700">
                                {formatCurrency(mockMetrics.cpc.recommendedValue)}
                              </span>
                              <div className={`flex items-center gap-4 px-6 py-2 rounded-full text-xs font-medium ${
                                cpcChange.isIncrease 
                                  ? 'bg-error-50 text-error-700' 
                                  : 'bg-success-50 text-success-700'
                              }`}>
                                {cpcChange.isIncrease ? (
                                  <ArrowUpRight className="h-10 w-10" />
                                ) : (
                                  <ArrowDownRight className="h-10 w-10" />
                                )}
                                <span>{cpcChange.value}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CPA Goal Card */}
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-20">
                        <div className="flex items-center gap-12 mb-16">
                          <div className="w-32 h-32 rounded-lg bg-secondary-100 flex items-center justify-center">
                            <Target className="h-16 w-16 text-secondary-700" />
                          </div>
                          <span className="subtitle2-medium text-neutral-700">CPA Goal</span>
                        </div>
                        
                        <div className="space-y-12">
                          <div className="flex justify-between items-center">
                            <span className="body2-regular text-neutral-500">Current:</span>
                            <span className="body1-semibold text-neutral-900">
                              {formatCurrency(mockMetrics.cpa.currentValue)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="body2-regular text-neutral-500">Recommended:</span>
                            <div className="flex items-center gap-8">
                              <span className="body1-semibold text-secondary-700">
                                {formatCurrency(mockMetrics.cpa.recommendedValue)}
                              </span>
                              <div className={`flex items-center gap-4 px-6 py-2 rounded-full text-xs font-medium ${
                                cpaChange.isDecrease 
                                  ? 'bg-success-50 text-success-700' 
                                  : 'bg-error-50 text-error-700'
                              }`}>
                                {cpaChange.isDecrease ? (
                                  <ArrowDownRight className="h-10 w-10" />
                                ) : (
                                  <ArrowUpRight className="h-10 w-10" />
                                )}
                                <span>{cpaChange.value}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Budget Card */}
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-20">
                        <div className="flex items-center gap-12 mb-16">
                          <div className="w-32 h-32 rounded-lg bg-warning-100 flex items-center justify-center">
                            <Zap className="h-16 w-16 text-warning-700" />
                          </div>
                          <span className="subtitle2-medium text-neutral-700">Budget</span>
                        </div>
                        
                        <div className="space-y-12">
                          <div className="flex justify-between items-center">
                            <span className="body2-regular text-neutral-500">Current:</span>
                            <span className="body1-semibold text-neutral-900">
                              {formatCurrency(mockMetrics.budget.currentValue)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="body2-regular text-neutral-500">Recommended:</span>
                            <div className="flex items-center gap-8">
                              <span className="body1-semibold text-warning-700">
                                {formatCurrency(mockMetrics.budget.recommendedValue)}
                              </span>
                              <div className={`flex items-center gap-4 px-6 py-2 rounded-full text-xs font-medium ${
                                budgetChange.isIncrease 
                                  ? 'bg-success-50 text-success-700' 
                                  : 'bg-error-50 text-error-700'
                              }`}>
                                {budgetChange.isIncrease ? (
                                  <ArrowUpRight className="h-10 w-10" />
                                ) : (
                                  <ArrowDownRight className="h-10 w-10" />
                                )}
                                <span>{budgetChange.value}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Publisher Note */}
                    {recommendation.note && (
                      <div className="mt-20 bg-neutral-50 border border-neutral-200 rounded-lg p-16">
                        <h4 className="body1-semibold text-neutral-700 mb-8">Publisher Note:</h4>
                        <p className="body2-regular text-neutral-600">{recommendation.note}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-32 pagination-container">
                <div className="pagination-info">
                  <span>Show:</span>
                  <Dropdown
                    options={itemsPerPageOptions}
                    value={itemsPerPage.toString()}
                    onChange={(value) => setItemsPerPage(parseInt(value))}
                    containerWidth="80px"
                    openUpward={true}
                  />
                  <span>
                    Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                    <strong>{Math.min(currentPage * itemsPerPage, filteredRecommendations.length)}</strong>{' '}
                    of <strong>{filteredRecommendations.length}</strong> results
                  </span>
                </div>

                <div className="pagination-controls">
                  <span
                    className={`pagination-nav ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  >
                    ‹
                  </span>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <span
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                      >
                        {page}
                      </span>
                    ))}
                  </div>
                  
                  <span
                    className={`pagination-nav ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  >
                    ›
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Partial Accept Modal */}
      {showPartialModal && selectedRecommendation && (
        <PartialAcceptModal
          onClose={() => {
            setShowPartialModal(false);
            setSelectedRecommendation(null);
          }}
          onAccept={handlePartialAcceptSubmit}
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

      {showToast && (
        <Toast message={toastMessage} type="success" />
      )}
    </>
  );
};