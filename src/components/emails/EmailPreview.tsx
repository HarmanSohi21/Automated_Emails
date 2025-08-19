import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { X, ChevronLeft, ChevronRight, Send, Edit3, TrendingUp, Check, AlertTriangle, AlertCircle, Clock, Minus } from 'lucide-react';
import { Priority } from '../../types';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';

interface EmailPreviewProps {
  template: {
    entityType?: 'Client' | 'Campaign' | 'JobGroup';
    entityName: string;
    clientName: string;
    currentMetrics?: {
      budget?: number;
      cpcBid?: number;
      cpaGoal?: number;
    } | Array<{
      budget?: number;
      cpcBid?: number;
      cpaGoal?: number;
    }>;
    feedUrl?: string;
    landingPage?: string;
    jobTitles?: string[];
    locations?: string[];
    note?: string;
    expiryDate?: string;
    partnerInsightsUrl: string;
    recommendationTypes?: string[];
    priority?: Priority;
    duration?: string;
  };
  publishers?: Array<{ name: string; email: string[] }>;
  user?: {
    name: string;
    email: string;
  };
  onClose?: () => void;
}

const priorityLabels: Record<Priority, string> = {
  'Urgent': 'Urgent / Critical — Immediate attention',
  'High': 'High — Action within 2 business days',
  'Medium': 'Medium — Action within 3–5 business days',
  'Low': 'Low — Action within 7 days (as bandwidth allows)'
};

const priorityColors: Record<Priority, string> = {
  'Urgent': 'bg-red-100 text-red-700 border-red-200',
  'High': 'bg-orange-100 text-orange-700 border-orange-200',
  'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Low': 'bg-gray-100 text-gray-700 border-gray-200'
};

const priorityIcons: Record<Priority, React.ComponentType<any>> = {
  'Urgent': AlertTriangle,
  'High': AlertCircle,
  'Medium': Clock,
  'Low': Minus
};

// Enhanced Toast Component
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

export const EmailPreview: React.FC<EmailPreviewProps> = ({ 
  template, 
  publishers = [], 
  user,
  onClose 
}) => {
  const [currentPublisherIndex, setCurrentPublisherIndex] = useState(0);
  const [ccRecipients, setCcRecipients] = useState('');
  
  // Generate subject line based on priority and client name
  const generateSubjectLine = () => {
    const priorityPrefix = template.priority && template.priority !== 'Low' ? 
      `[${template.priority} Priority] ` : '';
    const clientName = template.clientName || 'Client';
    return `${priorityPrefix}Request for Recommendation – ${clientName}`;
  };

  const [subject, setSubject] = useState(generateSubjectLine());

  // Get current publisher metrics based on index
  const getCurrentMetrics = () => {
    if (Array.isArray(template.currentMetrics)) {
      return template.currentMetrics[currentPublisherIndex] || { budget: 0, cpcBid: 0, cpaGoal: 0 };
    }
    return template.currentMetrics || { budget: 0, cpcBid: 0, cpaGoal: 0 };
  };

  const currentMetrics = getCurrentMetrics();
  const [cpcBid, setCpcBid] = useState((currentMetrics.cpcBid || 0).toString());
  const [cpaGoal, setCpaGoal] = useState((currentMetrics.cpaGoal || 0).toString());
  const [budget, setBudget] = useState((currentMetrics.budget || 0).toString());
  const [additionalNote, setAdditionalNote] = useState(template.note || '');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Track which fields have been manually cleared to prevent auto-reset
  const [userClearedFields, setUserClearedFields] = useState<Set<string>>(new Set());

  // Update metrics when publisher changes, but only if user hasn't manually cleared them
  useEffect(() => {
    const metrics = getCurrentMetrics();
    if (!userClearedFields.has('cpcBid')) {
      setCpcBid((metrics.cpcBid || 0).toString());
    }
    if (!userClearedFields.has('cpaGoal')) {
      setCpaGoal((metrics.cpaGoal || 0).toString());
    }
    if (!userClearedFields.has('budget')) {
      setBudget((metrics.budget || 0).toString());
    }
  }, [currentPublisherIndex, userClearedFields]);

  // Update subject when template changes
  useEffect(() => {
    setSubject(generateSubjectLine());
  }, [template.priority, template.clientName]);

  const clearField = (field: 'cpcBid' | 'cpaGoal' | 'budget') => {
    // Mark field as manually cleared
    setUserClearedFields(prev => new Set(prev).add(field));
    
    switch (field) {
      case 'cpcBid':
        setCpcBid('');
        break;
      case 'cpaGoal':
        setCpaGoal('');
        break;
      case 'budget':
        setBudget('');
        break;
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
      setToastMessage(`Email sent successfully to ${currentPublisher?.name || 'publisher'}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (error) {
      setToastMessage('Failed to send email. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handlePrevious = () => {
    setCurrentPublisherIndex((prev) => (prev > 0 ? prev - 1 : publishers.length - 1));
  };

  const handleNext = () => {
    setCurrentPublisherIndex((prev) => (prev < publishers.length - 1 ? prev + 1 : 0));
  };

  const currentPublisher = publishers[currentPublisherIndex];

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-24 py-16">
        {/* Navigation and Actions */}
        <div className="flex items-center justify-between mb-16">
          {/* Publisher Navigation */}
          <div className="flex items-center gap-16">
            {publishers.length > 1 && (
              <>
          <button
            onClick={handlePrevious}
                  className="p-8 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={publishers.length <= 1}
          >
                  <ChevronLeft size={20} className="text-gray-600" />
          </button>
                <span className="text-14 text-gray-600 font-medium min-w-100 text-center">
                  {currentPublisherIndex + 1} of {publishers.length}
          </span>
          <button
            onClick={handleNext}
                  className="p-8 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={publishers.length <= 1}
          >
                  <ChevronRight size={20} className="text-gray-600" />
          </button>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-12">
            <Button
              variant="secondary"
              onClick={handleClose}
              icon={<X size={16} />}
              className="h-40 px-16"
            >
              Close
            </Button>
            {emailSent ? (
              <div className="flex items-center gap-8 px-16 py-8 bg-green-100 text-green-700 rounded-lg h-40">
                <Check size={16} />
                <span className="text-14 font-medium">Email Sent</span>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={handleSendEmail}
                isLoading={isSending}
                icon={<Send size={16} />}
                className="h-40 px-16"
              >
                {isSending ? 'Sending...' : 'Send Email'}
              </Button>
            )}
          </div>
        </div>

        {/* Email Subject */}
        <div className="mb-16">
          <h2 className="text-18 font-medium text-gray-900 leading-relaxed">
            Request for {template.recommendationTypes?.join(', ') || 'Performance'} Recommendation – {template.clientName}
          </h2>
        </div>

        {/* Email Recipients */}
        <div className="space-y-12">
          <div className="flex items-start">
            <span className="text-14 text-gray-600 font-medium w-email-label flex-shrink-0">To:</span>
            <span className="text-14 text-gray-900 flex-1 ml-24">
              {currentPublisher?.email.join(', ') || 'publisher@example.com'}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-14 text-gray-600 font-medium w-email-label flex-shrink-0">Cc:</span>
            <div className="flex-1 ml-24">
              <Input
            type="text"
            placeholder="Enter email addresses (comma-separated)"
                value={ccRecipients}
                onChange={(e) => setCcRecipients(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-14 text-gray-600 font-medium w-email-label flex-shrink-0">Subject:</span>
            <div className="flex-1 ml-24">
              <Input
                type="text"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        </div>

      {/* Email Content - Following Figma Design */}
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
                    Dear {currentPublisher?.name || 'Partner'} Team,
                  </p>
                  
                  <p className="text-14 leading-relaxed">
            Hope you're doing well!
          </p>

                  <p className="text-14 leading-relaxed">
                    We're working on optimizing performance for <strong>{template.clientName}</strong> and would appreciate your recommendation for the following:
                  </p>
                </div>

                {/* Combined Content Box */}
                <div style={{ backgroundColor: '#E8EAF6' }} className="border rounded-8 p-24">
                  {/* Request Details Section */}
                  <div className="mb-32">
                    <h3 className="text-16 font-semibold mb-16 flex items-center gap-8" style={{ color: '#374151' }}>
                      <Edit3 size={16} />
                      Recommendation Request Details
                    </h3>
                    
                    <div className="space-y-12 text-14">
                      <div className="grid grid-cols-3 gap-12">
                        <span className="font-medium" style={{ color: '#6B7280' }}>Client:</span>
                        <span className="col-span-2" style={{ color: '#374151' }}>{template.clientName}</span>
                      </div>
                      
                      {template.entityType !== 'Client' && (
                        <div className="grid grid-cols-3 gap-12">
                          <span className="font-medium" style={{ color: '#6B7280' }}>
                            {template.entityType}:
                          </span>
                          <span className="col-span-2" style={{ color: '#374151' }}>{template.entityName}</span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-3 gap-12">
                        <span className="font-medium" style={{ color: '#6B7280' }}>Requested Metrics:</span>
                        <div className="flex flex-wrap gap-8 col-span-2">
                          {template.recommendationTypes?.map((metric, index) => (
                            <span key={index} className="inline-flex items-center px-8 py-4 rounded-full text-12 font-medium bg-red-100 text-red-800 border border-red-200">
                              {metric} (Mandatory)
                            </span>
                          ))}
                        </div>
                      </div>

                      {template.duration && (
                        <div className="grid grid-cols-3 gap-12">
                          <span className="font-medium" style={{ color: '#6B7280' }}>Duration:</span>
                          <span className="col-span-2" style={{ color: '#374151' }}>{template.duration}</span>
                        </div>
                      )}

                      {template.priority && (
                        <div className="grid grid-cols-3 gap-12 items-start">
                          <span className="font-medium" style={{ color: '#6B7280' }}>Priority:</span>
                          <div className="col-span-2">
                            <div className="flex items-center gap-8">
                              {(() => {
                                const IconComponent = priorityIcons[template.priority];
                                const iconColor = template.priority === 'Urgent' ? 'text-red-600' : 
                                                 template.priority === 'High' ? 'text-orange-600' : 
                                                 template.priority === 'Medium' ? 'text-yellow-600' : 'text-gray-600';
                                return <IconComponent size={16} className={iconColor} />;
                              })()}
                              <span className="text-14" style={{ color: '#374151' }}>
                                {priorityLabels[template.priority]}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Current Performance Metrics Section */}
                  <div className="mb-32">
                    <h3 className="text-16 font-semibold mb-16 flex items-center gap-8" style={{ color: '#374151' }}>
                      <TrendingUp size={16} />
                      Current Performance Metrics
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                      {/* CPC Bid */}
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <label className="block text-12 font-medium" style={{ color: '#3D4759' }}>
                            Current CPC Bid
                          </label>
                          {cpcBid && cpcBid.length > 0 && (
                            <button
                              type="button"
                              onClick={() => clearField('cpcBid')}
                              className="text-12 font-normal text-blue-600 hover:text-blue-800 transition-colors"
                              style={{ color: '#303F9F' }}
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            type="text"
                            value={cpcBid}
                            onChange={(e) => {
                              setCpcBid(e.target.value);
                              // Remove from cleared fields when user types
                              if (e.target.value) {
                                setUserClearedFields(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete('cpcBid');
                                  return newSet;
                                });
                              }
                            }}
                            placeholder="Enter CPC Bid value"
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
                          <label className="block text-12 font-medium" style={{ color: '#3D4759' }}>
                            Current CPA Goal
                          </label>
                          {cpaGoal && cpaGoal.length > 0 && (
                            <button
                              type="button"
                              onClick={() => clearField('cpaGoal')}
                              className="text-12 font-normal text-blue-600 hover:text-blue-800 transition-colors"
                              style={{ color: '#303F9F' }}
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            type="text"
                            value={cpaGoal}
                            onChange={(e) => {
                              setCpaGoal(e.target.value);
                              // Remove from cleared fields when user types
                              if (e.target.value) {
                                setUserClearedFields(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete('cpaGoal');
                                  return newSet;
                                });
                              }
                            }}
                            placeholder="Enter CPA Goal value"
                            style={{ paddingLeft: '45px !important' }}
                            className="!pl-45"
                          />
                          <span className="absolute left-16 top-1/2 transform -translate-y-1/2 text-14 text-gray-500 pointer-events-none">
                            $
                          </span>
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <label className="block text-12 font-medium" style={{ color: '#3D4759' }}>
                            <span className="text-red-500">*</span> Current Budget
                          </label>
                          {budget && budget.length > 0 && (
                            <button
                              type="button"
                              onClick={() => clearField('budget')}
                              className="text-12 font-normal text-blue-600 hover:text-blue-800 transition-colors"
                              style={{ color: '#303F9F' }}
                            >
                              Clear
                            </button>
                          )}
          </div>
                        <div className="relative">
                          <Input
                            type="text"
                            value={budget}
                            onChange={(e) => {
                              setBudget(e.target.value);
                              // Remove from cleared fields when user types
                              if (e.target.value) {
                                setUserClearedFields(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete('budget');
                                  return newSet;
                                });
                              }
                            }}
                            placeholder="Enter Budget value"
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

                  {/* Next Steps Section */}
                  <div>
                    <h3 className="text-16 font-semibold mb-16" style={{ color: '#374151' }}>
                      Next Steps
                    </h3>

          {template.expiryDate && (
                      <p className="mb-12 text-14 leading-relaxed" style={{ color: '#374151' }}>
                        <strong>Deadline:</strong> Please submit your recommendation using the Partner Insights platform by <strong>{template.expiryDate}</strong>
            </p>
          )}

                    <div className="flex items-center gap-8">
            <a 
              href={template.partnerInsightsUrl}
                        className="font-medium underline"
                        style={{ color: '#303F9F' }}
              target="_blank"
              rel="noopener noreferrer"
            >
                        Submit Recommendation on Partner Insights
                      </a>
                    </div>
                  </div>
                </div>

                {/* Additional Information - Separate Box if Needed */}
                {(template.feedUrl || template.landingPage || additionalNote) && (
                  <div style={{ backgroundColor: '#FFFBEB' }} className="border border-amber-200 rounded-8 p-20">
                    <h3 className="text-16 font-semibold mb-16" style={{ color: '#374151' }}>
                      Additional Information
                    </h3>
                    <div className="space-y-12 text-14">
                      {template.feedUrl && (
                        <div>
                          <span className="font-medium block mb-4" style={{ color: '#374151' }}>Feed URL:</span>
                          <a href={template.feedUrl} className="underline" style={{ color: '#303F9F' }}>
                            {template.feedUrl}
                          </a>
                        </div>
                      )}
                      
                      {template.landingPage && (
                        <div>
                          <span className="font-medium block mb-4" style={{ color: '#374151' }}>Landing Page:</span>
                          <a href={template.landingPage} className="underline" style={{ color: '#303F9F' }}>
                            {template.landingPage}
                          </a>
                        </div>
                      )}
                      
                      {additionalNote && (
                        <div>
                          <span className="font-medium block mb-4" style={{ color: '#374151' }}>Notes:</span>
                          <Textarea
                            value={additionalNote}
                            onChange={(e) => setAdditionalNote(e.target.value)}
                            placeholder="Any additional context or requirements..."
                            rows={3}
                            className="w-full"
                          />
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
                  <p className="font-medium text-14">{user?.name || 'Harman Sohi'}</p>
                  <p className="text-12 text-gray-600">Client Success Executive, Joveo</p>
                  <p className="text-12" style={{ color: '#303F9F' }}>{user?.email || 'harman@joveo.com'}</p>
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

      {/* Enhanced Toast */}
      {showToast && (
        <EnhancedToast 
          message={toastMessage} 
          type={toastMessage.includes('successfully') ? 'success' : 'error'} 
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};