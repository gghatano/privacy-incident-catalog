import { useState } from 'react'
import type { FilterState, FilterKey } from '../../hooks/useFilter'
import type { Case } from '../../types/case'
import {
  INCIDENT_CATEGORY_OPTIONS,
  INCIDENT_CATEGORY_LABELS,
  REGION_OPTIONS,
  DOMAIN_OPTIONS,
  REVIEW_STATUS_OPTIONS,
  REVIEW_STATUS_LABELS,
} from '../../constants/categories'

interface FilterPanelProps {
  filters: FilterState
  cases: Case[]
  onToggleFilter: (key: FilterKey, value: string) => void
}

interface FilterSectionProps {
  title: string
  filterKey: FilterKey
  options: readonly string[]
  labels: Record<string, string>
  selectedValues: string[]
  cases: Case[]
  onToggle: (key: FilterKey, value: string) => void
}

function countByField(cases: Case[], filterKey: FilterKey, value: string): number {
  return cases.filter((c) => {
    if (filterKey === 'incident_category') {
      return c.incident_category.includes(value as never)
    }
    if (filterKey === 'severity') {
      return c.severity === value
    }
    if (filterKey === 'region') {
      return c.region === value
    }
    if (filterKey === 'domain') {
      return c.domain === value
    }
    if (filterKey === 'review_status') {
      return c.review_status === value
    }
    return false
  }).length
}

function FilterSection({
  title,
  filterKey,
  options,
  labels,
  selectedValues,
  cases,
  onToggle,
}: FilterSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border-b border-gray-200 pb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-800"
      >
        {title}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <ul className="space-y-1">
          {options.map((value) => {
            const count = countByField(cases, filterKey, value)
            const checked = selectedValues.includes(value)
            return (
              <li key={value}>
                <label className="flex items-center gap-2 cursor-pointer py-0.5 text-sm text-gray-700 hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(filterKey, value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex-1">{labels[value] ?? value}</span>
                  <span className="text-xs text-gray-400">{count}</span>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function FilterPanel({ filters, cases, onToggleFilter }: FilterPanelProps) {
  // Build simple label maps for region and domain
  const regionLabels: Record<string, string> = Object.fromEntries(
    REGION_OPTIONS.map((v) => [v, v]),
  )
  const domainLabels: Record<string, string> = Object.fromEntries(
    DOMAIN_OPTIONS.map((v) => [v, v]),
  )

  return (
    <nav className="space-y-1">
      <h2 className="text-sm font-bold text-gray-900 mb-2">フィルタ</h2>
      <FilterSection
        title="カテゴリ"
        filterKey="incident_category"
        options={INCIDENT_CATEGORY_OPTIONS}
        labels={INCIDENT_CATEGORY_LABELS}
        selectedValues={filters.incident_category}
        cases={cases}
        onToggle={onToggleFilter}
      />
      <FilterSection
        title="地域"
        filterKey="region"
        options={REGION_OPTIONS}
        labels={regionLabels}
        selectedValues={filters.region}
        cases={cases}
        onToggle={onToggleFilter}
      />
      <FilterSection
        title="分野"
        filterKey="domain"
        options={DOMAIN_OPTIONS}
        labels={domainLabels}
        selectedValues={filters.domain}
        cases={cases}
        onToggle={onToggleFilter}
      />
      <FilterSection
        title="レビュー状態"
        filterKey="review_status"
        options={REVIEW_STATUS_OPTIONS}
        labels={REVIEW_STATUS_LABELS}
        selectedValues={filters.review_status}
        cases={cases}
        onToggle={onToggleFilter}
      />
    </nav>
  )
}
