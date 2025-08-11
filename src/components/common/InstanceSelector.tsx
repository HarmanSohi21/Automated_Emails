import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Instance } from '../../data/mockData';

interface InstanceSelectorProps {
  instances: Instance[];
  selectedInstance: Instance | null;
  onSelect: (instance: Instance) => void;
  onInstanceSelected?: () => void; // New prop to trigger client selector
  placeholder?: string;
}

export const InstanceSelector: React.FC<InstanceSelectorProps> = ({
  instances,
  selectedInstance,
  onSelect,
  onInstanceSelected,
  placeholder = "Select account"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter instances based on search term
  const filteredInstances = instances.filter(instance =>
    instance.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInstanceSelect = (instance: Instance) => {
    onSelect(instance);
    setIsOpen(false);
    setSearchTerm('');
    
    // Auto-trigger client selector opening
    if (onInstanceSelected) {
      setTimeout(() => {
        onInstanceSelected();
      }, 100);
    }
  };

  const getDisplayContent = () => {
    if (selectedInstance) {
      return (
        <div className="flex flex-col">
          <span className="text-10 font-normal" style={{ color: '#6B7280' }}>Account</span>
          <span className="text-12 font-normal" style={{ color: '#FFFFFF' }}>
            {selectedInstance.name.length > 20 ? selectedInstance.name.substring(0, 20) + '...' : selectedInstance.name}
          </span>
        </div>
      );
    }
    return (
      <span className="text-12 text-white opacity-60">{placeholder}</span>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-6 px-8 py-4 rounded-4 transition-colors min-w-120 max-w-180"
        style={{ 
          backgroundColor: 'transparent',
          borderBottom: selectedInstance ? '2px solid #7689F7' : 'none'
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
        <div className="absolute top-full left-0 mt-2 w-320 bg-white border border-gray-300 rounded-6 shadow-lg overflow-hidden z-50">
          {/* Search Header */}
          <div className="px-12 py-6 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-6 px-8 py-4 bg-gray-50 border border-gray-200 rounded-4">
              <Search size={14} className="text-gray-500 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search accounts"
                className="flex-1 bg-transparent text-12 text-gray-700 placeholder-gray-500 border-none outline-none"
                style={{ fontFamily: 'SF Pro Text' }}
              />
            </div>
          </div>

          {/* Instance List */}
          <div className="max-h-240 overflow-y-auto">
            {/* Section Header */}
            <div className="px-16 py-8 border-b border-gray-200 bg-gray-50">
              <span className="text-12 font-semibold text-gray-600 uppercase tracking-wide">
                Accounts ({filteredInstances.length})
              </span>
            </div>

            {/* Instance Options */}
            <div className="py-2">
              {filteredInstances.length === 0 ? (
                <div className="px-16 py-12 text-center">
                  <div className="text-14 font-medium text-gray-900 mb-2">No results found!</div>
                  <div className="text-12 text-gray-600">Please verify the search term and try again.</div>
                </div>
              ) : (
                filteredInstances.map(instance => {
                  const isSelected = selectedInstance?.id === instance.id;
                  
                  return (
                    <button
                      key={instance.id}
                      onClick={() => handleInstanceSelect(instance)}
                      className={`w-full flex items-center px-12 py-6 text-left hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-6 flex-1">
                        <span className={`text-12 font-medium ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {instance.name}
                        </span>
                        {/* Instance indicator for managed services only */}
                        {instance.id === 'managed-service' && (
                          <span className="text-10 font-medium text-blue-600">
                            Managed Services
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-8 p-8 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSearchTerm('');
              }}
              className="px-12 py-6 text-12 font-medium text-gray-700 border border-gray-300 rounded-4 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSearchTerm('');
              }}
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