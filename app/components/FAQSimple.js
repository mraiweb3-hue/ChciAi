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
      q: 'Mám přístup k original OpenClaw dashboardu?',
      a: 'ANO! Každý účet dostane přístup k plnému OpenClaw dashboardu - sessions, memory, tools, konfigurace. Máte kompletní kontrolu nad svým AI agentem.'
    },
    {
      q: 'Kde běží můj AI agent?',
      a: 'Na našem zabezpečeném Hetzner VPS serveru. Každý účet má vlastní izolovaný Docker kontejner se source code OpenClaw. My NEMÁME přístup k vašim datům.'
    },
    {
      q: 'Můžu používat vlastní AI model?',
      a: 'Ano. OpenClaw podporuje OpenAI, Claude, místní modely (Ollama) i vlastní API. Nastavíte si v dashboardu podle vašich potřeb.'
    },
    {
      q: 'Jak probíhá registrace?',
      a: 'Registrujete se na webu, během 2 minut vám vytvoříme vlastní OpenClaw kontejner, dostanete přihlašovací údaje k dashboardu. Žádná instalace, všechno hotové.'
    },
    {
      q: 'Co když chci zrušit?',
      a: 'Zrušit můžete kdykoliv. Žádné výpovědní lhůty, žádné penále. Data vám exportujeme, pokud chcete.'
    },
    {
      q: 'Máte přístup k mým datům?',
      a: 'NE! Každý účet běží v izolovaném kontejneru. Máte vlastní OpenClaw dashboard s vlastními přihlašovacími údaji. My vidíme pouze technické metriky (uptime, CPU).'
    },
    {
      q: 'Dostanu podporu?',
      a: 'Ano. Email i WhatsApp. Martin odpovídá do 24 hodin. Česky. Plus přístup k dokumentaci a komunitě.'
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
