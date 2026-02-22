'use client'

import Link from 'next/link'

export default function HeaderSimple() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          ChciAI.cz
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-gray-700">
          <a href="#jak-to-funguje" className="hover:text-blue-600 transition-colors">
            Jak to funguje
          </a>
          <a href="#cena" className="hover:text-blue-600 transition-colors">
            Cena
          </a>
          <a href="#self-hosted" className="hover:text-purple-600 transition-colors">
            Self-Hosted
          </a>
          <a href="#faq" className="hover:text-blue-600 transition-colors">
            FAQ
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Přihlásit
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Začít
          </Link>
        </div>
      </nav>
    </header>
  )
}
