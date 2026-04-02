import { usePageMeta } from '../hooks/usePageMeta'

export default function AboutPage() {
  usePageMeta({
    title: 'このサイトについて',
    description: 'データ活用・プライバシー炎上事例カタログの目的・掲載情報・利用上の注意について。',
  })

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">このサイトについて</h1>

      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">目的</h2>
        <p className="text-gray-700 leading-relaxed">
          データ活用・プライバシー炎上事例カタログは、データ活用やプライバシーに関する炎上・トラブル事例を収集・整理・検索できるWebカタログです。
          過去の事例から学び、同様のトラブルを未然に防ぐための参考情報を提供することを目的としています。
        </p>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">掲載情報について</h2>
        <p className="text-gray-700 leading-relaxed">
          掲載されている事例は、公開されている報道記事・調査報告書等の情報に基づいて作成されています。
          事実に基づく記述を心がけていますが、情報の正確性・完全性を保証するものではありません。
        </p>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">免責事項</h2>
        <p className="text-gray-700 leading-relaxed">
          本サイトの情報は公開情報に基づくものであり、正確性・最新性を保証するものではありません。
          本サイトの情報を利用したことにより生じたいかなる損害についても、一切の責任を負いません。
          個別の事例についての法的助言を提供するものではありません。
        </p>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">ソースコード・データ</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          本カタログのソースコードおよび事例データはGitHubリポジトリで公開しています。
        </p>
        <a
          href="https://github.com/gghatano/privacy-incident-catalog"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          GitHub リポジトリ
        </a>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-3">フィードバック</h2>
        <p className="text-gray-700 leading-relaxed">
          事例の内容に誤りを発見した場合や、追加情報をお持ちの場合は、各事例の詳細ページにある「この事例について報告・議論する」ボタンからGitHub Issueを作成できます。
        </p>
      </section>
    </div>
  )
}
