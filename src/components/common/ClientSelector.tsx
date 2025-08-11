import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { Client } from '../../types';

interface ClientSelectorProps {
  clients: Client[];
  selectedClientIds: string[];
  onSelectionChange: (clientIds: string[]) => void;
  shouldOpen?: boolean; // New prop to auto-open
  onOpenChange?: (isOpen: boolean) => void; // New prop to notify parent
  placeholder?: string;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  selectedClientIds,
  onSelectionChange,
  shouldOpen = false,
  onOpenChange,
  placeholder = "Select clients"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-open when shouldOpen changes to true
  useEffect(() => {
    if (shouldOpen && !isOpen) {
      setIsOpen(true);
      if (onOpenChange) {
        onOpenChange(true);
      }
    }
  }, [shouldOpen, isOpen, onOpenChange]);

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected client names for display
  const getSelectedClientNames = (): string[] => {
    return selectedClientIds.map(id => {
      const client = clients.find(c => c.id === id);
      return client?.name || '';
    }).filter(name => name);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onOpenChange]);

  const handleClientToggle = (clientId: string) => {
    const newSelection = selectedClientIds.includes(clientId)
      ? selectedClientIds.filter(id => id !== clientId)
      : [...selectedClientIds, clientId];
    
    onSelectionChange(newSelection);
  };

  const removeClient = (clientId: string) => {
    const newSelection = selectedClientIds.filter(id => id !== clientId);
    onSelectionChange(newSelection);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const truncateText = (text: string, maxLength: number = 20): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getDisplayContent = () => {
    if (selectedClientIds.length === 0) {
      return (
        <div className="flex flex-col">
          <span className="text-10 font-normal" style={{ color: '#6B7280' }}>Clients</span>
          <span className="text-12 font-normal text-white opacity-60">{placeholder}</span>
        </div>
      );
    }
    
    const clientNames = getSelectedClientNames();
    const displayText = clientNames.length <= 2 
      ? clientNames.map(name => truncateText(name, 12)).join(', ')
      : `${truncateText(clientNames[0], 12)}, ${truncateText(clientNames[1], 12)} +${clientNames.length - 2}`;
    
    return (
      <div className="flex flex-col">
        <span className="text-10 font-normal" style={{ color: '#6B7280' }}>Clients</span>
        <span className="text-12 font-normal" style={{ color: '#FFFFFF' }}>{displayText}</span>
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        type="button"
        onClick={() => {
          const newIsOpen = !isOpen;
          setIsOpen(newIsOpen);
          if (onOpenChange) {
            onOpenChange(newIsOpen);
          }
        }}
        className="flex items-center gap-6 px-8 py-4 rounded-4 transition-colors min-w-120 max-w-200"
        style={{ 
          backgroundColor: 'transparent',
          borderBottom: selectedClientIds.length > 0 ? '2px solid #7689F7' : 'none'
        }}
      >
        <div className="flex-1 text-left">
          {getDisplayContent()}
        </div>
        <ChevronDown 
          size={14} 
          className={`text-white transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-360 bg-white border border-gray-300 rounded-6 shadow-lg overflow-hidden z-50">
          {/* Search Header */}
          <div className="px-12 py-6 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-6 px-8 py-4 bg-gray-50 border border-gray-200 rounded-4">
              <Search size={14} className="text-gray-500 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clients"
                className="flex-1 bg-transparent text-12 text-gray-700 placeholder-gray-500 border-none outline-none"
                style={{ fontFamily: 'SF Pro Text' }}
              />
            </div>
          </div>

          {/* Client List */}
          <div className="max-h-240 overflow-y-auto">
            {/* Section Header */}
            <div className="px-16 py-8 border-b border-gray-200 bg-gray-50">
              <span className="text-12 font-semibold text-gray-600 uppercase tracking-wide">
                Clients ({filteredClients.length})
              </span>
            </div>

            {/* Client Options */}
            <div className="py-2">
              {filteredClients.length === 0 ? (
                <div className="px-16 py-12 text-center">
                  <div className="text-14 font-medium text-gray-900 mb-2">No results found!</div>
                  <div className="text-12 text-gray-600">Please verify the search term and try again.</div>
                </div>
              ) : (
                filteredClients.map(client => {
                  const isSelected = selectedClientIds.includes(client.id);
                  
                  return (
                    <div
                      key={client.id}
                      className="flex items-center justify-between px-12 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-6 flex-1 min-w-0">
                        {/* Client name and new badge */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <span className="text-12 font-medium text-gray-900 truncate">
                            {client.name}
                          </span>
                          {/* Show "New" badge for some clients */}
                          {client.id.includes('geico') && (
                            <div className="px-4 py-1 bg-green-100 text-green-800 text-10 font-semibold rounded-full flex-shrink-0">
                              New
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Selection Checkbox */}
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleClientToggle(client.id)}
                            className="h-12 w-12 rounded-3 border-gray-300 focus:ring-2 focus:ring-offset-2"
                            style={{ accentColor: '#303F9F' }}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Clients Chips (if any) */}
          {selectedClientIds.length > 0 && (
            <div className="px-12 py-6 border-t border-gray-200 bg-gray-50">
              <div className="text-10 font-medium text-gray-600 mb-4">Selected:</div>
              <div className="flex flex-wrap gap-3">
                {getSelectedClientNames().map((name, index) => (
                  <div
                    key={selectedClientIds[index]}
                    className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-10 font-medium"
                    style={{ backgroundColor: '#E2E8F0', color: '#3D4759' }}
                  >
                    <span>{truncateText(name, 10)}</span>
                    <button
                      type="button"
                      onClick={() => removeClient(selectedClientIds[index])}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-100 transition-colors"
                    >
                      <X size={6} style={{ color: '#3D4759' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-8 p-8 border-t border-gray-200 bg-white">
            <button
              type="button"
              onClick={handleClose}
              className="px-12 py-6 text-12 font-medium text-gray-700 border border-gray-300 rounded-4 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-12 py-6 text-12 font-medium text-white rounded-4 transition-colors"
              style={{ backgroundColor: '#303F9F' }}
            >
              Select
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 