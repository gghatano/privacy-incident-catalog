import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const casesDir = path.resolve(__dirname, '..', 'public', 'cases')
const distDir = path.resolve(__dirname, '..', 'dist')

const BASE_URL = 'https://gghatano.github.io/privacy-incident-catalog'

const caseIds = fs
  .readdirSync(casesDir)
  .filter((entry) => {
    const entryPath = path.join(casesDir, entry)
    return fs.statSync(entryPath).isDirectory()
  })
  .sort()

const lines: string[] = [
  '# データ活用・プライバシー炎上事例カタログ — 全事例サマリー',
  '',
  `> ${caseIds.length} 件の事例を収録。各事例の概要を以下に記載します。`,
  '',
]

for (const id of caseIds) {
  const caseFile = path.join(casesDir, id, 'case.json')
  if (!fs.existsSync(caseFile)) continue

  const data = JSON.parse(fs.readFileSync(caseFile, 'utf-8'))
  lines.push(`## ${data.title}`)
  lines.push('')
  lines.push(`- ID: ${data.id}`)
  lines.push(`- 組織: ${data.organization}`)
  lines.push(`- カテゴリ: ${(data.incident_category ?? []).join(', ')}`)
  lines.push(`- 深刻度: ${data.severity}`)
  lines.push(`- 発生時期: ${data.occurred_at ?? '不明'}`)
  lines.push(`- URL: ${BASE_URL}/cases/${data.id}`)
  lines.push('')
  lines.push(data.summary)
  lines.push('')
}

fs.writeFileSync(path.join(distDir, 'llms-full.txt'), lines.join('\n'))
console.log(`llms-full.txt 生成完了（${caseIds.length} 事例）`)
