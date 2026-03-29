import { useCases } from '../context/useCases'
import { INCIDENT_CATEGORY_LABELS, SEVERITY_LABELS } from '../constants/categories'
import type { IncidentCategory, Severity } from '../types/case'

function countBy<T>(items: T[], keyFn: (item: T) => string | string[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const item of items) {
    const keys = keyFn(item)
    const arr = Array.isArray(keys) ? keys : [keys]
    for (const key of arr) {
      counts[key] = (counts[key] ?? 0) + 1
    }
  }
  return counts
}

const CATEGORY_COLORS: Record<IncidentCategory, string> = {
  data_breach: 'bg-red-400',
  privacy_violation: 'bg-blue-400',
  unauthorized_use: 'bg-amber-400',
  inadequate_anonymization: 'bg-purple-400',
  algorithmic_discrimination: 'bg-green-400',
  surveillance_tracking: 'bg-slate-400',
}

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'bg-red-400',
  high: 'bg-orange-400',
  medium: 'bg-yellow-400',
  low: 'bg-green-400',
}

const REGION_COLORS: Record<string, string> = {
  '国内': 'bg-blue-400',
  '国外': 'bg-orange-400',
}

interface StatsEntry {
  key: string
  label: string
  count: number
  color: string
}

function BarChart({ entries, maxCount }: { entries: StatsEntry[]; maxCount: number }) {
  return (
    <div className="space-y-2 mb-4">
      {entries.map((entry) => (
        <div key={entry.key} className="flex items-center gap-3">
          <span className="text-xs sm:text-sm w-24 sm:w-36 shrink-0 truncate text-right" title={entry.label}>
            {entry.label}
          </span>
          <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
            <div
              className={`h-full rounded ${entry.color} transition-all`}
              style={{ width: maxCount > 0 ? `${(entry.count / maxCount) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-sm font-medium w-8 text-right">{entry.count}</span>
        </div>
      ))}
    </div>
  )
}

function StatsSection({
  title,
  data,
  labels,
  colors,
  sortByKey,
}: {
  title: string
  data: Record<string, number>
  labels?: Record<string, string>
  colors?: Record<string, string>
  sortByKey?: boolean
}) {
  let entries = Object.entries(data)
  if (sortByKey) {
    // Sort by key ascending, but push "不明" to the end
    entries.sort((a, b) => {
      if (a[0] === '不明') return 1
      if (b[0] === '不明') return -1
      return a[0].localeCompare(b[0])
    })
  } else {
    entries.sort((a, b) => b[1] - a[1])
  }

  if (entries.length === 0) return null

  const maxCount = Math.max(...entries.map(([, c]) => c))
  const defaultColor = 'bg-sky-400'

  const chartEntries: StatsEntry[] = entries.map(([key, count]) => ({
    key,
    label: labels?.[key] ?? key,
    count,
    color: colors?.[key] ?? defaultColor,
  }))

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <BarChart entries={chartEntries} maxCount={maxCount} />
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 text-gray-500 font-medium">項目</th>
            <th className="text-right py-2 text-gray-500 font-medium">件数</th>
          </tr>
        </thead>
        <tbody>
          {chartEntries.map((entry) => (
            <tr key={entry.key} className="border-b border-gray-100 last:border-0">
              <td className="py-2">{entry.label}</td>
              <td className="py-2 text-right font-medium">{entry.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function extractYear(occurredAt: string | null): string {
  if (!occurredAt) return '不明'
  const match = occurredAt.match(/^(\d{4})/)
  return match ? match[1] : '不明'
}

export default function StatsPage() {
  const { cases, loading, error } = useCases()

  if (loading) {
    return <p className="text-center py-12 text-gray-500">読み込み中...</p>
  }

  if (error) {
    return <p className="text-center py-12 text-red-500">{error}</p>
  }

  const byCategory = countBy(cases, (c) => c.incident_category)
  const bySeverity = countBy(cases, (c) => c.severity)
  const byRegion = countBy(cases, (c) => c.region)
  const byDomain = countBy(cases, (c) => c.domain)
  const byYear = countBy(cases, (c) => extractYear(c.occurred_at))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">統計</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <p className="text-sm text-gray-500">総事例数</p>
        <p className="text-4xl font-bold">{cases.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsSection
          title="カテゴリ別"
          data={byCategory}
          labels={INCIDENT_CATEGORY_LABELS as Record<string, string>}
          colors={CATEGORY_COLORS}
        />
        <StatsSection
          title="深刻度別"
          data={bySeverity}
          labels={SEVERITY_LABELS as Record<string, string>}
          colors={SEVERITY_COLORS}
        />
        <StatsSection
          title="地域別"
          data={byRegion}
          colors={REGION_COLORS}
        />
        <StatsSection
          title="ドメイン別"
          data={byDomain}
        />
        <StatsSection
          title="年別"
          data={byYear}
          sortByKey
        />
      </div>
    </div>
  )
}
