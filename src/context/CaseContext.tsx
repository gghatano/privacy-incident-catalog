import { useEffect, useState, type ReactNode } from 'react'
import type { Case } from '../types/case'
import { loadAllCases } from '../lib/data-loader'
import { CaseContext } from './caseContextValue'

export function CaseProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAllCases()
      .then((data) => {
        setCases(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : '読み込みに失敗しました')
        setLoading(false)
      })
  }, [])

  return (
    <CaseContext.Provider value={{ cases, loading, error }}>
      {children}
    </CaseContext.Provider>
  )
}
