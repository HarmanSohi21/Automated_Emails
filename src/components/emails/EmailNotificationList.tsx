import React, { useState, useEffect } from 'react';
import { Mail, Search, Filter, Send, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { EntityTypeBadge } from '../common/EntityTypeBadge';
import { PublisherBadge } from '../common/PublisherBadge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmailView } from './EmailView';
import { Toast } from '../common/Toast';
import { Input } from '../common/Input';
import { Dropdown } from '../common/Dropdown';
import { EmailNotification } from '../../types';

export const EmailNotificationList: React.FC = () => {
  const { emailNotifications, isLoading, selectedClient, publishers, sendEmail } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [publisherFilter, setPublisherFilter] = useState<string>('all');
  const [showEmailView, setShowEmailView] = useState(false);
  const [showAllEmailsView, setShowAllEmailsView] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  const [showReadyNotification, setShowReadyNotification] = useState(false);
  const [readyEmails, setReadyEmails] = useState<EmailNotification[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const ready = emailNotifications.filter(email => email.status === 'Ready');
    setReadyEmails(ready);
    setShowReadyNotification(ready.length > 0);
  }, [emailNotifications]);

  const filteredEmails = emailNotifications
    .filter(email => {
      if (selectedClient && email.clientName !== selectedClient) {
        return false;
      }

      if (publisherFilter !== 'all' && email.publisherId !== publisherFilter) {
        return false;
      }
      
      if (statusFilter !== 'all' && email.status !== statusFilter) {
        return false;
      }
      
      if (entityFilter !== 'all' && email.entityType !== entityFilter) {
        return false;
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          email.subject.toLowerCase().includes(searchLower) ||
          email.entityName.toLowerCase().includes(searchLower) ||
          email.publisherName.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);
  const paginatedEmails = filteredEmails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, publisherFilter, searchTerm, entityFilter, itemsPerPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const handleView = (email: EmailNotification) => {
    setSelectedEmail(email);
    setShowEmailView(true);
  };

  const handleViewAll = () => {
    setCurrentEmailIndex(0);
    setSelectedEmail(paginatedEmails[0]);
    setShowAllEmailsView(true);
  };

  const handleNextEmail = () => {
    if (currentEmailIndex < paginatedEmails.length - 1) {
      setCurrentEmailIndex(prev => prev + 1);
      setSelectedEmail(paginatedEmails[currentEmailIndex + 1]);
    }
  };

  const handlePreviousEmail = () => {
    if (currentEmailIndex > 0) {
      setCurrentEmailIndex(prev => prev - 1);
      setSelectedEmail(paginatedEmails[currentEmailIndex - 1]);
    }
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSendEmail = async (email: EmailNotification) => {
    try {
      setSendingEmails(prev => new Set([...prev, email.id]));
      await sendEmail({
        entityId: email.entityId,
        recipients: email.recipients,
        subject: email.subject,
        body: JSON.stringify(email.template)
      });
      showSuccessToast(`Email sent successfully to ${email.publisherName}`);
    } catch (error) {
      showErrorToast(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(email.id);
        return newSet;
      });
    }
  };

  const handleSendAllReady = async () => {
    try {
      for (const email of readyEmails) {
        await handleSendEmail(email);
      }
      setShowReadyNotification(false);
      showSuccessToast(`Successfully sent ${readyEmails.length} emails`);
    } catch (error) {
      showErrorToast('Failed to send all emails');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const publisherOptions = [
    { value: 'all', label: 'All Publishers' },
    ...publishers.map(publisher => ({
      value: publisher.id,
      label: publisher.name
    }))
  ];

  const entityOptions = [
    { value: 'all', label: 'All Entities' },
    { value: 'Client', label: 'Client' },
    { value: 'Campaign', label: 'Campaign' },
    { value: 'JobGroup', label: 'Job Group' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Ready', label: 'Ready to be sent' },
    { value: 'Sent', label: 'Sent' }
  ];

  const itemsPerPageOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '15', label: '15' }
  ];

  return (
    <>
      {showReadyNotification && readyEmails.length > 0 && (
        <div className="mb-20 banner">
          <div className="flex items-center space-x-12">
            <div className="p-8 rounded-lg" style={{backgroundColor: 'var(--color-primary-main)'}}>
              <Mail className="h-20 w-20 text-white" />
            </div>
            <div>
              <p className="subtitle2-medium" style={{color: 'var(--color-text-heading)'}}>
                {readyEmails.length} email{readyEmails.length > 1 ? 's are' : ' is'} ready to be sent
              </p>
              <p className="body2-regular">
                Review and send notifications to publishers
              </p>
            </div>
          </div>
          <div className="banner-actions">
            <Button
              variant="primary"
              size="sm"
              icon={<Eye size={14} />}
              onClick={handleViewAll}
            >
              View All
            </Button>
            <Button
              variant="primary-solid"
              size="sm"
              icon={<Send size={14} />}
              onClick={handleSendAllReady}
              isLoading={sendingEmails.size > 0}
            >
              Send All
            </Button>
          </div>
        </div>
      )}

      <Card className="mb-24">
        <div className="mb-20">
          <h2 className="heading-h5 text-slate-900 mb-6">Email Notifications</h2>
          <p className="body2-regular text-slate-600">
            Manage and track email notifications sent to publishers for newly setup entities.
          </p>
        </div>

        <div className="flex justify-between items-center mb-20">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              containerWidth="100%"
            />
          </div>
          
          <div className="flex space-x-8 ml-16">
            <Dropdown
              options={publisherOptions}
              value={publisherFilter}
              onChange={setPublisherFilter}
              containerWidth="160px"
            />

            <Dropdown
              options={entityOptions}
              value={entityFilter}
              onChange={setEntityFilter}
              containerWidth="140px"
            />
            
            <Dropdown
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              containerWidth="160px"
            />
          </div>
        </div>

        {filteredEmails.length === 0 ? (
          <EmptyState
            title="No notifications found"
            description="No email notifications match your current filters."
            icon={<Mail className="mx-auto h-48 w-48 text-neutral-400" />}
          />
        ) : (
          <>
            <div className="space-y-16">
              {paginatedEmails.map((email) => (
                <div 
                  key={email.id} 
                  className="p-20 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 cursor-pointer"
                  onClick={() => setExpandedEmailId(expandedEmailId === email.id ? null : email.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-8 mb-8">
                        <StatusBadge status={email.status} />
                        <EntityTypeBadge type={email.entityType} />
                        <PublisherBadge name={email.publisherName} type="Job" />
                      </div>
                      <p className="subtitle2-medium text-text-primary mb-4 truncate">
                        {email.subject}
                      </p>
                      <p className="body2-regular text-text-secondary">
                        Created: {formatDate(email.createdAt)}
                        {email.sentAt && ` • Sent: ${formatDate(email.sentAt)}`}
                      </p>
                    </div>
                    <div className="ml-16 flex-shrink-0 space-x-8">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(email);
                        }}
                      >
                        View
                      </Button>
                      {email.status === 'Ready' && (
                        <Button
                          variant="primary-solid"
                          size="sm"
                          icon={<Send size={14} />}
                          isLoading={sendingEmails.has(email.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendEmail(email);
                          }}
                        >
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {expandedEmailId === email.id && (
                    <div className="mt-20 bg-neutral-50 p-20 rounded-lg border border-neutral-200">
                      <h4 className="subtitle2-medium text-text-primary mb-12">Email Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 body2-regular">
                        <div>
                          <p className="text-text-secondary mb-4">Recipients:</p>
                          <p className="body2-medium text-text-primary">{email.recipients.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary mb-4">Entity Type:</p>
                          <p className="body2-medium text-text-primary">{email.entityType}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary mb-4">Publisher:</p>
                          <p className="body2-medium text-text-primary">{email.publisherName}</p>
                        </div>
                        {email.status === 'Failed' && email.errorMessage && (
                          <div className="col-span-2">
                            <p className="text-text-secondary mb-4">Error Message:</p>
                            <p className="body2-medium text-error-600">{email.errorMessage}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-24 pagination-container bg-white border-t border-slate-200">
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
                    <strong>{Math.min(currentPage * itemsPerPage, filteredEmails.length)}</strong>{' '}
                    of <strong>{filteredEmails.length}</strong> results
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

      {showAllEmailsView && selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-16 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-16 border-b border-neutral-200 flex justify-between items-center">
              <div className="flex items-center space-x-8">
                <button
                  className="text-slate-600 hover:text-slate-900"
                  onClick={handlePreviousEmail}
                  disabled={currentEmailIndex === 0}
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  {currentEmailIndex + 1} of {paginatedEmails.length}
                </span>
                <button
                  className="text-slate-600 hover:text-slate-900"
                  onClick={handleNextEmail}
                  disabled={currentEmailIndex === paginatedEmails.length - 1}
                >
                  Next
                </button>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAllEmailsView(false)}
              >
                Close
              </Button>
            </div>
            <div className="p-24">
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

      {showEmailView && selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-16 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-16 border-b border-neutral-200 flex justify-between items-center bg-gradient-to-r from-neutral-50 to-white">
              <h2 className="subtitle1-semibold text-text-primary">Email Preview</h2>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowEmailView(false);
                  setSelectedEmail(null);
                }}
              >
                Close
              </Button>
            </div>
            <div className="p-24">
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
        </div>
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
        />
      )}
    </>
  );
};