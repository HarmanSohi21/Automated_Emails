import { 
  Publisher, 
  EmailNotification, 
  Recommendation, 
  EntityType, 
  FeedStatus,
  RecommendationStatus,
  RecommendationType,
  RecommendationMetric,
  EmailTemplate,
  Client,
  ClientPOC,
  ClientMetrics
} from '../types';

// Define Instance interface for account management
export interface Instance {
  id: string;
  name: string;
  clients: Client[];
}

// Define Entity interface for campaigns and job groups
export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  clientId: string;
  clientName: string;
  createdAt: string;
  feedStatus: FeedStatus;
}

export const publishers: Publisher[] = [
  // Filter priority publishers (matching filter options exactly)
  { id: 'pub1', name: 'ZipRecruiter', type: 'CPC', email: ['support@ziprecruiter.com'] },
  { id: 'pub2', name: 'Monster', type: 'Flat CPC', email: ['team@monster.com'] },
  { id: 'pub3', name: 'Snagajob', type: 'CPC', email: ['hourly@snagajob.com'] },
  { id: 'pub4', name: 'Jooble', type: 'CPA', email: ['support@jooble.org'] },
  { id: 'pub5', name: 'OnTimeHire', type: 'Flat CPA', email: ['contact@ontimehire.com'] },
  { id: 'pub6', name: 'Banya', type: 'CPA', email: ['team@banya.io'] },
  { id: 'pub7', name: 'Indeed', type: 'CPC', email: ['partner@indeed.com'] },
  { id: 'pub8', name: 'LinkedIn', type: 'CPA', email: ['support@linkedin.com'] },
  { id: 'pub9', name: 'Glassdoor', type: 'CPC', email: ['publisher@glassdoor.com'] },
  { id: 'pub10', name: 'CareerBuilder', type: 'CPA', email: ['partnerships@careerbuilder.com'] },
  { id: 'pub11', name: 'FlexJobs', type: 'CPC', email: ['flex@flexjobs.com'] },
  { id: 'pub12', name: 'Dice', type: 'CPC', email: ['tech@dice.com'] },
  { id: 'pub13', name: 'AngelList', type: 'CPA', email: ['startups@angellist.com'] },
  // Additional publishers for diversity
  { id: 'pub14', name: 'SimplyHired', type: 'Flat CPA', email: ['publishers@simplyhired.com'] },
  { id: 'pub15', name: 'PeoplePerHour', type: 'CPC', email: ['hourly@peopleperhour.com'] },
  { id: 'pub16', name: 'ClearanceJobs', type: 'CPA', email: ['security@clearancejobs.com'] },
  { id: 'pub17', name: 'TheLadders', type: 'Flat CPC', email: ['executives@theladders.com'] },
  { id: 'pub18', name: 'JobStreet', type: 'CPA', email: ['asia@jobstreet.com'] },
  { id: 'pub19', name: 'RemoteOK', type: 'Flat CPC', email: ['remote@remoteok.io'] },
  { id: 'pub20', name: 'Upwork', type: 'CPA', email: ['freelance@upwork.com'] }
];

// Instance and Client Data
export const instances: Instance[] = [
  {
    id: 'adecco',
    name: 'Adecco',
    clients: [
      { id: 'adecco-brazil', name: 'Adecco Brazil', poc: [{ name: 'Carlos Silva', email: 'carlos@adecco.br', role: 'Account Manager' }], metrics: { budget: 50000, cpcBid: 2.5, cpaGoal: 45 } },
      { id: 'adecco-france', name: 'Adecco France', poc: [{ name: 'Marie Dubois', email: 'marie@adecco.fr', role: 'Regional Director' }], metrics: { budget: 75000, cpcBid: 3.2, cpaGoal: 52 } },
      { id: 'adecco-germany', name: 'Adecco Germany', poc: [{ name: 'Hans Mueller', email: 'hans@adecco.de', role: 'Operations Lead' }], metrics: { budget: 80000, cpcBid: 3.8, cpaGoal: 58 } },
      { id: 'adecco-mexico', name: 'Adecco Mexico', poc: [{ name: 'Sofia Rodriguez', email: 'sofia@adecco.mx', role: 'Country Manager' }], metrics: { budget: 35000, cpcBid: 2.1, cpaGoal: 38 } },
      { id: 'adecco-switzerland', name: 'Adecco Switzerland', poc: [{ name: 'Peter Zimmermann', email: 'peter@adecco.ch', role: 'Regional Head' }], metrics: { budget: 95000, cpcBid: 4.2, cpaGoal: 65 } }
    ]
  },
  {
    id: 'ashley-furniture',
    name: 'Ashley Furniture',
    clients: [
      { id: 'ashley-furniture-main', name: 'Ashley Furniture', poc: [{ name: 'John Anderson', email: 'john@ashleyfurniture.com', role: 'HR Director' }], metrics: { budget: 120000, cpcBid: 2.8, cpaGoal: 48 } }
    ]
  },
  {
    id: 'geico',
    name: 'Geico',
    clients: [
      { id: 'geico-main', name: 'Geico', poc: [{ name: 'Sarah Wilson', email: 'sarah@geico.com', role: 'Talent Acquisition Manager' }], metrics: { budget: 200000, cpcBid: 3.5, cpaGoal: 55 } }
    ]
  },
  {
    id: 'managed-services',
    name: 'Managed Services',
    clients: [
      { id: 'dwa-northrup-grumman', name: 'DWA - Northrup Grumman', poc: [{ name: 'Michael Chen', email: 'michael@dwa.com', role: 'Defense Recruiting Lead' }], metrics: { budget: 300000, cpcBid: 5.2, cpaGoal: 85 } }
    ]
  },
  {
    id: 'rsr',
    name: 'RSR',
    clients: [
      { id: 'rsr-main', name: 'RSR', poc: [{ name: 'David Kim', email: 'david@rsr.com', role: 'Supply Chain Recruiter' }], metrics: { budget: 85000, cpcBid: 2.9, cpaGoal: 42 } }
    ]
  },
  {
    id: 'uber',
    name: 'Uber',
    clients: [
      { id: 'ubereats', name: 'UberEats', poc: [{ name: 'Amanda Lee', email: 'amanda@uber.com', role: 'UberEats Hiring Manager' }], metrics: { budget: 180000, cpcBid: 4.1, cpaGoal: 68 } },
      { id: 'uber-freight', name: 'Uber Freight', poc: [{ name: 'Robert Johnson', email: 'robert@uber.com', role: 'Freight Operations' }], metrics: { budget: 150000, cpcBid: 3.6, cpaGoal: 58 } },
      { id: 'uber-main', name: 'Uber', poc: [{ name: 'Jennifer Davis', email: 'jennifer@uber.com', role: 'Global Talent Acquisition' }], metrics: { budget: 250000, cpcBid: 4.8, cpaGoal: 78 } },
      { id: 'uber-delivery', name: 'UberDelivery', poc: [{ name: 'Kevin Park', email: 'kevin@uber.com', role: 'Delivery Operations Manager' }], metrics: { budget: 60000, cpcBid: 3.2, cpaGoal: 52 } },
      { id: 'uber-logistics', name: 'UberLogistics', poc: [{ name: 'Lisa Thompson', email: 'lisa@uber.com', role: 'Logistics Recruiter' }], metrics: { budget: 40000, cpcBid: 2.4, cpaGoal: 35 } },
      { id: 'uber-business', name: 'UberBusiness', poc: [{ name: 'Mark Robinson', email: 'mark@uber.com', role: 'Business Solutions Lead' }], metrics: { budget: 75000, cpcBid: 2.7, cpaGoal: 44 } },
      { id: 'uber-corporate', name: 'UberCorporate', poc: [{ name: 'Zhang Wei', email: 'zhang@uber.com', role: 'Corporate Talent Acquisition' }], metrics: { budget: 95000, cpcBid: 3.4, cpaGoal: 56 } },
      { id: 'uberexchange', name: 'UberExchange', poc: [{ name: 'Ryan Martinez', email: 'ryan@uber.com', role: 'Exchange Platform Lead' }], metrics: { budget: 70000, cpcBid: 3.1, cpaGoal: 49 } },
      { id: 'uberdrivers', name: 'UberDrivers', poc: [{ name: 'Nicole Brown', email: 'nicole@uber.com', role: 'Driver Acquisition Manager' }], metrics: { budget: 130000, cpcBid: 3.9, cpaGoal: 62 } }
    ]
  }
];

// Get all clients from all instances
export const getAllClients = (): Client[] => {
  return instances.flatMap(instance => instance.clients);
};

export const clients = getAllClients();

// Helper function to get client POCs (simplified version to avoid circular dependency)
const getClientPOCs = (clientName: string): string[] => {
  // Return dummy emails for demo
  return [`poc1@${clientName.toLowerCase().replace(/\s+/g, '')}.com`, `poc2@${clientName.toLowerCase().replace(/\s+/g, '')}.com`];
};

// Generate email template
const generateEmailTemplate = (clientName: string): EmailTemplate => ({
    clientName,
  campaignName: `Demo Campaign for ${clientName}`,
  campaignObjective: 'Increase qualified applications',
  feedUrl: `https://feeds.example.com/${clientName.toLowerCase().replace(/\s+/g, '')}/jobs.xml`,
  budget: Math.floor(Math.random() * 100000) + 10000,
  budgetDuration: 'Monthly',
  feedStartDate: new Date().toISOString().split('T')[0],
  feedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  cpaGoalRequest: Math.floor(Math.random() * 50) + 30,
    cpaGoalValidate: true,
  cpcBidRequest: Math.floor(Math.random() * 5) + 2,
    cpcBidValidate: true,
  numberOfJobs: Math.floor(Math.random() * 100) + 10,
  jobTitles: ['Software Engineer', 'Marketing Manager', 'Sales Representative'],
  countries: ['United States'],
  states: ['California', 'New York', 'Texas'],
  cities: ['San Francisco', 'New York', 'Austin'],
  sampleLandingPage: `https://careers.${clientName.toLowerCase().replace(/\s+/g, '')}.com`,
  note: 'Demo note for testing',
  partnerInsightsUrl: 'https://insights.joveo.com',
  isEasyApply: true
});

// Generate Entity
const generateEntity = (
  id: string,
  name: string,
  type: EntityType,
  clientId: string,
  clientName: string,
  feedStatus: FeedStatus
): Entity => ({
    id,
    name,
    type,
    clientId,
    clientName,
  createdAt: new Date().toISOString(),
  feedStatus
});

// Generate email notification
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
    errorMessage: status === 'Failed' ? 'Network connection timeout' : undefined,
    template: generateEmailTemplate(entity.clientName)
  };
};

// Generate recommendation metrics
const generateRecommendationMetrics = (type: RecommendationType): RecommendationMetric[] => {
  const allMetrics = [
    {
      type: 'CPC Bid' as RecommendationType,
      currentValue: 2.50,
      recommendedValue: 3.25,
      isMandatory: true,
      isRequested: true, // This was specifically requested
      potentialImprovement: '+30% more traffic'
    },
    {
      type: 'CPA Goal' as RecommendationType,
      currentValue: 45.00,
      recommendedValue: 38.50,
      isMandatory: false,
      isRequested: false, // Optional metric, not requested
      potentialImprovement: '+14% efficiency'
    },
    {
      type: 'Budget' as RecommendationType,
      currentValue: 15000,
      recommendedValue: 18000,
      isMandatory: true,
      isRequested: true, // This was specifically requested
      potentialImprovement: '+20% reach'
    }
  ];
  
  // Return all metrics for richer demo data
  return allMetrics;
};

// Generate recommendation
const generateRecommendation = (
  id: string,
  entity: Entity,
  metricType: RecommendationType,
  status: RecommendationStatus,
  metrics: RecommendationMetric[] = [] // Added metrics parameter
): Recommendation => {
  const publisher = publishers[Math.floor(Math.random() * publishers.length)];
  
  // Sample publisher notes for overall recommendations
  const sampleNotes = [
    "CPA in this category tends to go high due to market demand. Recommend increasing both CPC bid and budget for better performance.",
    "Difficult to hire category, requires more budget and higher CPA goals. The suggested metrics should improve quality of applicants.",
    "Seasonal trend shows better performance with increased budget. Historical data supports these recommendations for Q4.",
    "Competition is fierce in this market. Higher bids recommended for better visibility against competitors.",
    "Based on historical data from similar campaigns, these adjustments will improve ROI by 15-20%.",
    "Market analysis shows opportunity for growth with modest budget increase. CPA goals are realistic for this sector.",
    "",  // Some recommendations won't have notes
    ""
  ];
  
  return {
    id,
    entityId: entity.id,
    entityName: entity.name,
    entityType: entity.type,
    publisherId: publisher.id,
    publisherName: publisher.name,
    clientId: entity.clientId,
    clientName: entity.clientName,
    level: entity.type === 'Client' ? 'Client' : entity.type === 'Campaign' ? 'Campaign' : 'JobGroup',
    metrics: metrics, // Use the provided metrics
    duration: Math.random() > 0.5 ? 'This Month' : 'Next Month',
    status,
    requestedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    requestType: Math.random() > 0.5 ? 'CSE_REQUEST' : 'PROACTIVE_PUBLISHER',
    priority: ['Urgent', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)] as 'Urgent' | 'High' | 'Medium' | 'Low',
    notes: sampleNotes[Math.floor(Math.random() * sampleNotes.length)]
  };
};

// Enhanced mock email notifications - comprehensive coverage
export const mockEmailNotifications: EmailNotification[] = [
  // Generate 100+ comprehensive email notifications for all clients
  ...Array.from({ length: 100 }, (_, index) => {
    const allClients = getAllClients();
    const clientIndex = index % allClients.length;
    const client = allClients[clientIndex];
    
    const entityTypes: EntityType[] = ['Client', 'Campaign', 'JobGroup'];
    const statuses: FeedStatus[] = ['Ready', 'Sent', 'Processing', 'Failed'];
    const triggerTypes = ['Manual', 'Automatic'] as const;
    
    const entityType = entityTypes[index % entityTypes.length];
    const status = statuses[Math.floor(index / 25) % statuses.length];
    const triggerType = triggerTypes[index % triggerTypes.length];
    
    const entityNames = [
      'Software Engineering', 'Marketing Campaign', 'Sales Operations', 'Customer Support',
      'Data Analytics', 'Product Management', 'HR Operations', 'Finance Team',
      'Quality Assurance', 'Business Development', 'Technical Support', 'Operations Management',
      'Client Onboarding', 'Account Setup', 'Service Integration', 'Platform Configuration'
    ];
    
    let entityName;
    if (entityType === 'Client') {
      const clientNames = ['Client Onboarding', 'Account Setup', 'Service Integration', 'Platform Configuration'];
      entityName = `${clientNames[index % clientNames.length]} - ${client.name}`;
    } else {
      entityName = `${entityNames[index % entityNames.length]} ${index + 1} - ${client.name}`;
    }
    
    const entity = generateEntity(
      `entity-${client.id}-${index}`,
      entityName,
      entityType,
      client.id,
      client.name,
      'Ready'
    );
    
    const daysAgo = Math.floor(Math.random() * 30); // 0-30 days ago
    const offset = daysAgo * 24 * 60 * 60 * 1000 + Math.floor(Math.random() * 24 * 60 * 60 * 1000);
    
    return generateEmailNotification(
      `email-${index + 1}`,
      entity,
      status,
      triggerType,
      offset
    );
  }),

  // Add specific Client notifications to ensure good representation
  ...Array.from({ length: 15 }, (_, index) => {
    const allClients = getAllClients();
    const client = allClients[index % allClients.length];
    
    const clientEntityNames = [
      'Client Onboarding Process', 'Account Verification', 'Service Activation', 
      'Platform Integration', 'Initial Setup', 'Client Configuration'
    ];
    
    const entity = generateEntity(
      `client-entity-${index}`,
      `${clientEntityNames[index % clientEntityNames.length]} - ${client.name}`,
      'Client',
      client.id,
      client.name,
      'Ready'
    );
    
    const daysAgo = Math.floor(Math.random() * 7); // 0-7 days ago for recent Client notifications
    const offset = daysAgo * 24 * 60 * 60 * 1000 + Math.floor(Math.random() * 24 * 60 * 60 * 1000);
    
    return generateEmailNotification(
      `client-notification-${index}`,
      entity,
      'Ready', // Make most Client notifications ready to send
      index % 2 === 0 ? 'Manual' : 'Automatic',
      offset
    );
  }),

  // Ensure every publisher appears at least once in Email Notifications
  ...publishers.map((publisher, index) => {
    const allClients = getAllClients();
    const client = allClients[index % allClients.length];
    
    const entityTypes: EntityType[] = ['Campaign', 'JobGroup', 'Client'];
    const entityType = entityTypes[index % entityTypes.length];
    const statuses: FeedStatus[] = ['Ready', 'Sent', 'Processing'];
    const status = statuses[index % statuses.length];
    
    const entityNames = [
      'Publisher Specific Campaign', 'Channel Optimization', 'Performance Drive',
      'Targeted Outreach', 'Strategic Initiative', 'Growth Campaign'
    ];
    
    let entityName;
    if (entityType === 'Client') {
      entityName = `${publisher.name} Integration - ${client.name}`;
    } else {
      entityName = `${entityNames[index % entityNames.length]} (${publisher.name}) - ${client.name}`;
    }
    
    const entity = generateEntity(
      `pub-entity-${publisher.id}`,
      entityName,
      entityType,
      client.id,
      client.name,
      status
    );
    
    const daysAgo = Math.floor(Math.random() * 14); // 0-14 days ago
    const offset = daysAgo * 24 * 60 * 60 * 1000 + Math.floor(Math.random() * 24 * 60 * 60 * 1000);
    
    return {
      ...generateEmailNotification(
        `pub-notification-${publisher.id}`,
        entity,
        status,
        index % 2 === 0 ? 'Manual' : 'Automatic',
        offset
      ),
      publisherId: publisher.id,
      publisherName: publisher.name
    };
  })
].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

// Enhanced mock recommendations - comprehensive coverage for demo
export const mockRecommendations: Recommendation[] = [
  // THIS WEEK recommendations (for default filter)
  ...Array.from({ length: 25 }, (_, index) => {
    const allClients = getAllClients();
    const client = allClients[index % allClients.length];
    
    // Ensure good coverage across all dimensions
    const entityTypes: EntityType[] = ['Campaign', 'JobGroup', 'Client'];
    const metricTypes: RecommendationType[] = ['CPC Bid', 'CPA Goal', 'Budget'];
    const statuses: RecommendationStatus[] = ['Pending', 'Accepted', 'Partially accepted', 'Rejected', 'Sent'];
    const publishers = ['ZipRecruiter', 'Monster', 'Snagajob', 'Indeed', 'LinkedIn', 'Glassdoor', 'CareerBuilder', 'AngelList'];
    const priorities = ['Urgent', 'High', 'Medium', 'Low'];
    const requestTypes = ['CSE_REQUEST', 'PROACTIVE_PUBLISHER'];
    
    const entityType = entityTypes[index % entityTypes.length];
    const metricType = metricTypes[index % metricTypes.length];
    const status = statuses[index % statuses.length];
    const publisherName = publishers[index % publishers.length];
    const priority = priorities[index % priorities.length] as 'Urgent' | 'High' | 'Medium' | 'Low';
    const requestType = requestTypes[index % requestTypes.length] as 'CSE_REQUEST' | 'PROACTIVE_PUBLISHER';
    
    const entityNames = {
      Campaign: [
        'Tech Recruitment Drive', 'Sales Performance Boost', 'Customer Acquisition',
        'Brand Awareness Campaign', 'Lead Generation Initiative', 'Market Expansion',
        'Product Launch Support', 'Retention Strategy', 'Growth Optimization'
      ],
      JobGroup: [
        'Senior Developer Roles', 'Marketing Specialists', 'Sales Representatives',
        'Customer Support Team', 'Data Analytics Team', 'Operations Management',
        'Quality Assurance', 'Business Development', 'Technical Support'
      ],
      Client: [
        'Account Setup', 'Platform Integration', 'Service Optimization',
        'Client Onboarding', 'Performance Review', 'Strategic Planning'
      ]
    };
    
    const entityName = `${entityNames[entityType][index % entityNames[entityType].length]} - ${client.name}`;
    
    const entity = generateEntity(
      `rec-entity-${client.id}-${index}`,
      entityName,
      entityType,
      client.id,
      client.name,
      'Ready'
    );
    
    // Generate metrics with proper acceptance status
    const metrics = generateRecommendationMetrics(metricType).map((metric, metricIndex) => {
      if (status === 'Partially accepted') {
        // For partially accepted, metrics can only be 'accepted' or 'rejected' (no pending)
        const acceptanceStatus = (index + metricIndex) % 2 === 0 ? 'accepted' : 'rejected';
        return { ...metric, acceptanceStatus: acceptanceStatus as 'accepted' | 'rejected' };
      }
      return metric;
    });
    
    // Calculate days ago for this week (0-6 days ago)
    const daysAgo = index % 7;
    const requestedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    // Some recommendations expiring soon (< 2 days)
    const isExpiringSoon = index % 8 === 0;
    const expiresAt = isExpiringSoon 
      ? new Date(Date.now() + (Math.random() * 1.5) * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + (7 + Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString();
    
    return {
      id: `rec-${index + 1}`,
      entityId: entity.id,
      entityName: entity.name,
      entityType: entity.type,
      publisherId: `pub-${index % publishers.length + 1}`,
      publisherName,
      clientId: entity.clientId,
      clientName: entity.clientName,
      level: entity.type,
      metrics,
      duration: index % 2 === 0 ? 'This Month' : 'Next Month',
      status,
      requestedAt,
      expiresAt,
      requestType: requestType as 'CSE_REQUEST' | 'PROACTIVE_PUBLISHER',
      priority: priority as 'Urgent' | 'High' | 'Medium' | 'Low',
      notes: index % 4 === 0 ? "CPA in this category tends to go high due to market demand. Recommend increasing budget for better performance." : 
             index % 4 === 1 ? "Difficult to hire category, requires higher CPA goals. Historical data supports these recommendations." :
             index % 4 === 2 ? "Seasonal trend shows better performance with increased budget and CPC adjustments." : ""
    };
  }),
  
  // OLDER recommendations (for other date filters)
  ...Array.from({ length: 30 }, (_, index) => {
    const allClients = getAllClients();
    const client = allClients[index % allClients.length];
    
    const entityTypes: EntityType[] = ['Campaign', 'JobGroup', 'Client'];
    const metricTypes: RecommendationType[] = ['CPC Bid', 'CPA Goal', 'Budget'];
    const statuses: RecommendationStatus[] = ['Accepted', 'Rejected', 'Sent']; // Removed 'Expired'
    const publishers = ['ZipRecruiter', 'Monster', 'Snagajob', 'Indeed', 'LinkedIn', 'Glassdoor', 'CareerBuilder', 'AngelList'];
    
    const entityType = entityTypes[index % entityTypes.length];
    const metricType = metricTypes[index % metricTypes.length];
    const status = statuses[index % statuses.length];
    const publisherName = publishers[index % publishers.length];
    
    const entityName = `Historical ${entityType} ${index + 26} - ${client.name}`;
    
    const entity = generateEntity(
      `hist-entity-${client.id}-${index}`,
      entityName,
      entityType,
      client.id,
      client.name,
      'Ready'
    );
    
    const metrics = generateRecommendationMetrics(metricType);
    
    // Generate dates from 8-60 days ago for older data
    const daysAgo = 8 + (index % 52);
    const requestedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const expiresAt = new Date(Date.now() - (daysAgo - 14) * 24 * 60 * 60 * 1000).toISOString();
    
    return {
      id: `hist-rec-${index + 1}`,
      entityId: entity.id,
      entityName: entity.name,
      entityType: entity.type,
      publisherId: `pub-${index % publishers.length + 1}`,
      publisherName,
      clientId: entity.clientId,
      clientName: entity.clientName,
      level: entity.type,
      metrics,
      duration: index % 2 === 0 ? 'This Month' : 'Next Month',
      status,
      requestedAt,
      expiresAt,
      requestType: index % 2 === 0 ? 'CSE_REQUEST' : 'PROACTIVE_PUBLISHER',
      priority: ['Urgent', 'High', 'Medium', 'Low'][index % 4] as 'Urgent' | 'High' | 'Medium' | 'Low',
      notes: index % 3 === 0 ? "Competition is fierce in this market. Higher bids recommended for better visibility." : ""
    };
  })
].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

// Mock Campaigns and Job Groups for RequestRecommendationForm
export const mockCampaigns = [
  { id: 'camp-1', name: 'Software Engineering Campaign', clientId: 'adecco-brazil', clientName: 'Adecco Brazil', metrics: { budget: 25000, cpcBid: 3.25, cpaGoal: 85.00 } },
  { id: 'camp-2', name: 'Marketing Campaign', clientId: 'adecco-france', clientName: 'Adecco France', metrics: { budget: 45000, cpcBid: 2.80, cpaGoal: 120.00 } },
  { id: 'camp-3', name: 'Sales Operations', clientId: 'adecco-germany', clientName: 'Adecco Germany', metrics: { budget: 35000, cpcBid: 4.10, cpaGoal: 95.00 } },
  { id: 'camp-4', name: 'Customer Support', clientId: 'ashley-furniture-main', clientName: 'Ashley Furniture', metrics: { budget: 18000, cpcBid: 2.45, cpaGoal: 70.00 } },
  { id: 'camp-5', name: 'Insurance Sales', clientId: 'geico-main', clientName: 'Geico', metrics: { budget: 65000, cpcBid: 5.20, cpaGoal: 150.00 } },
  { id: 'camp-6', name: 'Defense Technology', clientId: 'dwa-northrup-grumman', clientName: 'DWA - Northrup Grumman', metrics: { budget: 85000, cpcBid: 6.75, cpaGoal: 200.00 } },
  { id: 'camp-7', name: 'Driver Acquisition', clientId: 'ubereats', clientName: 'UberEats', metrics: { budget: 32000, cpcBid: 3.90, cpaGoal: 110.00 } },
  { id: 'camp-8', name: 'Freight Logistics', clientId: 'uber-freight', clientName: 'Uber Freight', metrics: { budget: 58000, cpcBid: 4.85, cpaGoal: 175.00 } },
  { id: 'camp-9', name: 'Tech Innovation', clientId: 'uber-main', clientName: 'Uber', metrics: { budget: 125000, cpcBid: 7.20, cpaGoal: 250.00 } },
  { id: 'camp-10', name: 'Retail Distribution', clientId: 'rsr-main', clientName: 'RSR', metrics: { budget: 22000, cpcBid: 2.95, cpaGoal: 80.00 } }
];

export const mockJobGroups = [
  { id: 'jg-1', name: 'Engineering Team', clientId: 'adecco-brazil', clientName: 'Adecco Brazil', metrics: { budget: 15000, cpcBid: 2.85, cpaGoal: 65.00 } },
  { id: 'jg-2', name: 'Finance Department', clientId: 'adecco-france', clientName: 'Adecco France', metrics: { budget: 28000, cpcBid: 3.40, cpaGoal: 90.00 } },
  { id: 'jg-3', name: 'Business Development', clientId: 'adecco-germany', clientName: 'Adecco Germany', metrics: { budget: 42000, cpcBid: 4.20, cpaGoal: 125.00 } },
  { id: 'jg-4', name: 'Warehouse Management', clientId: 'ashley-furniture-main', clientName: 'Ashley Furniture', metrics: { budget: 12000, cpcBid: 2.10, cpaGoal: 55.00 } },
  { id: 'jg-5', name: 'Claims Processing', clientId: 'geico-main', clientName: 'Geico', metrics: { budget: 38000, cpcBid: 4.60, cpaGoal: 115.00 } },
  { id: 'jg-6', name: 'Cybersecurity Operations', clientId: 'dwa-northrup-grumman', clientName: 'DWA - Northrup Grumman', metrics: { budget: 72000, cpcBid: 6.15, cpaGoal: 185.00 } },
  { id: 'jg-7', name: 'Restaurant Partnerships', clientId: 'ubereats', clientName: 'UberEats', metrics: { budget: 19500, cpcBid: 3.15, cpaGoal: 75.00 } },
  { id: 'jg-8', name: 'Fleet Management', clientId: 'uber-freight', clientName: 'Uber Freight', metrics: { budget: 48000, cpcBid: 4.95, cpaGoal: 145.00 } },
  { id: 'jg-9', name: 'Global Operations', clientId: 'uber-main', clientName: 'Uber', metrics: { budget: 95000, cpcBid: 6.80, cpaGoal: 220.00 } },
  { id: 'jg-10', name: 'Supply Chain', clientId: 'rsr-main', clientName: 'RSR', metrics: { budget: 16500, cpcBid: 2.65, cpaGoal: 70.00 } }
];