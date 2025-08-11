import React, { useState } from 'react';
import { Button } from '../common/Button';
import { EntityTypeBadge } from '../common/EntityTypeBadge';
import { PublisherBadge } from '../common/PublisherBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Check, X, MoreHorizontal, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { RecommendationType, RecommendationStatus } from '../../types';
import { PartialAcceptModal } from './PartialAcceptModal';

interface RecommendationMetric {
  type: RecommendationType;
  currentValue: number;
  recommendedValue?: number;
  isMandatory: boolean;
  isAccepted?: boolean;
  potentialImprovement?: string;
}

interface RecommendationLogItem {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'Client' | 'Campaign' | 'JobGroup';
  publisherId: string;
  publisherName: string;
  metrics: RecommendationMetric[];
  status: RecommendationStatus;
  requestedAt: string;
  respondedAt?: string;
  requestType: 'CSE_REQUEST' | 'PROACTIVE_PUBLISHER';
  requestedMetrics?: RecommendationType[];
  priority?: 'Urgent' | 'High' | 'Medium' | 'Low';
}

interface RecommendationLogProps {
  recommendations: RecommendationLogItem[];
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onPartialAccept?: (id: string, selectedMetrics: RecommendationType[]) => void;
}

export const RecommendationLog: React.FC<RecommendationLogProps> = ({
  recommendations,
  onAccept,
  onReject,
  onPartialAccept
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationLogItem | null>(null);

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

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handlePartialAccept = (recommendation: RecommendationLogItem) => {
    setSelectedRecommendation(recommendation);
    setShowPartialModal(true);
  };

  const handlePartialAcceptSubmit = (selectedMetrics: RecommendationType[]) => {
    if (selectedRecommendation && onPartialAccept) {
      onPartialAccept(selectedRecommendation.id, selectedMetrics);
    }
    setShowPartialModal(false);
    setSelectedRecommendation(null);
  };

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-48 text-slate-500">
        <TrendingUp className="mx-auto h-48 w-48 text-slate-300 mb-16" />
        <h3 className="text-lg font-medium text-slate-900 mb-8">No Recommendation Logs</h3>
        <p className="text-sm">Publisher responses will appear here once they submit recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {recommendations.map((recommendation) => {
        const isExpanded = expandedItems.has(recommendation.id);
        const mandatoryMetrics = recommendation.metrics.filter(m => m.isMandatory);
        const additionalMetrics = recommendation.metrics.filter(m => !m.isMandatory);
        
        return (
          <div 
            key={recommendation.id}
            className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Header */}
            <div className="p-20 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Badges Row */}
                  <div className="flex items-center gap-8 mb-12 flex-wrap">
                    <EntityTypeBadge type={recommendation.entityType} />
                    <PublisherBadge name={recommendation.publisherName} type="Job" />
                    <StatusBadge status={recommendation.status} />
                    
                    {/* Request Type Badge */}
                    <span className={`inline-flex items-center gap-4 px-8 py-4 text-xs font-medium rounded-full ${
                      recommendation.requestType === 'CSE_REQUEST' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {recommendation.requestType === 'CSE_REQUEST' ? (
                        <>
                          <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                          CSE Requested
                        </>
                      ) : (
                        <>
                          <span className="w-4 h-4 bg-amber-500 rounded-full"></span>
                          Proactive Submission
                        </>
                      )}
                    </span>

                    {/* Priority Badge */}
                    {recommendation.priority && recommendation.requestType === 'CSE_REQUEST' && (
                      <span className={`inline-flex items-center gap-4 px-8 py-4 text-xs font-medium rounded-full ${
                        recommendation.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                        recommendation.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                        recommendation.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {recommendation.priority} Priority
                      </span>
                    )}
                  </div>
                  
                  {/* Title and Meta */}
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    {recommendation.entityName}
                  </h3>
                  
                  <div className="flex items-center gap-16 text-sm text-slate-600">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-12 w-12" />
                      <span>
                        {recommendation.requestType === 'CSE_REQUEST' ? 'Requested:' : 'Submitted:'} {' '}
                        {new Date(recommendation.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {recommendation.respondedAt && (
                      <div className="flex items-center gap-4">
                        <TrendingUp className="h-12 w-12" />
                        <span>Responded: {new Date(recommendation.respondedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-8 ml-16">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<MoreHorizontal size={14} />}
                    onClick={() => toggleExpanded(recommendation.id)}
                  >
                    {isExpanded ? 'Collapse' : 'View Details'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="p-20 space-y-20">
                {/* Mandatory Metrics Section */}
                {mandatoryMetrics.length > 0 && (
                  <div>
                    <div className="flex items-center gap-8 mb-12">
                      <h4 className="text-sm font-semibold text-slate-900">Mandatory Metrics</h4>
                      <span className="inline-flex items-center gap-4 px-6 py-2 text-xs font-medium bg-red-100 text-red-700 rounded-full border border-red-200">
                        <AlertCircle className="h-8 w-8" />
                        Required by CSE
                      </span>
                    </div>
                    
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                      {mandatoryMetrics.map((metric) => {
                        const change = metric.recommendedValue ? 
                          calculatePercentageChange(metric.currentValue, metric.recommendedValue) : null;
                        
                        return (
                          <div key={metric.type} className="bg-red-50 border border-red-200 rounded-lg p-16">
                            <div className="flex items-center justify-between mb-8">
                              <h5 className="text-sm font-medium text-red-900">{metric.type}</h5>
                              <span className="text-xs font-medium text-red-700 bg-red-100 px-6 py-2 rounded-full">
                                MANDATORY
                              </span>
                            </div>
                            
                            <div className="space-y-6">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-red-700">Current:</span>
                                <span className="text-sm font-medium text-red-900">
                                  {formatCurrency(metric.currentValue)}
                                </span>
                              </div>
                              
                              {metric.recommendedValue && (
                                <>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-red-700">Recommended:</span>
                                    <span className="text-sm font-medium text-red-900">
                                      {formatCurrency(metric.recommendedValue)}
                                    </span>
                                  </div>
                                  
                                  {change && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-red-700">Change:</span>
                                      <span className={`text-sm font-medium flex items-center gap-4 ${
                                        change.isIncrease ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {change.isIncrease ? '↗' : '↘'} {change.value}%
                                      </span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Additional Metrics Section */}
                {additionalMetrics.length > 0 && (
                  <div>
                    <div className="flex items-center gap-8 mb-12">
                      <h4 className="text-sm font-semibold text-slate-900">Additional Recommendations</h4>
                      <span className="inline-flex items-center gap-4 px-6 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                        Unrequested Insights
                      </span>
                    </div>
                    
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                      {additionalMetrics.map((metric) => {
                        const change = metric.recommendedValue ? 
                          calculatePercentageChange(metric.currentValue, metric.recommendedValue) : null;
                        
                        return (
                          <div key={metric.type} className="bg-slate-50 border border-slate-200 rounded-lg p-16">
                            <div className="flex items-center justify-between mb-8">
                              <h5 className="text-sm font-medium text-slate-900">{metric.type}</h5>
                              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-6 py-2 rounded-full">
                                OPTIONAL
                              </span>
                            </div>
                            
                            <div className="space-y-6">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600">Current:</span>
                                <span className="text-sm font-medium text-slate-900">
                                  {formatCurrency(metric.currentValue)}
                                </span>
                              </div>
                              
                              {metric.recommendedValue && (
                                <>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-600">Recommended:</span>
                                    <span className="text-sm font-medium text-slate-900">
                                      {formatCurrency(metric.recommendedValue)}
                                    </span>
                                  </div>
                                  
                                  {change && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-slate-600">Change:</span>
                                      <span className={`text-sm font-medium flex items-center gap-4 ${
                                        change.isIncrease ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {change.isIncrease ? '↗' : '↘'} {change.value}%
                                      </span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {recommendation.status === 'Response Received' && (
                  <div className="flex items-center justify-end gap-8 pt-16 border-t border-slate-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<X size={14} />}
                      onClick={() => onReject?.(recommendation.id)}
                    >
                      Reject
                    </Button>
                    
                    {recommendation.metrics.length > 1 && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<MoreHorizontal size={14} />}
                        onClick={() => handlePartialAccept(recommendation)}
                      >
                        Partial Accept
                      </Button>
                    )}
                    
                    <Button
                      variant="primary-solid"
                      size="sm"
                      icon={<Check size={14} />}
                      onClick={() => onAccept?.(recommendation.id)}
                    >
                      Accept All
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Partial Accept Modal */}
      {showPartialModal && selectedRecommendation && (
        <PartialAcceptModal
          recommendation={selectedRecommendation}
          onClose={() => {
            setShowPartialModal(false);
            setSelectedRecommendation(null);
          }}
          onSubmit={handlePartialAcceptSubmit}
        />
      )}
    </div>
  );
}; 