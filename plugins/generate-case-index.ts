import { readdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import type { Plugin } from 'vite'

/**
 * public/cases/ 配下のフォルダを走査し、
 * case.json を持つフォルダのIDを index.json に書き出す Vite プラグイン。
 *
 * dev サーバー起動時・ビルド時に自動実行されるため、手動で index.json を更新する必要がなくなる。
 */
export default function generateCaseIndex(): Plugin {
  const casesDir = resolve('public/cases')

  function generate() {
    if (!existsSync(casesDir)) return

    const ids = readdirSync(casesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(casesDir, d.name, 'case.json')))
      .map((d) => d.name)
      .sort()

    const indexPath = join(casesDir, 'index.json')
    const newContent = JSON.stringify({ cases: ids }, null, 2) + '\n'

    // 変更がある場合のみ書き込み（不要なHMRトリガーを防止）
    const current = existsSync(indexPath) ? readFileSync(indexPath, 'utf-8') : ''
    if (current !== newContent) {
      writeFileSync(indexPath, newContent)
      console.log(`[generate-case-index] Updated index.json (${ids.length} cases)`)
    }
  }

  return {
    name: 'generate-case-index',
    buildStart() {
      generate()
    },
    configureServer(server) {
      // public/cases/ 配下のフォルダ追加・削除を監視
      server.watcher.on('addDir', (path) => {
        if (path.startsWith(casesDir)) generate()
      })
      server.watcher.on('unlinkDir', (path) => {
        if (path.startsWith(casesDir)) generate()
      })
      server.watcher.on('add', (path) => {
        if (path.endsWith('case.json') && path.startsWith(casesDir)) generate()
      })
      server.watcher.on('unlink', (path) => {
        if (path.endsWith('case.json') && path.startsWith(casesDir)) generate()
      })
    },
  }
}
