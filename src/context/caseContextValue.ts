import { createContext } from 'react'
import type { Case } from '../types/case'

export interface CaseContextValue {
  cases: Case[]
  loading: boolean
  error: string | null
}

export const CaseContext = createContext<CaseContextValue>({
  cases: [],
  loading: true,
  error: null,
})
