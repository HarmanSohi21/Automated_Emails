import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { EntityTypeBadge } from '../common/EntityTypeBadge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { Entity } from '../../types';
import { Search, Building2 } from 'lucide-react';

export const EntityList: React.FC = () => {
  const { entities, isLoading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [feedStatusFilter, setFeedStatusFilter] = useState<string>('all');

  // Filter and sort entities
  const filteredEntities = entities
    .filter(entity => {
      // Apply entity type filter
      if (typeFilter !== 'all' && entity.type !== typeFilter) {
        return false;
      }
      
      // Apply feed status filter
      if (feedStatusFilter !== 'all' && entity.feedStatus !== feedStatusFilter) {
        return false;
      }
      
      // Apply search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          entity.name.toLowerCase().includes(searchLower) ||
          entity.clientName.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card 
      title="Entities" 
      className="mb-6"
      headerAction={
        <div className="flex space-x-2">
          <select
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Client">Clients</option>
            <option value="Campaign">Campaigns</option>
            <option value="JobGroup">Job Groups</option>
          </select>
          
          <select
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={feedStatusFilter}
            onChange={e => setFeedStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Ready">Ready</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      }
    >
      <div className="mb-4">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search entities..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredEntities.length === 0 ? (
        <EmptyState
          title="No entities found"
          description="No entities match your current filters."
          icon={<Building2 className="mx-auto h-12 w-12 text-gray-400" />}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Client
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Feed Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntities.map((entity) => (
                <tr key={entity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{entity.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <EntityTypeBadge type={entity.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{entity.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={entity.feedStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(entity.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};