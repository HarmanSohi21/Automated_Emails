import { Entity, EmailNotification, Recommendation, EntityType, FeedStatus, Publisher, EmailTemplate, RecommendationStatus } from '../types';

// Mock clients with POC data
export const clients = [
  { 
    id: 'client1', 
    name: 'Acme Corporation',
    metrics: {
      budget: 150000,
      cpcBid: 2.75,
      cpaGoal: 45.00
    },
    poc: [
      { name: 'John Smith', email: 'john.smith@acme.com', role: 'Recruitment Manager' },
      { name: 'Sarah Johnson', email: 'sarah.j@acme.com', role: 'Talent Acquisition Lead' }
    ]
  },
  { 
    id: 'client2', 
    name: 'GlobalTech Solutions',
    poc: [
      { name: 'Michael Chen', email: 'mchen@globaltech.com', role: 'HR Director' },
      { name: 'Emily Brown', email: 'ebrown@globaltech.com', role: 'Recruitment Specialist' }
    ]
  },
  { 
    id: 'client3', 
    name: 'Stellar Marketing',
    poc: [
      { name: 'David Wilson', email: 'dwilson@stellar.com', role: 'HR Manager' },
      { name: 'Lisa Anderson', email: 'landerson@stellar.com', role: 'Talent Lead' }
    ]
  },
  { 
    id: 'client4', 
    name: 'Quantum Enterprises',
    poc: [
      { name: 'Robert Taylor', email: 'rtaylor@quantum.com', role: 'Recruitment Director' },
      { name: 'Amanda Martinez', email: 'amartinez@quantum.com', role: 'HR Specialist' }
    ]
  },
];

// Mock campaigns with metrics
export const mockCampaigns = [
  {
    id: 'campaign1',
    name: 'Engineering Recruitment Q2',
    clientId: 'client1',
    metrics: {
      budget: 45000,
      cpcBid: 3.25,
      cpaGoal: 40.00
    }
  },
  {
    id: 'campaign2',
    name: 'Sales Team Expansion',
    clientId: 'client1',
    metrics: {
      budget: 35000,
      cpcBid: 2.50,
      cpaGoal: 35.00
    }
  }
];

// Mock job groups with metrics
export const mockJobGroups = [
  {
    id: 'jg1',
    name: 'Software Engineers',
    clientId: 'client1',
    campaignId: 'campaign1',
    metrics: {
      budget: 25000,
      cpcBid: 3.75,
      cpaGoal: 42.00
    }
  },
  {
    id: 'jg2',
    name: 'Product Managers',
    clientId: 'client1',
    campaignId: 'campaign1',
    metrics: {
      budget: 20000,
      cpcBid: 3.00,
      cpaGoal: 38.00
    }
  }
];

// Mock publishers with more diverse types
export const publishers: Publisher[] = [
  { 
    id: 'pub1', 
    name: 'Indeed', 
    type: 'Flat CPC',
    email: ['indeed.partner@example.com', 'indeed.support@example.com']
  },
  { 
    id: 'pub2', 
    name: 'Monster', 
    type: 'CPC',
    email: ['monster.partner@example.com']
  },
  { 
    id: 'pub3', 
    name: 'ZipRecruiter', 
    type: 'CPA',
    email: ['zip.partner@example.com', 'zip.support@example.com']
  },
  { 
    id: 'pub4', 
    name: 'JobCloud', 
    type: 'Flat CPA',
    email: ['jobcloud.partner@example.com']
  },
  { 
    id: 'pub5', 
    name: 'CareerBuilder', 
    type: 'TCPA',
    email: ['cb.partner@example.com']
  },
  { 
    id: 'pub6', 
    name: 'LinkedIn', 
    type: 'CPC',
    email: ['linkedin.partner@example.com']
  },
  { 
    id: 'pub7', 
    name: 'Glassdoor', 
    type: 'Flat CPC',
    email: ['glassdoor.partner@example.com']
  },
  { 
    id: 'pub8', 
    name: 'Dice', 
    type: 'CPA',
    email: ['dice.partner@example.com']
  }
];

// Generate random values within specified ranges
const generateValues = () => {
  const cpcBid = 1.7;
  const cpaGoal = 17;
  const budget = 1150;
  return { cpcBid, cpaGoal, budget };
};

const calculateRecommendedValue = (type: 'CPC' | 'CPA' | 'Budget', currentValue: number, values: ReturnType<typeof generateValues>): number => {
  switch (type) {
    case 'CPC':
    case 'CPA':
    case 'Budget':
    default:
      return currentValue;
  }
};

const generateEmailTemplate = (clientName: string): EmailTemplate => {
  const values = generateValues();
  return {
    clientName,
    campaignName: `${clientName} Campaign Q2 2025`,
    campaignObjective: 'Increase job applications by 25%',
    feedUrl: 'https://example.com/feed/123',
    budget: values.budget,
    budgetDuration: '3 months',
    feedStartDate: '2025-04-01',
    feedEndDate: '2025-06-30',
    cpaGoalRequest: values.cpaGoal,
    cpaGoalValidate: true,
    cpcBidRequest: values.cpcBid,
    cpcBidValidate: true,
    numberOfJobs: Math.floor(Math.random() * 200) + 50,
    jobTitles: ['Software Engineer', 'Product Manager', 'Data Scientist', 'Sales Representative', 'Marketing Manager'],
    countries: ['United States', 'Canada', 'United Kingdom'],
    states: ['California', 'New York', 'Texas', 'Florida', 'Illinois'],
    cities: ['San Francisco', 'New York City', 'Austin', 'Chicago', 'Miami'],
    sampleLandingPage: 'https://example.com/jobs/software-engineer',
    note: 'Priority campaign for Q2 2025',
    isEasyApply: Math.random() > 0.5,
    partnerInsightsUrl: 'https://partner-insights.example.com/recommendations'
  };
};

// Generate more diverse mock entities
const generateEntity = (
  id: string,
  name: string,
  type: EntityType,
  clientId: string,
  clientName: string,
  feedStatus: FeedStatus
): Entity => {
  return {
    id,
    name,
    type,
    clientId,
    clientName,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    feedStatus,
  };
};

// Extended mock entities for Acme Corporation
export const mockEntities: Entity[] = [
  generateEntity('entity1', 'Summer Campaign 2025', 'Campaign', 'client1', 'Acme Corporation', 'Ready'),
  generateEntity('entity2', 'Engineering Jobs', 'JobGroup', 'client1', 'Acme Corporation', 'Ready'),
  generateEntity('entity3', 'Sales Team Expansion', 'Campaign', 'client1', 'Acme Corporation', 'Sent'),
  generateEntity('entity4', 'Marketing Department', 'JobGroup', 'client1', 'Acme Corporation', 'Ready'),
  generateEntity('entity5', 'Product Development', 'Campaign', 'client1', 'Acme Corporation', 'Sent'),
  generateEntity('entity6', 'Customer Support', 'JobGroup', 'client1', 'Acme Corporation', 'Ready'),
  generateEntity('entity7', 'Finance Team', 'Campaign', 'client1', 'Acme Corporation', 'Ready'),
  generateEntity('entity8', 'HR Recruitment', 'JobGroup', 'client1', 'Acme Corporation', 'Sent'),
];

const getClientPOCs = (clientName: string): string[] => {
  const client = clients.find(c => c.name === clientName);
  return client ? client.poc.map(p => p.email) : [];
};

// Generate more diverse email notifications
const generateEmailNotification = (
  id: string,
  entity: Entity,
  status: FeedStatus,
  triggerType: 'Manual' | 'Automatic',
  createdAtOffset: number
): EmailNotification => {
  const createdAt = new Date(Date.now() - createdAtOffset).toISOString();
  const publisher = publishers[Math.floor(Math.random() * publishers.length)];
  const clientPOCs = getClientPOCs(entity.clientName);
  
  return {
    id,
    entityId: entity.id,
    entityName: entity.name,
    entityType: entity.type,
    clientName: entity.clientName,
    publisherId: publisher.id,
    publisherName: publisher.name,
    subject: `New ${entity.type} setup for ${entity.clientName} - ${entity.name}`,
    recipients: [...publisher.email, ...clientPOCs],
    status,
    triggerType,
    createdAt,
    sentAt: status === 'Sent' ? new Date(Date.now() - createdAtOffset).toISOString() : undefined,
    errorMessage: status === 'Failed' ? 'Failed to connect to mail server' : undefined,
    template: generateEmailTemplate(entity.clientName)
  };
};

// Generate mock email notifications with both "Due Today" and "Overdue" items
export const mockEmailNotifications: EmailNotification[] = [
  // Due Today notifications (exactly 24 hours ago)
  ...Array.from({ length: 7 }, (_, index) => {
    const entity = mockEntities[index % mockEntities.length];
    return generateEmailNotification(
      `email_due_today_${index + 1}`,
      entity,
      'Sent',
      Math.random() > 0.5 ? 'Manual' : 'Automatic',
      24 * 60 * 60 * 1000 // Exactly 24 hours ago
    );
  }),
  
  // Overdue notifications (48-72 hours ago, with multiple reminders sent)
  ...Array.from({ length: 7 }, (_, index) => {
    const entity = mockEntities[(index + 3) % mockEntities.length];
    const hoursAgo = 48 + (Math.random() * 24); // Between 48 and 72 hours ago
    return generateEmailNotification(
      `email_overdue_${index + 1}`,
      entity,
      'Sent',
      Math.random() > 0.5 ? 'Manual' : 'Automatic',
      Math.floor(hoursAgo * 60 * 60 * 1000)
    );
  }),
  
  // Regular notifications with various statuses
  ...Array.from({ length: 16 }, (_, index) => {
    const entity = mockEntities[index % mockEntities.length];
    const statuses: FeedStatus[] = ['Ready', 'Sent'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const offset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Random offset within 30 days
    
    return generateEmailNotification(
      `email_regular_${index + 1}`,
      entity,
      status,
      Math.random() > 0.5 ? 'Manual' : 'Automatic',
      offset
    );
  })
].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

// Generate mock recommendations
const generateRecommendation = (
  id: string,
  entity: Entity,
  type: 'CPC' | 'CPA' | 'Budget',
  status: RecommendationStatus
): Recommendation => {
  const values = generateValues();
  let currentValue: number;
  let recommendedValue: number;

  switch (type) {
    case 'CPC':
    case 'CPA':
    case 'Budget':
    default:
      currentValue = values.cpcBid;
      recommendedValue = calculateRecommendedValue('CPC', currentValue, values);
      break;
  }

  const improvement = ((recommendedValue - currentValue) / currentValue * 100).toFixed(1);
  const publisher = publishers[Math.floor(Math.random() * publishers.length)];
  const requestedAt = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();
  
  return {
    id,
    entityId: entity.id,
    entityName: entity.name,
    entityType: entity.type,
    publisherId: publisher.id,
    publisherName: publisher.name,
    type,
    currentValue,
    recommendedValue,
    potentialImprovement: type === 'CPA' ? `-${improvement}%` : `+${improvement}%`,
    level: entity.type,
    metrics: ['Bid', 'Goal'],
    duration: 'This Month',
    status,
    requestedAt,
    respondedAt: status !== 'Sent' ? new Date(Date.now() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)).toISOString() : undefined,
    expiresAt: status === 'Sent' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    note: 'Recommendation based on historical performance data'
  };
};

// Generate more diverse mock recommendations
export const mockRecommendations: Recommendation[] = [
  ...mockEntities.flatMap(entity => [
    generateRecommendation(`rec_${entity.id}_1`, entity, 'CPC', 'Response Received'),
    generateRecommendation(`rec_${entity.id}_2`, entity, 'CPA', 'Sent'),
    generateRecommendation(`rec_${entity.id}_3`, entity, 'Budget', 'Accepted')
  ])
];