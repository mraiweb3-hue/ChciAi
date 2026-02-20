'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function CTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implement form submission (email, webhook, etc.)
    console.log('Form data:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="kontakt" className="py-20 bg-gradient-to-br from-cyan-500 to-cyan-600">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pojďme si promluvit
          </h2>
          <p className="text-xl text-cyan-50 max-w-2xl mx-auto">
            Konzultace je zdarma a nezávazná. Zjistíme, jak vám AI může pomoct.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Díky! Ozveme se brzy</h3>
              <p className="text-gray-600">Vaši zprávu jsme obdrželi. Odpovíme do 24 hodin.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Jméno *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Jan Novák"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="+420 123 456 789"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="jan@example.com"
                />
              </div>

              <div>
                <label htmlFor="business" className="block text-sm font-semibold text-gray-700 mb-2">
                  Typ podnikání
                </label>
                <select
                  id="business"
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value="">Vyberte...</option>
                  <option value="autoservis">Autoservis / autoopravna</option>
                  <option value="kadernictvi">Kadeřnictví / holičství</option>
                  <option value="fitness">Fitness / osobní trenér</option>
                  <option value="restaurace">Restaurace / bistro</option>
                  <option value="eshop">E-shop</option>
                  <option value="reality">Reality</option>
                  <option value="jine">Jiné</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Čím můžeme pomoct?
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                  placeholder="Popište stručně, co vás trápí nebo co byste chtěli automatizovat..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 bg-cyan-500 text-white font-bold rounded-lg text-lg hover:bg-cyan-600 transition-colors duration-200 shadow-lg"
              >
                Odeslat poptávku
              </motion.button>

              <p className="text-sm text-gray-500 text-center">
                Odesláním souhlasíte se zpracováním osobních údajů za účelem odpovědi na dotaz.
              </p>
            </form>
          )}

          {/* Alternative contact methods */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600 mb-6">Nebo nás kontaktujte přímo:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 text-center">
              <a href="mailto:info@chciai.cz" className="flex items-center justify-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                info@chciai.cz
              </a>
              <a href="tel:+420123456789" className="flex items-center justify-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +420 123 456 789
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
