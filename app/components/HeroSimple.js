'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSimple() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo/Brand */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">
              OpenClaw AI Agent
            </h1>
            <p className="text-xl md:text-2xl text-gray-600">
              Bezpečný hosting na českém VPS
            </p>
          </div>

          {/* Main value prop */}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Nainstalujeme vám OpenClaw<br />
            <span className="text-blue-600">zdarma na 24 hodin</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Vyzkoušejte bez platby • Český VPS • 24/7 AI podpora
          </p>

          {/* Clawix intro */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 max-w-2xl mx-auto mb-12">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🤖</div>
              <div className="text-left">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong className="text-blue-600">Ahoj, jsem Clawix!</strong> 👋<br />
                  Jsem OpenClaw AI agent - pomáhám Martinovi s instalací, podporou a školením. 
                  <strong> Stejného agenta můžete mít vy pro své zákazníky!</strong>
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/signup"
              className="px-10 py-5 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-700 transition-colors shadow-xl hover:shadow-2xl"
            >
              Začít zdarma
            </Link>
            <a
              href="#jak-to-funguje"
              className="px-10 py-5 text-gray-700 font-semibold text-lg hover:text-blue-600 transition-colors"
            >
              Jak to funguje ↓
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>24h zdarma</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Bez platební karty</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Pak 499 Kč/měs</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
