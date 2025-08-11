import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Tooltip } from '../common/Tooltip';
import { TrendingUp, Mail, DollarSign, Target, Zap, X, Send, FileText, Info, AlertTriangle, AlertCircle, Clock, Minus } from 'lucide-react';
import { MetricSelector } from './MetricSelector';
import { PublisherSelector } from './PublisherSelector';
import { Dropdown } from '../common/Dropdown';
import { EmailPreview } from '../emails/EmailPreview';
import { RecommendationWarningModal } from './RecommendationWarningModal';
import { mockCampaigns, mockJobGroups } from '../../data/mockData';
import { PublisherType, RecommendationType, Priority, Publisher } from '../../types';
import { Input } from '../common/Input';

interface EntityMetrics {
  budget: number;
  cpcBid: number;
  cpaGoal: number;
}

const priorityOptions: { value: Priority; label: string; icon: React.ComponentType<any>; color: string }[] = [
  { value: 'Urgent', label: 'Urgent / Critical — Immediate attention', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'High', label: 'High — Action within 2 business days', icon: AlertCircle, color: 'text-orange-500' },
  { value: 'Medium', label: 'Medium — Action within 3–5 business days', icon: Clock, color: 'text-yellow-500' },
  { value: 'Low', label: 'Low — Action within 7 days (as bandwidth allows)', icon: Minus, color: 'text-gray-500' },
];

// Simple Dropdown Component for Duration (no search, no icons) - POSITIONING FIXED
const SimpleDropdown: React.FC<{
  options: { value: string; label: string }[];
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
        <span className={`block truncate ${selectedOption ? 'text-neutral-900' : 'text-neutral-500'}`}>
          {selectedOption ? selectedOption.label : placeholder}
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

// Priority Dropdown Component with Icons - FIXED
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

export const RequestRecommendationForm: React.FC = () => {
  const { clients, publishers, selectedClient, isLoading, getSelectedClients } = useApp();
  const selectedClients = getSelectedClients();
  const currentClient = selectedClients[0] || clients[0];
  
  const [formData, setFormData] = useState({
    recommendationLevel: '',
    client: '',
    campaign: '',
    jobGroup: '',
    publisherType: '',
    publishers: [] as string[],
    metrics: [] as RecommendationType[],
    duration: '',
    notes: '',
    priority: ''
  });

  // Editable metrics state
  const [editableMetrics, setEditableMetrics] = useState({
    budget: '',
    cpcBid: '',
    cpaGoal: ''
  });

  const [isMetricSelectionValid, setIsMetricSelectionValid] = useState(false);
  const [metricValidationErrors, setMetricValidationErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [hasPreviewedAll, setHasPreviewedAll] = useState(false);
  const [availableCampaigns, setAvailableCampaigns] = useState(() => {
    const selectedClientIds = selectedClients.map(c => c.id);
    return mockCampaigns.filter(c => selectedClientIds.includes(c.clientId));
  });
  const [availableJobGroups, setAvailableJobGroups] = useState(() => {
    const selectedClientIds = selectedClients.map(c => c.id);
    return mockJobGroups.filter(jg => selectedClientIds.includes(jg.clientId));
  });
  const [entityMetrics, setEntityMetrics] = useState<EntityMetrics | null>(null);

  // Update available campaigns and job groups when selected clients change
  useEffect(() => {
    const selectedClientIds = selectedClients.map(c => c.id);
    setAvailableCampaigns(mockCampaigns.filter(c => selectedClientIds.includes(c.clientId)));
    setAvailableJobGroups(mockJobGroups.filter(jg => selectedClientIds.includes(jg.clientId)));
  }, [selectedClients]);

  // Filter campaigns and job groups based on selected client
  useEffect(() => {
    if (formData.client) {
      setAvailableCampaigns(mockCampaigns.filter(c => c.clientId === formData.client));
      setAvailableJobGroups(mockJobGroups.filter(jg => jg.clientId === formData.client));
    }
  }, [formData.client]);

  // Update entity metrics based on recommendation level and selected entity
  useEffect(() => {
    if (formData.recommendationLevel === 'Client' && formData.client) {
      const client = selectedClients.find(c => c.id === formData.client);
      setEntityMetrics(client?.metrics || null);
    } else if (formData.recommendationLevel === 'Campaign' && formData.campaign) {
      const campaign = mockCampaigns.find(c => c.id === formData.campaign);
      setEntityMetrics(campaign?.metrics || null);
    } else if (formData.recommendationLevel === 'JobGroup' && formData.jobGroup) {
      const jobGroup = mockJobGroups.find(jg => jg.id === formData.jobGroup);
      setEntityMetrics(jobGroup?.metrics || null);
    } else {
      setEntityMetrics(null);
    }
  }, [formData.recommendationLevel, formData.client, formData.campaign, formData.jobGroup, selectedClients]);

  // Initialize editable metrics when entityMetrics changes
  useEffect(() => {
    if (entityMetrics) {
      setEditableMetrics({
        budget: entityMetrics.budget.toString(),
        cpcBid: entityMetrics.cpcBid.toString(),
        cpaGoal: entityMetrics.cpaGoal.toString()
      });
    } else {
      setEditableMetrics({
        budget: '',
        cpcBid: '',
        cpaGoal: ''
      });
    }
  }, [entityMetrics]);

  // Reset hasPreviewedAll when form changes
  useEffect(() => {
    setHasPreviewedAll(false);
  }, [formData.publishers, formData.metrics, formData.publisherType]);

  const publishersByType = publishers.reduce((acc, publisher) => {
    if (!acc[publisher.type]) {
      acc[publisher.type] = [];
    }
    acc[publisher.type].push(publisher);
    return acc;
  }, {} as Record<PublisherType, Publisher[]>);

  const handleMetricsChange = (metrics: RecommendationType[]) => {
    setIsMetricSelectionValid(metrics.length > 0);
    setFormData(prev => ({
      ...prev,
      metrics: metrics
    }));
  };

  const handlePublisherTypeChange = (type: string) => {
    setFormData(prev => ({ 
      ...prev, 
      publisherType: type as PublisherType,
      publishers: [] // Reset publishers when type changes
    }));
  };

  const handleRecommendationLevelChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      recommendationLevel: value as 'Client' | 'Campaign' | 'JobGroup',
      campaign: '', // Reset when level changes
      jobGroup: '' // Reset when level changes
    }));
  };

  const handleMetricValidationChange = (isValid: boolean, errors: string[]) => {
    setIsMetricSelectionValid(isValid);
    setMetricValidationErrors(errors);
  };

  // Check if all mandatory fields are filled
  const isMandatoryFieldsFilled = () => {
    const hasRecommendationLevel = !!formData.recommendationLevel;
    const hasClient = !!formData.client;
    const hasCampaign = formData.recommendationLevel === 'Client' || !!formData.campaign;
    const hasJobGroup = formData.recommendationLevel !== 'JobGroup' || !!formData.jobGroup;
    const hasPublisherType = !!formData.publisherType;
    const hasPublishers = formData.publishers.length > 0;
    const hasValidMetrics = isMetricSelectionValid;
    const hasDuration = !!formData.duration;

    return hasRecommendationLevel && hasClient && hasCampaign && hasJobGroup && 
           hasPublisherType && hasPublishers && hasValidMetrics && hasDuration;
  };

  const handleSendAll = () => {
    if (!hasPreviewedAll) {
      setShowWarningModal(true);
      return;
    }
    handleConfirmSendAll();
  };

  const handleConfirmSendAll = async () => {
    setShowWarningModal(false);
    setError(null);

    try {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

              // Reset form
      setFormData({
          recommendationLevel: 'Client',
          client: currentClient?.id || '',
          campaign: '',
          jobGroup: '',
          publisherType: 'CPC',
          publishers: [],
        metrics: [],
          priority: '',
        duration: 'This Month',
        notes: '',
      });
      setHasPreviewedAll(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handlePreview = () => {
    logPublisherAllocations(); // Debug publisher allocations
    setShowEmailPreview(true);
    setHasPreviewedAll(true);
  };

  const handleWarningPreview = () => {
    setShowWarningModal(false);
    handlePreview();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const canPreview = isMandatoryFieldsFilled();
  const canSend = isMandatoryFieldsFilled();

  // Prepare dropdown options
  const recommendationLevelOptions = [
    { value: 'Client', label: 'Client' },
    { value: 'Campaign', label: 'Campaign' },
    { value: 'JobGroup', label: 'Job Group' }
  ];

  const clientOptions = selectedClients.map(client => ({
    value: client.id,
    label: client.name
  }));

  const campaignOptions = availableCampaigns.map(campaign => ({
    value: campaign.id,
    label: campaign.name
  }));

  const jobGroupOptions = availableJobGroups.map(jobGroup => ({
    value: jobGroup.id,
    label: jobGroup.name
  }));

  const publisherTypeOptions = [
    { value: 'CPC', label: 'CPC Publishers' },
    { value: 'CPA', label: 'CPA Publishers' },
    { value: 'TCPA', label: 'TCPA Publishers' },
    { value: 'Flat CPC', label: 'Flat CPC Publishers' },
    { value: 'Flat CPA', label: 'Flat CPA Publishers' }
  ];

  const durationOptions = [
    { value: 'This Month', label: 'This Month' },
    { value: 'Next Month', label: 'Next Month' }
  ];

  // Publisher-specific metric allocation function
  const generatePublisherMetrics = (entityMetrics: { budget: number; cpcBid: number; cpaGoal: number }, publisherId: string, totalPublishers: number) => {
    // For consistent allocation per publisher, use publisherId as seed
    const publisherSeed = publisherId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Budget allocation: Random percentage (15-40% per publisher)
    const budgetPercentage = 0.15 + random(publisherSeed) * 0.25; // 15-40%
    let publisherBudget = Math.round((entityMetrics.budget * budgetPercentage) / 10) * 10; // Round to nearest 10
    
    // Ensure minimum budget of $50
    publisherBudget = Math.max(publisherBudget, 50);

    // CPC Bid: Vary around entity average (±20% max variance)
    const cpcVariance = (random(publisherSeed + 1) - 0.5) * 0.4; // -20% to +20%
    const publisherCpc = Math.round((entityMetrics.cpcBid * (1 + cpcVariance)) * 100) / 100; // Round to 2 decimals

    // CPA Goal: Vary around entity average (±20% max variance)  
    const cpaVariance = (random(publisherSeed + 2) - 0.5) * 0.4; // -20% to +20%
    const publisherCpa = Math.round((entityMetrics.cpaGoal * (1 + cpaVariance)) * 100) / 100; // Round to 2 decimals

    return {
      budget: publisherBudget,
      cpcBid: Math.max(publisherCpc, 0.10), // Minimum CPC of $0.10
      cpaGoal: Math.max(publisherCpa, 1.00)  // Minimum CPA of $1.00
    };
  };

  // Get publisher-specific metrics for all publishers
  const getAllPublisherMetrics = () => {
    if (!entityMetrics || formData.publishers.length === 0) {
      const defaultMetrics = {
        budget: editableMetrics.budget ? parseFloat(editableMetrics.budget) : 0,
        cpcBid: editableMetrics.cpcBid ? parseFloat(editableMetrics.cpcBid) : 0,
        cpaGoal: editableMetrics.cpaGoal ? parseFloat(editableMetrics.cpaGoal) : 0
      };
      return [defaultMetrics];
    }

    // Use entity metrics (either original or user-edited)
    const currentEntityMetrics = {
      budget: editableMetrics.budget ? parseFloat(editableMetrics.budget) : entityMetrics.budget,
      cpcBid: editableMetrics.cpcBid ? parseFloat(editableMetrics.cpcBid) : entityMetrics.cpcBid,
      cpaGoal: editableMetrics.cpaGoal ? parseFloat(editableMetrics.cpaGoal) : entityMetrics.cpaGoal
    };

    // Generate metrics for each publisher
    return formData.publishers.map(publisherId => 
      generatePublisherMetrics(currentEntityMetrics, publisherId, formData.publishers.length)
    );
  };

  // Debug function to log publisher allocations (for testing)
  const logPublisherAllocations = () => {
    if (!entityMetrics || formData.publishers.length === 0) return;

    const currentEntityMetrics = {
      budget: editableMetrics.budget ? parseFloat(editableMetrics.budget) : entityMetrics.budget,
      cpcBid: editableMetrics.cpcBid ? parseFloat(editableMetrics.cpcBid) : entityMetrics.cpcBid,
      cpaGoal: editableMetrics.cpaGoal ? parseFloat(editableMetrics.cpaGoal) : entityMetrics.cpaGoal
    };

    console.log('=== Publisher Allocation Debug ===');
    console.log('Entity Metrics:', currentEntityMetrics);
    
    const allPublisherMetrics = formData.publishers.map(publisherId => {
      const publisher = publishers.find(p => p.id === publisherId);
      const metrics = generatePublisherMetrics(currentEntityMetrics, publisherId, formData.publishers.length);
      return { publisherName: publisher?.name || publisherId, ...metrics };
    });

    console.log('Publisher Allocations:', allPublisherMetrics);
    
    // Calculate totals
    const totalBudget = allPublisherMetrics.reduce((sum, p) => sum + p.budget, 0);
    const avgCpc = allPublisherMetrics.reduce((sum, p) => sum + p.cpcBid, 0) / allPublisherMetrics.length;
    const avgCpa = allPublisherMetrics.reduce((sum, p) => sum + p.cpaGoal, 0) / allPublisherMetrics.length;

    console.log('Validation:');
    console.log(`Budget - Entity: $${currentEntityMetrics.budget}, Publisher Total: $${totalBudget}, Difference: ${((totalBudget - currentEntityMetrics.budget) / currentEntityMetrics.budget * 100).toFixed(1)}%`);
    console.log(`CPC - Entity: $${currentEntityMetrics.cpcBid}, Publisher Avg: $${avgCpc.toFixed(2)}, Difference: ${((avgCpc - currentEntityMetrics.cpcBid) / currentEntityMetrics.cpcBid * 100).toFixed(1)}%`);
    console.log(`CPA - Entity: $${currentEntityMetrics.cpaGoal}, Publisher Avg: $${avgCpa.toFixed(2)}, Difference: ${((avgCpa - currentEntityMetrics.cpaGoal) / currentEntityMetrics.cpaGoal * 100).toFixed(1)}%`);
    console.log('=================================');
  };

  return (
    <div className="p-20">
      <Card className="mb-16">
      <div className="mb-20">
          <h2 className="text-18 font-semibold text-dark-grey mb-4">Request Recommendation</h2>
          <p className="text-14 text-gray-600 leading-relaxed">
          Submit recommendation requests to publishers for optimization insights on CPC bids, CPA goals, and budget allocation.
        </p>
      </div>

      {success && (
        <div className="mb-16 p-12 bg-green-50 text-green-700 rounded-6 border border-green-200">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <X size={12} className="text-white" />
            </div>
            <span className="text-14 font-medium">Recommendation request sent successfully!</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-16 p-12 bg-red-50 text-red-700 rounded-6 border border-red-200">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
              <X size={12} className="text-white" />
            </div>
            <span className="text-14 font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-32">
        {/* 1. Recommendation Level - Mandatory */}
          <div className="space-y-8">
          <label className="block text-14 font-semibold text-dark-grey">
            <span className="text-red-500 mr-4">*</span>Recommendation Level
          </label>
          <Dropdown
            options={recommendationLevelOptions}
            value={formData.recommendationLevel}
            onChange={handleRecommendationLevelChange}
            placeholder="Select recommendation level"
          />
        </div>

        {/* 2. Client Selection - Always visible and Mandatory */}
        <div className="space-y-8">
          <label className="block text-14 font-semibold text-dark-grey">
            <span className="text-red-500">*</span> Client
          </label>
          <Dropdown
            options={clientOptions}
            value={formData.client}
            onChange={(value) => setFormData(prev => ({ 
              ...prev, 
              client: value,
              campaign: '', // Reset when client changes
              jobGroup: '' // Reset when client changes
            }))}
            placeholder="Select client"
          />
        </div>

        {/* Campaign Selection - Show for Campaign and JobGroup levels */}
        {(formData.recommendationLevel === 'Campaign' || formData.recommendationLevel === 'JobGroup') && (
          <div className="space-y-8">
            <label className="block text-14 font-semibold text-dark-grey">
              <span className="text-red-500">*</span> Campaign
            </label>
            <Dropdown
              options={campaignOptions}
              value={formData.campaign}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                campaign: value,
                jobGroup: '' // Reset when campaign changes
              }))}
              placeholder="Select campaign"
            />
          </div>
        )}

        {/* Job Group Selection - Show only for JobGroup level */}
        {formData.recommendationLevel === 'JobGroup' && (
          <div className="space-y-8">
            <label className="block text-14 font-semibold text-dark-grey">
              <span className="text-red-500">*</span> Job Group
            </label>
            <Dropdown
              options={jobGroupOptions}
              value={formData.jobGroup}
              onChange={(value) => setFormData(prev => ({ ...prev, jobGroup: value }))}
              placeholder="Select job group"
            />
          </div>
        )}

        {/* Entity Metrics Display - Now Editable */}
        {entityMetrics && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-16 rounded-8 border border-blue-200">
            <h3 className="text-14 font-semibold text-dark-grey mb-12" style={{ color: '#303F9F' }}>
              {formData.recommendationLevel} Metrics
            </h3>
            
            {/* Horizontal Layout for Input Fields */}
            <div className="grid grid-cols-3 gap-16">
              {/* Budget */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <label className="block text-14 font-semibold text-dark-grey">
                    <span className="text-red-500 mr-4">*</span>Budget
                  </label>
                  {editableMetrics.budget && (
                    <button
                      type="button"
                      onClick={() => setEditableMetrics(prev => ({ ...prev, budget: '' }))}
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
                    value={editableMetrics.budget}
                    onChange={(e) => setEditableMetrics(prev => ({ ...prev, budget: e.target.value }))}
                    style={{ paddingLeft: '45px !important' }}
                    className="!pl-45"
                  />
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 text-14 text-gray-500 pointer-events-none">
                    $
                  </span>
                </div>
              </div>

              {/* CPC Bid */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <label className="block text-14 font-semibold text-dark-grey">
                    CPC Bid
                  </label>
                  {editableMetrics.cpcBid && (
                    <button
                      type="button"
                      onClick={() => setEditableMetrics(prev => ({ ...prev, cpcBid: '' }))}
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
                    value={editableMetrics.cpcBid}
                    onChange={(e) => setEditableMetrics(prev => ({ ...prev, cpcBid: e.target.value }))}
                    style={{ paddingLeft: '45px !important' }}
                    className="!pl-45"
                  />
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 text-14 text-gray-500 pointer-events-none">
                    $
                  </span>
                </div>
              </div>

              {/* CPA Goal */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <label className="block text-14 font-semibold text-dark-grey">
                    CPA Goal
                  </label>
                  {editableMetrics.cpaGoal && (
                    <button
                      type="button"
                      onClick={() => setEditableMetrics(prev => ({ ...prev, cpaGoal: '' }))}
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
                    value={editableMetrics.cpaGoal}
                    onChange={(e) => setEditableMetrics(prev => ({ ...prev, cpaGoal: e.target.value }))}
                    style={{ paddingLeft: '45px !important' }}
                    className="!pl-45"
                  />
                  <span className="absolute left-16 top-1/2 transform -translate-y-1/2 text-14 text-gray-500 pointer-events-none">
                    $
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Priority - Optional */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <label className="block text-14 font-semibold text-dark-grey">
              Priority
            </label>
            {formData.priority && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priority: '' }))}
                className="text-12 font-normal text-blue-600 hover:text-blue-800 transition-colors"
                style={{ color: '#303F9F' }}
              >
                Clear
              </button>
            )}
          </div>
          <PriorityDropdown
            options={priorityOptions}
            value={formData.priority}
            onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            placeholder="No priority set"
          />
        </div>

        {/* 4. Publisher Type - Mandatory */}
        <div className="space-y-8">
          <label className="block text-14 font-semibold text-dark-grey">
            <span className="text-red-500">*</span> Publisher Type
          </label>
        <Dropdown
            options={publisherTypeOptions}
            value={formData.publisherType}
            onChange={handlePublisherTypeChange}
            placeholder="Select publisher type"
          />
        </div>

        {/* 5. Select Publishers - Mandatory (moved before metrics) */}
        <div className="space-y-8">
          <label className="block text-14 font-semibold text-dark-grey">
            <span className="text-red-500">*</span> Select Publishers
          </label>
          <PublisherSelector
            publishers={publishersByType[formData.publisherType as PublisherType] || []}
            selectedPublishers={formData.publishers}
            onPublishersChange={(publisherIds) => setFormData(prev => ({ ...prev, publishers: publisherIds }))}
          />
        </div>

        {/* 6. Recommendation Metrics - Mandatory */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <label className="block text-14 font-semibold text-dark-grey">
              <span className="text-red-500">*</span> Recommendation Metrics
            </label>
            <Tooltip
              content="Recommendation metrics are based on the chosen publisher bid type."
              position="top"
              variant="default"
              size="md"
            >
              <Info size={16} className="text-gray-500 cursor-help" />
            </Tooltip>
          </div>
          <MetricSelector
            publisherType={formData.publisherType}
            selectedMetrics={formData.metrics}
            onMetricsChange={handleMetricsChange}
            onValidationChange={handleMetricValidationChange}
          />
        </div>

        {/* 7. Duration - Mandatory */}
        <div className="space-y-8">
          <label className="block text-14 font-semibold text-dark-grey">
            <span className="text-red-500">*</span> Duration
          </label>
          <SimpleDropdown
          options={durationOptions}
          value={formData.duration}
          onChange={(value) => setFormData(prev => ({ ...prev, duration: value as 'This Month' | 'Next Month' }))}
            placeholder="Select duration"
          />
        </div>

        {/* 8. Notes - Optional (renamed from Additional Notes) */}
        <div className="space-y-8">
          <label className="block text-14 font-semibold text-dark-grey">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full p-16 border border-neutral-300 rounded-lg text-sm bg-white transition-all duration-200 resize-none hover:border-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
            placeholder="Any additional context or requirements..."
            maxLength={200}
            rows={4}
          />
          <p className="text-12 text-gray-500">{formData.notes.length}/200 characters</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-12 pt-24 border-t border-gray-200">
            <Button
              type="button"
            variant="secondary"
            icon={<FileText size={16} />}
              onClick={handlePreview}
            disabled={!canPreview}
            >
            {formData.publishers.length > 1 ? 'Preview All' : 'Preview'}
            </Button>
          
          <Button
            type="button"
            variant="primary"
            icon={<Send size={16} />}
            onClick={handleSendAll}
            disabled={!canSend}
            isLoading={isLoading}
          >
            {formData.publishers.length > 1 ? 'Send All' : 'Send'}
          </Button>
        </div>
      </div>

      {/* Warning Modal */}
      <RecommendationWarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onPreview={handleWarningPreview}
        onSend={handleConfirmSendAll}
        publisherCount={formData.publishers.length}
      />

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-16 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <EmailPreview 
                template={{
                clientName: clients.find(c => c.id === formData.client)?.name || '',
                entityType: formData.recommendationLevel,
                entityName: formData.recommendationLevel === 'JobGroup' 
                  ? availableJobGroups.find(jg => jg.id === formData.jobGroup)?.name || 'Job Group'
                  : formData.recommendationLevel === 'Campaign'
                  ? availableCampaigns.find(c => c.id === formData.campaign)?.name || 'Campaign'
                  : clients.find(c => c.id === formData.client)?.name || 'Client',
                recommendationTypes: formData.metrics as string[],
                currentMetrics: getAllPublisherMetrics(),
                  note: formData.notes || undefined,
                priority: formData.priority as Priority,
                duration: formData.duration,
                  expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }),
                  partnerInsightsUrl: 'https://partner-insights.example.com/recommendations/new'
                }}
                publishers={formData.publishers.map(id => {
                  const publisher = publishers.find(p => p.id === id);
                  return {
                    name: publisher?.name || '',
                    email: publisher?.email || []
                  };
                })}
                user={{
                  name: 'Harman Sohi',
                  email: 'harman@joveo.com'
                }}
                onClose={() => setShowEmailPreview(false)}
              />
          </div>
          </div>
      )}
    </Card>
    </div>
  );
};