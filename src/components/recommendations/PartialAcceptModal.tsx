import React, { useState } from 'react';
import { Button } from '../common/Button';
import { X, Check, DollarSign, Target, Zap } from 'lucide-react';

interface MetricOption {
  currentValue: number;
  recommendedValue: number;
}

interface PartialAcceptModalProps {
  onClose: () => void;
  onAccept: (selectedMetrics: string[], rejectionReasons: Record<string, string>) => void;
  metrics: {
    cpc: MetricOption;
    cpa: MetricOption;
    budget: MetricOption;
  };
}

export const PartialAcceptModal: React.FC<PartialAcceptModalProps> = ({
  onClose,
  onAccept,
  metrics
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  const handleToggleMetric = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value >= 100 ? 0 : 2,
      maximumFractionDigits: value >= 100 ? 0 : 2,
    }).format(value);
  };

  const calculateChange = (current: number, recommended: number) => {
    const percentChange = ((recommended - current) / current) * 100;
    const isIncrease = percentChange > 0;
    const formattedChange = Math.abs(percentChange).toFixed(1);
    return (
      <span className={isIncrease ? 'text-red-600' : 'text-emerald-600'}>
        ({isIncrease ? '+' : '-'}{formattedChange}%)
      </span>
    );
  };

  const handleSubmit = () => {
    onAccept(selectedMetrics, rejectionReasons);
    onClose();
  };

  const isSubmitDisabled = () => {
    if (selectedMetrics.length === 0) return true;
    
    // Check if all unselected metrics have rejection reasons
    const missingReasons = unselectedMetrics.some(metric => !rejectionReasons[metric]?.trim());
    return missingReasons;
  };

  const handleRejectionReasonChange = (metric: string, reason: string) => {
    setRejectionReasons(prev => ({
      ...prev,
      [metric]: reason
    }));
  };

  const allMetrics = ['CPC', 'CPA', 'Budget'];
  const unselectedMetrics = allMetrics.filter(metric => !selectedMetrics.includes(metric));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-16 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-24 py-20 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <h2 className="subtitle1-semibold text-slate-900">Partially Accept Recommendations</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 transition-colors p-4 rounded-md hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-24 py-24">
          <p className="body1-regular text-slate-600 mb-24">
            Select the metrics you want to accept. Unselected metrics will remain unchanged.
          </p>
          
          <div className="space-y-20">
            {/* CPC Metric */}
            <div className="flex items-start p-20 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                id="cpc"
                checked={selectedMetrics.includes('CPC')}
                onChange={() => handleToggleMetric('CPC')}
                className="w-20 h-20 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-md mt-4"
              />
              <label htmlFor="cpc" className="ml-16 flex-1 cursor-pointer">
                <div className="flex items-center space-x-8 mb-8">
                  <div className="w-24 h-24 rounded bg-indigo-100 flex items-center justify-center">
                    <DollarSign size={12} className="text-indigo-700" />
                  </div>
                  <span className="subtitle2-medium text-slate-900">CPC Bid</span>
                </div>
                <div className="body2-regular">
                  <span className="text-slate-500">Current: {formatCurrency(metrics.cpc.currentValue)}</span>
                  <span className="mx-8 text-slate-400">→</span>
                  <span className="font-medium text-indigo-600">{formatCurrency(metrics.cpc.recommendedValue)}</span>
                  <span className="ml-8">{calculateChange(metrics.cpc.currentValue, metrics.cpc.recommendedValue)}</span>
                </div>
              </label>
            </div>

            {/* CPA Metric */}
            <div className="flex items-start p-20 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                id="cpa"
                checked={selectedMetrics.includes('CPA')}
                onChange={() => handleToggleMetric('CPA')}
                className="w-20 h-20 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-md mt-4"
              />
              <label htmlFor="cpa" className="ml-16 flex-1 cursor-pointer">
                <div className="flex items-center space-x-8 mb-8">
                  <div className="w-24 h-24 rounded bg-cyan-100 flex items-center justify-center">
                    <Target size={12} className="text-cyan-700" />
                  </div>
                  <span className="subtitle2-medium text-slate-900">CPA Goal</span>
                </div>
                <div className="body2-regular">
                  <span className="text-slate-500">Current: {formatCurrency(metrics.cpa.currentValue)}</span>
                  <span className="mx-8 text-slate-400">→</span>
                  <span className="font-medium text-cyan-600">{formatCurrency(metrics.cpa.recommendedValue)}</span>
                  <span className="ml-8">{calculateChange(metrics.cpa.currentValue, metrics.cpa.recommendedValue)}</span>
                </div>
              </label>
            </div>

            {/* Budget Metric */}
            <div className="flex items-start p-20 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                id="budget"
                checked={selectedMetrics.includes('Budget')}
                onChange={() => handleToggleMetric('Budget')}
                className="w-20 h-20 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-md mt-4"
              />
              <label htmlFor="budget" className="ml-16 flex-1 cursor-pointer">
                <div className="flex items-center space-x-8 mb-8">
                  <div className="w-24 h-24 rounded bg-amber-100 flex items-center justify-center">
                    <Zap size={12} className="text-amber-700" />
                  </div>
                  <span className="subtitle2-medium text-slate-900">Budget</span>
                </div>
                <div className="body2-regular">
                  <span className="text-slate-500">Current: {formatCurrency(metrics.budget.currentValue)}</span>
                  <span className="mx-8 text-slate-400">→</span>
                  <span className="font-medium text-amber-600">{formatCurrency(metrics.budget.recommendedValue)}</span>
                  <span className="ml-8">{calculateChange(metrics.budget.currentValue, metrics.budget.recommendedValue)}</span>
                </div>
              </label>
            </div>
          </div>

          {/* Rejection Reasons Section */}
          {unselectedMetrics.length > 0 && (
            <div className="mt-32 pt-24 border-t border-slate-200">
              <h3 className="subtitle2-medium text-slate-900 mb-16">
                Rejection Reasons for Unselected Metrics
              </h3>
              <p className="body2-regular text-slate-600 mb-20">
                Please provide a reason for each metric you're not accepting:
              </p>
              
              <div className="space-y-16">
                {unselectedMetrics.map((metric) => (
                  <div key={metric} className="space-y-8">
                    <label className="block body2-medium text-slate-700">
                      {metric === 'CPC' ? 'CPC Bid' : metric === 'CPA' ? 'CPA Goal' : 'Budget'} - Rejection Reason:
                    </label>
                    <textarea
                      value={rejectionReasons[metric] || ''}
                      onChange={(e) => handleRejectionReasonChange(metric, e.target.value)}
                      placeholder={`Why are you not accepting the ${metric === 'CPC' ? 'CPC Bid' : metric === 'CPA' ? 'CPA Goal' : 'Budget'} recommendation?`}
                      className="w-full px-12 py-6 border border-gray-300 rounded-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-14"
                      rows={1}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-24 py-20 bg-gray-50 rounded-b-xl border-t border-gray-200 flex justify-end space-x-12">
          <button
            onClick={onClose}
            className="px-20 py-12 text-14 font-medium text-gray-700 bg-white border border-gray-300 rounded-8 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            className="flex items-center gap-8 px-20 py-12 text-14 font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-8 transition-all duration-200"
          >
            <Check size={14} />
            Accept Selected Metrics
          </button>
        </div>
      </div>
    </div>
  );
};