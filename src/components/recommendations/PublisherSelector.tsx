import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
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

  const getDisplayContent = () => {
    if (selectedPublishers.length === 0) {
      return (
        <span className="text-14 text-gray-500">Select publishers</span>
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
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-full pl-16 pr-40 py-10 text-sm border bg-white rounded-lg cursor-pointer transition-all duration-200
            ${isOpen 
              ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20' 
              : 'border-neutral-300 hover:border-neutral-400'
            }
          `}
        >
          <div className="flex-1">
            {getDisplayContent()}
          </div>
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
          <div className="absolute z-50 w-full bg-white border border-neutral-200 rounded-lg shadow-xl max-h-240 overflow-y-auto top-full mt-4">
            {/* Publisher Options */}
            <div className="py-4">
              {publishers.length === 0 ? (
                <div className="px-8 py-12 text-14 text-gray-500 text-center">
                  No publishers available for this type
                </div>
              ) : (
                publishers.map(publisher => {
                  const isSelected = selectedPublishers.includes(publisher.id);
                  
                  return (
                    <label 
                      key={publisher.id} 
                      className="flex items-center gap-8 px-8 py-8 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handlePublisherToggle(publisher.id)}
                        className="h-16 w-16 rounded-4 border-gray-300 focus:ring-2 focus:ring-offset-2"
                        style={{ accentColor: '#303F9F' }}
                      />
                      <span className="text-14 text-gray-900">{publisher.name}</span>
                    </label>
                  );
                })
              )}
              
              {/* Apply Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-14 font-semibold py-10 px-8 rounded-8 transition-colors"
                style={{ backgroundColor: '#303F9F', color: 'white' }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Click outside to close */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}; 