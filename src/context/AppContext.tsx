import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  EmailNotification, 
  Recommendation,
  RequestRecommendationPayload,
  SendEmailPayload,
  Publisher,
  RecommendationStatus,
  User as AppUser,
  Client
} from '../types';
import { mockEmailNotifications, mockRecommendations, clients, publishers, instances, Instance } from '../data/mockData';

interface UserPreferences {
  selectedInstanceId: string | null;
  selectedClientIds: string[];
}

interface AppContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
  emailNotifications: EmailNotification[];
  recommendations: Recommendation[];
  clients: Client[];
  publishers: Publisher[];
  instances: Instance[];
  
  // New global filter state
  selectedInstanceId: string | null;
  selectedClientIds: string[];
  
  // Filter methods
  setSelectedInstance: (instanceId: string | null) => void;
  setSelectedClients: (clientIds: string[]) => void;
  
  // Helper methods
  getSelectedInstance: () => Instance | null;
  getSelectedClients: () => Client[];
  getAvailableClients: () => Client[];
  getFilteredEmailNotifications: () => EmailNotification[];
  getFilteredRecommendations: () => Recommendation[];
  
  // Existing methods
  selectedClient: string | null;
  sendEmail: (payload: SendEmailPayload) => Promise<EmailNotification>;
  requestRecommendation: (payload: RequestRecommendationPayload) => Promise<Recommendation>;
  updateRecommendationStatus: (recommendationId: string, status: RecommendationStatus) => Promise<void>;
  setSelectedClient: (clientId: string | null) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  // New global filter state
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const preferences: UserPreferences = JSON.parse(savedPreferences);
        setSelectedInstanceId(preferences.selectedInstanceId);
        setSelectedClientIds(preferences.selectedClientIds || []);
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    } else {
      // Set default instance for demo
      const defaultInstance = instances[0];
      if (defaultInstance) {
        setSelectedInstanceId(defaultInstance.id);
        // Auto-select all clients for the default instance
        const instanceClients = getClientsByInstance(defaultInstance.id);
        const clientIds = instanceClients.map(client => client.id);
        setSelectedClientIds(clientIds);
      }
    }
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (selectedInstanceId !== null) {
      const preferences: UserPreferences = {
        selectedInstanceId,
        selectedClientIds
      };
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }, [selectedInstanceId, selectedClientIds]);

  const getClientsByInstance = (instanceId: string): Client[] => {
    const instance = instances.find(inst => inst.id === instanceId);
    return instance ? instance.clients : [];
  };

  const setSelectedInstance = (instanceId: string | null) => {
    setSelectedInstanceId(instanceId);
    // Auto-select all clients for the selected instance
    if (instanceId) {
      const instanceClients = getClientsByInstance(instanceId);
      const clientIds = instanceClients.map(client => client.id);
      setSelectedClientIds(clientIds);
    } else {
      setSelectedClientIds([]);
    }
  };

  const setSelectedClients = (clientIds: string[]) => {
    setSelectedClientIds(clientIds);
  };

  const getSelectedInstance = (): Instance | null => {
    return instances.find(instance => instance.id === selectedInstanceId) || null;
  };

  const getSelectedClients = (): Client[] => {
    return selectedClientIds.map(id => 
      clients.find(client => client.id === id)
    ).filter(client => client !== undefined) as Client[];
  };

  const getAvailableClients = (): Client[] => {
    if (!selectedInstanceId) return [];
    return getClientsByInstance(selectedInstanceId);
  };

  // Filter data based on selections
  const getFilteredEmailNotifications = (): EmailNotification[] => {
    if (selectedClientIds.length === 0) return [];
    
    return mockEmailNotifications.filter(notification => {
      // Get selected client names
      const selectedClientNames = selectedClientIds.map(clientId => {
        const client = getAvailableClients().find(c => c.id === clientId);
        return client?.name;
      }).filter(name => name);
      
      // Check if notification belongs to any selected client
      return selectedClientNames.some(clientName => {
        return notification.template.clientName === clientName ||
               notification.clientName === clientName ||
               notification.entityName.includes(clientName || '') ||
               notification.template.clientName.includes(clientName || '');
      });
    });
  };

  const getFilteredRecommendations = (): Recommendation[] => {
    if (selectedClientIds.length === 0) return [];
    
    return mockRecommendations.filter(recommendation => {
      // Get selected client names
      const selectedClientNames = selectedClientIds.map(clientId => {
        const client = getAvailableClients().find(c => c.id === clientId);
        return client?.name;
      }).filter(name => name);
      
      // Check if recommendation belongs to any selected client
      return selectedClientNames.some(clientName => {
        // Match by entity name containing client name
        return recommendation.entityName.includes(clientName || '') ||
               // Match by exact client name patterns
               (clientName === 'Adecco Brazil' && recommendation.entityName.includes('Adecco Brazil')) ||
               (clientName === 'Adecco France' && recommendation.entityName.includes('Adecco France')) ||
               (clientName === 'Adecco Germany' && recommendation.entityName.includes('Adecco Germany')) ||
               (clientName === 'Adecco Mexico' && recommendation.entityName.includes('Adecco Mexico')) ||
               (clientName === 'Adecco Switzerland' && recommendation.entityName.includes('Adecco Switzerland')) ||
               (clientName === 'Ashley Furniture' && recommendation.entityName.includes('Ashley Furniture')) ||
               (clientName === 'Geico' && recommendation.entityName.includes('Geico')) ||
               (clientName === 'DWA - Northrup Grumman' && recommendation.entityName.includes('DWA')) ||
               (clientName === 'RSR' && recommendation.entityName.includes('RSR')) ||
               (clientName === 'UberEats' && recommendation.entityName.includes('UberEats')) ||
               (clientName === 'Uber Freight' && recommendation.entityName.includes('Uber Freight')) ||
               (clientName === 'Uber' && recommendation.entityName.includes('Uber'));
      });
    });
  };

  const sendEmail = async (payload: SendEmailPayload): Promise<EmailNotification> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock notification based on the payload
    const mockEntity = mockEmailNotifications[0]; // Use first notification as template
    const newNotification: EmailNotification = {
      id: `email-${Date.now()}`,
      entityId: payload.entityId,
      entityName: mockEntity.entityName,
      entityType: mockEntity.entityType,
      clientName: mockEntity.clientName,
      publisherId: mockEntity.publisherId,
      publisherName: mockEntity.publisherName,
      subject: payload.subject,
      recipients: payload.recipients,
      status: 'Sent',
      triggerType: 'Manual',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      template: mockEntity.template
    };
    
    return newNotification;
  };

  const requestRecommendation = async (payload: RequestRecommendationPayload): Promise<Recommendation> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock recommendation based on the payload
    const mockRec = mockRecommendations[0]; // Use first recommendation as template
    const newRecommendation: Recommendation = {
      id: `rec-${Date.now()}`,
      entityId: payload.entityId,
      entityName: mockRec.entityName,
      entityType: mockRec.entityType,
      publisherId: payload.publisherId,
      publisherName: mockRec.publisherName,
      clientId: mockRec.clientId,
      clientName: mockRec.clientName,
      level: payload.level,
      metrics: mockRec.metrics, // Use template metrics
      duration: payload.duration,
      status: 'Sent',
      requestedAt: new Date().toISOString(),
      requestType: 'CSE_REQUEST'
    };
    
    return newRecommendation;
  };

  const updateRecommendationStatus = async (recommendationId: string, status: RecommendationStatus): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Recommendation ${recommendationId} status updated to ${status}`);
  };

  const logout = (clearPreferences: boolean = false) => {
    setUser(null);
    if (clearPreferences) {
      localStorage.removeItem('userPreferences');
      setSelectedInstanceId(null);
      setSelectedClientIds([]);
    }
  };

  const value: AppContextType = {
    user,
    setUser,
    logout,
    emailNotifications: getFilteredEmailNotifications(),
    recommendations: getFilteredRecommendations(),
    clients,
    publishers,
    instances,
    selectedInstanceId,
    selectedClientIds,
    setSelectedInstance,
    setSelectedClients,
    getSelectedInstance,
    getSelectedClients,
    getAvailableClients,
    getFilteredEmailNotifications,
    getFilteredRecommendations,
    selectedClient,
    sendEmail,
    requestRecommendation,
    updateRecommendationStatus,
    setSelectedClient,
    isLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};