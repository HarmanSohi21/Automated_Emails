import React, { useState } from 'react';
import { Button } from '../common/Button';
import { X, Send } from 'lucide-react';
import { Toast } from '../common/Toast';

interface ReminderEmailViewProps {
  originalSubject: string;
  originalSentDate: string;
  recipients: string[];
  partnerInsightsUrl: string;
  onClose: () => void;
}

export const ReminderEmailView: React.FC<ReminderEmailViewProps> = ({
  originalSubject,
  originalSentDate,
  recipients,
  partnerInsightsUrl,
  onClose
}) => {
  const [ccEmail, setCcEmail] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleSendReminder = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="bg-white p-24 rounded-lg">
      <div className="prose max-w-none">
        <div className="mb-24">
          <p className="subtitle2-medium text-text-primary mb-8">To:</p>
          <p className="bg-neutral-50 p-12 rounded body1-regular text-text-secondary">
            {recipients.join(', ')}
          </p>
        </div>

        <div className="mb-24">
          <p className="subtitle2-medium text-text-primary mb-8">Cc:</p>
          <input
            type="email"
            className="w-full p-12 border border-neutral-300 rounded body1-regular focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter email addresses (comma-separated)"
            value={ccEmail}
            onChange={(e) => setCcEmail(e.target.value)}
          />
        </div>

        <div className="mb-24">
          <p className="subtitle2-medium text-text-primary mb-8">Subject:</p>
          <p className="body1-regular text-text-primary">
            Reminder - {originalSubject}
          </p>
        </div>

        <div className="mb-24 space-y-16">
          <p className="body1-regular text-text-primary">Hi Team,</p>
          <p className="body1-regular text-text-primary">Hope you're doing well!</p>
          
          <p className="body1-regular text-text-primary">
            This is a reminder for the new entity notification sent on {formatDate(originalSentDate)}. 
            Please provide your response at your earliest convenience.
          </p>

          <div>
            <p className="subtitle2-medium text-text-primary mb-8">Additional Notes:</p>
            <textarea
              className="w-full p-12 border border-neutral-300 rounded-md body1-regular focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Add any additional context or requirements here..."
            />
          </div>

          <p className="body1-regular text-text-primary">
            Kindly validate and submit your recommendation, if any using the Partner Insights platform by{' '}
            {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}:
          </p>

          <p className="body1-regular">
            <a 
              href={partnerInsightsUrl}
              className="text-primary-700 hover:text-primary-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Submit Recommendation on Partner Insights
            </a>
          </p>

          <p className="body1-regular text-text-primary">We value your input and look forward to your suggestions.</p>

          <div className="body1-regular text-text-primary">
            <p>Thanks and best regards,</p>
            <p>Harman Sohi</p>
            <p>Client Success Executive, Joveo</p>
            <p>harman@joveo.com</p>
          </div>
        </div>
      </div>

      <div className="mt-24 flex justify-end space-x-8">
        <Button
          variant="primary-solid"
          size="sm"
          icon={<Send size={16} />}
          onClick={handleSendReminder}
          isLoading={isSending}
        >
          Send Email
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={<X size={16} />}
          onClick={handleClose}
        >
          Close
        </Button>
      </div>

      {showToast && (
        <Toast
          message="Reminder sent successfully!"
          type="success"
        />
      )}
    </div>
  );
};