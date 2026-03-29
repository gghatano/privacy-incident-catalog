export default function AboutPage() {
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

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-3">免責事項</h2>
        <p className="text-gray-700 leading-relaxed">
          本サイトの情報は公開情報に基づくものであり、正確性・最新性を保証するものではありません。
          本サイトの情報を利用したことにより生じたいかなる損害についても、一切の責任を負いません。
          個別の事例についての法的助言を提供するものではありません。
        </p>
      </section>
    </div>
  )
}
