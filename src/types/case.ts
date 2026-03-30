// Incident Categories
export const INCIDENT_CATEGORIES = [
  'data_breach',
  'privacy_violation',
  'unauthorized_use',
  'inadequate_anonymization',
  'algorithmic_discrimination',
  'surveillance_tracking',
] as const
export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number]

// Severity
export const SEVERITIES = ['critical', 'high', 'medium', 'low'] as const
export type Severity = (typeof SEVERITIES)[number]

// Review Status
export const REVIEW_STATUSES = ['ai_generated', 'human_reviewed', 'flagged', 'under_review'] as const
export type ReviewStatus = (typeof REVIEW_STATUSES)[number]

// Case Status
export const CASE_STATUSES = ['seed', 'draft', 'published'] as const
export type CaseStatus = (typeof CASE_STATUSES)[number]

// Figure Types
export const FIGURE_TYPES = ['data_flow', 'timeline'] as const
export type FigureType = (typeof FIGURE_TYPES)[number]

// Source
export interface Source {
  source_type: 'web' | 'pdf'
  title: string
  url: string
  note?: string
}

// Data Flow
export interface DataFlowNode {
  id: string
  label: string
  category: string
}

export interface DataFlowEdge {
  from: string
  to: string
  label: string
}

export interface DataFlowData {
  nodes: DataFlowNode[]
  edges: DataFlowEdge[]
}

// Timeline
export interface TimelineEvent {
  date: string
  label: string
}

export interface TimelineData {
  events: TimelineEvent[]
}

// Figure
export interface Figure {
  type: FigureType
  title: string
  data: DataFlowData | TimelineData
  note: string
}

// Case
export interface Case {
  id: string
  title: string
  region: string
  domain: string
  domain_sub?: string
  organization: string
  incident_category: IncidentCategory[]
  severity: Severity
  occurred_at: string | null
  summary: string
  impact: string
  root_cause: string
  response: string
  lessons_learned: string
  tags: string[]
  sources: Source[]
  figures: Figure[]
  review_status: ReviewStatus
  status: CaseStatus
  editorial_notes?: string[]
  created_at?: string
  updated_at?: string
  country?: string
  affected_count?: number
  related_laws?: string[]
  penalty_amount?: {
    amount: number
    currency: string
    authority: string
  } | null
  discovered_at?: string
  related_cases?: string[]
  ethical_notes?: string[]
}
