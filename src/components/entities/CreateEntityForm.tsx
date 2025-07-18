import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { EntityType, CreateEntityPayload } from '../../types';
import { PlusCircle } from 'lucide-react';

export const CreateEntityForm: React.FC = () => {
  const { clients, createEntity, isLoading } = useApp();
  const [formData, setFormData] = useState<CreateEntityPayload>({
    name: '',
    type: 'Campaign',
    clientId: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Please enter a name');
      return;
    }
    
    if (!formData.clientId) {
      setError('Please select a client');
      return;
    }
    
    setError(null);
    
    try {
      await createEntity(formData);
      
      // Reset form
      setFormData({
        name: '',
        type: 'Campaign',
        clientId: '',
      });
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Card title="Create New Entity">
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          Entity created successfully! A notification will be sent automatically when the feed is ready.
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="Entity name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Entity Type
            </label>
            <select
              id="type"
              name="type"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="Client">Client</option>
              <option value="Campaign">Campaign</option>
              <option value="JobGroup">Job Group</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
              Client
            </label>
            <select
              id="clientId"
              name="clientId"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={formData.clientId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary-solid"
              isLoading={isLoading}
              icon={<PlusCircle size={16} />}
            >
              Create Entity
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};