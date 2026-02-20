'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '1',
    title: 'Konzultace (zdarma)',
    description: 'Zavoláme si, zjistíme, co potřebujete, a navrhneme řešení na míru',
    duration: '30 minut',
    icon: '📞'
  },
  {
    number: '2',
    title: 'Nasazení AI',
    description: 'Nainstalujeme a nakonfigurujeme vašeho AI asistenta. Vy nemusíte nic.',
    duration: '24-48 hodin',
    icon: '⚙️'
  },
  {
    number: '3',
    title: 'Školení',
    description: 'Ukážeme vám, jak AI ovládat a vytěžit maximum. Osobně nebo online.',
    duration: '2 hodiny',
    icon: '🎓'
  },
  {
    number: '4',
    title: 'Spuštění',
    description: 'AI začne pracovat. Vy šetříte čas. Zákazníci jsou spokojení.',
    duration: 'Okamžitě',
    icon: '🚀'
  },
  {
    number: '5',
    title: 'Průběžná podpora',
    description: 'Jsme s vámi. Měsíční check-in, vylepšování, přidávání funkcí.',
    duration: 'Dlouhodobě',
    icon: '🤝'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jak to funguje?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Od prvního hovoru po spuštění za 48 hodin
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-200 via-cyan-400 to-cyan-200 transform -translate-x-1/2"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className={index % 2 === 0 ? 'md:text-right' : 'md:text-left'}>
                    <div className="inline-block bg-cyan-100 text-cyan-600 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      {step.duration}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Number circle */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative flex-shrink-0 w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg z-10"
                >
                  <span className="absolute -top-8 text-5xl">{step.icon}</span>
                  <span>{step.number}</span>
                </motion.div>

                {/* Spacer for alignment */}
                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">Připraveni začít?</p>
          <motion.a
            href="#kontakt"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors duration-200 shadow-lg"
          >
            Domluvit konzultaci zdarma
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
