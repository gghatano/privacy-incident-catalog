import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { caseSchema, type CaseFormData } from '../../schemas/case.schema'
import { generateCaseId } from '../../lib/generate-id'
import {
  REGION_OPTIONS,
  DOMAIN_OPTIONS,
  INCIDENT_CATEGORY_OPTIONS,
  INCIDENT_CATEGORY_LABELS,
  SEVERITY_OPTIONS,
  SEVERITY_LABELS,
  REVIEW_STATUS_OPTIONS,
  REVIEW_STATUS_LABELS,
} from '../../constants/categories'
import TagInput from './TagInput'
import { Link } from 'react-router-dom'

interface CaseFormProps {
  defaultValues?: Partial<CaseFormData>
  isEdit?: boolean
}

const inputClass =
  'mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none'
const labelClass = 'block text-sm font-medium text-gray-700'
const errorClass = 'mt-1 text-xs text-red-600'
const sectionClass = 'space-y-4 border-b border-gray-200 pb-6'

export default function CaseForm({ defaultValues, isEdit }: CaseFormProps) {
  const [outputJson, setOutputJson] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // 新規作成時はランダムIDを自動生成（既存IDがあればそちらを優先）
  const autoId = isEdit ? '' : generateCaseId()
  const mergedDefaults = {
    id: '',
    title: '',
    region: '',
    domain: '',
    domain_sub: '',
    organization: '',
    incident_category: [] as CaseFormData['incident_category'],
    severity: 'medium' as const,
    occurred_at: '',
    summary: '',
    impact: '',
    root_cause: '',
    response: '',
    lessons_learned: '',
    tags: [] as string[],
    sources: [{ source_type: 'web' as const, title: '', url: '', note: '' }],
    figures: [] as CaseFormData['figures'],
    review_status: 'ai_generated' as const,
    status: 'seed' as const,
    ...defaultValues,
  }
  // defaultValues に ID がなければ自動生成IDを使用
  if (!mergedDefaults.id) {
    mergedDefaults.id = autoId
  }

  const methods = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: mergedDefaults,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  const {
    fields: sourceFields,
    append: appendSource,
    remove: removeSource,
  } = useFieldArray({ control: methods.control, name: 'sources' })

  function onSubmit(data: CaseFormData) {
    // Convert empty occurred_at to null
    const output = {
      ...data,
      occurred_at: data.occurred_at === '' ? null : data.occurred_at,
      // Remove empty optional fields
      domain_sub: data.domain_sub || undefined,
    }
    // Remove empty note from sources
    output.sources = output.sources.map((s) => {
      const { note, ...rest } = s
      return note ? { ...rest, note } : rest
    })
    setOutputJson(JSON.stringify(output, null, 2))
    setCopied(false)
  }

  async function handleCopy() {
    if (!outputJson) return
    await navigator.clipboard.writeText(outputJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    if (!outputJson) return
    const blob = new Blob([outputJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'case.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <fieldset className={sectionClass}>
          <legend className="text-lg font-semibold text-gray-900 mb-2">基本情報</legend>

          <div>
            <label htmlFor="id" className={labelClass}>ID</label>
            <div className="flex gap-2 items-end">
              <input id="id" type="text" {...register('id')} className={inputClass + ' flex-1'} placeholder="自動生成されます" />
              {!isEdit && (
                <button
                  type="button"
                  onClick={() => methods.setValue('id', generateCaseId())}
                  className="mt-1 shrink-0 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  再生成
                </button>
              )}
            </div>
            {errors.id && <p className={errorClass}>{errors.id.message}</p>}
          </div>

          <div>
            <label htmlFor="title" className={labelClass}>タイトル</label>
            <input id="title" type="text" {...register('title')} className={inputClass} />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="region" className={labelClass}>地域</label>
              <select id="region" {...register('region')} className={inputClass}>
                <option value="">選択してください</option>
                {REGION_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.region && <p className={errorClass}>{errors.region.message}</p>}
            </div>

            <div>
              <label htmlFor="domain" className={labelClass}>分野</label>
              <select id="domain" {...register('domain')} className={inputClass}>
                <option value="">選択してください</option>
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.domain && <p className={errorClass}>{errors.domain.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="domain_sub" className={labelClass}>サブ分野（任意）</label>
            <input id="domain_sub" type="text" {...register('domain_sub')} className={inputClass} />
          </div>

          <div>
            <label htmlFor="organization" className={labelClass}>組織</label>
            <input id="organization" type="text" {...register('organization')} className={inputClass} />
            {errors.organization && <p className={errorClass}>{errors.organization.message}</p>}
          </div>
        </fieldset>

        {/* Classification */}
        <fieldset className={sectionClass}>
          <legend className="text-lg font-semibold text-gray-900 mb-2">分類</legend>

          <div>
            <span className={labelClass}>インシデントカテゴリ</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {INCIDENT_CATEGORY_OPTIONS.map((cat) => (
                <label key={cat} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    value={cat}
                    {...register('incident_category')}
                    className="rounded border-gray-300"
                  />
                  {INCIDENT_CATEGORY_LABELS[cat]}
                </label>
              ))}
            </div>
            {errors.incident_category && (
              <p className={errorClass}>{errors.incident_category.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="severity" className={labelClass}>深刻度</label>
              <select id="severity" {...register('severity')} className={inputClass}>
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>{SEVERITY_LABELS[s]}</option>
                ))}
              </select>
              {errors.severity && <p className={errorClass}>{errors.severity.message}</p>}
            </div>

            <div>
              <label htmlFor="occurred_at" className={labelClass}>発生時期</label>
              <input
                id="occurred_at"
                type="text"
                {...register('occurred_at')}
                className={inputClass}
                placeholder="YYYY / YYYY-MM / YYYY-MM-DD / 空欄"
              />
              {errors.occurred_at && <p className={errorClass}>{errors.occurred_at.message}</p>}
            </div>
          </div>
        </fieldset>

        {/* Description */}
        <fieldset className={sectionClass}>
          <legend className="text-lg font-semibold text-gray-900 mb-2">詳細</legend>

          {(['summary', 'impact', 'root_cause', 'response', 'lessons_learned'] as const).map(
            (field) => {
              const labels: Record<string, string> = {
                summary: '概要',
                impact: '影響',
                root_cause: '根本原因',
                response: '対応',
                lessons_learned: '教訓',
              }
              return (
                <div key={field}>
                  <label htmlFor={field} className={labelClass}>{labels[field]}</label>
                  <textarea
                    id={field}
                    rows={4}
                    {...register(field)}
                    className={inputClass + ' resize-y'}
                  />
                  {errors[field] && <p className={errorClass}>{errors[field]?.message}</p>}
                </div>
              )
            },
          )}
        </fieldset>

        {/* Tags */}
        <fieldset className={sectionClass}>
          <legend className="text-lg font-semibold text-gray-900 mb-2">タグ</legend>
          <TagInput />
        </fieldset>

        {/* Sources */}
        <fieldset className={sectionClass}>
          <legend className="text-lg font-semibold text-gray-900 mb-2">出典</legend>
          {errors.sources && !Array.isArray(errors.sources) && (
            <p className={errorClass}>{errors.sources.message}</p>
          )}
          {errors.sources?.root && (
            <p className={errorClass}>{errors.sources.root.message}</p>
          )}

          {sourceFields.map((field, index) => (
            <div key={field.id} className="rounded border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">出典 {index + 1}</span>
                {sourceFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSource(index)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    削除
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>種別</label>
                  <select {...register(`sources.${index}.source_type`)} className={inputClass}>
                    <option value="web">Web</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>タイトル</label>
                  <input type="text" {...register(`sources.${index}.title`)} className={inputClass} />
                  {errors.sources?.[index]?.title && (
                    <p className={errorClass}>{errors.sources[index].title?.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>URL</label>
                <input type="text" {...register(`sources.${index}.url`)} className={inputClass} />
                {errors.sources?.[index]?.url && (
                  <p className={errorClass}>{errors.sources[index].url?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>メモ（任意）</label>
                <input type="text" {...register(`sources.${index}.note`)} className={inputClass} />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendSource({ source_type: 'web', title: '', url: '' })}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + 出典を追加
          </button>
        </fieldset>

        {/* Review / Status */}
        <fieldset className={sectionClass}>
          <legend className="text-lg font-semibold text-gray-900 mb-2">ステータス</legend>

          <div>
            <label htmlFor="review_status" className={labelClass}>レビュー状態</label>
            <select id="review_status" {...register('review_status')} className={inputClass}>
              {REVIEW_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{REVIEW_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          <input type="hidden" {...register('status')} value="seed" />
        </fieldset>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEdit ? 'JSON を生成' : 'JSON を生成'}
          </button>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
            戻る
          </Link>
        </div>
      </form>

      {/* Output */}
      {outputJson && (
        <div className="mt-8 rounded border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">生成された case.json</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                {copied ? 'コピー済み' : 'コピー'}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                ダウンロード
              </button>
            </div>
          </div>
          <pre className="overflow-auto rounded bg-white border border-gray-200 p-3 text-xs leading-relaxed max-h-96">
            {outputJson}
          </pre>
        </div>
      )}
    </FormProvider>
  )
}
