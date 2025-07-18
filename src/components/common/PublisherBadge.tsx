import React from 'react';
import { Building } from 'lucide-react';

interface PublisherBadgeProps {
  name: string;
  type: 'Job' | 'Marketing';
}

export const PublisherBadge: React.FC<PublisherBadgeProps> = ({ name, type }) => {
  return (
    <span className="joveo-badge bg-indigo-50 text-indigo-700 border border-indigo-200">
      <Building size={12} />
      {name}
    </span>
  );
};