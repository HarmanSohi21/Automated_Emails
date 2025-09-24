import React from 'react';
import { Button } from '../common/Button';
import { X, FileText, AlertTriangle, Send } from 'lucide-react';

interface SendAllWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewAll: () => void;
  onConfirmSendAll: () => void;
  publisherCount: number;
}

export const SendAllWarningModal: React.FC<SendAllWarningModalProps> = ({
  isOpen,
  onClose,
  onPreviewAll,
  onConfirmSendAll,
  publisherCount
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-16 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-24 border-b border-gray-200">
            <div className="flex items-center gap-12">
              <div className="w-40 h-40 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-20 h-20 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                You're about to send all emails
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              icon={<X size={20} />}
              className="p-4 text-gray-400 hover:text-gray-600"
            />
          </div>

          {/* Body */}
          <div className="p-24">
            <div className="space-y-16">
              <p className="text-gray-700 leading-relaxed">
                You haven't previewed all emails. Any unviewed or partially filled emails will still be sent using only the available mandatory fields.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Optional fields that haven't been selected or filled will be omitted from the emails. Please review before proceeding.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-16">
                <div className="flex items-start gap-8">
                  <AlertTriangle className="w-16 h-16 text-amber-600 mt-2 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <strong>Impact:</strong> {publisherCount} publisher{publisherCount !== 1 ? 's' : ''} will receive email notifications without your review.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-12 p-24 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                onPreviewAll();
              }}
              icon={<FileText size={16} />}
            >
              Preview All
            </Button>
            
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onConfirmSendAll();
              }}
              icon={<Send size={16} />}
            >
              Send All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}; 