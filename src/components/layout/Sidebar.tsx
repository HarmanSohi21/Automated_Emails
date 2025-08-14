import React from 'react';
import { Bell, Mail } from 'lucide-react';

interface SidebarProps {
  currentView: 'entities' | 'recommendations';
  onViewChange: (view: 'entities' | 'recommendations') => void;
  entitiesCount: number;
  recommendationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  entitiesCount,
  recommendationsCount
}) => {
  // Show badges only when there's data to show (when selections are made)
  const showBadges = entitiesCount > 0 || recommendationsCount > 0;

  return (
    <div className="w-248 h-full bg-white border-r border-gray-200 pt-16">
      <nav className="px-16 space-y-8">
        {/* Recommendations */}
        <button
          onClick={() => onViewChange('recommendations')}
          className={`w-full flex items-center justify-between p-10 rounded-lg transition-all ${
            currentView === 'recommendations'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="font-semibold text-14">Recommendations</span>
          {showBadges && recommendationsCount > 0 && (
            <div
              className={`px-6 py-4 rounded-full text-xs font-semibold ${
                currentView === 'recommendations'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {recommendationsCount.toString().padStart(2, '0')}
            </div>
          )}
        </button>

        {/* New Entities Added */}
        <button
          onClick={() => onViewChange('entities')}
          className={`w-full flex items-center justify-between p-10 rounded-lg transition-all ${
            currentView === 'entities'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="font-semibold text-14">New Entities Added</span>
          {showBadges && entitiesCount > 0 && (
            <div
              className={`px-6 py-4 rounded-full text-xs font-semibold ${
                currentView === 'entities'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {entitiesCount.toString().padStart(2, '0')}
            </div>
          )}
        </button>
      </nav>
    </div>
  );
}; 