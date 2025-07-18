import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlobalFilters } from '../filters/GlobalFilters';
import { EmailNotificationList } from '../emails/EmailNotificationList';
import { RecommendationList } from '../recommendations/RecommendationList';
import { RequestRecommendationForm } from '../recommendations/RequestRecommendationForm';
import { ReminderDashboard } from '../reminders/ReminderDashboard';
import { ProfileSection } from '../profile/ProfileSection';
import { BellRing, Mail, TrendingUp } from 'lucide-react';

type ActiveCard = 'reminders' | 'recommendations' | 'emails';

export const Dashboard: React.FC = () => {
  const { emailNotifications, recommendations } = useApp();
  const [activeCard, setActiveCard] = useState<ActiveCard>('reminders');

  // Calculate metrics
  const reminderCount = emailNotifications.filter(email => {
    const sentDate = new Date(email.sentAt || '');
    const now = new Date();
    const hoursSinceEmail = Math.floor((now.getTime() - sentDate.getTime()) / (1000 * 60 * 60));
    return hoursSinceEmail >= 24 && email.status === 'Sent';
  }).length;

  const readyToSendCount = emailNotifications.filter(email => email.status === 'Ready').length;
  
  const pendingRecommendationsCount = recommendations.filter(rec => 
    rec.status === 'Response Received'
  ).length;

  const totalRecommendations = recommendations.length;

  const getCardTitle = (cardType: ActiveCard) => {
    switch (cardType) {
      case 'reminders':
        return 'Reminder Dashboard';
      case 'recommendations':
        return 'Recommendations Hub';
      case 'emails':
        return 'Email Management';
      default:
        return '';
    }
  };

  const getCardDescription = (cardType: ActiveCard) => {
    switch (cardType) {
      case 'reminders':
        return 'Tracking follow-ups for publisher responses: First reminder after 24 hours, second reminder after 48 hours. After 72 hours without response, the item requires manual intervention.';
      case 'recommendations':
        return 'Request optimization recommendations from publishers and review their responses for CPC bids, CPA goals, and budget allocation.';
      case 'emails':
        return 'Manage and track email notifications sent to publishers for newly setup entities.';
      default:
        return '';
    }
  };

  const renderActiveContent = () => {
    switch (activeCard) {
      case 'reminders':
        return <ReminderDashboard />;
      case 'recommendations':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            <div className="lg:col-span-2">
              <RecommendationList />
            </div>
            <div>
              <RequestRecommendationForm />
            </div>
          </div>
        );
      case 'emails':
        return <EmailNotificationList />;
      default:
        return <ReminderDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background-default">
      {/* Header - Joveo Style */}
      <header className="bg-header border-b border-neutral-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-24">
          <div className="flex justify-between h-64 items-center">
            <div className="flex items-center space-x-16">
              <div className="flex items-center space-x-12">
                <div className="w-32 h-32 rounded-lg bg-primary-700 flex items-center justify-center shadow-md">
                  <Mail className="h-20 w-20 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Email Manager</h1>
                </div>
              </div>
            </div>
            <ProfileSection />
          </div>
        </div>
      </header>

      <GlobalFilters />
      
      <main className="max-w-7xl mx-auto px-24 py-32">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-40">
          {/* Reminders Card */}
          <div 
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 rounded-xl ${
              activeCard === 'reminders' 
                ? 'bg-[#E8EAF6] border-2 border-[#303F9F] shadow-lg' 
                : 'bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300'
            }`}
            onClick={() => setActiveCard('reminders')}
          >
            {/* Top ribbon for selected state */}
            {activeCard === 'reminders' && (
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#303F9F]"></div>
            )}
            
            <div className="p-24">
              <div className="flex items-center space-x-16">
                <BellRing className={`h-24 w-24 transition-colors duration-300 ${
                  activeCard === 'reminders' ? 'text-[#E65100]' : 'text-[#F57C00]'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-8 mb-4">
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      activeCard === 'reminders' ? 'text-[#303F9F]' : 'text-neutral-600'
                    }`}>
                      Reminders
                    </p>
                    {activeCard === 'reminders' && (
                      <div className="w-6 h-6 rounded-full bg-[#303F9F] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                  <p className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                    activeCard === 'reminders' ? 'text-neutral-900' : 'text-neutral-800'
                  }`}>
                    {reminderCount}
                  </p>
                  <p className="text-sm text-neutral-500">Requiring follow-up</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div 
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 rounded-xl ${
              activeCard === 'recommendations' 
                ? 'bg-[#E8EAF6] border-2 border-[#303F9F] shadow-lg' 
                : 'bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300'
            }`}
            onClick={() => setActiveCard('recommendations')}
          >
            {/* Top ribbon for selected state */}
            {activeCard === 'recommendations' && (
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#303F9F]"></div>
            )}
            
            <div className="p-24">
              <div className="flex items-center space-x-16">
                <TrendingUp className={`h-24 w-24 transition-colors duration-300 ${
                  activeCard === 'recommendations' ? 'text-[#006064]' : 'text-[#0277BD]'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-8 mb-4">
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      activeCard === 'recommendations' ? 'text-[#303F9F]' : 'text-neutral-600'
                    }`}>
                      Recommendations
                    </p>
                    {activeCard === 'recommendations' && (
                      <div className="w-6 h-6 rounded-full bg-[#303F9F] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                  <p className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                    activeCard === 'recommendations' ? 'text-neutral-900' : 'text-neutral-800'
                  }`}>
                    {totalRecommendations}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {pendingRecommendationsCount} pending review
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Management Card */}
          <div 
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 rounded-xl ${
              activeCard === 'emails' 
                ? 'bg-[#E8EAF6] border-2 border-[#303F9F] shadow-lg' 
                : 'bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300'
            }`}
            onClick={() => setActiveCard('emails')}
          >
            {/* Top ribbon for selected state */}
            {activeCard === 'emails' && (
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#303F9F]"></div>
            )}
            
            <div className="p-24">
              <div className="flex items-center space-x-16">
                <Mail className={`h-24 w-24 transition-colors duration-300 ${
                  activeCard === 'emails' ? 'text-[#4A148C]' : 'text-[#AD1457]'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-8 mb-4">
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      activeCard === 'emails' ? 'text-[#303F9F]' : 'text-neutral-600'
                    }`}>
                      Email Management
                    </p>
                    {activeCard === 'emails' && (
                      <div className="w-6 h-6 rounded-full bg-[#303F9F] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                  <p className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                    activeCard === 'emails' ? 'text-neutral-900' : 'text-neutral-800'
                  }`}>
                    {emailNotifications.length}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {readyToSendCount} ready to send
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header for Active Content */}
        <div className="mb-32 p-24 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex items-center space-x-16">
            <div className="w-40 h-40 rounded-xl bg-[#E8EAF6] border border-[#303F9F] flex items-center justify-center">
              {activeCard === 'reminders' && <BellRing className="h-20 w-20 text-[#303F9F]" />}
              {activeCard === 'recommendations' && <TrendingUp className="h-20 w-20 text-[#303F9F]" />}
              {activeCard === 'emails' && <Mail className="h-20 w-20 text-[#303F9F]" />}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-8">{getCardTitle(activeCard)}</h2>
              <p className="text-sm text-neutral-600 max-w-4xl leading-relaxed">
                {getCardDescription(activeCard)}
              </p>
            </div>
          </div>
        </div>

        {/* Active Content */}
        <div className="transition-all duration-300">
          {renderActiveContent()}
        </div>
      </main>
    </div>
  );
};