import { z } from 'zod'

const sourceSchema = z.object({
  source_type: z.enum(['web', 'pdf']),
  title: z.string(),
  url: z.string(),
  note: z.string().optional(),
})

const dataFlowNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  category: z.string(),
})

const dataFlowEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string(),
})

const dataFlowDataSchema = z.object({
  nodes: z.array(dataFlowNodeSchema),
  edges: z.array(dataFlowEdgeSchema),
})

const timelineEventSchema = z.object({
  date: z.string(),
  label: z.string(),
})

const timelineDataSchema = z.object({
  events: z.array(timelineEventSchema),
})

const figureSchema = z.object({
  type: z.enum(['data_flow', 'timeline']),
  title: z.string(),
  data: z.union([dataFlowDataSchema, timelineDataSchema]),
  note: z.string(),
})

export const caseSchema = z.object({
  id: z.string(),
  title: z.string(),
  region: z.string(),
  domain: z.string(),
  domain_sub: z.string().optional(),
  organization: z.string(),
  incident_category: z.array(
    z.enum([
      'data_breach',
      'privacy_violation',
      'unauthorized_use',
      'inadequate_anonymization',
      'algorithmic_discrimination',
      'surveillance_tracking',
    ]),
  ),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  occurred_at: z.string().nullable(),
  summary: z.string(),
  impact: z.string(),
  root_cause: z.string(),
  response: z.string(),
  lessons_learned: z.string(),
  tags: z.array(z.string()),
  sources: z.array(sourceSchema).min(1),
  figures: z.array(figureSchema),
  review_status: z.enum(['ai_generated', 'human_reviewed', 'flagged', 'under_review']),
  status: z.enum(['seed', 'draft', 'published']),
  editorial_notes: z.array(z.string()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type CaseFormData = z.infer<typeof caseSchema>
