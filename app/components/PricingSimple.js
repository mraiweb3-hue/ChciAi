'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PricingSimple() {
  return (
    <section className="py-20 bg-gray-50" id="cena">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jednoduchá cena
          </h2>
          <p className="text-xl text-gray-600">
            Každý účet = vlastní zabezpečený kontejner s plným přístupem
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl border-2 border-blue-600 p-10 shadow-xl"
        >
          {/* Price */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              499 Kč
            </div>
            <div className="text-xl text-gray-600">
              za měsíc
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-10">
            {[
              '🦞 Vlastní OpenClaw kontejner (zabezpečený)',
              '🎛️ Přístup k original OpenClaw dashboardu',
              '💻 Source code OpenClaw (vaše kopie)',
              '🔐 Plná kontrola - my NEMÁME přístup',
              '☁️ Český VPS hosting (Hetzner)',
              '🔄 Automatické aktualizace',
              '💾 Denní zálohy',
              '✅ Zrušit kdykoliv'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/signup"
            className="block w-full py-5 bg-blue-600 text-white font-bold rounded-xl text-lg text-center hover:bg-blue-700 transition-colors shadow-lg"
          >
            Začít zdarma
          </Link>

          <p className="text-center text-sm text-gray-500 mt-4">
            Registrace zdarma • 10 dní zkušební období
          </p>
        </motion.div>

        {/* Academy addon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <div className="inline-block bg-white rounded-2xl border border-gray-300 p-6 max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎓</div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  VibeCooding Academy
                </h3>
                <p className="text-gray-600 mb-3">
                  Naučte se OpenClaw ovládat jako profík. Step-by-step videa, 
                  pre-written prompts, šablony a komunita.
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-blue-600">+349 Kč</span>
                  <span className="text-gray-500">(nepovinné)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
