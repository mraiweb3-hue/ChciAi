'use client'

import { motion } from 'framer-motion'

export default function OpenClawSelfHosted() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50" id="self-hosted">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-purple-100 text-purple-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            🦞 OpenClaw Self-Hosted
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Vlastní AI Employee s Plnou Kontrolou
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Získejte plný přístup k OpenClaw dashboardu. Source code na vašem VPS. 
            Kompletní kontrola nad daty a bezpečností.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: '🎛️',
              title: 'Plný Dashboard Access',
              description: 'Přístup ke kompletnímu OpenClaw rozhraní - sessions, memory, tools, analytics, konfigurace.'
            },
            {
              icon: '💻',
              title: 'Source Code na VPS',
              description: 'OpenClaw běží na vašem VPS (Hetzner, DigitalOcean). Vlastní data, vlastní kontrola.'
            },
            {
              icon: '🔐',
              title: 'Bezpečnost First',
              description: 'Žádné sdílení dat. API keys uloženy lokálně. Izolované prostředí jen pro vás.'
            },
            {
              icon: '🔄',
              title: 'Multi-Channel',
              description: 'WhatsApp, Telegram, Discord, Slack, web chat - vše v jednom dashboardu.'
            },
            {
              icon: '🛠️',
              title: 'Rozšiřitelný',
              description: 'Přidávejte vlastní skills, integrace s vašimi systémy, custom automations.'
            },
            {
              icon: '📊',
              title: 'Analytics & Monitoring',
              description: 'Sledujte usage, tokeny, náklady. Exportujte data. Plná transparentnost.'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-10 shadow-xl border-2 border-purple-200 mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Jak To Funguje?
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Kontakt',
                description: 'Napište nám email nebo vyplňte formulář'
              },
              {
                step: '2',
                title: 'Instalace',
                description: 'Nainstalujeme OpenClaw na váš VPS (2 minuty)'
              },
              {
                step: '3',
                title: 'Onboarding',
                description: '1h video call - nastavíme vše společně'
              },
              {
                step: '4',
                title: 'Go Live',
                description: 'Váš AI employee je ready! 24/7 podpora.'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What You Need */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-blue-50 rounded-2xl p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📋 Co Budete Potřebovat
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🖥️</span>
                VPS Hosting
              </h4>
              <p className="text-gray-600 mb-3 text-sm">
                Doporučujeme Hetzner nebo DigitalOcean
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>RAM:</strong> 2-4 GB</li>
                <li>• <strong>Disk:</strong> 10 GB</li>
                <li>• <strong>Cena:</strong> ~150-300 Kč/měsíc</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔑</span>
                API Key
              </h4>
              <p className="text-gray-600 mb-3 text-sm">
                OpenAI nebo Anthropic (Claude)
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>OpenAI:</strong> platform.openai.com</li>
                <li>• <strong>Claude:</strong> console.anthropic.com</li>
                <li>• <strong>Cena:</strong> Pay-as-you-go</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-10 text-white text-center mb-16"
        >
          <h3 className="text-3xl font-bold mb-4">
            💰 Cena
          </h3>
          <div className="text-6xl font-bold mb-4">
            ZDARMA
          </div>
          <p className="text-xl mb-6 opacity-90">
            Installation + 1h onboarding call + email support
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto mb-8">
            <p className="text-lg mb-4">
              <strong>Co platíte:</strong>
            </p>
            <ul className="text-left space-y-2">
              <li>• VPS hosting (~150-300 Kč/měsíc)</li>
              <li>• OpenAI/Claude API usage (pay-as-you-go)</li>
            </ul>
          </div>

          <h4 className="text-2xl font-bold mb-4">
            🎯 Volitelné Balíčky
          </h4>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-2">🔧</div>
              <h5 className="font-bold text-lg mb-2">Rozšířený Balíček</h5>
              <p className="text-sm opacity-90 mb-3">
                Pokročilá konfigurace, custom skills, multi-channel strategie
              </p>
              <p className="text-2xl font-bold">od 2000 Kč/hod</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl mb-2">🎓</div>
              <h5 className="font-bold text-lg mb-2">Coding Academy</h5>
              <p className="text-sm opacity-90 mb-3">
                Naučte se psát vlastní skills a integrace
              </p>
              <p className="text-2xl font-bold">5000 Kč</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <a
            href="mailto:martin@chciai.cz?subject=Zájem o OpenClaw Self-Hosted&body=Dobrý den,%0A%0AZajímá mě OpenClaw Self-Hosted řešení.%0A%0AJméno: %0AFirma: %0ATelefon: %0AEmail: %0A%0ADěkuji"
            className="inline-block px-12 py-5 bg-purple-600 text-white font-bold rounded-xl text-xl hover:bg-purple-700 transition-colors shadow-2xl"
          >
            📧 Kontaktovat Martin
          </a>
          <p className="text-gray-600 mt-4">
            Nebo napište na: <a href="mailto:martin@chciai.cz" className="text-purple-600 hover:underline font-semibold">martin@chciai.cz</a>
          </p>
        </motion.div>

      </div>
    </section>
  )
}
