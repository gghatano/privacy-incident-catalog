import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '..', 'dist')
const casesDir = path.resolve(__dirname, '..', 'public', 'cases')

const BASE_URL = 'https://gghatano.github.io/privacy-incident-catalog'

const staticPages = ['/', '/stats', '/about']

const caseIds = fs
  .readdirSync(casesDir)
  .filter((entry) => {
    const entryPath = path.join(casesDir, entry)
    return fs.statSync(entryPath).isDirectory()
  })
  .sort()

const today = new Date().toISOString().split('T')[0]

const urls = [
  ...staticPages.map(
    (page) =>
      `  <url>\n    <loc>${BASE_URL}${page}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`,
  ),
  ...caseIds.map(
    (id) =>
      `  <url>\n    <loc>${BASE_URL}/cases/${id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`,
  ),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)
console.log(`sitemap.xml 生成完了（${staticPages.length + caseIds.length} URL）`)
