'use client'

import { motion } from 'framer-motion'

const benefits = [
  {
    icon: '🇨🇿',
    title: 'Česky a pro Čechy',
    description: 'Rozumíme českému trhu, zákonům i mentalitě. Komunikujeme česky, platíte v korunách.'
  },
  {
    icon: '💰',
    title: 'Transparentní ceny',
    description: 'Žádné skryté poplatky. Víte přesně, co platíte a za co. Bez vendor lock-in.'
  },
  {
    icon: '⚡',
    title: 'Rychlé nasazení',
    description: 'Za 48 hodin máte AI v provozu. Jiní vás budou ještě měsíc "analyzovat".'
  },
  {
    icon: '🔓',
    title: 'Open-source first',
    description: 'Používáme otevřená řešení - žádná závislost na jednom dodavateli. Vlastníte své data.'
  },
  {
    icon: '🎯',
    title: 'Šité na míru',
    description: 'Žádné "one-size-fits-all". Každý byznys je jiný, řešení musí sedět přesně vám.'
  },
  {
    icon: '🤝',
    title: 'Partner, ne dodavatel',
    description: 'Nejsme "udělej a zmiz". Zůstáváme s vámi, vylepšujeme, rosteme společně.'
  }
]

const stats = [
  { value: '10+', label: 'hodin ušetřených týdně' },
  { value: '24/7', label: 'dostupnost pro zákazníky' },
  { value: '48h', label: 'od konzultace k provozu' },
  { value: '95%+', label: 'spokojených klientů' }
]

export default function WhyUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-cyan-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Proč zrovna my?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Protože rozumíme malým a středním firmám - sami jsme takoví
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-l-4 border-cyan-500"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-6xl">💡</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Nejste si jistí, jestli je AI pro vás?
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                To je v pořádku. Většina našich klientů měla stejné pochybnosti. 
                Proto začínáme <strong>nezávaznou konzultací zdarma</strong> - promluvíme si, 
                zjistíme, jestli to dává smysl, a pokud ne, nic se neděje.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Žádný tlak, žádné prodejní kecy. Jen upřímný rozhovor o tom, jak by vám AI mohla pomoct.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
