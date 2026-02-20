'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validace
    if (formData.password !== formData.confirmPassword) {
      setError('Hesla se neshodují')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Heslo musí mít minimálně 8 znaků')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        
        // Save session
        if (typeof window !== 'undefined') {
          localStorage.setItem('chciai_session', JSON.stringify({
            email: formData.email,
            clientId: data.clientId,
            firstName: formData.firstName,
            lastName: formData.lastName,
          }))
        }
        
        // Redirect po 2 sekundách na dashboard
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        setError(data.error || 'Něco se pokazilo. Zkuste to prosím znovu.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Chyba při odesílání. Zkontrolujte připojení k internetu.')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Instalace OpenClaw... 🚀
          </h2>
          <p className="text-gray-600 mb-6">
            Stahujeme a instalujeme OpenClaw na VPS...<br />
            <strong>Zbývá ~2 minuty</strong>
          </p>
          
          {/* Progress steps */}
          <div className="space-y-3 mb-6 text-left max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
              <span className="text-gray-700">Účet vytvořen</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
              <span className="text-gray-700">VPS připraven</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-semibold">Stahování OpenClaw...</span>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <span className="text-gray-500">Konfigurace</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Přesměrování za chvíli...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              ChciAI.cz
            </h1>
          </Link>
          <h2 className="mt-8 text-4xl font-bold text-gray-900">
            Začněte <span className="text-blue-600">zdarma</span>
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            ✅ Bez platební karty • 🚀 Aktivace za 2 minuty
          </p>
        </div>

        {/* Formulář */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Jméno a příjmení */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Jméno *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Jan"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Příjmení *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Novák"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="jan@firma.cz"
              />
            </div>

            {/* Telefon */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="+420 XXX XXX XXX"
              />
            </div>

            {/* Název firmy */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Název firmy *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Moje firma s.r.o."
              />
            </div>

            {/* Heslo */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Heslo *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Minimálně 8 znaků"
              />
            </div>

            {/* Potvrzení hesla */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Potvrdit heslo *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Znovu zadejte heslo"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Vytváření účtu...
                </span>
              ) : (
                'Vytvořit účet zdarma'
              )}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-600">
              Už máte účet?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Přihlásit se
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Security note */}
        <p className="mt-6 text-center text-xs text-gray-500">
          🔒 Vaše data jsou v bezpečí. Používáme šifrování podle standardů EU.
        </p>
      </div>
    </div>
  )
}
