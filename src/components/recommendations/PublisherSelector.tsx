import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { Publisher } from '../../types';

interface PublisherSelectorProps {
  publishers: Publisher[];
  selectedPublishers: string[];
  onPublishersChange: (publisherIds: string[]) => void;
}

export const PublisherSelector: React.FC<PublisherSelectorProps> = ({
  publishers,
  selectedPublishers,
  onPublishersChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handlePublisherToggle = (publisherId: string) => {
    const newPublishers = selectedPublishers.includes(publisherId)
      ? selectedPublishers.filter(id => id !== publisherId)
      : [...selectedPublishers, publisherId];
    
    onPublishersChange(newPublishers);
  };

  const removePublisher = (publisherId: string) => {
    const newPublishers = selectedPublishers.filter(id => id !== publisherId);
    onPublishersChange(newPublishers);
  };

  const getSelectedPublisherNames = () => {
    return selectedPublishers.map(id => {
      const publisher = publishers.find(p => p.id === id);
      return publisher?.name || '';
    }).filter(name => name);
  };

  // Filter publishers based on search term
  const filteredPublishers = publishers.filter(publisher =>
    publisher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus the search input when opening
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const getDisplayContent = () => {
    if (selectedPublishers.length === 0) {
      return (
        <span className="text-14 text-neutral-500">Select publishers</span>
      );
    }
    
    const publisherNames = getSelectedPublisherNames();
    return (
      <div className="flex flex-wrap gap-6">
        {publisherNames.map((name, index) => (
          <div
            key={selectedPublishers[index]}
            className="inline-flex items-center gap-2 px-12 py-2 rounded-full text-12 font-medium"
            style={{ backgroundColor: '#E2E8F0', color: '#3D4759' }}
          >
            <span>{name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removePublisher(selectedPublishers[index]);
              }}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-white hover:bg-gray-100 transition-colors"
            >
              <X size={10} style={{ color: '#3D4759' }} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Input Field with Chips */}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={handleToggle}
          className={`
            relative w-full pl-16 pr-40 py-10 text-sm border bg-white rounded-lg cursor-pointer transition-all duration-200
            ${isOpen 
              ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20' 
              : 'border-neutral-300 hover:border-neutral-400'
            }
          `}
        >
          {getDisplayContent()}
          
          <div className="absolute inset-y-0 right-12 flex items-center pointer-events-none">
            <ChevronDown 
              className={`w-16 h-16 text-neutral-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full bg-white border border-neutral-200 rounded-lg shadow-xl max-h-240 overflow-hidden top-full mt-4">
            {/* Search Input */}
            <div className="p-12 border-b border-neutral-100">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search publishers..."
                className="w-full px-12 py-8 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Publisher List - Scrollable */}
            <div className="max-h-160 overflow-y-auto">
              {filteredPublishers.length === 0 ? (
                <div className="px-16 py-12 text-sm text-neutral-500 text-center">
                  {searchTerm ? 'No publishers found' : 'No publishers available for this type'}
                </div>
              ) : (
                filteredPublishers.map(publisher => {
                  const isSelected = selectedPublishers.includes(publisher.id);
                  
                  return (
                    <div
                      key={publisher.id}
                      onClick={() => handlePublisherToggle(publisher.id)}
                      className={`
                        flex items-center justify-between px-16 py-10 text-sm cursor-pointer transition-colors
                        ${isSelected
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-900 hover:bg-neutral-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-8">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by parent div onClick
                          className="h-16 w-16 rounded-4 border-gray-300 focus:ring-2 focus:ring-offset-2 pointer-events-none"
                          style={{ accentColor: '#303F9F' }}
                        />
                        <span className="truncate">{publisher.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-16 h-16 text-primary-600 flex-shrink-0 ml-12" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 