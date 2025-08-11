import React from 'react';
import { EmailNotification } from '../../types';
import { EmailView } from './EmailView';

interface EmailPreviewModalProps {
  email: EmailNotification;
  onClose: () => void;
}

// A lightweight modal wrapper that shows EmailView. This will be shared by card “Preview” and banner “Preview All”.
export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ email, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-16 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <EmailView
          template={{
            ...email.template,
            recipients: email.recipients,
            entityType: email.entityType,
            entityName: email.entityName,
          }}
          onClose={onClose}
        />
      </div>
    </div>
  );
}; 