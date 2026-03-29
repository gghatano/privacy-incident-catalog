import type { Case } from '../types/case'

const BASE = import.meta.env.BASE_URL

export async function loadCaseIndex(): Promise<string[]> {
  const res = await fetch(`${BASE}cases/index.json`)
  if (!res.ok) throw new Error(`Failed to load case index: ${res.status}`)
  const data: { cases: string[] } = await res.json()
  return data.cases
}

export async function loadCase(id: string): Promise<Case> {
  const res = await fetch(`${BASE}cases/${id}/case.json`)
  if (!res.ok) throw new Error(`Failed to load case ${id}: ${res.status}`)
  return res.json()
}

export async function loadAllCases(): Promise<Case[]> {
  const ids = await loadCaseIndex()
  const cases = await Promise.all(ids.map((id) => loadCase(id)))
  return cases
}
