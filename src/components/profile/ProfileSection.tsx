import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, User as UserIcon, ChevronDown, Settings, HelpCircle, Globe } from 'lucide-react';
import { ProfileModal } from './ProfileModal';

export const ProfileSection: React.FC = () => {
  const { user, logout } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
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
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-12 px-16 py-8 rounded-lg hover:bg-neutral-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <div className="flex items-center space-x-12">
            {/* HS Avatar Circle */}
            <div 
              className="h-32 w-32 rounded-full flex items-center justify-center ring-2 ring-neutral-300"
              style={{ backgroundColor: '#303F9F' }}
            >
              <span className="text-sm font-semibold text-white">
                {getInitials(user.name)}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-neutral-300">{user.email}</p>
            </div>
          </div>
          <ChevronDown 
            className={`h-16 w-16 text-neutral-300 transition-transform duration-200 ${
              isDropdownOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-8 w-240 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 overflow-hidden">
            {/* User Info Header */}
            <div className="px-16 py-12 bg-neutral-50 border-b border-neutral-200">
              <div className="flex items-center space-x-12">
                {/* HS Avatar Circle in dropdown */}
                <div 
                  className="h-40 w-40 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#303F9F' }}
                >
                  <span className="text-base font-semibold text-white">
                    {getInitials(user.name)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
                  <p className="text-xs text-neutral-600">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-8">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-12 px-16 py-10 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
              >
                <UserIcon className="h-16 w-16 text-neutral-500" />
                <span>Profile</span>
              </button>

              <button
                className="w-full flex items-center space-x-12 px-16 py-10 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
              >
                <Globe className="h-16 w-16 text-neutral-500" />
                <span>English</span>
                <ChevronDown className="h-12 w-12 text-neutral-400 ml-auto" />
              </button>

              <button
                className="w-full flex items-center space-x-12 px-16 py-10 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
              >
                <HelpCircle className="h-16 w-16 text-neutral-500" />
                <span>Help</span>
              </button>

              <div className="border-t border-neutral-200 mt-8 pt-8">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-12 px-16 py-10 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                >
                  <LogOut className="h-16 w-16 text-neutral-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </>
  );
};