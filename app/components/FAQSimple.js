'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function FAQSimple() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      q: 'Co je OpenClaw?',
      a: 'Open-source AI agent platforma. Spravujte konverzace přes WhatsApp, Email, Web. Integrujte vlastní AI modely. Vše v jednom dashboardu.'
    },
    {
      q: 'Potřebuji technické znalosti?',
      a: 'Ne. My vám OpenClaw nainstalujeme, nastavíme a spustíme. Vy jen používáte dashboard - jako kdybyste používali email nebo sociální síť.'
    },
    {
      q: 'Kde běží můj AI agent?',
      a: 'Máte dvě možnosti: (1) Managed - na našem zabezpečeném VPS serveru v Česku, nebo (2) Self-Hosted - na vašem vlastním VPS s plnou kontrolou.'
    },
    {
      q: 'Jaký je rozdíl mezi Managed a Self-Hosted?',
      a: 'Managed: Vše řešíme za vás. 499 Kč/měsíc, plug & play. Self-Hosted: Plný přístup k dashboardu, source code na vašem VPS, kompletní kontrola. Instalace zdarma, platíte jen VPS a API usage.'
    },
    {
      q: 'Můžu používat vlastní AI model?',
      a: 'Ano. OpenClaw podporuje OpenAI, Claude, místní modely (Ollama) i vlastní API. Nastavíte si v dashboardu.'
    },
    {
      q: 'Co potřebuji pro Self-Hosted?',
      a: 'Vlastní VPS (Hetzner/DigitalOcean ~150-300 Kč/měsíc) a OpenAI nebo Claude API key. My vám nainstalujeme a nastavíme vše během onboarding call zdarma.'
    },
    {
      q: 'Co když chci zrušit?',
      a: 'Zrušit můžete kdykoliv. Žádné výpovědní lhůty, žádné penále. Data vám exportujeme, pokud chcete.'
    },
    {
      q: 'Dostanu podporu?',
      a: 'Ano. Email i WhatsApp. Martin odpovídá do 24 hodin. Česky. Pro Self-Hosted klienty: email support + volitelný rozšířený balíček (od 2000 Kč/hod).'
    }
  ]

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Časté otázky
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.q}
                </span>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
