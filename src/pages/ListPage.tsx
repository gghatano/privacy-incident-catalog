import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCases } from '../context/useCases'
import { useFilter } from '../hooks/useFilter'
import SummaryDashboard from '../components/case-list/SummaryDashboard'
import SearchBar from '../components/case-list/SearchBar'
import ActiveFilterBadges from '../components/case-list/ActiveFilterBadges'
import FilterPanel from '../components/case-list/FilterPanel'
import Pagination from '../components/case-list/Pagination'
import { INCIDENT_CATEGORY_LABELS, SEVERITY_LABELS } from '../constants/categories'
import ReviewStatusBadge from '../components/ReviewStatusBadge'
import type { Case, Severity } from '../types/case'

const PER_PAGE_CARD = 12
const PER_PAGE_TABLE = 30

type ViewMode = 'card' | 'table'

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${SEVERITY_COLORS[severity]}`}>
      {SEVERITY_LABELS[severity]}
    </span>
  )
}

function CaseTable({ cases }: { cases: Case[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50 text-left">
            <th className="py-2.5 px-3 font-medium text-gray-600 whitespace-nowrap">タイトル</th>
            <th className="py-2.5 px-3 font-medium text-gray-600 whitespace-nowrap">カテゴリ</th>
            <th className="py-2.5 px-3 font-medium text-gray-600 whitespace-nowrap">深刻度</th>
            <th className="py-2.5 px-3 font-medium text-gray-600 whitespace-nowrap">地域</th>
            <th className="py-2.5 px-3 font-medium text-gray-600 whitespace-nowrap">分野</th>
            <th className="py-2.5 px-3 font-medium text-gray-600 whitespace-nowrap">ステータス</th>
            <th className="py-2.5 px-3 font-medium text-gray-600 whitespace-nowrap">発生時期</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
              <td className="py-2.5 px-3 max-w-xs">
                <Link to={`cases/${c.id}`} className="text-blue-700 hover:underline font-medium line-clamp-2">
                  {c.title}
                </Link>
              </td>
              <td className="py-2.5 px-3">
                <div className="flex flex-wrap gap-1">
                  {c.incident_category.map((cat) => (
                    <span key={cat} className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded whitespace-nowrap">
                      {INCIDENT_CATEGORY_LABELS[cat]}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-2.5 px-3"><SeverityBadge severity={c.severity} /></td>
              <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{c.region}</td>
              <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{c.domain}</td>
              <td className="py-2.5 px-3"><ReviewStatusBadge status={c.review_status} /></td>
              <td className="py-2.5 px-3 text-gray-400 whitespace-nowrap">{c.occurred_at ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ListPage() {
  const { cases, loading, error } = useCases()
  const { filters, filtered, setQuery, setPage, toggleFilter, clearFilters } = useFilter(cases)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('card')

  if (loading) {
    return <p className="text-center py-12 text-gray-500">読み込み中...</p>
  }

  if (error) {
    return <p className="text-center py-12 text-red-500">{error}</p>
  }

  const perPage = viewMode === 'table' ? PER_PAGE_TABLE : PER_PAGE_CARD
  const totalPages = Math.ceil(filtered.length / perPage)
  const start = (filters.page - 1) * perPage
  const paginated = filtered.slice(start, start + perPage)

  return (
    <div className="flex gap-6">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <FilterPanel filters={filters} cases={cases} onToggleFilter={toggleFilter} />
      </aside>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-4 overflow-y-auto shadow-lg transform transition-transform lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-gray-900">フィルタ</span>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="フィルタを閉じる"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        <FilterPanel filters={filters} cases={cases} onToggleFilter={toggleFilter} />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <SummaryDashboard cases={cases} onToggleFilter={toggleFilter} filters={filters} />

        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-2"
            aria-label="フィルタを開く"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
            </svg>
            フィルタ
          </button>
          <div className="flex-1">
            <SearchBar value={filters.query} onChange={setQuery} />
          </div>
        </div>

        <ActiveFilterBadges
          filters={filters}
          onToggleFilter={toggleFilter}
          onClearFilters={clearFilters}
        />

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{filtered.length} 件の事例</p>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => { setViewMode('card'); setPage(1) }}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              aria-label="カード表示"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => { setViewMode('table'); setPage(1) }}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              aria-label="テーブル表示"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <CaseTable cases={paginated} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.map((c) => (
              <Link
                key={c.id}
                to={`cases/${c.id}`}
                className="relative block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="absolute top-3 right-3">
                  <ReviewStatusBadge status={c.review_status} />
                </div>
                <h2 className="text-base font-semibold mb-2 pr-20 line-clamp-2">{c.title}</h2>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  <SeverityBadge severity={c.severity} />
                  {c.incident_category.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                    >
                      {INCIDENT_CATEGORY_LABELS[cat]}
                    </span>
                  ))}
                </div>

                {c.occurred_at && (
                  <p className="text-xs text-gray-400 mb-2">{c.occurred_at}</p>
                )}

                <p className="text-sm text-gray-600 line-clamp-3">
                  {c.summary.length > 100 ? c.summary.slice(0, 100) + '...' : c.summary}
                </p>
              </Link>
            ))}
          </div>
        )}

        <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}
