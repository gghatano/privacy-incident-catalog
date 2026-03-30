import type { FilterState, FilterKey } from '../../hooks/useFilter'
import { TECHNOLOGY_CATEGORY_LABELS, REVIEW_STATUS_LABELS, INCIDENT_CATEGORY_LABELS } from '../../constants/categories'

interface ActiveFilterBadgesProps {
  filters: FilterState
  onToggleFilter: (key: FilterKey, value: string) => void
  onClearFilters: () => void
}

const filterLabels: Record<FilterKey, string> = {
  region: '地域',
  domain: '分野',
  usecase_category: '分類',
  technology_category: '技術',
  review_status: '状態',
  incident_category: 'カテゴリ',
  severity: '深刻度',
}

const VALUE_LABELS: Record<string, Record<string, string>> = {
  technology_category: TECHNOLOGY_CATEGORY_LABELS,
  review_status: REVIEW_STATUS_LABELS,
  incident_category: INCIDENT_CATEGORY_LABELS,

}

export default function ActiveFilterBadges({ filters, onToggleFilter, onClearFilters }: ActiveFilterBadgesProps) {
  const keys: FilterKey[] = ['incident_category', 'technology_category', 'region', 'domain', 'usecase_category', 'review_status']
  const badges: { key: FilterKey; value: string }[] = []

  for (const key of keys) {
    for (const value of filters[key]) {
      badges.push({ key, value })
    }
  }

  if (badges.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      {badges.map(({ key, value }) => (
        <span
          key={`${key}-${value}`}
          className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 ring-1 ring-blue-200 rounded-full px-2.5 py-1"
        >
          <span className="text-blue-400">{filterLabels[key]}:</span>
          {VALUE_LABELS[key]?.[value] ?? value}
          <button
            type="button"
            onClick={() => onToggleFilter(key, value)}
            className="ml-0.5 text-blue-400 hover:text-blue-600"
            aria-label={`${value}を解除`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
            </svg>
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearFilters}
        className="text-xs text-red-500 hover:text-red-700 hover:underline"
      >
        すべてクリア
      </button>
    </div>
  )
}
