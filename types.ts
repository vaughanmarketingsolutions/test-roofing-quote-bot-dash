export interface Quote {
  id: string;
  customerName: string;
  address: string;
  serviceType: ServiceType;
  quoteAmount: number;
  date: string; // ISO Date string
  status: QuoteStatus;
  roofSizeSqFt: number;
}

export enum ServiceType {
  ROOF_REPLACEMENT = 'Roof Replacement',
  REPAIR = 'Repair',
  GUTTER_INSTALLATION = 'Gutter Installation',
  INSPECTION = 'Inspection'
}

export enum QuoteStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed'
}

export interface DashboardMetrics {
  totalQuotes: number;
  totalRevenue: number;
  averageQuoteValue: number;
  conversionRate: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  revenue?: number;
}

export interface AIInsight {
  title: string;
  content: string;
  severity: 'info' | 'positive' | 'warning';
}

export type ViewType = 'dashboard' | 'quotes' | 'clients' | 'analytics' | 'settings' | 'notifications';
