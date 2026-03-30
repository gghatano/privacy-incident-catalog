import { useMemo } from 'react'
import type { Case, IncidentCategory, Severity, ReviewStatus } from '../../types/case'
import type { FilterKey, FilterState } from '../../hooks/useFilter'
import {
  INCIDENT_CATEGORY_OPTIONS,
  INCIDENT_CATEGORY_LABELS,
  SEVERITY_OPTIONS,
  SEVERITY_LABELS,
  REVIEW_STATUS_OPTIONS,
  REVIEW_STATUS_LABELS,
} from '../../constants/categories'

interface SummaryDashboardProps {
  cases: Case[]
  onToggleFilter: (key: FilterKey, value: string) => void
  filters: FilterState
}

const REGION_COLORS: Record<string, string> = {
  国内: 'bg-blue-500',
  国外: 'bg-orange-500',
}

const CATEGORY_COLORS: Record<IncidentCategory, string> = {
  data_breach: 'bg-red-500',
  privacy_violation: 'bg-blue-500',
  unauthorized_use: 'bg-amber-500',
  inadequate_anonymization: 'bg-purple-500',
  algorithmic_discrimination: 'bg-green-500',
  surveillance_tracking: 'bg-slate-500',
}

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
}

const REVIEW_STATUS_COLORS: Record<ReviewStatus, string> = {
  ai_generated: 'bg-gray-500',
  under_review: 'bg-yellow-500',
  human_reviewed: 'bg-green-500',
  flagged: 'bg-red-500',
}

function StackedBar({
  segments,
  total,
  filterKey,
  activeValues,
  onToggle,
}: {
  segments: { value: string; count: number; color: string }[]
  total: number
  filterKey: FilterKey
  activeValues: string[]
  onToggle: (key: FilterKey, value: string) => void
}) {
  if (total === 0) return null
  const hasActive = activeValues.length > 0

  return (
    <div className="flex h-6 w-full rounded-md overflow-hidden">
      {segments.map((seg) => {
        if (seg.count === 0) return null
        const pct = (seg.count / total) * 100
        const isActive = activeValues.includes(seg.value)
        const dimmed = hasActive && !isActive

        return (
          <div
            key={seg.value}
            className={`${seg.color} cursor-pointer transition-opacity ${dimmed ? 'opacity-30' : 'opacity-100'}`}
            style={{ width: `${pct}%` }}
            onClick={() => onToggle(filterKey, seg.value)}
            title={`${seg.value}: ${seg.count}件`}
          />
        )
      })}
    </div>
  )
}

function LegendItem({
  color,
  label,
  count,
  isActive,
  onClick,
}: {
  color: string
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm cursor-pointer hover:underline ${isActive ? 'font-bold' : ''}`}
    >
      <span className={`w-3 h-3 rounded-full shrink-0 ${color}`} />
      <span>{label}</span>
      <span className="text-gray-400">{count}</span>
    </button>
  )
}

export default function SummaryDashboard({ cases, onToggleFilter, filters }: SummaryDashboardProps) {
  const stats = useMemo(() => {
    const regionMap: Record<string, number> = {}
    const categoryMap: Record<string, number> = {}
    const severityMap: Record<string, number> = {}
    const reviewStatusMap: Record<string, number> = {}

    for (const c of cases) {
      regionMap[c.region] = (regionMap[c.region] ?? 0) + 1
      for (const cat of c.incident_category) {
        categoryMap[cat] = (categoryMap[cat] ?? 0) + 1
      }
      severityMap[c.severity] = (severityMap[c.severity] ?? 0) + 1
      reviewStatusMap[c.review_status] = (reviewStatusMap[c.review_status] ?? 0) + 1
    }

    return { regionMap, categoryMap, severityMap, reviewStatusMap }
  }, [cases])

  const total = cases.length

  const regionSegments = ['国内', '国外'].map((r) => ({
    value: r,
    count: stats.regionMap[r] ?? 0,
    color: REGION_COLORS[r],
  }))

  const categorySegments = INCIDENT_CATEGORY_OPTIONS.map((cat) => ({
    value: cat,
    count: stats.categoryMap[cat] ?? 0,
    color: CATEGORY_COLORS[cat],
  }))

  const severitySegments = SEVERITY_OPTIONS.map((sev) => ({
    value: sev,
    count: stats.severityMap[sev] ?? 0,
    color: SEVERITY_COLORS[sev],
  }))

  const reviewStatusSegments = REVIEW_STATUS_OPTIONS.map((rs) => ({
    value: rs,
    count: stats.reviewStatusMap[rs] ?? 0,
    color: REVIEW_STATUS_COLORS[rs],
  }))

  if (total === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 mb-6 space-y-4">
      {/* Row 1: Total + Region */}
      <div className="flex items-center gap-6">
        <div className="shrink-0">
          <p className="text-3xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-500">総件数</p>
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <StackedBar
            segments={regionSegments}
            total={total}
            filterKey="region"
            activeValues={filters.region}
            onToggle={onToggleFilter}
          />
          <div className="flex gap-4">
            {regionSegments.map((seg) => (
              <LegendItem
                key={seg.value}
                color={seg.color}
                label={seg.value}
                count={seg.count}
                isActive={filters.region.includes(seg.value)}
                onClick={() => onToggleFilter('region', seg.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 1.5: Review Status (next to region) */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-500">レビューステータス別</p>
        <StackedBar
          segments={reviewStatusSegments}
          total={total}
          filterKey="review_status"
          activeValues={filters.review_status}
          onToggle={onToggleFilter}
        />
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {reviewStatusSegments.map((seg) => (
            <LegendItem
              key={seg.value}
              color={seg.color}
              label={REVIEW_STATUS_LABELS[seg.value as ReviewStatus]}
              count={seg.count}
              isActive={filters.review_status.includes(seg.value)}
              onClick={() => onToggleFilter('review_status', seg.value)}
            />
          ))}
        </div>
      </div>

      {/* Row 2: Category + Severity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500">カテゴリ別</p>
          <StackedBar
            segments={categorySegments}
            total={cases.reduce((s, c) => s + c.incident_category.length, 0)}
            filterKey="incident_category"
            activeValues={filters.incident_category}
            onToggle={onToggleFilter}
          />
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {categorySegments.map((seg) => (
              <LegendItem
                key={seg.value}
                color={seg.color}
                label={INCIDENT_CATEGORY_LABELS[seg.value as IncidentCategory]}
                count={seg.count}
                isActive={filters.incident_category.includes(seg.value)}
                onClick={() => onToggleFilter('incident_category', seg.value)}
              />
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500">深刻度別</p>
          <StackedBar
            segments={severitySegments}
            total={total}
            filterKey="severity"
            activeValues={filters.severity}
            onToggle={onToggleFilter}
          />
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {severitySegments.map((seg) => (
              <LegendItem
                key={seg.value}
                color={seg.color}
                label={SEVERITY_LABELS[seg.value as Severity]}
                count={seg.count}
                isActive={filters.severity.includes(seg.value)}
                onClick={() => onToggleFilter('severity', seg.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
