export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 space-y-1">
        <p>&copy; {new Date().getFullYear()} データ活用・プライバシー炎上事例カタログ</p>
        <p>
          ソースコード・データは{' '}
          <a
            href="https://github.com/gghatano/privacy-incident-catalog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </a>{' '}
          で公開しています
        </p>
      </div>
    </footer>
  )
}
