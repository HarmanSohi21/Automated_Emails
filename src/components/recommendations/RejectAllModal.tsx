import React, { useState } from 'react';
import { X, Check, DollarSign, Target, Zap } from 'lucide-react';

interface MetricOption {
  currentValue: number;
  recommendedValue: number;
}

interface RejectAllModalProps {
  onClose: () => void;
  onReject: (rejectionReasons: Record<string, string>) => void;
  metrics: {
    cpc: MetricOption;
    cpa: MetricOption;
    budget: MetricOption;
  };
}

export const RejectAllModal: React.FC<RejectAllModalProps> = ({
  onClose,
  onReject,
  metrics
}) => {
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

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
    onReject(rejectionReasons);
    onClose();
  };

  const isSubmitDisabled = () => {
    // Check if all metrics have rejection reasons
    const allMetrics = ['CPC', 'CPA', 'Budget'];
    const missingReasons = allMetrics.some(metric => !rejectionReasons[metric]?.trim());
    return missingReasons;
  };

  const handleRejectionReasonChange = (metric: string, reason: string) => {
    setRejectionReasons(prev => ({
      ...prev,
      [metric]: reason
    }));
  };

  const allMetrics = ['CPC', 'CPA', 'Budget'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-16 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-24 py-20 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <h2 className="subtitle1-semibold text-slate-900">Reject All Recommendations</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 transition-colors p-4 rounded-md hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-24 py-24">
          <p className="body1-regular text-slate-600 mb-24">
            You are about to reject all recommendation metrics. Please provide a reason for rejecting each metric.
          </p>
          
          <div className="space-y-20">
            {/* CPC Metric */}
            <div className="flex items-start space-x-16 p-16 border border-slate-200 rounded-lg bg-slate-50">
              <div className="w-24 h-24 rounded bg-blue-100 flex items-center justify-center mt-4">
                <DollarSign size={12} className="text-blue-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-8 mb-8">
                  <span className="subtitle2-medium text-slate-900">CPC Bid</span>
                </div>
                <div className="body2-regular">
                  <span className="text-slate-500">Current: {formatCurrency(metrics.cpc.currentValue)}</span>
                  <span className="mx-8 text-slate-400">→</span>
                  <span className="font-medium text-blue-600">{formatCurrency(metrics.cpc.recommendedValue)}</span>
                  <span className="ml-8">{calculateChange(metrics.cpc.currentValue, metrics.cpc.recommendedValue)}</span>
                </div>
              </div>
            </div>

            {/* CPA Metric */}
            <div className="flex items-start space-x-16 p-16 border border-slate-200 rounded-lg bg-slate-50">
              <div className="w-24 h-24 rounded bg-green-100 flex items-center justify-center mt-4">
                <Target size={12} className="text-green-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-8 mb-8">
                  <span className="subtitle2-medium text-slate-900">CPA Goal</span>
                </div>
                <div className="body2-regular">
                  <span className="text-slate-500">Current: {formatCurrency(metrics.cpa.currentValue)}</span>
                  <span className="mx-8 text-slate-400">→</span>
                  <span className="font-medium text-green-600">{formatCurrency(metrics.cpa.recommendedValue)}</span>
                  <span className="ml-8">{calculateChange(metrics.cpa.currentValue, metrics.cpa.recommendedValue)}</span>
                </div>
              </div>
            </div>

            {/* Budget Metric */}
            <div className="flex items-start space-x-16 p-16 border border-slate-200 rounded-lg bg-slate-50">
              <div className="w-24 h-24 rounded bg-amber-100 flex items-center justify-center mt-4">
                <Zap size={12} className="text-amber-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-8 mb-8">
                  <span className="subtitle2-medium text-slate-900">Budget</span>
                </div>
                <div className="body2-regular">
                  <span className="text-slate-500">Current: {formatCurrency(metrics.budget.currentValue)}</span>
                  <span className="mx-8 text-slate-400">→</span>
                  <span className="font-medium text-amber-600">{formatCurrency(metrics.budget.recommendedValue)}</span>
                  <span className="ml-8">{calculateChange(metrics.budget.currentValue, metrics.budget.recommendedValue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Reasons Section */}
          <div className="mt-32 pt-24 border-t border-slate-200">
            <h3 className="subtitle2-medium text-slate-900 mb-16">
              Rejection Reasons for All Metrics
            </h3>
            <p className="body2-regular text-slate-600 mb-20">
              Please provide a reason for rejecting each metric:
            </p>
            
            <div className="space-y-16">
              {allMetrics.map((metric) => (
                <div key={metric} className="space-y-8">
                  <label className="block body2-medium text-slate-700">
                    {metric === 'CPC' ? 'CPC Bid' : metric === 'CPA' ? 'CPA Goal' : 'Budget'} - Rejection Reason:
                  </label>
                  <textarea
                    value={rejectionReasons[metric] || ''}
                    onChange={(e) => handleRejectionReasonChange(metric, e.target.value)}
                    placeholder={`Why are you rejecting the ${metric === 'CPC' ? 'CPC Bid' : metric === 'CPA' ? 'CPA Goal' : 'Budget'} recommendation?`}
                    className="w-full px-12 py-6 border border-gray-300 rounded-6 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-14"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
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
            className="flex items-center gap-8 px-20 py-12 text-14 font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-8 transition-all duration-200"
          >
            <X size={14} />
            Reject All Metrics
          </button>
        </div>
      </div>
    </div>
  );
};
