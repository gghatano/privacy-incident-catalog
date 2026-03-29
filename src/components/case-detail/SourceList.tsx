import type { Source } from '../../types'

interface SourceListProps {
  sources: Source[]
}

function SourceTypeLabel({ sourceType }: { sourceType: Source['source_type'] }) {
  if (sourceType === 'pdf') {
    return <span className="mr-1 text-red-600">[PDF]</span>
  }
  return <span className="mr-1 text-blue-600">[Web]</span>
}

export default function SourceList({ sources }: SourceListProps) {
  if (sources.length === 0) return null

  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">出典</h2>
      <ul className="space-y-2">
        {sources.map((source, i) => (
          <li key={i}>
            <SourceTypeLabel sourceType={source.source_type} />
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              {source.title}
            </a>
            {source.note && (
              <p className="mt-0.5 text-sm text-gray-500">{source.note}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
