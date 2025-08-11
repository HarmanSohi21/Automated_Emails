import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InstanceSelector } from '../common/InstanceSelector';
import { ClientSelector } from '../common/ClientSelector';

export const Header: React.FC = () => {
  const { 
    user, 
    logout, 
    instances,
    selectedInstanceId,
    selectedClientIds,
    setSelectedInstance,
    setSelectedClients,
    getSelectedInstance,
    getAvailableClients
  } = useApp();
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [shouldOpenClientSelector, setShouldOpenClientSelector] = useState(false);

  const selectedInstance = getSelectedInstance();
  const availableClients = getAvailableClients();

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleInstanceSelect = (instance: any) => {
    setSelectedInstance(instance.id);
  };

  const handleInstanceSelected = () => {
    // Auto-open client selector after instance selection
    setShouldOpenClientSelector(true);
  };

  const handleClientSelectorOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setShouldOpenClientSelector(false);
    }
  };

  return (
    <header className="h-56 bg-slate-800 text-white flex items-center justify-between px-21 py-13 relative z-30">
      {/* Left Section - Logo, Title and Selectors */}
      <div className="flex items-center gap-32">
        {/* Joveo Logo and Title */}
        <div className="flex items-center gap-8">
          <div className="w-29 h-30 relative">
            <img 
              src="/Joveo.png" 
              alt="Joveo Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-18 font-medium text-white">Email Manager</h1>
        </div>

        {/* Global Selectors */}
        <div className="flex items-center gap-8">
          {/* Instance Selector */}
          <div className="relative">
            <InstanceSelector
              instances={instances}
              selectedInstance={selectedInstance}
              onSelect={handleInstanceSelect}
              onInstanceSelected={handleInstanceSelected}
            />
          </div>
          
          {/* Client Selector */}
          <div className="relative">
            <ClientSelector
              clients={availableClients}
              selectedClientIds={selectedClientIds}
              onSelectionChange={setSelectedClients}
              shouldOpen={shouldOpenClientSelector}
              onOpenChange={handleClientSelectorOpenChange}
            />
          </div>
        </div>
      </div>

      {/* Right Section - Profile */}
      <div className="relative">
        <button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="flex items-center gap-8 p-8 rounded-8 hover:bg-slate-700 transition-colors"
        >
          <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-14">
            {user ? getUserInitials(user.name) : 'HS'}
          </div>
        </button>

        {/* Profile Dropdown */}
        {showProfileDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowProfileDropdown(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-8 w-200 bg-white rounded-8 shadow-lg border border-gray-200 py-8 z-20">
              <div className="px-16 py-8 border-b border-gray-200">
                <p className="text-14 font-medium text-dark-grey">{user?.name || 'Harman Sohi'}</p>
                <p className="text-12 text-gray-500">{user?.email || 'harman@joveo.com'}</p>
              </div>
              
              <button
                onClick={logout}
                className="w-full flex items-center gap-8 px-16 py-8 text-left text-14 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}; 