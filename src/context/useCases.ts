import { useContext } from 'react'
import { CaseContext } from './caseContextValue'
import type { CaseContextValue } from './caseContextValue'

export type { CaseContextValue }

export function useCases(): CaseContextValue {
  return useContext(CaseContext)
}
