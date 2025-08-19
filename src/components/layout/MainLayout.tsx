import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import Footer from './Footer';
import { EmailNotificationList } from '../emails/EmailNotificationList';
import { RecommendationList } from '../recommendations/RecommendationList';
import { EmptyState } from '../common/EmptyState';
import { useApp } from '../../context/AppContext';

export const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<'recommendations' | 'entities'>('recommendations');
  const { 
    selectedInstanceId, 
    selectedClientIds, 
    emailNotifications, 
    recommendations 
  } = useApp();

  // Check if user has completed the required selections
  const hasRequiredSelections = selectedInstanceId && selectedClientIds.length > 0;

  // Calculate counts for sidebar based on filtered data
  const entitiesCount = emailNotifications.filter(notif => notif.status === 'Ready').length;
  const recommendationsCount = recommendations.filter(rec => rec.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200">
        <Header />
      </div>
      
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-64 bottom-0 z-20">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          entitiesCount={entitiesCount}
          recommendationsCount={recommendationsCount}
        />
      </div>
      
      {/* Main Content Area - Scrollable with flex-grow */}
      <main className="ml-248 pt-64 flex-grow flex flex-col">
        <div className="flex-grow">
          {!hasRequiredSelections ? (
            <EmptyState showSelectionPrompt={true} />
          ) : (
            <>
              {currentView === 'recommendations' && <RecommendationList />}
              {currentView === 'entities' && <EmailNotificationList />}
            </>
          )}
        </div>
        
        {/* Footer at bottom of main content area */}
        <Footer />
      </main>
    </div>
  );
}; 