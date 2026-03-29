import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useCases } from '../context/useCases'
import { loadCase } from '../lib/data-loader'
import CaseForm from '../components/case-form/CaseForm'
import type { Case } from '../types/case'
import type { CaseFormData } from '../schemas/case.schema'

function caseToFormData(c: Case): Partial<CaseFormData> {
  return {
    ...c,
    occurred_at: c.occurred_at ?? '',
    domain_sub: c.domain_sub ?? '',
  }
}

export default function EditPage() {
  const { id } = useParams<{ id: string }>()
  const { cases } = useCases()

  const contextCase = useMemo(() => cases.find((c) => c.id === id) ?? null, [cases, id])

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
      <h1 className="text-2xl font-bold mb-6">事例の編集: {caseData.title}</h1>
      <CaseForm defaultValues={caseToFormData(caseData)} isEdit />
    </div>
  )
}
