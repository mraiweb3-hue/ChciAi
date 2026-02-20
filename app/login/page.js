'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Save session
        if (typeof window !== 'undefined') {
          localStorage.setItem('chciai_session', JSON.stringify({
            email: formData.email,
            clientId: data.clientId,
            firstName: data.firstName,
            lastName: data.lastName,
          }))
        }
        
        // Redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Nesprávné přihlašovací údaje')
      }
    } catch (err) {
      setError('Chyba při přihlašování. Zkuste to prosím znovu.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900">ChciAI.cz</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Přihlásit se
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Přístup do vašeho OpenClaw dashboardu
          </p>
        </div>

        {/* Formulář */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="vas@email.cz"
              />
            </div>

            {/* Heslo */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Heslo
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="••••••••"
              />
            </div>

            {/* Zapomenuté heslo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Zapamatovat si mě
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                  Zapomněli jste heslo?
                </a>
              </div>
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
                  Přihlašování...
                </span>
              ) : (
                'Přihlásit se'
              )}
            </button>

            {/* Signup link */}
            <p className="text-center text-sm text-gray-600">
              Ještě nemáte účet?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Založit zdarma
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Security note */}
        <p className="mt-6 text-center text-xs text-gray-500">
          🔒 Zabezpečené připojení pomocí SSL šifrování
        </p>
      </div>
    </div>
  )
}
