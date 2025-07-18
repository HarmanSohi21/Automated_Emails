import React, { useState } from 'react';
import { X, User as UserIcon } from 'lucide-react';
import { User as AppUser } from '../../types';
import { Button } from '../common/Button';

interface ProfileModalProps {
  user: AppUser;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose }) => {
  const [firstName, setFirstName] = useState(user.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user.name.split(' ').slice(1).join(' ') || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setFirstName(user.name.split(' ')[0] || '');
    setLastName(user.name.split(' ').slice(1).join(' ') || '');
    onClose();
  };

  // Get user initials
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-16 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-24 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Profile</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors p-4 rounded-md hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-24">
          {/* Profile Picture */}
          <div className="flex justify-center mb-24">
            {/* HS Avatar Circle in modal */}
            <div 
              className="h-80 w-80 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#303F9F' }}
            >
              <span className="text-2xl font-semibold text-white">
                {getInitials(user.name)}
              </span>
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="text-center mb-24">
            <p className="text-sm text-neutral-600">{user.email}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-20">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-8">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-16 py-12 text-sm border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-8">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-16 py-12 text-sm border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-12 p-24 border-t border-neutral-200 bg-neutral-50 rounded-b-lg">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary-solid"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};