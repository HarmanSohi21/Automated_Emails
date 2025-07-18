import React from 'react';
import { FeedStatus } from '../../types';

interface StatusBadgeProps {
  status: FeedStatus | 'Sent' | 'Failed' | 'Pending' | 'Due Today' | 'Overdue' | 'Needs Manual Follow-up';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeClasses = '';
  
  switch (status) {
    case 'Ready':
    case 'Sent':
      badgeClasses = 'bg-emerald-100 text-emerald-700 border-emerald-200';
      break;
    case 'Processing':
    case 'Pending':
    case 'Due Today':
      badgeClasses = 'bg-blue-100 text-blue-700 border-blue-200';
      break;
    case 'Failed':
    case 'Overdue':
    case 'Needs Manual Follow-up':
      badgeClasses = 'bg-red-100 text-red-700 border-red-200';
      break;
    default:
      badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  }
  
  return (
    <span 
      className={`joveo-badge border ${badgeClasses}`}
    >
      {status}
    </span>
  );
};