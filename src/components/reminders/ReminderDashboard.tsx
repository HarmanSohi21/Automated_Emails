import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { EntityTypeBadge } from '../common/EntityTypeBadge';
import { PublisherBadge } from '../common/PublisherBadge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { EmailView } from '../emails/EmailView';
import { ReminderEmailView } from './ReminderEmailView';
import { Dropdown } from '../common/Dropdown';
import { Clock, Mail, BellRing, AlertTriangle, ChevronDown, ChevronUp, History, Eye, Send, TrendingUp } from 'lucide-react';
import { EmailNotification } from '../../types';

type ReminderType = 'New entity notification' | 'Recommendation follow-up';
type ReminderStatus = 'Due Today' | 'Overdue' | 'Needs Manual Follow-up';

interface ReminderItem {
  id: string;
  entityName: string;
  entityType: string;
  publisherName: string;
  status: ReminderStatus;
  reminderCount: number;
  originalSentDate: string;
  originalEmail: EmailNotification;
  followUps?: Array<{
    sentAt: string;
    status: 'Sent' | 'Failed';
  }>;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

export const ReminderDashboard: React.FC = () => {
  const { emailNotifications, publishers, isLoading } = useApp();
  const [showDueToday, setShowDueToday] = useState(true);
  const [showOverdue, setShowOverdue] = useState(true);
  const [reminderTypeFilter, setReminderTypeFilter] = useState<'all' | ReminderType>('all');
  const [publisherFilter, setPublisherFilter] = useState<string>('all');
  const [daysOverdueFilter, setDaysOverdueFilter] = useState<string>('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<ReminderItem | null>(null);
  const [showOriginalEmail, setShowOriginalEmail] = useState(false);
  const [showThreadView, setShowThreadView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Reset to first page when filters change - moved before conditional returns
  React.useEffect(() => {
    setCurrentPage(1);
  }, [reminderTypeFilter, publisherFilter, daysOverdueFilter, entityTypeFilter, itemsPerPage]);

  const reminders = useMemo(() => {
    const now = new Date();

    return emailNotifications
      .filter(notification => notification.sentAt) // Only process notifications that have been sent
      .map(notification => {
        const sentDate = new Date(notification.sentAt!);
        const hoursSince = Math.floor((now.getTime() - sentDate.getTime()) / (1000 * 60 * 60));
        
        let status: ReminderStatus;
        if (hoursSince >= 24 && hoursSince < 72) {
          status = 'Due Today';
        } else if (hoursSince >= 72) {
          status = 'Overdue';
        } else {
          // Less than 24 hours - not ready for reminder yet
          return null;
        }

        return {
          id: notification.id,
          entityName: notification.entityName,
          entityType: notification.entityType,
          publisherName: notification.publisherName,
          status,
          reminderCount: Math.floor(hoursSince / 24),
          originalSentDate: notification.sentAt!,
          originalEmail: notification,
          followUps: []
        };
      })
      .filter((reminder): reminder is ReminderItem => reminder !== null) // Filter out null values and type guard
      .filter(reminder => {
        // Filter by reminder type
        if (reminderTypeFilter !== 'all') {
          // For now, treating all as 'New entity notification'
          // In real app, this would be based on the actual reminder type
          if (reminderTypeFilter !== 'New entity notification') return false;
        }

        // Filter by publisher
        if (publisherFilter !== 'all' && reminder.originalEmail.publisherId !== publisherFilter) {
          return false;
        }

        // Filter by days overdue
        if (daysOverdueFilter !== 'all') {
          const hoursSince = Math.floor((now.getTime() - new Date(reminder.originalSentDate).getTime()) / (1000 * 60 * 60));
          const daysSince = Math.floor(hoursSince / 24);
          
          switch (daysOverdueFilter) {
            case 'today':
              if (daysSince !== 1) return false;
              break;
            case '1-2':
              if (daysSince < 1 || daysSince > 2) return false;
              break;
            case '3+':
              if (daysSince < 3) return false;
              break;
          }
        }

        // Filter by entity type
        if (entityTypeFilter !== 'all' && reminder.entityType !== entityTypeFilter) {
          return false;
        }

        return true;
      });
  }, [emailNotifications, reminderTypeFilter, publisherFilter, daysOverdueFilter, entityTypeFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const dueTodayReminders = reminders.filter(r => r.status === 'Due Today');
  const overdueReminders = reminders.filter(r => r.status === 'Overdue');

  // Pagination for Due Today
  const dueTodayTotalPages = Math.ceil(dueTodayReminders.length / itemsPerPage);
  const paginatedDueTodayReminders = dueTodayReminders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination for Overdue
  const overdueTotalPages = Math.ceil(overdueReminders.length / itemsPerPage);
  const paginatedOverdueReminders = overdueReminders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter options
  const reminderTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'New entity notification', label: 'New Entity Notifications' },
    { value: 'Recommendation follow-up', label: 'Recommendation Follow-ups' }
  ];

  const publisherOptions = [
    { value: 'all', label: 'All Publishers' },
    ...publishers.map(publisher => ({
      value: publisher.id,
      label: publisher.name
    }))
  ];

  const daysOverdueOptions = [
    { value: 'all', label: 'All Days' },
    { value: 'today', label: 'Today' },
    { value: '1-2', label: '1-2 days' },
    { value: '3+', label: '3+ days' }
  ];

  const entityTypeOptions = [
    { value: 'all', label: 'All Entity Types' },
    { value: 'Client', label: 'Client' },
    { value: 'Campaign', label: 'Campaign' },
    { value: 'JobGroup', label: 'Job Group' }
  ];

  const itemsPerPageOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '15', label: '15' }
  ];

  const renderReminderCard = (reminder: ReminderItem) => (
    <div key={reminder.id} className="p-20 bg-white hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-8 mb-8">
            <StatusBadge status={reminder.status} />
            <EntityTypeBadge type={reminder.entityType} />
            <PublisherBadge name={reminder.publisherName} type="Job" />
          </div>
          <p className="subtitle2-medium text-neutral-900 truncate mb-4">
            {reminder.entityName}
          </p>
          <p className="body2-regular text-neutral-600">
            Originally sent: {formatDate(reminder.originalSentDate)} • 
            Reminder count: {reminder.reminderCount}
          </p>
        </div>
        <div className="ml-16 flex-shrink-0 space-x-8">
          <div className="flex items-center space-x-8">
            <Button
              variant="primary"
              size="sm"
              icon={<Eye size={14} />}
              onClick={() => {
                setSelectedReminder(reminder);
                setShowOriginalEmail(true);
              }}
            >
              View Original
            </Button>
          
            <Button
              variant="primary-solid"
              size="sm"
              icon={<Send size={14} />}
              onClick={() => {
                setSelectedReminder(reminder);
                setShowEmailPreview(true);
              }}
            >
              Send Reminder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaginationControls = (totalPages: number, items: ReminderItem[], sectionName: string) => {
    if (totalPages <= 1) return null;

    return (
      <div className="px-20 py-16 bg-neutral-50 border-t border-neutral-200 pagination-container">
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
            <strong>{Math.min(currentPage * itemsPerPage, items.length)}</strong>{' '}
            of <strong>{items.length}</strong> results
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
    );
  };

  if (reminders.length === 0) {
    return (
      <div className="space-y-16">
        {/* Filter Controls */}
        <div className="flex justify-end space-x-8">
          <Dropdown
            options={publisherOptions}
            value={publisherFilter}
            onChange={setPublisherFilter}
            containerWidth="160px"
          />
          <Dropdown
            options={reminderTypeOptions}
            value={reminderTypeFilter}
            onChange={(value) => setReminderTypeFilter(value as 'all' | ReminderType)}
            containerWidth="200px"
          />
          <Dropdown
            options={daysOverdueOptions}
            value={daysOverdueFilter}
            onChange={setDaysOverdueFilter}
            containerWidth="120px"
          />
          <Dropdown
            options={entityTypeOptions}
            value={entityTypeFilter}
            onChange={setEntityTypeFilter}
            containerWidth="160px"
          />
        </div>

        <EmptyState
          title="No reminders"
          description="There are no reminders that need attention at this time."
          icon={<BellRing className="mx-auto h-48 w-48 text-neutral-400" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {/* Filter Controls */}
      <div className="flex justify-end space-x-8">
        <Dropdown
          options={publisherOptions}
          value={publisherFilter}
          onChange={setPublisherFilter}
          containerWidth="160px"
        />
        <Dropdown
          options={reminderTypeOptions}
          value={reminderTypeFilter}
          onChange={(value) => setReminderTypeFilter(value as 'all' | ReminderType)}
          containerWidth="200px"
        />
        <Dropdown
          options={daysOverdueOptions}
          value={daysOverdueFilter}
          onChange={setDaysOverdueFilter}
          containerWidth="120px"
        />
        <Dropdown
          options={entityTypeOptions}
          value={entityTypeFilter}
          onChange={setEntityTypeFilter}
          containerWidth="160px"
        />
      </div>

      {/* Due Today Banner - Warning Style */}
      {dueTodayReminders.length > 0 && (
        <div className="bg-white rounded-xl border border-warning-200 overflow-hidden shadow-sm">
          {/* Banner Header */}
          <div 
            className="flex items-center justify-between p-16 bg-gradient-to-r from-warning-50 to-warning-100 border-b border-warning-200 cursor-pointer hover:from-warning-100 hover:to-warning-150 transition-all duration-200"
            onClick={() => setShowDueToday(!showDueToday)}
          >
            <div className="flex items-center space-x-12">
              <TrendingUp className="h-20 w-20 text-warning-700" />
              <div>
                <h3 className="subtitle1-semibold text-warning-900">
                  {dueTodayReminders.length} reminder{dueTodayReminders.length > 1 ? 's are' : ' is'} due today
                </h3>
                <p className="body2-regular text-warning-700">
                  Follow-up required for publisher responses
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <span className="body2-medium text-warning-700">
                {showDueToday ? 'Hide' : 'Show'} details
              </span>
              {showDueToday ? (
                <ChevronUp className="h-20 w-20 text-warning-700" />
              ) : (
                <ChevronDown className="h-20 w-20 text-warning-700" />
              )}
            </div>
          </div>
          
          {/* Expandable Content */}
          {showDueToday && (
            <div>
              <div className="divide-y divide-neutral-100">
                {paginatedDueTodayReminders.map(renderReminderCard)}
              </div>
              {renderPaginationControls(dueTodayTotalPages, dueTodayReminders, 'Due Today')}
            </div>
          )}
        </div>
      )}

      {/* Overdue Banner - Error Style */}
      {overdueReminders.length > 0 && (
        <div className="bg-white rounded-xl border border-error-200 overflow-hidden shadow-sm">
          {/* Banner Header */}
          <div 
            className="flex items-center justify-between p-16 bg-gradient-to-r from-error-50 to-error-100 border-b border-error-200 cursor-pointer hover:from-error-100 hover:to-error-150 transition-all duration-200"
            onClick={() => setShowOverdue(!showOverdue)}
          >
            <div className="flex items-center space-x-12">
              <AlertTriangle className="h-20 w-20 text-error-700" />
              <div>
                <h3 className="subtitle1-semibold text-error-900">
                  {overdueReminders.length} reminder{overdueReminders.length > 1 ? 's are' : ' is'} overdue
                </h3>
                <p className="body2-regular text-error-700">
                  Immediate attention required for these items
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <span className="body2-medium text-error-700">
                {showOverdue ? 'Hide' : 'Show'} details
              </span>
              {showOverdue ? (
                <ChevronUp className="h-20 w-20 text-error-700" />
              ) : (
                <ChevronDown className="h-20 w-20 text-error-700" />
              )}
            </div>
          </div>
          
          {/* Expandable Content */}
          {showOverdue && (
            <div>
              <div className="divide-y divide-neutral-100">
                {paginatedOverdueReminders.map(renderReminderCard)}
              </div>
              {renderPaginationControls(overdueTotalPages, overdueReminders, 'Overdue')}
            </div>
          )}
        </div>
      )}

      {/* Modal views */}
      {selectedReminder && showEmailPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-16 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-24">
              <div className="flex items-center justify-between mb-16">
                <h2 className="heading-h6">Send Reminder</h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedReminder(null);
                    setShowEmailPreview(false);
                  }}
                >
                  Close
                </Button>
              </div>
              <ReminderEmailView
                originalSubject={selectedReminder.originalEmail.subject}
                originalSentDate={selectedReminder.originalSentDate}
                recipients={selectedReminder.originalEmail.recipients}
                partnerInsightsUrl={selectedReminder.originalEmail.template.partnerInsightsUrl || 'https://partner-insights.example.com'}
                onClose={() => {
                  setSelectedReminder(null);
                  setShowEmailPreview(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {selectedReminder && showOriginalEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-16 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-24">
              <div className="flex items-center justify-between mb-16">
                <h2 className="heading-h6">Original Email</h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedReminder(null);
                    setShowOriginalEmail(false);
                  }}
                >
                  Close
                </Button>
              </div>
              <EmailView
                template={{
                  ...selectedReminder.originalEmail.template,
                  recipients: selectedReminder.originalEmail.recipients,
                  entityType: selectedReminder.originalEmail.entityType,
                  entityName: selectedReminder.originalEmail.entityName
                }}
                onClose={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {selectedReminder && showThreadView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-16 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-24">
              <div className="flex items-center justify-between mb-16">
                <h2 className="heading-h6">Email Thread</h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedReminder(null);
                    setShowThreadView(false);
                  }}
                >
                  Close
                </Button>
              </div>
              <div className="space-y-16">
                <EmailView
                  template={{
                    ...selectedReminder.originalEmail.template,
                    recipients: selectedReminder.originalEmail.recipients,
                    entityType: selectedReminder.originalEmail.entityType,
                    entityName: selectedReminder.originalEmail.entityName
                  }}
                  onClose={() => {}}
                />
                {selectedReminder.followUps?.map((followUp, index) => (
                  <div key={index} className="border rounded-lg p-16">
                    <div className="flex items-center justify-between mb-8">
                      <span className="subtitle2-semibold">
                        Follow-up #{index + 1}
                      </span>
                      <span className={`body2-regular ${
                        followUp.status === 'Sent' ? 'text-success-700' : 'text-error-700'
                      }`}>
                        {followUp.status}
                      </span>
                    </div>
                    <div className="caption-regular text-text-secondary">
                      Sent on {formatDate(followUp.sentAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};