'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import InstallationStatusCard from './InstallationStatusCard'

export default function DashboardClient({ initialEmail }) {
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCallForm, setShowCallForm] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)

  useEffect(() => {
    // Check for payment success
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success') {
      setShowPaymentSuccess(true)
      // Remove query params after showing message
      setTimeout(() => {
        window.history.replaceState({}, '', '/dashboard')
      }, 5000)
    }

    fetchClientData()
    // Refresh every minute to update trial countdown
    const interval = setInterval(fetchClientData, 60000)
    return () => clearInterval(interval)
  }, [])

  async function fetchClientData() {
    try {
      const response = await fetch('/api/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: initialEmail }),
      })
      
      const data = await response.json()
      if (data.success) {
        setClientData(data.client)
      }
    } catch (error) {
      console.error('Failed to fetch client data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !clientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const isTrial = clientData.status === 'trial'
  const isActive = clientData.status === 'active'
  const trialRemaining = clientData.trialRemaining

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">ChciAI Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">{clientData.email}</span>
            <button
              onClick={() => {
                localStorage.removeItem('chciai_session')
                window.location.href = '/'
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Odhlásit
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Payment Success Banner */}
        {showPaymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎉</div>
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  Platba úspěšná!
                </h3>
                <p className="text-lg opacity-90">
                  Váš účet byl aktivován. Máte neomezený přístup k OpenClaw!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Installation Status Check */}
          <InstallationStatusCard 
            email={clientData.email}
            openclawUrl={clientData.openclawUrl}
          />

          {/* Welcome */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              Vítejte, {clientData.firstName}! 👋
            </h2>
            <p className="text-xl opacity-90">
              {isTrial && 'Váš OpenClaw běží v trial režimu.'}
              {isActive && 'Váš OpenClaw je plně aktivní!'}
            </p>
          </div>

          {/* Trial Status */}
          {isTrial && trialRemaining && !trialRemaining.expired && (
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                  ⏰
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    24h Trial aktivní!
                  </h3>
                  <p className="text-lg opacity-90 mb-2">
                    Zbývá <strong>{trialRemaining.hours}h {trialRemaining.minutes}m</strong>
                  </p>
                  <p className="text-sm opacity-75">
                    Po vypršení trial můžete aktivovat za 499 Kč/měs
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Trial expired */}
          {isTrial && trialRemaining && trialRemaining.expired && (
            <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                  ⚠️
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    Trial vypršel
                  </h3>
                  <p className="text-lg opacity-90 mb-4">
                    Váš OpenClaw byl pozastaven. Aktivujte účet pro pokračování.
                  </p>
                  <Link
                    href="/dashboard/install"
                    className="inline-block px-8 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Aktivovat za 499 Kč/měs →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Paid status */}
          {isActive && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                  ✅
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    Účet aktivní
                  </h3>
                  <p className="text-lg opacity-90">
                    Neomezený přístup k OpenClaw. Děkujeme za podporu!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main CTA - Go to OpenClaw */}
          <div className="bg-white rounded-3xl p-10 border-2 border-blue-600 shadow-xl">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl">
                🤖
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Přejít do OpenClaw
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Váš OpenClaw dashboard je připravený. Nastavte si svého AI agenta a začněte používat.
                </p>
                <div className="space-y-3">
                  <a
                    href={clientData.openclawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-10 py-4 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Otevřít OpenClaw Dashboard →
                  </a>
                  <p className="text-sm text-gray-500">
                    📍 Váš OpenClaw: <code className="bg-gray-100 px-2 py-1 rounded">{clientData.openclawUrl}</code>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activate now (payment) - only show if trial active */}
          {isTrial && !trialRemaining?.expired && (
            <div className="bg-white rounded-3xl p-8 border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-4xl">
                  💳
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Aktivovat nyní
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Nemusíte čekat na konec trial. Aktivujte teď a dostanete neomezený přístup.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-blue-600">499 Kč/měs</span>
                    <Link
                      href="/dashboard/install"
                      className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Aktivovat
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Support cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Chat with Clawix */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">🤖</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Chat s Clawixem
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Clawix AI agent vám pomůže s instalací, nastavením a řešením problémů. 24/7 dostupný.
                  </p>
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    Otevřít chat (vpravo dole) →
                  </button>
                </div>
              </div>
            </div>

            {/* Call with Clawix */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">📞</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Zavolat Clawixovi
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Potřebujete hlasovou podporu? Clawix vám zavolá a pomůže s čímkoliv.
                  </p>
                  <button
                    onClick={() => setShowCallForm(true)}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Vyžádat hovor
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              📚 Zdroje a dokumentace
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="https://docs.openclaw.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 mb-1">OpenClaw Docs</h4>
                <p className="text-sm text-gray-600">Oficiální dokumentace</p>
              </a>
              <a
                href="https://github.com/clawdbot/clawdbot"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 mb-1">GitHub</h4>
                <p className="text-sm text-gray-600">Open-source kód</p>
              </a>
              <Link
                href="/academy"
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 mb-1">VibeCooding Academy</h4>
                <p className="text-sm text-gray-600">Kurzy a školení</p>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Call request modal */}
      {showCallForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vyžádat hovor s Clawixem
            </h3>
            <p className="text-gray-600 mb-6">
              Zadejte své jméno a číslo. Clawix vám zavolá do 5 minut.
            </p>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Call request received!'); setShowCallForm(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vaše jméno
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Jan Novák"
                  defaultValue={`${clientData.firstName} ${clientData.lastName}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefonní číslo
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="+420 XXX XXX XXX"
                  defaultValue={clientData.phone}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCallForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Zavolat mi
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Chat widget placeholder (vpravo dole) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center text-2xl">
          💬
        </button>
      </div>
    </div>
  )
}
