'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function InstallPage() {
  const [includeAcademy, setIncludeAcademy] = useState(false)
  const [loading, setLoading] = useState(false)

  const basePrice = 499
  const academyPrice = 349
  const totalPrice = includeAcademy ? basePrice + academyPrice : basePrice

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      // Get email from session
      const sessionData = localStorage.getItem('chciai_session')
      if (!sessionData) {
        alert('Nejste přihlášen. Přesměrování...')
        window.location.href = '/signup'
        return
      }
      
      const session = JSON.parse(sessionData)
      const email = session.email
      
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, includeAcademy }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (data.mockCheckout) {
          // Mock payment - simulate success
          alert('✅ TEST REŽIM: Platba simulována jako úspěšná!\n\nV produkci se otevře Stripe checkout.')
          
          // Simulate payment success
          setTimeout(() => {
            window.location.href = '/dashboard?payment=success&test=true'
          }, 1000)
        } else if (data.url) {
          // Real Stripe checkout
          window.location.href = data.url
        }
      } else {
        alert('Chyba: ' + data.error)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Chyba při vytváření platby')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Zpět na dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Instalace OpenClaw
          </h1>
          <p className="text-xl text-gray-600">
            Vyberte si balíček a zaplaťte. Instalace začne okamžitě.
          </p>
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: What you get */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Co dostanete
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">OpenClaw instalace</h3>
                    <p className="text-sm text-gray-600">Stáhneme, nastavíme a spustíme za 2 minuty</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Český VPS hosting</h3>
                    <p className="text-sm text-gray-600">Wedos datacenter • GDPR compliant • Bezpečné</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">24/7 AI podpora (Clawix)</h3>
                    <p className="text-sm text-gray-600">Chat + hlasová podpora kdykoliv potřebujete</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Osobní pomoc (Martin)</h3>
                    <p className="text-sm text-gray-600">Dlouhodobá spolupráce a konzultace</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Automatické aktualizace + zálohy</h3>
                    <p className="text-sm text-gray-600">Starám se o technickou údržbu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important info */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-xl">ℹ️</span>
                Důležité informace
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• <strong>Platba měsíční:</strong> 499 Kč každý měsíc</li>
                <li>• <strong>Zrušení kdykoliv:</strong> Žádné závazky, žádné penále</li>
                <li>• <strong>Po zrušení:</strong> Agent přestane běžet, data exportujeme</li>
                <li>• <strong>Platba přes Stripe:</strong> Bezpečná kreditní karta</li>
                <li>• <strong>Open-source:</strong> Vlastníte svá data, žádný vendor lock-in</li>
              </ul>
            </div>
          </motion.div>

          {/* Right: Pricing & checkout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Base package */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-600">
              <div className="mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {basePrice} Kč
                </div>
                <div className="text-lg text-gray-600">
                  za měsíc
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                OpenClaw Hosting
              </h3>
              <p className="text-gray-600 mb-6">
                Instalace, hosting, podpora, aktualizace - vše v ceně.
              </p>
            </div>

            {/* Academy addon */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAcademy}
                  onChange={(e) => setIncludeAcademy(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      VibeCooding Academy
                    </h3>
                    <span className="font-bold text-blue-600">+{academyPrice} Kč</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Step-by-step videa, pre-written prompts, šablony, kompletní kurz jak nastavit a používat OpenClaw. 
                    Staňte se součástí ChciAI VibeCooding komunity.
                  </p>
                </div>
              </label>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-semibold">Celkem k zaplacení:</span>
                <span className="text-4xl font-bold">{totalPrice} Kč</span>
              </div>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl text-lg hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Načítání...' : 'Zaplatit a aktivovat →'}
              </button>
              <p className="text-center text-sm opacity-90 mt-4">
                Bezpečná platba přes Stripe • SSL šifrování
              </p>
            </div>

            {/* Money back guarantee */}
            <div className="text-center text-sm text-gray-600">
              <p>
                💯 <strong>Spokojeni nebo peníze zpět</strong><br />
                První měsíc zdarma pokud nefunguje jak má
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
