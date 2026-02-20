'use client'

import { motion } from 'framer-motion'

export default function WhatYouGet() {
  const features = [
    {
      icon: '🇨🇿',
      title: 'Český VPS od Wedos',
      description: 'Váš OpenClaw běží na českém serveru. GDPR compliant, bezpečné, rychlé.'
    },
    {
      icon: '🤖',
      title: '24/7 AI podpora (Clawix)',
      description: 'Clawix - můj OpenClaw agent - vám pomůže kdykoliv. Chat i hlasová podpora.'
    },
    {
      icon: '👨‍💼',
      title: 'Osobní pomoc (Martin)',
      description: 'Martin vám osobně poradí s nastavením a dlouhodobě spolupracuje s vámi.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50" id="co-dostanete">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Co dostanete
          </h2>
          <p className="text-xl text-gray-600">
            Všechno co potřebujete pro vlastního AI agenta
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
