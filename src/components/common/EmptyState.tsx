import React from 'react';
import { InboxIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = <InboxIcon className="mx-auto h-48 w-48 text-neutral-400" />,
}) => {
  return (
    <div className="text-center py-64">
      <div className="mb-16">
        {icon}
      </div>
      <h3 className="subtitle1-medium text-text-primary mb-8">{title}</h3>
      <p className="body1-regular text-text-secondary max-w-sm mx-auto mb-24">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};