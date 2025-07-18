import React, { useState } from 'react';
import { Button } from '../common/Button';
import { X, Check, DollarSign, Target, Zap } from 'lucide-react';

interface MetricOption {
  currentValue: number;
  recommendedValue: number;
}

interface PartialAcceptModalProps {
  onClose: () => void;
  onAccept: (selectedMetrics: string[]) => void;
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
    onAccept(selectedMetrics);
    onClose();
  };

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
        </div>

        <div className="px-24 py-20 bg-slate-50 rounded-b-xl border-t border-slate-200 flex justify-end space-x-12">
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="accept"
            size="md"
            icon={<Check size={16} />}
            onClick={handleSubmit}
            disabled={selectedMetrics.length === 0}
          >
            Accept Selected Metrics
          </Button>
        </div>
      </div>
    </div>
  );
};