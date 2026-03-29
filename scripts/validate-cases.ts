import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { caseSchema } from '../src/schemas/case.schema.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const casesDir = path.resolve(__dirname, '..', 'public', 'cases')

interface IndexJson {
  cases: string[]
}

const indexPath = path.join(casesDir, 'index.json')
const indexRaw = fs.readFileSync(indexPath, 'utf-8')
const index: IndexJson = JSON.parse(indexRaw)

if (index.cases.length === 0) {
  console.log('事例なし（index.json が空配列です）')
  process.exit(0)
}

let errorCount = 0

for (const id of index.cases) {
  const casePath = path.join(casesDir, id, 'case.json')

  if (!fs.existsSync(casePath)) {
    console.error(`[ERROR] ${id}: case.json が見つかりません (${casePath})`)
    errorCount++
    continue
  }

  const raw = fs.readFileSync(casePath, 'utf-8')
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    console.error(`[ERROR] ${id}: JSON パースに失敗しました`)
    errorCount++
    continue
  }

  const result = caseSchema.safeParse(data)
  if (!result.success) {
    console.error(`[ERROR] ${id}: バリデーションエラー`)
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
    }
    errorCount++
  }
}

if (errorCount > 0) {
  console.error(`\nバリデーション失敗: ${errorCount} 件のエラー`)
  process.exit(1)
} else {
  console.log(`バリデーション成功: ${index.cases.length} 件の事例を検証しました`)
  process.exit(0)
}
