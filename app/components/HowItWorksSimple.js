'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HowItWorksSimple() {
  const steps = [
    {
      number: '1',
      title: 'Zaregistrujete se zdarma',
      description: 'Email + heslo. Žádná platební karta.'
    },
    {
      number: '2',
      title: 'OpenClaw se nainstaluje',
      description: 'Automaticky za 2 minuty. 24h trial zdarma.'
    },
    {
      number: '3',
      title: 'Aktivujete za 499 Kč/měs',
      description: 'Po trial nebo kdykoliv během trial. Plný přístup bez omezení.'
    }
  ]

  return (
    <section className="py-20 bg-white" id="jak-to-funguje">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jak to funguje
          </h2>
          <p className="text-xl text-gray-600">
            Tři jednoduché kroky
          </p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex gap-6 items-start"
            >
              {/* Number circle */}
              <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/signup"
            className="inline-block px-10 py-5 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-700 transition-colors shadow-xl hover:shadow-2xl"
          >
            Začít teď →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
