import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useCases } from '../context/useCases'
import { loadCase } from '../lib/data-loader'
import SourceList from '../components/case-detail/SourceList'
import { INCIDENT_CATEGORY_LABELS, SEVERITY_LABELS, REVIEW_STATUS_LABELS } from '../constants/categories'
import type { Case, Severity } from '../types/case'

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
}

function Section({ title, content }: { title: string; content: string }) {
  if (!content) return null
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
    </section>
  )
}

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const { cases } = useCases()

  // Try to find the case in the already-loaded context data
  const contextCase = useMemo(() => cases.find((c) => c.id === id) ?? null, [cases, id])

  // Fallback: load individually if not found in context
  const needsFetch = !contextCase && !!id
  const [fetchedCase, setFetchedCase] = useState<Case | null>(null)
  const [fetchDone, setFetchDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!needsFetch) return

    let cancelled = false
    loadCase(id!)
      .then((data) => {
        if (!cancelled) {
          setFetchedCase(data)
          setFetchDone(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('事例が見つかりませんでした')
          setFetchDone(true)
        }
      })
    return () => { cancelled = true }
  }, [id, needsFetch])

  const caseData = contextCase ?? fetchedCase
  const loading = needsFetch && !fetchDone

  if (loading) {
    return <p className="text-center py-12 text-gray-500">読み込み中...</p>
  }

  if (error || !caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error ?? '事例が見つかりませんでした'}</p>
        <Link to="/" className="text-blue-600 hover:underline">&larr; 一覧に戻る</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          &larr; 一覧に戻る
        </Link>
        <Link
          to={`/cases/${caseData.id}/edit`}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          編集
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">{caseData.title}</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-gray-500">組織</dt>
            <dd className="font-medium">{caseData.organization}</dd>
          </div>
          <div>
            <dt className="text-gray-500">地域</dt>
            <dd className="font-medium">{caseData.region}</dd>
          </div>
          <div>
            <dt className="text-gray-500">分野</dt>
            <dd className="font-medium">{caseData.domain}</dd>
          </div>
          <div>
            <dt className="text-gray-500">発生時期</dt>
            <dd className="font-medium">{caseData.occurred_at ?? '不明'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">深刻度</dt>
            <dd>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SEVERITY_COLORS[caseData.severity]}`}>
                {SEVERITY_LABELS[caseData.severity]}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">カテゴリ</dt>
            <dd className="flex flex-wrap gap-1">
              {caseData.incident_category.map((cat) => (
                <span key={cat} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {INCIDENT_CATEGORY_LABELS[cat]}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">レビュー状態</dt>
            <dd className="font-medium">{REVIEW_STATUS_LABELS[caseData.review_status]}</dd>
          </div>
        </dl>
      </div>

      <Section title="概要" content={caseData.summary} />
      <Section title="影響" content={caseData.impact} />
      <Section title="根本原因" content={caseData.root_cause} />
      <Section title="対応" content={caseData.response} />
      <Section title="教訓" content={caseData.lessons_learned} />

      {caseData.tags.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">タグ</h2>
          <div className="flex flex-wrap gap-2">
            {caseData.tags.map((tag) => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      <SourceList sources={caseData.sources} />
    </div>
  )
}
