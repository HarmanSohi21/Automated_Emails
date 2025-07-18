import React, { useState } from 'react';
import { Button } from '../common/Button';
import { X, Send } from 'lucide-react';
import { EmailTemplate } from '../../types';
import { Toast } from '../common/Toast';
import { DatePicker } from '../common/DatePicker';

interface EmailViewProps {
  template: EmailTemplate & {
    recipients: string[];
    entityType: string;
    entityName: string;
  };
  onClose?: () => void;
}

export const EmailView: React.FC<EmailViewProps> = ({ template, onClose }) => {
  const [ccEmail, setCcEmail] = useState('');
  const [note, setNote] = useState(template.note || 'Add any additional context or requirements here...');
  const [cpcBid, setCpcBid] = useState(template.cpcBidRequest);
  const [cpaGoal, setCpaGoal] = useState(template.cpaGoalRequest);
  const [budget, setBudget] = useState(template.budget);
  const [feedUrl, setFeedUrl] = useState(template.feedUrl);
  const [landingPage, setLandingPage] = useState(template.sampleLandingPage);
  const [jobTitles, setJobTitles] = useState(template.jobTitles?.join(', ') || '');
  const [locations, setLocations] = useState([...(template.cities || []), ...(template.states || []), ...(template.countries || [])].join(', '));
  const [goLiveDate, setGoLiveDate] = useState<Date | null>(new Date());
  const [showToast, setShowToast] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  const handleNoteFocus = () => {
    if (note === 'Add any additional context or requirements here...') {
      setNote('');
    }
  };

  const handleNoteBlur = () => {
    if (!note.trim()) {
      setNote('Add any additional context or requirements here...');
    }
  };

  const handleMetricChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      if (onClose) onClose();
    }, 2000);
  };

  return (
    <div className="bg-white p-24 rounded-lg">
      <div className="prose max-w-none">
        <div className="mb-24">
          <p className="subtitle2-medium text-text-primary mb-8">To:</p>
          <p className="bg-neutral-50 p-12 rounded body1-regular text-text-secondary">
            {template.recipients.join(', ')}
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
            New {template.entityType} setup for {template.clientName} - {template.entityName}
          </p>
        </div>

        <div className="mb-24 space-y-16">
          <p className="body1-regular text-text-primary">Hi Team,</p>
          <p className="body1-regular text-text-primary">Hope you're doing well!</p>
          
          <p className="body1-regular text-text-primary">
            Joveo has added a new {template.entityType?.toLowerCase() || 'entity'} and would request you validate the goals. 
            Please provide recommendations, if any. Please index the feed attached. The jobs will be added to this feed in a few hours. We thank you for your patience. We would also appreciate your recommendation for the following:
          </p>

          <div className="bg-neutral-50 p-16 rounded-lg space-y-16">
            <p className="body1-regular text-text-primary">
              <span className="body1-semibold">Entity type:</span> {template.entityType}
            </p>
            <p className="body1-regular text-text-primary">
              <span className="body1-semibold">Entity name:</span> {template.entityName}
            </p>
            
            <div>
              <p className="subtitle2-medium text-text-primary mb-8">Current CPC Bid:</p>
              <div className="flex items-center">
                <span className="text-text-secondary mr-8 body1-regular">$</span>
                <input
                  type="number"
                  className="w-32 p-8 border border-neutral-300 rounded body1-regular focus:ring-primary-500 focus:border-primary-500"
                  value={cpcBid}
                  onChange={(e) => handleMetricChange(e, setCpcBid)}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <p className="subtitle2-medium text-text-primary mb-8">Current CPA Goal:</p>
              <div className="flex items-center">
                <span className="text-text-secondary mr-8 body1-regular">$</span>
                <input
                  type="number"
                  className="w-32 p-8 border border-neutral-300 rounded body1-regular focus:ring-primary-500 focus:border-primary-500"
                  value={cpaGoal}
                  onChange={(e) => handleMetricChange(e, setCpaGoal)}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <p className="subtitle2-medium text-text-primary mb-8">Current Budget:</p>
              <div className="flex items-center">
                <span className="text-text-secondary mr-8 body1-regular">$</span>
                <input
                  type="number"
                  className="w-32 p-8 border border-neutral-300 rounded body1-regular focus:ring-primary-500 focus:border-primary-500"
                  value={budget}
                  onChange={(e) => handleMetricChange(e, setBudget)}
                  step="1"
                  min="0"
                />
              </div>
            </div>

            <div>
              <p className="subtitle2-medium text-text-primary mb-8">Feed URL:</p>
              <input
                type="url"
                className="w-full p-8 border border-neutral-300 rounded body1-regular focus:ring-primary-500 focus:border-primary-500"
                value={feedUrl}
                onChange={(e) => setFeedUrl(e.target.value)}
                placeholder="Enter feed URL"
              />
            </div>

            <div>
              <p className="subtitle2-medium text-text-primary mb-8">Landing Page:</p>
              <input
                type="url"
                className="w-full p-8 border border-neutral-300 rounded body1-regular focus:ring-primary-500 focus:border-primary-500"
                value={landingPage}
                onChange={(e) => setLandingPage(e.target.value)}
                placeholder="Enter landing page URL"
              />
            </div>

            <div>
              <p className="subtitle2-medium text-text-primary mb-8">Top 5 Job Titles:</p>
              <input
                type="text"
                className="w-full p-8 border border-neutral-300 rounded body1-regular focus:ring-primary-500 focus:border-primary-500"
                value={jobTitles}
                onChange={(e) => setJobTitles(e.target.value)}
                placeholder="Enter job titles (comma-separated)"
              />
            </div>

            <div>
              <p className="subtitle2-medium text-text-primary mb-8">Top 5 Locations:</p>
              <input
                type="text"
                className="w-full p-8 border border-neutral-300 rounded body1-regular focus:ring-primary-500 focus:border-primary-500"
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                placeholder="Enter locations (comma-separated)"
              />
            </div>

            <div>
              <DatePicker
                label="Go Live Date"
                value={goLiveDate}
                onChange={setGoLiveDate}
                placeholder="Select go live date"
                containerWidth="100%"
              />
            </div>

            <div>
              <p className="subtitle2-medium text-text-primary mb-8">Additional Notes:</p>
              <textarea
                className="w-full p-12 border border-neutral-300 rounded-md body1-regular focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
                value={note}
                onChange={handleNoteChange}
                onFocus={handleNoteFocus}
                onBlur={handleNoteBlur}
              />
            </div>
          </div>

          <p className="body1-regular text-text-primary">
            Kindly validate and submit your recommendation, if any using the Partner Insights platform by{' '}
            {dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}:
          </p>

          <p className="body1-regular">
            <a 
              href={template.partnerInsightsUrl}
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

      {onClose && (
        <div className="mt-24 flex justify-end space-x-8">
          <Button
            variant="primary-solid"
            size="sm"
            icon={<Send size={16} />}
            onClick={handleSendEmail}
            isLoading={isSending}
          >
            Send Email
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<X size={16} />}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      )}

      {showToast && (
        <Toast
          message="Email sent successfully!"
          type="success"
        />
      )}
    </div>
  );
};