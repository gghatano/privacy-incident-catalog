import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-gray-900 hover:text-blue-700">
          プライバシー事例カタログ
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-4 text-sm">
          <Link to="/" className="text-gray-600 hover:text-blue-700">
            事例一覧
          </Link>
          <Link to="/new" className="text-gray-600 hover:text-blue-700">
            新規作成
          </Link>
          <Link to="/stats" className="text-gray-600 hover:text-blue-700">
            統計
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-700">
            このサイトについて
          </Link>
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
          aria-label="メニュー"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-gray-200 px-4 py-2 space-y-1">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-600 hover:text-blue-700">
            事例一覧
          </Link>
          <Link to="/new" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-600 hover:text-blue-700">
            新規作成
          </Link>
          <Link to="/stats" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-600 hover:text-blue-700">
            統計
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-600 hover:text-blue-700">
            このサイトについて
          </Link>
        </nav>
      )}
    </header>
  )
}
