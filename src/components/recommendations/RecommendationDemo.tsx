import React from 'react';
import { RecommendationLog } from './RecommendationLog';
import { RecommendationType } from '../../types';

const sampleRecommendations = [
  {
    id: 'rec-001',
    entityId: 'client1',
    entityName: 'Summer Campaign 2024',
    entityType: 'Campaign' as const,
    publisherId: 'pub-001',
    publisherName: 'Indeed',
    status: 'Response Received' as const,
    requestedAt: '2024-01-15T10:00:00Z',
    respondedAt: '2024-01-17T14:30:00Z',
    requestType: 'CSE_REQUEST' as const,
    requestedMetrics: ['CPC Bid', 'Budget'] as RecommendationType[],
    priority: 'High' as const,
    metrics: [
      {
        type: 'CPC Bid' as const,
        currentValue: 2.75,
        recommendedValue: 3.25,
        isMandatory: true,
        potentialImprovement: '18% increase in visibility'
      },
      {
        type: 'Budget' as const,
        currentValue: 15000,
        recommendedValue: 18000,
        isMandatory: true,
        potentialImprovement: '20% more job applications'
      },
      {
        type: 'CPA Goal' as const,
        currentValue: 45,
        recommendedValue: 42,
        isMandatory: false,
        potentialImprovement: '7% cost reduction'
      }
    ]
  },
  {
    id: 'rec-002',
    entityId: 'client2',
    entityName: 'Q4 Hiring Initiative',
    entityType: 'Client' as const,
    publisherId: 'pub-002',
    publisherName: 'ZipRecruiter',
    status: 'Response Received' as const,
    requestedAt: '2024-01-18T09:15:00Z',
    respondedAt: '2024-01-19T11:45:00Z',
    requestType: 'PROACTIVE_PUBLISHER' as const,
    metrics: [
      {
        type: 'CPC Bid' as const,
        currentValue: 3.50,
        recommendedValue: 4.00,
        isMandatory: false,
        potentialImprovement: '14% better targeting'
      },
      {
        type: 'CPA Goal' as const,
        currentValue: 50,
        recommendedValue: 48,
        isMandatory: false,
        potentialImprovement: '4% efficiency gain'
      }
    ]
  }
];

export const RecommendationDemo: React.FC = () => {
  const handleAccept = (id: string) => {
    console.log('Accepting recommendation:', id);
  };

  const handleReject = (id: string) => {
    console.log('Rejecting recommendation:', id);
  };

  const handlePartialAccept = (id: string, selectedMetrics: string[]) => {
    console.log('Partial accept for recommendation:', id, 'metrics:', selectedMetrics);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Recommendation Logs Demo</h2>
        <p className="text-slate-600">
          This demonstrates the new recommendation logging system with mandatory metrics tracking.
        </p>
      </div>

      <RecommendationLog
        recommendations={sampleRecommendations}
        onAccept={handleAccept}
        onReject={handleReject}
        onPartialAccept={handlePartialAccept}
      />
    </div>
  );
}; 