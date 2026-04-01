import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState, useRef } from 'react'
import { useCases } from '../context/useCases'
import { loadCase } from '../lib/data-loader'
import SourceList from '../components/case-detail/SourceList'
import { INCIDENT_CATEGORY_LABELS, SEVERITY_LABELS, REVIEW_STATUS_LABELS } from '../constants/categories'
import { usePageMeta } from '../hooks/usePageMeta'
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

  usePageMeta(
    caseData
      ? {
          title: caseData.title,
          description: caseData.summary.slice(0, 160),
        }
      : {},
  )

  // JSON-LD structured data
  const jsonLdRef = useRef<HTMLScriptElement | null>(null)
  useEffect(() => {
    if (!caseData) return

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: caseData.title,
      description: caseData.summary.slice(0, 160),
      author: { '@type': 'Organization', name: caseData.organization },
      datePublished: caseData.occurred_at ?? undefined,
      keywords: caseData.tags.join(', '),
      url: `https://gghatano.github.io/privacy-incident-catalog/cases/${caseData.id}`,
    })
    document.head.appendChild(script)
    jsonLdRef.current = script

    return () => {
      if (jsonLdRef.current) {
        document.head.removeChild(jsonLdRef.current)
        jsonLdRef.current = null
      }
    }
  }, [caseData])

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

      {caseData.ethical_notes && caseData.ethical_notes.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-yellow-800 mb-1">注意事項</p>
          {caseData.ethical_notes.map((note, i) => (
            <p key={i} className="text-sm text-yellow-700">{note}</p>
          ))}
        </div>
      )}

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

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-2">この事例の内容に誤りや追加情報がありましたら、ぜひお知らせください。</p>
        <a
          href={`https://github.com/gghatano/privacy-incident-catalog/issues/new?title=${encodeURIComponent(`[事例フィードバック] ${caseData.id}: ${caseData.title}`)}&body=${encodeURIComponent(`## 事例ID\n${caseData.id}\n\n## フィードバック種別\n- [ ] 事実誤認の指摘\n- [ ] 出典の追加提案\n- [ ] 表現の改善提案\n- [ ] その他\n\n## 詳細\n\n## 出典URL（任意）\n`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          この事例について報告・議論する
        </a>
      </div>
    </div>
  )
}
