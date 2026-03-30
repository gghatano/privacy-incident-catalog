import { useState } from 'react'
import CaseForm from '../components/case-form/CaseForm'
import { caseSchema, type CaseFormData } from '../schemas/case.schema'
import { CASE_CREATE_PROMPT, CASE_CREATE_PROMPT_SHORT } from '../constants/prompts'

export default function NewPage() {
  const [showAssist, setShowAssist] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [parseError, setParseError] = useState<string | null>(null)
  const [importedData, setImportedData] = useState<Partial<CaseFormData> | undefined>(undefined)
  const [formKey, setFormKey] = useState(0)
  const [promptCopied, setPromptCopied] = useState(false)

  async function handleCopyPrompt() {
    await navigator.clipboard.writeText(CASE_CREATE_PROMPT)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  function handleApplyJson() {
    setParseError(null)
    let parsed: unknown
    try {
      parsed = JSON.parse(jsonInput)
    } catch {
      setParseError('JSONの形式が正しくありません。')
      return
    }

    const result = caseSchema.safeParse(parsed)
    if (!result.success) {
      const messages = result.error.issues.map(
        (e) => `${String(e.path.join('.'))}: ${e.message}`
      )
      setParseError(messages.join('\n'))
      return
    }

    setImportedData(result.data)
    setFormKey((k) => k + 1)
    setShowAssist(false)
    setJsonInput('')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">新規事例の作成</h1>

      {/* AI Assist Toggle */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowAssist((v) => !v)}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {showAssist ? 'AIアシストを閉じる' : 'AIアシストを使う'}
        </button>
      </div>

      {/* AI Assist Panel */}
      {showAssist && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-blue-900">AIアシストによる事例作成</h2>

          {/* Step 1: Prompt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">1. プロンプトをコピー</span>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="rounded border border-blue-300 bg-white px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
              >
                {promptCopied ? 'コピー済み' : 'コピー'}
              </button>
            </div>
            <pre className="overflow-auto max-h-60 rounded border border-blue-200 bg-white p-3 text-xs leading-relaxed text-gray-800 whitespace-pre-wrap">
              {CASE_CREATE_PROMPT}
            </pre>
          </div>

          {/* Step 2: Instructions */}
          <p className="text-sm text-blue-800">{CASE_CREATE_PROMPT_SHORT}</p>

          {/* Step 3: JSON Input */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              2. AIの出力JSONを貼り付け
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={8}
              className="block w-full rounded border border-blue-200 bg-white px-3 py-2 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder='{"id": "breach-0001", "title": "...", ...}'
            />
          </div>

          {/* Error */}
          {parseError && (
            <pre className="rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700 whitespace-pre-wrap">
              {parseError}
            </pre>
          )}

          {/* Step 4: Apply */}
          <button
            type="button"
            onClick={handleApplyJson}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            フォームに反映
          </button>
        </div>
      )}

      <CaseForm key={formKey} defaultValues={importedData} />
    </div>
  )
}
