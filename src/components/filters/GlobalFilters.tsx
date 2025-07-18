import React from 'react';
import { useApp } from '../../context/AppContext';
import { Dropdown } from '../common/Dropdown';

export const GlobalFilters: React.FC = () => {
  const { 
    clients,
    selectedClient,
    setSelectedClient
  } = useApp();

  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.name
  }));

  return (
    <div className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-24 py-16">
        <div className="flex items-center">
          <Dropdown
            options={clientOptions}
            value={selectedClient || clients[0]?.id || ''}
            onChange={(value) => setSelectedClient(value)}
            placeholder="Select client..."
            containerWidth="240px"
          />
        </div>
      </div>
    </div>
  );
};