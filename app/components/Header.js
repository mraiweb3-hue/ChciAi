'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">ChciAI.cz</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#priklady" className="text-gray-700 hover:text-blue-600 transition-colors">
              Příklady
            </a>
            <a href="#sluzby" className="text-gray-700 hover:text-blue-600 transition-colors">
              Služby
            </a>
            <a href="#jak-to-funguje" className="text-gray-700 hover:text-blue-600 transition-colors">
              Jak to funguje
            </a>
            <a href="#kontakt" className="text-gray-700 hover:text-blue-600 transition-colors">
              Kontakt
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Přihlásit se
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Začít zdarma
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 py-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-4">
              <a href="#priklady" className="text-gray-700 hover:text-blue-600 transition-colors">
                Příklady
              </a>
              <a href="#sluzby" className="text-gray-700 hover:text-blue-600 transition-colors">
                Služby
              </a>
              <a href="#jak-to-funguje" className="text-gray-700 hover:text-blue-600 transition-colors">
                Jak to funguje
              </a>
              <a href="#kontakt" className="text-gray-700 hover:text-blue-600 transition-colors">
                Kontakt
              </a>
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                <Link
                  href="/login"
                  className="text-center py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Přihlásit se
                </Link>
                <Link
                  href="/signup"
                  className="text-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Začít zdarma
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}
