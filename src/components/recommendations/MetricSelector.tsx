import React, { useState, useEffect, useRef } from 'react';
import { RecommendationType, PublisherType } from '../../types';
import { ChevronDown, X, Check } from 'lucide-react';

interface MetricSelectorProps {
  publisherType: PublisherType;
  selectedMetrics: RecommendationType[];
  onMetricsChange: (metrics: RecommendationType[]) => void;
  onValidationChange: (isValid: boolean, errors: string[]) => void;
}

// Define valid metric combinations for each publisher type based on documentation
const PUBLISHER_METRIC_RULES: Record<PublisherType, {
  allowedMetrics: RecommendationType[];
  requiredCombinations: RecommendationType[][];
  description: string;
}> = {
  'CPC': {
    allowedMetrics: ['CPC Bid', 'CPA Goal', 'Budget'],
    requiredCombinations: [['CPC Bid'], ['CPA Goal'], ['Budget'], ['CPC Bid', 'CPA Goal'], ['CPC Bid', 'Budget'], ['CPA Goal', 'Budget'], ['CPC Bid', 'CPA Goal', 'Budget']],
    description: 'For CPC publishers, you can request CPC Bid, CPA Goal, and/or Budget recommendations.'
  },
  'CPA': {
    allowedMetrics: ['CPA Goal', 'Budget'],
    requiredCombinations: [['CPA Goal'], ['Budget'], ['CPA Goal', 'Budget']],
    description: 'For CPA publishers, you can request CPA Goal and/or Budget recommendations.'
  },
  'TCPA': {
    allowedMetrics: ['CPC Bid', 'CPA Goal', 'Budget'],
    requiredCombinations: [['CPC Bid'], ['CPA Goal'], ['Budget'], ['CPC Bid', 'CPA Goal'], ['CPC Bid', 'Budget'], ['CPA Goal', 'Budget'], ['CPC Bid', 'CPA Goal', 'Budget']],
    description: 'For TCPA publishers, you can request CPC Bid, CPA Goal, and/or Budget recommendations.'
  },
  'Flat CPC': {
    allowedMetrics: ['CPC Bid', 'CPA Goal', 'Budget'],
    requiredCombinations: [['CPC Bid'], ['CPA Goal'], ['Budget'], ['CPC Bid', 'CPA Goal'], ['CPC Bid', 'Budget'], ['CPA Goal', 'Budget'], ['CPC Bid', 'CPA Goal', 'Budget']],
    description: 'For Flat CPC publishers, you can request CPC Bid, CPA Goal, and/or Budget recommendations.'
  },
  'Flat CPA': {
    allowedMetrics: ['CPA Goal', 'Budget'],
    requiredCombinations: [['CPA Goal'], ['Budget'], ['CPA Goal', 'Budget']],
    description: 'For Flat CPA publishers, you can request CPA Goal and/or Budget recommendations.'
  }
};

export const MetricSelector: React.FC<MetricSelectorProps> = ({
  publisherType,
  selectedMetrics,
  onMetricsChange,
  onValidationChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rules = PUBLISHER_METRIC_RULES[publisherType];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    validateSelection();
  }, [selectedMetrics, publisherType]);

  useEffect(() => {
    // Auto-update metrics when publisher type changes
    const invalidMetrics = selectedMetrics.filter(metric => !rules.allowedMetrics.includes(metric));
    if (invalidMetrics.length > 0) {
      const validMetrics = selectedMetrics.filter(metric => rules.allowedMetrics.includes(metric));
      onMetricsChange(validMetrics);
    }
  }, [publisherType]);

  const validateSelection = () => {
    const errors: string[] = [];
    
    // Only show error if user has made selections but they're invalid
    if (selectedMetrics.length > 0) {
      // Check if the combination is valid
      const isValidCombination = rules.requiredCombinations.some(combination => 
        combination.length === selectedMetrics.length &&
        combination.every(metric => selectedMetrics.includes(metric))
      );
      
      if (!isValidCombination) {
        errors.push(`Please select a valid combination of metrics for ${publisherType} publishers`);
      }
    }

    setValidationErrors(errors);
    onValidationChange(selectedMetrics.length > 0 && errors.length === 0, errors);
  };

  const handleMetricToggle = (metric: RecommendationType) => {
    const newMetrics = selectedMetrics.includes(metric)
      ? selectedMetrics.filter(m => m !== metric)
      : [...selectedMetrics, metric];
    
    onMetricsChange(newMetrics);
  };

  const removeMetric = (metric: RecommendationType) => {
    const newMetrics = selectedMetrics.filter(m => m !== metric);
    onMetricsChange(newMetrics);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const getDisplayContent = () => {
    if (selectedMetrics.length === 0) {
      return (
        <span className="text-14 text-neutral-500">Selected metrics will be mandatory</span>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-6">
        {selectedMetrics.map((metric) => (
          <div
            key={metric}
            className="inline-flex items-center gap-2 px-12 py-2 rounded-full text-12 font-medium"
            style={{ backgroundColor: '#E2E8F0', color: '#3D4759' }}
          >
            <span>{metric}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeMetric(metric);
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
            {/* Metric Options */}
            <div className="max-h-160 overflow-y-auto">
              {rules.allowedMetrics.map(metric => {
                const isSelected = selectedMetrics.includes(metric);
                
                return (
                  <div
                    key={metric}
                    onClick={() => handleMetricToggle(metric)}
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
                      <span className="truncate">{metric}</span>
                    </div>
                    <div className="flex items-center gap-8">
                      {isSelected && (
                        <span className="text-xs font-medium px-6 py-2 rounded-full bg-red-100 text-red-700">
                          Mandatory
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-16 h-16 text-primary-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 