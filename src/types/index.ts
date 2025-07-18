export type RecommendationType = 'CPC Bid' | 'CPA Goal' | 'Budget';
export type EntityType = 'Client' | 'Campaign' | 'JobGroup';
export type FeedStatus = 'Processing' | 'Ready' | 'Sent';
export type RecommendationStatus = 'Ready to Send' | 'Sent' | 'Response Received' | 'Accepted' | 'Rejected' | 'Expired';
export type PublisherType = 'Flat CPC' | 'Flat CPA' | 'CPA' | 'CPC' | 'TCPA';
export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface User {
  email: string;
  name: string;
  picture?: string;
}

export interface ClientPOC {
  name: string;
  email: string;
  role: string;
}

export interface Client {
  id: string;
  name: string;
  poc: ClientPOC[];
}

export interface Publisher {
  id: string;
  name: string;
  type: PublisherType;
  email: string[];
}

export interface EmailTemplate {
  clientName: string;
  campaignName: string;
  campaignObjective: string;
  feedUrl: string;
  budget: number;
  budgetDuration: string;
  feedStartDate: string;
  feedEndDate: string;
  cpaGoalRequest: number;
  cpaGoalValidate: boolean;
  cpcBidRequest: number;
  cpcBidValidate: boolean;
  numberOfJobs: number;
  jobTitles: string[];
  countries: string[];
  states: string[];
  cities: string[];
  sampleLandingPage: string;
  note: string;
  attachmentUrl?: string;
  partnerInsightsUrl?: string;
  isEasyApply: boolean;
  status?: FeedStatus;
}

export interface EmailNotification {
  id: string;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  clientName: string;
  publisherId: string;
  publisherName: string;
  subject: string;
  recipients: string[];
  status: FeedStatus;
  triggerType: 'Manual' | 'Automatic';
  createdAt: string;
  sentAt?: string;
  errorMessage?: string;
  template: EmailTemplate;
}

export interface Recommendation {
  id: string;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  publisherId: string;
  publisherName: string;
  level: 'Client' | 'Campaign' | 'JobGroup';
  metrics: ('Bid' | 'Goal')[];
  duration: 'This Month' | 'Next Month';
  status: RecommendationStatus;
  requestedAt: string;
  respondedAt?: string;
  expiresAt?: string;
  currentValue?: number;
  recommendedValue?: number;
  potentialImprovement?: string;
  note?: string;
  email?: EmailTemplate;
  priority?: Priority;
}

export interface RequestRecommendationPayload {
  entityId: string;
  publisherId: string;
  level: 'Client' | 'Campaign' | 'JobGroup';
  recommendationTypes: RecommendationType[];
  duration: 'This Month' | 'Next Month';
  priority: Priority;
}

export interface SendEmailPayload {
  entityId: string;
  recipients: string[];
  subject: string;
  body: string;
}