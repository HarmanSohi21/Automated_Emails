import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { SendEmailPayload } from '../../types';
import { Mail } from 'lucide-react';

export const SendEmailForm: React.FC = () => {
  const { entities, sendEmail, isLoading } = useApp();
  const [formData, setFormData] = useState<SendEmailPayload>({
    entityId: '',
    recipients: [],
    subject: '',
    body: '',
  });
  const [recipientsInput, setRecipientsInput] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecipientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientsInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse recipients
    const recipients = recipientsInput
      .split(',')
      .map(email => email.trim())
      .filter(email => email !== '');
    
    if (recipients.length === 0) {
      setError('Please enter at least one recipient email address');
      return;
    }
    
    if (!formData.entityId) {
      setError('Please select an entity');
      return;
    }
    
    if (!formData.subject.trim()) {
      setError('Please enter a subject');
      return;
    }
    
    setError(null);
    
    try {
      await sendEmail({
        ...formData,
        recipients,
      });
      
      // Reset form
      setFormData({
        entityId: '',
        recipients: [],
        subject: '',
        body: '',
      });
      setRecipientsInput('');
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Card title="Send Email Notification">
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          Email notification created successfully and is being processed!
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="entityId" className="block text-sm font-medium text-gray-700">
              Select Entity
            </label>
            <select
              id="entityId"
              name="entityId"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={formData.entityId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select entity...</option>
              {entities?.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {entity.name} ({entity.type}) - {entity.clientName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
              Recipients (comma-separated)
            </label>
            <input
              type="text"
              id="recipients"
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="email@example.com, another@example.com"
              value={recipientsInput}
              onChange={handleRecipientsChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="Email subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700">
              Email Body
            </label>
            <textarea
              id="body"
              name="body"
              rows={4}
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter email content here..."
              value={formData.body}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary-solid"
              isLoading={isLoading}
              icon={<Mail size={16} />}
            >
              Send Notification
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};