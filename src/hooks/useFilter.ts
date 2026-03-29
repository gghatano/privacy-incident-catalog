import { useState, useMemo, useCallback } from 'react'
import type { Case } from '../types/case'

export interface FilterState {
  query: string
  sortBy: string
  page: number
  region: string[]
  domain: string[]
  usecase_category: string[]
  technology_category: string[]
  review_status: string[]
  incident_category: string[]
  severity: string[]
}

export type FilterKey = keyof Omit<FilterState, 'query' | 'sortBy' | 'page'>

const initialState: FilterState = {
  query: '',
  sortBy: 'occurred_at',
  page: 1,
  region: [],
  domain: [],
  usecase_category: [],
  technology_category: [],
  review_status: [],
  incident_category: [],
  severity: [],
}

export function useFilter(cases: Case[]) {
  const [filters, setFilters] = useState<FilterState>(initialState)

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query, page: 1 }))
  }, [])

  const setSortBy = useCallback((sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }, [])

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const toggleFilter = useCallback((key: FilterKey, value: string) => {
    setFilters((prev) => {
      const current = prev[key]
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [key]: next, page: 1 }
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialState)
  }, [])

  const filtered = useMemo(() => {
    let result = cases

    if (filters.query) {
      const q = filters.query.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    if (filters.region.length > 0) {
      result = result.filter((c) => filters.region.includes(c.region))
    }

    if (filters.domain.length > 0) {
      result = result.filter((c) => filters.domain.includes(c.domain))
    }

    if (filters.review_status.length > 0) {
      result = result.filter((c) => filters.review_status.includes(c.review_status))
    }

    if (filters.incident_category.length > 0) {
      result = result.filter((c) =>
        c.incident_category.some((cat) => filters.incident_category.includes(cat)),
      )
    }

    if (filters.severity.length > 0) {
      result = result.filter((c) => filters.severity.includes(c.severity))
    }

    if (filters.sortBy === 'occurred_at') {
      result = [...result].sort((a, b) => {
        const da = a.occurred_at ?? ''
        const db = b.occurred_at ?? ''
        return db.localeCompare(da)
      })
    }

    return result
  }, [cases, filters])

  return {
    filters,
    filtered,
    setQuery,
    setSortBy,
    setPage,
    toggleFilter,
    clearFilters,
  }
}
