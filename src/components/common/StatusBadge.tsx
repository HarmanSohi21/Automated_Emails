import React from 'react';
import { FeedStatus, RecommendationStatus } from '../../types';

interface StatusBadgeProps {
  status: FeedStatus | RecommendationStatus | 'Due Today' | 'Overdue' | 'Needs Manual Follow-up';
  type?: 'entity' | 'recommendation';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'entity' }) => {
  let badgeClasses = '';
  
  if (type === 'entity') {
    // New Entities Added status styles
    switch (status) {
      case 'Ready':
        badgeClasses = 'bg-emerald-100 text-emerald-700 border-emerald-200';
        break;
      case 'Sent':
        badgeClasses = 'bg-blue-100 text-blue-700 border-blue-200';
        break;
      case 'Failed':
        badgeClasses = 'bg-red-100 text-red-700 border-red-200';
        break;
      case 'Due Today':
        badgeClasses = 'bg-orange-100 text-orange-700 border-orange-200';
        break;
      case 'Overdue':
      case 'Needs Manual Follow-up':
        badgeClasses = 'bg-red-100 text-red-700 border-red-200';
        break;
      default:
        badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
    }
  } else {
    // Recommendations status styles
    switch (status) {
      case 'Pending':
        badgeClasses = 'bg-orange-50 text-orange-600 border-orange-200';
        break;
      case 'Accepted':
        badgeClasses = 'bg-green-50 text-green-600 border-green-200';
        break;
      case 'Partially accepted':
        badgeClasses = 'bg-yellow-50 text-yellow-600 border-yellow-200';
        break;
      case 'Rejected':
        badgeClasses = 'bg-red-50 text-red-600 border-red-200';
        break;
      case 'Sent':
        badgeClasses = 'bg-blue-50 text-blue-600 border-blue-200';
        break;
      case 'Expired':
        badgeClasses = 'bg-gray-50 text-gray-600 border-gray-200';
        break;
      default:
        badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }
  
  return (
    <span className={`joveo-badge ${badgeClasses}`}>
      {status}
    </span>
  );
};