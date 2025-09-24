export type RecommendationType = 'CPC Bid' | 'CPA Goal' | 'Budget';
export type EntityType = 'Client' | 'Campaign' | 'JobGroup';
export type FeedStatus = 'Processing' | 'Ready' | 'Sent' | 'Failed' | 'Expired';
export type RecommendationStatus = 'Sent' | 'Pending' | 'Accepted' | 'Partially accepted' | 'Rejected' | 'Expired';
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

export interface ClientMetrics {
  budget: number;
  cpcBid: number;
  cpaGoal: number;
  duration: 'Daily' | 'Weekly' | 'Monthly';
}

export interface Client {
  id: string;
  name: string;
  poc: ClientPOC[];
  metrics?: ClientMetrics;
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
  entityType?: EntityType;
  entityName?: string;
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

export interface RecommendationMetric {
  type: RecommendationType;
  currentValue: number;
  recommendedValue?: number;
  isMandatory?: boolean;
  isRequested?: boolean;
  status?: 'pending' | 'accepted' | 'rejected';
  potentialImprovement?: string;
  // For partial acceptance tracking
  acceptanceStatus?: 'accepted' | 'rejected' | 'pending';
  appliedValue?: number;
  rejectionReason?: string;
}

export interface Recommendation {
  id: string;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  publisherId: string;
  publisherName: string;
  clientId: string;
  clientName: string;
  metrics: RecommendationMetric[];
  level: 'Client' | 'Campaign' | 'JobGroup';
  duration: string;
  status: RecommendationStatus;
  requestedAt: string;
  expiresAt?: string;
  respondedAt?: string;
  requestType?: 'CSE_REQUEST' | 'PROACTIVE_PUBLISHER';
  priority?: 'Urgent' | 'High' | 'Medium' | 'Low';
  notes?: string; // Publisher notes for the overall recommendation
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

export interface FilterChip {
  id: string;
  type: string;
  label: string;
  values: string[];
  displayText: string;
}