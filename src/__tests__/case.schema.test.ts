import { describe, it, expect } from 'vitest'
import { caseSchema } from '../schemas/case.schema'

const validCase = {
  id: 'test-001',
  title: 'テスト事例',
  region: '日本',
  domain: 'IT',
  organization: 'テスト株式会社',
  incident_category: ['data_breach'],
  severity: 'high',
  occurred_at: '2024-01',
  summary: '個人情報が漏洩した事例',
  impact: 'ユーザー1万人の個人情報が流出',
  root_cause: 'セキュリティ設定の不備',
  response: '即座にサービスを停止し、影響範囲を調査',
  lessons_learned: 'セキュリティ監査の定期実施が重要',
  tags: ['個人情報', '漏洩'],
  sources: [
    {
      source_type: 'web',
      title: '報道記事',
      url: 'https://example.com/article',
    },
  ],
  figures: [],
  review_status: 'ai_generated',
  status: 'draft',
}

describe('caseSchema', () => {
  it('正常な case データがパースできる', () => {
    const result = caseSchema.safeParse(validCase)
    expect(result.success).toBe(true)
  })

  it('必須フィールド (title) が欠落しているとエラーになる', () => {
    const { title: _, ...incomplete } = validCase
    const result = caseSchema.safeParse(incomplete)
    expect(result.success).toBe(false)
  })

  it('sources が空配列の場合エラーになる (min(1))', () => {
    const noSources = { ...validCase, sources: [] }
    const result = caseSchema.safeParse(noSources)
    expect(result.success).toBe(false)
  })

  it('不正な severity 値でエラーになる', () => {
    const badSeverity = { ...validCase, severity: 'unknown' }
    const result = caseSchema.safeParse(badSeverity)
    expect(result.success).toBe(false)
  })

  it('occurred_at が null でもパースできる', () => {
    const nullDate = { ...validCase, occurred_at: null }
    const result = caseSchema.safeParse(nullDate)
    expect(result.success).toBe(true)
  })

  it('オプショナルフィールド (domain_sub, editorial_notes) がなくてもパースできる', () => {
    const result = caseSchema.safeParse(validCase)
    expect(result.success).toBe(true)
    // domain_sub と editorial_notes は validCase に含まれていない
    expect(validCase).not.toHaveProperty('domain_sub')
    expect(validCase).not.toHaveProperty('editorial_notes')
  })
})
