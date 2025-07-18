import React from 'react';
import { EntityType } from '../../types';
import { Building2, BarChart2, Briefcase } from 'lucide-react';

interface EntityTypeBadgeProps {
  type: EntityType;
}

export const EntityTypeBadge: React.FC<EntityTypeBadgeProps> = ({ type }) => {
  let Icon = Building2;
  
  switch (type) {
    case 'Client':
      Icon = Building2;
      break;
    case 'Campaign':
      Icon = BarChart2;
      break;
    case 'JobGroup':
      Icon = Briefcase;
      break;
  }
  
  return (
    <span className="joveo-badge bg-slate-100 text-slate-700 border border-slate-200">
      <Icon size={12} />
      {type}
    </span>
  );
};