import type { ReviewStatus } from '../types/case'
import { REVIEW_STATUS_LABELS } from '../constants/categories'

const REVIEW_STATUS_COLORS: Record<ReviewStatus, string> = {
  ai_generated: 'bg-gray-100 text-gray-600',
  under_review: 'bg-yellow-100 text-yellow-800',
  human_reviewed: 'bg-green-100 text-green-800',
  flagged: 'bg-red-100 text-red-800',
}

export default function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${REVIEW_STATUS_COLORS[status]}`}
    >
      {REVIEW_STATUS_LABELS[status]}
    </span>
  )
}
