'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PricingSimple() {
  return (
    <section className="py-20 bg-gray-50" id="cena">
      <div className="max-w-6xl mx-auto px-6">
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
            Vyberte si variantu, která vám sedí
          </p>
        </motion.div>

        {/* Two pricing options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Managed Hosting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl border-2 border-blue-600 p-10 shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🚀 DOPORUČUJEME
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Managed Hosting
              </h3>
              <p className="text-gray-600 mb-6">
                Vše řešíme za vás. Plug & play.
              </p>
            </div>

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
                '✅ OpenClaw instalace (2 minuty)',
                '✅ Český VPS hosting (Wedos)',
                '✅ 24/7 AI podpora (Clawix)',
                '✅ Osobní pomoc (Martin)',
                '✅ Automatické aktualizace',
                '✅ Denní zálohy',
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
              Registrace zdarma • Platba až při instalaci
            </p>
          </motion.div>

          {/* Self-Hosted */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl border-2 border-gray-300 p-10 shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🦞 PRO POKROČILÉ
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                OpenClaw Self-Hosted
              </h3>
              <p className="text-gray-600 mb-6">
                Plná kontrola nad svým AI agentem
              </p>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ZDARMA*
              </div>
              <div className="text-lg text-gray-600">
                + vlastní VPS + API key
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-10">
              {[
                '🦞 Plný přístup k OpenClaw dashboardu',
                '💻 Source code na vašem VPS',
                '🔐 Kompletní kontrola nad daty',
                '🛠️ Onboarding call (1h) zdarma',
                '📧 Email podpora (24h)',
                '🎯 Rozšiřitelný (skills, channels)',
                '🔄 WhatsApp, Telegram, Discord...'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="mailto:martin@chciai.cz?subject=Zájem o OpenClaw Self-Hosted&body=Dobrý den,%0A%0AZajímá mě OpenClaw Self-Hosted řešení.%0A%0AJméno: %0AFirma: %0ATelefon: %0A%0ADěkuji"
              className="block w-full py-5 bg-purple-600 text-white font-bold rounded-xl text-lg text-center hover:bg-purple-700 transition-colors shadow-lg"
            >
              Kontaktovat Martin
            </a>

            <p className="text-center text-sm text-gray-500 mt-4">
              *Vlastní Hetzner/DigitalOcean VPS + OpenAI/Claude API key
            </p>
          </motion.div>
        </div>

        {/* Optional packages for self-hosted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-gray-300 p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎯 Volitelné balíčky (Self-Hosted)
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Extended Package */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔧</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Rozšířený Balíček
                  </h4>
                  <p className="text-gray-600 mb-3 text-sm">
                    Pokročilá konfigurace, vlastní skills development, 
                    multi-channel strategie, enterprise security.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">od 2000 Kč</span>
                    <span className="text-gray-500 text-sm">/hodina</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coding Academy */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎓</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Coding Academy
                  </h4>
                  <p className="text-gray-600 mb-3 text-sm">
                    Naučte se psát vlastní skills, integrace s vašimi systémy, 
                    úpravy OpenClaw source code.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">5000 Kč</span>
                    <span className="text-gray-500 text-sm">jednorázově</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academy addon for managed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
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
                  <span className="text-gray-500">(nepovinné, pro Managed)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
