import type { IncidentCategory, Severity, ReviewStatus } from '../types/case'

export const REGION_OPTIONS = ['国内', '国外'] as const

export const DOMAIN_OPTIONS = [
  '金融',
  '医療',
  '公共',
  '通信',
  'IT',
  'SNS・メディア',
  '小売',
  '製造',
  '教育',
  'モビリティ',
  'エネルギー',
] as const

export const INCIDENT_CATEGORY_OPTIONS: IncidentCategory[] = [
  'data_breach',
  'privacy_violation',
  'unauthorized_use',
  'inadequate_anonymization',
  'algorithmic_discrimination',
  'surveillance_tracking',
]

export const INCIDENT_CATEGORY_LABELS: Record<IncidentCategory, string> = {
  data_breach: 'データ漏洩',
  privacy_violation: 'プライバシー侵害',
  unauthorized_use: '同意なし利用',
  inadequate_anonymization: '不適切な匿名化',
  algorithmic_discrimination: 'アルゴリズム差別',
  surveillance_tracking: '監視・追跡',
}

export const SEVERITY_OPTIONS: Severity[] = ['critical', 'high', 'medium', 'low']

export const SEVERITY_LABELS: Record<Severity, string> = {
  critical: '重大',
  high: '高',
  medium: '中',
  low: '低',
}

export const REVIEW_STATUS_OPTIONS: ReviewStatus[] = [
  'ai_generated',
  'human_reviewed',
  'flagged',
  'under_review',
]

export const TECHNOLOGY_CATEGORY_LABELS: Record<string, string> = {
  ai_ml: 'AI/機械学習',
  big_data: 'ビッグデータ',
  iot: 'IoT',
  cloud: 'クラウド',
  biometrics: '生体認証',
  location: '位置情報',
  sns: 'SNS',
  other: 'その他',
}

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  ai_generated: 'AI生成',
  human_reviewed: 'レビュー済',
  flagged: '要確認',
  under_review: 'レビュー中',
}
