import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  EmailNotification, 
  Recommendation,
  RequestRecommendationPayload,
  SendEmailPayload,
  Publisher,
  RecommendationStatus,
  User as AppUser
} from '../types';
import { mockEmailNotifications, mockRecommendations, clients, publishers } from '../data/mockData';

interface AppContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
  emailNotifications: EmailNotification[];
  recommendations: Recommendation[];
  clients: { id: string; name: string; poc: { name: string; email: string; role: string; }[] }[];
  publishers: Publisher[];
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
  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const logout = () => {
    setUser(null);
  };

  // Simulate loading data from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmailNotifications(mockEmailNotifications);
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Send an email manually
  const sendEmail = async (payload: SendEmailPayload): Promise<EmailNotification> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new email notification
    const newEmailNotification: EmailNotification = {
      id: crypto.randomUUID(),
      ...payload,
      status: 'Processing',
      triggerType: 'Manual',
      createdAt: new Date().toISOString(),
    };
    
    // Update notifications state
    setEmailNotifications(prev => [...prev, newEmailNotification]);
    
    // Simulate sending email
    setTimeout(() => {
      const success = Math.random() > 0.1;
      
      setEmailNotifications(prev => 
        prev.map(notification => 
          notification.id === newEmailNotification.id 
            ? { 
                ...notification, 
                status: success ? 'Sent' : 'Failed',
                sentAt: success ? new Date().toISOString() : undefined,
                errorMessage: success ? undefined : 'Failed to send email: Connection timeout'
              } 
            : notification
        )
      );
    }, 2000);
    
    setIsLoading(false);
    return newEmailNotification;
  };

  // Request a recommendation
  const requestRecommendation = async (payload: RequestRecommendationPayload): Promise<Recommendation> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create new recommendation
    const newRecommendation: Recommendation = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
    };
    
    // Update recommendations state
    setRecommendations(prev => [...prev, newRecommendation]);
    
    setIsLoading(false);
    return newRecommendation;
  };

  // Update recommendation status
  const updateRecommendationStatus = async (recommendationId: string, status: RecommendationStatus): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update recommendation status
    setRecommendations(prev =>
      prev.map(recommendation =>
        recommendation.id === recommendationId
          ? { ...recommendation, status }
          : recommendation
      )
    );
    
    setIsLoading(false);
  };

  const value = {
    user,
    setUser,
    logout,
    emailNotifications,
    recommendations,
    clients,
    publishers,
    selectedClient,
    sendEmail,
    requestRecommendation,
    updateRecommendationStatus,
    setSelectedClient,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};