import React, { useState } from 'react';
import { Button } from '../common/Button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Priority } from '../../types';

interface EmailPreviewProps {
  template: {
    entityType?: 'Client' | 'Campaign' | 'JobGroup';
    entityName: string;
    clientName: string;
    currentMetrics?: {
      budget?: number;
      cpcBid?: number;
      cpaGoal?: number;
    };
    feedUrl?: string;
    landingPage?: string;
    jobTitles?: string[];
    locations?: string[];
    note?: string;
    expiryDate?: string;
    partnerInsightsUrl: string;
    recommendationTypes?: string[];
    priority?: Priority;
  };
  publishers?: Array<{ name: string; email: string[] }>;
  user?: {
    name: string;
    email: string;
  };
  onClose?: () => void;
}

const priorityIcons: Record<Priority, string> = {
  'Urgent': '🔺',
  'High': '🔶',
  'Medium': '🔵',
  'Low': '⚪'
};

const priorityDescriptions: Record<Priority, string> = {
  'Urgent': 'Urgent / Critical — Immediate attention',
  'High': 'High — Action within 2 business days',
  'Medium': 'Medium — Action within 3–5 business days',
  'Low': 'Low — Action within 7 days (as bandwidth allows)'
};

export const EmailPreview: React.FC<EmailPreviewProps> = ({ 
  template, 
  publishers = [], 
  user,
  onClose 
}) => {
  const [currentPublisherIndex, setCurrentPublisherIndex] = useState(0);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handlePrevious = () => {
    setCurrentPublisherIndex((prev) => (prev > 0 ? prev - 1 : publishers.length - 1));
  };

  const handleNext = () => {
    setCurrentPublisherIndex((prev) => (prev < publishers.length - 1 ? prev + 1 : 0));
  };

  const currentPublisher = publishers[currentPublisherIndex];

  return (
    <div className="bg-white p-6 rounded-lg">
      {publishers.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <button
            onClick={handlePrevious}
            className="p-1 hover:bg-gray-200 rounded-full"
            disabled={publishers.length <= 1}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-600">
            Showing {currentPublisherIndex + 1} of {publishers.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1 hover:bg-gray-200 rounded-full"
            disabled={publishers.length <= 1}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <div className="prose max-w-none">
        <div className="mb-6">
          <p className="font-medium mb-2">To:</p>
          <p className="bg-gray-50 p-2 rounded">
            {currentPublisher?.email.join(', ') || '[Publisher POCs - auto-filled]'}
          </p>
        </div>

        <div className="mb-6">
          <p className="font-medium mb-2">Cc:</p>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter email addresses (comma-separated)"
            value={ccRecipients.join(', ')}
            onChange={(e) => setCcRecipients(
              e.target.value.split(',').map(email => email.trim()).filter(Boolean)
            )}
          />
        </div>

        <div className="mb-6">
          <p className="font-medium mb-2">Subject:</p>
          <p>Request for {template.recommendationTypes?.join(', ')} Recommendation – {template.clientName}</p>
        </div>

        <div className="mb-6">
          <p>Hi {currentPublisher?.name || '[Publisher Name]'} Team,</p>
          
          <p className="my-4">
            Hope you're doing well!
          </p>

          <p className="my-4">
            We're working on optimizing job advertising performance for {template.clientName} and would appreciate your recommendation for the following:
          </p>

          <div className="my-4 space-y-2">
            {template.entityType === 'Client' ? (
              <p>Client: {template.clientName}</p>
            ) : template.entityType === 'Campaign' ? (
              <>
                <p>Client: {template.clientName}</p>
                <p>Campaign: {template.entityName}</p>
              </>
            ) : (
              <>
                <p>Client: {template.clientName}</p>
                <p>Job Group: {template.entityName}</p>
              </>
            )}
            
            <p>Recommendation Type(s): {template.recommendationTypes?.join(', ')}</p>

            {template.priority && (
              <p>Priority: {priorityIcons[template.priority]} {priorityDescriptions[template.priority]}</p>
            )}
            
            {template.currentMetrics?.cpcBid !== undefined && (
              <p>Current CPC Bid: {formatCurrency(template.currentMetrics.cpcBid)}</p>
            )}
            
            {template.currentMetrics?.cpaGoal !== undefined && (
              <p>Current CPA Goal: {formatCurrency(template.currentMetrics.cpaGoal)}</p>
            )}
            
            {template.currentMetrics?.budget !== undefined && (
              <p>Current Budget: {formatCurrency(template.currentMetrics.budget)}</p>
            )}
            
            {template.feedUrl && (
              <p>Feed URL: <a href={template.feedUrl} className="text-blue-600 hover:text-blue-800">{template.feedUrl}</a></p>
            )}
            
            {template.landingPage && (
              <p>Landing Page: <a href={template.landingPage} className="text-blue-600 hover:text-blue-800">{template.landingPage}</a></p>
            )}
            
            {template.jobTitles && template.jobTitles.length > 0 && (
              <p>Top 5 Job Titles: {template.jobTitles.slice(0, 5).join(', ')}</p>
            )}
            
            {template.locations && template.locations.length > 0 && (
              <p>Top 5 Locations: {template.locations.slice(0, 5).join(', ')}</p>
            )}
            
            {template.note && (
              <p>Additional Notes: {template.note}</p>
            )}
          </div>

          {template.expiryDate && (
            <p className="my-4">
              Kindly submit your recommendation using the Partner Insights platform by {template.expiryDate}:
            </p>
          )}

          <p className="my-2">
            <a 
              href={template.partnerInsightsUrl}
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Submit Recommendation on Partner Insights
            </a>
          </p>

          <p className="my-4">
            We value your partnership and look forward to your suggestions.
          </p>

          <div className="mt-4">
            <p>Thanks and best regards,</p>
            <p>{user?.name || '[Your Name]'}</p>
            <p>Client Success Executive, Joveo</p>
            <p>{user?.email || '[Email Signature]'}</p>
          </div>
        </div>
      </div>

      {onClose && (
        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            size="sm"
            icon={<X size={16} />}
            onClick={onClose}
          >
            Close Preview
          </Button>
        </div>
      )}
    </div>
  );
};