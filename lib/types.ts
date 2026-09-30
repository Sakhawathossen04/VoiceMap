// VoiceMap BD - core domain types.
// Shaped so a real FastAPI + PostgreSQL/PostGIS backend can serve these
// structures verbatim later.

export type Category =
  | "Waterlogging"
  | "Road Damage"
  | "Street Lighting"
  | "Waste Management"
  | "Drainage"
  | "Accessibility"
  | "Public Safety"
  | "Footpath"
  | "Traffic"
  | "Public Infrastructure";

export type Severity = "Low" | "Medium" | "High" | "Critical";

export type Urgency = "Low" | "Medium" | "High" | "Immediate";

export type IssueStatus = "Open" | "Investigating" | "Planned" | "In Progress" | "Resolved";

export type ReportStatus = "Submitted" | "AI Reviewed" | "Clustered" | "Authority Notified";

export interface SeverityCount {
  Low: number;
  Medium: number;
  High: number;
  Critical: number;
}

export interface PriorityFactors {
  frequency: number;
  severity: number;
  urgency: number;
  vulnerability: number;
  recurrence: number;
  geographicImpact: number;
}

export interface CitizenReport {
  id: string;
  createdAt: string;
  inputMode: "voice" | "text" | "photo";
  originalText: string;
  transcription: string;
  category: Category;
  severity: Severity;
  urgency: Urgency;
  affectedGroup: string;
  entities: string[];
  ward: number;
  locationLabel: string;
  lat: number;
  lng: number;
  clusterId: string | null;
  status: ReportStatus;
  confidence: { category: number; location: number };
  hasPhoto: boolean;
  anonymizedCitizen: string;
}

export interface WardInfo {
  id: number;
  name: string;
  path: string;
  centroid: [number, number];
}

export interface IssueCluster {
  id: string;
  title: string;
  category: Category;
  ward: number;
  reportCount: number;
  severityMix: SeverityCount;
  priorityScore: number;
  priorityFactors: PriorityFactors;
  status: IssueStatus;
  underheard: boolean;
  underheardReason?: string;
  lat: number;
  lng: number;
  radiusM: number;
  firstReported: string;
  lastReported: string;
  trendPct: number;
  affectedGroups: string[];
  summary: string;
  locationLabel: string;
  citizenQuotes: string[];
  timeline: { label: string; date: string; done: boolean; note?: string }[];
  verification?: { solved: number; partial: number; notSolved: number };
}

export interface InterventionOption {
  id: string;
  title: string;
  type: string;
  locations: number;
  impact: string;
  costBDT: number;
  peopleAffected: string;
  priorityCoverage: string;
  underheardSupport: boolean;
  clustersCovered: string[];
}

export interface KpiPoint {
  label: string;
  value: number;
}
