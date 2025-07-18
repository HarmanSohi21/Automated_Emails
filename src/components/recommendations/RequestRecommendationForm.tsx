import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Tooltip } from '../common/Tooltip';
import { TrendingUp, Mail, DollarSign, Target, Zap, Info } from 'lucide-react';
import { mockCampaigns, mockJobGroups } from '../../data/mockData';
import { EmailPreview } from '../emails/EmailPreview';
import { Dropdown } from '../common/Dropdown';
import { PublisherType, RecommendationType, Priority } from '../../types';

interface EntityMetrics {
  budget: number;
  cpcBid: number;
  cpaGoal: number;
}

interface FormData {
  entityType: 'Client' | 'Campaign' | 'JobGroup';
  entityId: string;
  recommendationTypes: RecommendationType[];
  publisherType: PublisherType;
  selectedPublishers: string[];
  duration: 'This Month' | 'Next Month';
  note: string;
  priority: Priority;
}

const priorityOptions: { value: Priority; label: string; icon: string }[] = [
  { value: 'Urgent', label: 'Urgent / Critical — Immediate attention', icon: '🔺' },
  { value: 'High', label: 'High — Action within 2 business days', icon: '🔶' },
  { value: 'Medium', label: 'Medium — Action within 3–5 business days', icon: '🔵' },
  { value: 'Low', label: 'Low — Action within 7 days (as bandwidth allows)', icon: '⚪' },
];

export const RequestRecommendationForm: React.FC = () => {
  const { clients, publishers, selectedClient, isLoading } = useApp();
  const currentClient = clients.find(c => c.id === selectedClient) || clients[0];
  
  const [formData, setFormData] = useState<FormData>({
    entityType: 'Client',
    entityId: currentClient?.id || '',
    recommendationTypes: [],
    publisherType: 'Flat CPC',
    selectedPublishers: [],
    duration: 'This Month',
    note: '',
    priority: 'Medium',
  });

  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [availableCampaigns, setAvailableCampaigns] = useState(mockCampaigns);
  const [availableJobGroups, setAvailableJobGroups] = useState(mockJobGroups);
  const [entityMetrics, setEntityMetrics] = useState<EntityMetrics | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentClient) {
      setAvailableCampaigns(mockCampaigns.filter(c => c.clientId === currentClient.id));
      setAvailableJobGroups(mockJobGroups.filter(jg => jg.clientId === currentClient.id));
      setEntityMetrics(currentClient.metrics);
    }
  }, [currentClient]);

  useEffect(() => {
    if (formData.entityType === 'Client') {
      setEntityMetrics(currentClient?.metrics || null);
    } else if (formData.entityType === 'Campaign' && formData.entityId) {
      const campaign = mockCampaigns.find(c => c.id === formData.entityId);
      setEntityMetrics(campaign?.metrics || null);
    } else if (formData.entityType === 'JobGroup' && formData.entityId) {
      const jobGroup = mockJobGroups.find(jg => jg.id === formData.entityId);
      setEntityMetrics(jobGroup?.metrics || null);
    }
  }, [formData.entityType, formData.entityId, currentClient]);

  const publishersByType = publishers.reduce((acc, publisher) => {
    if (!acc[publisher.type]) {
      acc[publisher.type] = [];
    }
    acc[publisher.type].push(publisher);
    return acc;
  }, {} as Record<PublisherType, typeof publishers>);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'entityType') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        entityId: '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePublisherSelection = (publisherId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPublishers: prev.selectedPublishers.includes(publisherId)
        ? prev.selectedPublishers.filter(id => id !== publisherId)
        : [...prev.selectedPublishers, publisherId]
    }));
  };

  const handleRecommendationTypeChange = (type: RecommendationType) => {
    setFormData(prev => ({
      ...prev,
      recommendationTypes: prev.recommendationTypes.includes(type)
        ? prev.recommendationTypes.filter(t => t !== type)
        : [...prev.recommendationTypes, type]
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.entityId) {
      setError('Please select an entity');
      return;
    }

    if (formData.selectedPublishers.length === 0) {
      setError('Please select at least one publisher');
      return;
    }

    if (formData.recommendationTypes.length === 0) {
      setError('Please select at least one recommendation type');
      return;
    }

    setError(null);

    try {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setFormData({
        entityType: 'Client',
        entityId: currentClient?.id || '',
        recommendationTypes: [],
        publisherType: 'Flat CPC',
        selectedPublishers: [],
        duration: 'This Month',
        note: '',
        priority: 'Medium',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handlePreview = () => {
    setShowEmailPreview(true);
  };

  const canPreview = formData.selectedPublishers.length > 0 && formData.entityId && formData.recommendationTypes.length > 0;

  // Prepare dropdown options
  const entityTypeOptions = [
    { value: 'Client', label: 'Client' },
    { value: 'Campaign', label: 'Campaign' },
    { value: 'JobGroup', label: 'Job Group' }
  ];

  const campaignOptions = availableCampaigns.map(campaign => ({
    value: campaign.id,
    label: campaign.name
  }));

  const jobGroupOptions = availableJobGroups.map(jobGroup => ({
    value: jobGroup.id,
    label: jobGroup.name
  }));

  const publisherTypeOptions = [
    { value: 'Flat CPC', label: 'Flat CPC Publishers' },
    { value: 'Flat CPA', label: 'Flat CPA Publishers' },
    { value: 'CPA', label: 'CPA Publishers' },
    { value: 'CPC', label: 'CPC Publishers' },
    { value: 'TCPA', label: 'TCPA Publishers' }
  ];

  const durationOptions = [
    { value: 'This Month', label: 'This Month' },
    { value: 'Next Month', label: 'Next Month' }
  ];

  return (
    <Card className="mb-24">
      <div className="mb-20">
        <h2 className="heading-h5 text-slate-900 mb-6">Request Recommendation</h2>
        <p className="body2-regular text-slate-600">
          Submit recommendation requests to publishers for optimization insights on CPC bids, CPA goals, and budget allocation.
        </p>
      </div>

      {success && (
        <div className="mb-16 p-12 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm">
          Recommendation request submitted successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-16 p-12 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-20">
        {/* Client Level Metrics */}
        <div className="bg-gradient-to-r from-slate-50 to-white p-16 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-12">Client Level Metrics</h3>
          <div className="space-y-8">
            {/* Total Budget */}
            <div className="flex items-center justify-between p-10 bg-white rounded-md border border-slate-200">
              <div className="flex items-center space-x-8">
                <div className="w-20 h-20 rounded bg-indigo-100 flex items-center justify-center">
                  <DollarSign className="h-10 w-10 text-indigo-700" />
                </div>
                <span className="text-xs text-slate-600">Total Budget</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{formatCurrency(currentClient?.metrics.budget || 0)}</span>
            </div>

            {/* Avg. CPC Bid */}
            <div className="flex items-center justify-between p-10 bg-white rounded-md border border-slate-200">
              <div className="flex items-center space-x-8">
                <div className="w-20 h-20 rounded bg-cyan-100 flex items-center justify-center">
                  <Target className="h-10 w-10 text-cyan-700" />
                </div>
                <span className="text-xs text-slate-600">Avg. CPC Bid</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{formatCurrency(currentClient?.metrics.cpcBid || 0)}</span>
            </div>

            {/* Avg. CPA Goal */}
            <div className="flex items-center justify-between p-10 bg-white rounded-md border border-slate-200">
              <div className="flex items-center space-x-8">
                <div className="w-20 h-20 rounded bg-amber-100 flex items-center justify-center">
                  <Zap className="h-10 w-10 text-amber-700" />
                </div>
                <span className="text-xs text-slate-600">Avg. CPA Goal</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{formatCurrency(currentClient?.metrics.cpaGoal || 0)}</span>
            </div>
          </div>
        </div>

        {/* Entity Type Dropdown */}
        <Dropdown
          label="Entity Type"
          options={entityTypeOptions}
          value={formData.entityType}
          onChange={(value) => setFormData(prev => ({ ...prev, entityType: value as 'Client' | 'Campaign' | 'JobGroup', entityId: '' }))}
        />

        {formData.entityType !== 'Client' && (
          <Dropdown
            label={`Select ${formData.entityType}`}
            options={formData.entityType === 'Campaign' ? campaignOptions : jobGroupOptions}
            value={formData.entityId}
            onChange={(value) => setFormData(prev => ({ ...prev, entityId: value }))}
            placeholder={`Select ${formData.entityType.toLowerCase()}...`}
          />
        )}

        {formData.entityId && formData.entityType !== 'Client' && entityMetrics && (
          <div className="bg-gradient-to-r from-slate-50 to-white p-16 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-12">
              {formData.entityType} Metrics
            </h3>
            <div className="space-y-8">
              {/* Current Budget */}
              <div className="flex items-center justify-between p-10 bg-white rounded-md border border-slate-200">
                <div className="flex items-center space-x-8">
                  <div className="w-20 h-20 rounded bg-indigo-100 flex items-center justify-center">
                    <DollarSign className="h-10 w-10 text-indigo-700" />
                  </div>
                  <span className="text-xs text-slate-600">Current Budget</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(entityMetrics.budget)}</span>
              </div>

              {/* Current CPC Bid */}
              <div className="flex items-center justify-between p-10 bg-white rounded-md border border-slate-200">
                <div className="flex items-center space-x-8">
                  <div className="w-20 h-20 rounded bg-cyan-100 flex items-center justify-center">
                    <Target className="h-10 w-10 text-cyan-700" />
                  </div>
                  <span className="text-xs text-slate-600">Current CPC Bid</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(entityMetrics.cpcBid)}</span>
              </div>

              {/* Current CPA Goal */}
              <div className="flex items-center justify-between p-10 bg-white rounded-md border border-slate-200">
                <div className="flex items-center space-x-8">
                  <div className="w-20 h-20 rounded bg-amber-100 flex items-center justify-center">
                    <Zap className="h-10 w-10 text-amber-700" />
                  </div>
                  <span className="text-xs text-slate-600">Current CPA Goal</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(entityMetrics.cpaGoal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Priority Dropdown */}
        <Dropdown
          label="Priority"
          options={priorityOptions.map(option => ({
            value: option.value,
            label: `${option.icon} ${option.label}`
          }))}
          value={formData.priority}
          onChange={(value) => setFormData(prev => ({ ...prev, priority: value as Priority }))}
        />

        <div>
          <div className="flex items-center space-x-8 mb-8">
            <label className="block text-sm font-medium text-slate-700">
              Recommendation Types
            </label>
            <Tooltip
              content="Please select at least one recommendation type"
              position="top"
              variant="default"
              size="md"
            >
              <Info className="h-12 w-12 text-slate-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="space-y-8">
            {(['CPC Bid', 'CPA Goal', 'Budget'] as RecommendationType[]).map(type => (
              <label key={type} className="flex items-center space-x-8 p-12 rounded-md border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.recommendationTypes.includes(type)}
                  onChange={() => handleRecommendationTypeChange(type)}
                  className="h-12 w-12 text-indigo-700 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <span className="text-sm text-slate-900">{type}</span>
              </label>
            ))}
          </div>
          {formData.recommendationTypes.length === 0 && (
            <div className="mt-8 flex items-center space-x-6 text-slate-500">
              <Info className="h-12 w-12 flex-shrink-0" />
              <span className="text-xs">
                Select the types of recommendations you'd like to request from publishers
              </span>
            </div>
          )}
        </div>

        {/* Publisher Type Dropdown */}
        <Dropdown
          label="Publisher Type"
          options={publisherTypeOptions}
          value={formData.publisherType}
          onChange={(value) => setFormData(prev => ({ ...prev, publisherType: value as PublisherType }))}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-8">
            Select Publishers
          </label>
          <div className="space-y-8">
            {publishersByType[formData.publisherType]?.map(publisher => (
              <label key={publisher.id} className="flex items-center space-x-8 p-12 rounded-md border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.selectedPublishers.includes(publisher.id)}
                  onChange={() => handlePublisherSelection(publisher.id)}
                  className="h-12 w-12 text-indigo-700 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <span className="text-sm text-slate-900">{publisher.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Duration Dropdown */}
        <Dropdown
          label="Duration"
          options={durationOptions}
          value={formData.duration}
          onChange={(value) => setFormData(prev => ({ ...prev, duration: value as 'This Month' | 'Next Month' }))}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-6">
            Additional Note
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            className="w-full p-12 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="Any additional context or requirements..."
          />
        </div>

        <div className="flex justify-end space-x-8 pt-16 border-t border-slate-200">
          {canPreview && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={<Mail size={14} />}
              onClick={handlePreview}
            >
              Preview Email
            </Button>
          )}
          <Button
            type="submit"
            variant="primary-solid"
            size="sm"
            isLoading={isLoading}
            icon={<TrendingUp size={14} />}
          >
            Submit Request
          </Button>
        </div>
      </form>

      {showEmailPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-16 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-16 border-b border-neutral-200 flex justify-between items-center bg-gradient-to-r from-neutral-50 to-white">
              <h2 className="subtitle1-semibold text-text-primary">Email Preview</h2>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowEmailPreview(false)}
              >
                Close Preview
              </Button>
            </div>
            <div className="p-24">
              <EmailPreview 
                template={{
                  clientName: currentClient?.name || '',
                  entityType: formData.entityType,
                  entityName: formData.entityType === 'JobGroup' 
                    ? availableJobGroups.find(jg => jg.id === formData.entityId)?.name 
                    : formData.entityType === 'Campaign'
                    ? availableCampaigns.find(c => c.id === formData.entityId)?.name
                    : undefined,
                  recommendationTypes: formData.recommendationTypes,
                  currentMetrics: entityMetrics || currentClient?.metrics || {},
                  note: formData.note || undefined,
                  priority: formData.priority,
                  expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }),
                  partnerInsightsUrl: 'https://partner-insights.example.com/recommendations/new'
                }}
                publishers={formData.selectedPublishers.map(id => {
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
          </div>
      )}
    </Card>
  );
};