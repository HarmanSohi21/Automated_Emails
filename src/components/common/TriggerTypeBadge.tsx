import React from 'react';
import { Zap, Hand } from 'lucide-react';

interface TriggerTypeBadgeProps {
  type: 'Manual' | 'Automatic';
}

export const TriggerTypeBadge: React.FC<TriggerTypeBadgeProps> = ({ type }) => {
  const Icon = type === 'Automatic' ? Zap : Hand;
  const badgeClasses = type === 'Automatic' 
    ? 'bg-warning-50 text-warning-700 border-warning-200'
    : 'bg-secondary-50 text-secondary-700 border-secondary-200';
  
  return (
    <span className={`inline-flex items-center gap-4 px-8 py-4 caption-semibold rounded-full border ${badgeClasses}`}>
      <Icon size={12} />
      {type}
    </span>
  );
};