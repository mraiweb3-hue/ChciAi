'use client'

import { motion } from 'framer-motion'
import { AIAssistantIcon, AutomationIcon, TrainingIcon, PartnershipIcon, WebsiteIcon, SEOIcon, MarketingIcon, DataIcon } from './ServiceIcons'

const services = [
  {
    Icon: AIAssistantIcon,
    title: 'Nasazení AI asistenta',
    description: 'Bezpečné vytvoření a připojení OpenClawd (přes Emergent) - váš digitální partner dostupný 24/7',
    features: [
      'WhatsApp / Messenger / Telegram',
      'Email & SMS automatizace',
      'Kalendář & rezervační systém',
      'Hlasové hovory (voice AI)',
      'Integrace s CRM systémy'
    ],
    highlight: 'Hlavní služba'
  },
  {
    Icon: AutomationIcon,
    title: 'Opensource automatizace',
    description: 'Věříme v budoucnost postavenou na open-source projektech. Žádný vendor lock-in.',
    features: [
      'n8n, Make.com workflow',
      'Integrace existujících systémů',
      'Vlastní automatizační procesy',
      'Bez závislosti na jednom dodavateli',
      'Plná kontrola nad daty'
    ],
    highlight: 'Open-source first'
  },
  {
    Icon: WebsiteIcon,
    title: 'Webové stránky & SEO',
    description: 'Moderní web optimalizovaný pro vyhledávače a LLM modely (ChatGPT, Claude, Grok)',
    features: [
      'Responzivní web design',
      'SEO optimalizace',
      'Google Analytics & Search Console',
      'Strukturovaná data (Schema.org)',
      'Viditelnost v AI odpovědích'
    ],
    highlight: 'LLM ready'
  },
  {
    Icon: MarketingIcon,
    title: 'Marketing & sociální sítě',
    description: 'Komplexní správa vašeho digitálního marketingu a online prezence',
    features: [
      'Facebook, Instagram, LinkedIn',
      'Content marketing & copywriting',
      'Email kampaně',
      'PPC reklamy (Google, Meta)',
      'Analytics & reporting'
    ],
    highlight: 'Nové příležitosti'
  },
  {
    Icon: TrainingIcon,
    title: 'Školení & vibe coding',
    description: 'Naučíme vás ovládat AI a programovat s pomocí AI (cursor.com, Claude, ChatGPT)',
    features: [
      'Osobní školení na míru',
      'Video návody a dokumentace',
      'Vibe coding - programování s AI',
      'Průběžná podpora 24/7',
      'Komunita dalších klientů'
    ],
    highlight: 'Vzdělávání'
  },
  {
    Icon: PartnershipIcon,
    title: 'Dlouhodobé partnerství',
    description: 'Nejsme dodavatel - jsme váš obchodní partner v digitálním světě',
    features: [
      'Měsíční check-iny a konzultace',
      'Prioritní technická podpora',
      'Průběžné vylepšování systému',
      'Nové funkce dle potřeb',
      'Společný růst vašeho byznysu'
    ],
    highlight: 'Partner, ne dodavatel'
  }
]

export default function Services() {
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
            Co dostanete?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kompletní řešení od instalace po dlouhodobou podporu
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.Icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-cyan-300 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Highlight badge */}
                {service.highlight && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {service.highlight}
                    </span>
                  </div>
                )}
                
                <div className="relative z-10">
                  {/* Modern SVG icon */}
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-16 h-16" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                        <svg className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-cyan-100/30 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
