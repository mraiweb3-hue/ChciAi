'use client'
import { useState } from 'react'

export default function CallMeButton({ language = 'cs' }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+420')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const translations = {
    cs: {
      button: '📞 Zavolej mi',
      title: 'Zavoláme ti během 5 minut!',
      namePlaceholder: 'Tvoje jméno',
      phonePlaceholder: 'Telefon (bez předvolby)',
      submit: 'Zavolej mi teď',
      submitting: 'Odesílám...',
      success: '✅ Skvělé! Voláme ti za chvíli!',
      successDesc: 'Měl bys mít hovor do 5 minut.',
      error: 'Chyba - zkus to prosím znovu',
      phoneHint: 'Zadej 9 čísel, např: 777123456'
    },
    en: {
      button: '📞 Call Me',
      title: 'We\'ll call you in 5 minutes!',
      namePlaceholder: 'Your name',
      phonePlaceholder: 'Phone (without country code)',
      submit: 'Call Me Now',
      submitting: 'Sending...',
      success: '✅ Great! We\'ll call you soon!',
      successDesc: 'Expect a call within 5 minutes.',
      error: 'Error - please try again',
      phoneHint: 'Enter 9 digits, e.g: 777123456'
    },
    de: {
      button: '📞 Ruf mich an',
      title: 'Wir rufen dich in 5 Minuten an!',
      namePlaceholder: 'Dein Name',
      phonePlaceholder: 'Telefon (ohne Landesvorwahl)',
      submit: 'Jetzt anrufen',
      submitting: 'Senden...',
      success: '✅ Super! Wir rufen bald an!',
      successDesc: 'Erwarte einen Anruf in 5 Minuten.',
      error: 'Fehler - bitte versuche es erneut',
      phoneHint: 'Gib 9 Ziffern ein, z.B: 777123456'
    }
  }

  const t = translations[language] || translations.cs

  const countryCodes = [
    { code: '+420', flag: '🇨🇿', name: 'Česká republika', digits: 9 },
    { code: '+421', flag: '🇸🇰', name: 'Slovensko', digits: 9 },
    { code: '+48', flag: '🇵🇱', name: 'Polsko', digits: 9 },
    { code: '+49', flag: '🇩🇪', name: 'Německo', digits: 10 },
    { code: '+43', flag: '🇦🇹', name: 'Rakousko', digits: 10 },
    { code: '+44', flag: '🇬🇧', name: 'UK', digits: 10 },
    { code: '+1', flag: '🇺🇸', name: 'USA', digits: 10 },
    { code: '+380', flag: '🇺🇦', name: 'Ukrajina', digits: 9 },
    { code: '+7', flag: '🇷🇺', name: 'Rusko', digits: 10 }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const fullPhone = `${countryCode}${phone.replace(/\s/g, '')}`
      
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: fullPhone,
          language,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setSubmitted(true)
        // Auto close po 5 sekundách
        setTimeout(() => {
          setShowForm(false)
          setSubmitted(false)
          setName('')
          setPhone('')
        }, 5000)
      } else {
        alert(t.error)
      }
    } catch (error) {
      console.error('Callback request error:', error)
      alert(t.error)
    } finally {
      setLoading(false)
    }
  }

  const isPhoneValid = () => {
    const digits = phone.replace(/\D/g, '')
    const country = countryCodes.find(c => c.code === countryCode)
    return digits.length === country?.digits
  }

  return (
    <>
      {/* Floating Call Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 font-bold flex items-center gap-2 z-40 animate-pulse"
      >
        📞 {t.button}
      </button>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-slideUp">
            {/* Close button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">📞</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {t.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Zadej své údaje a během 5 minut ti zavoláme
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Jméno */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jméno *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Country Code Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Země
                    </label>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    >
                      {countryCodes.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code} - {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Telefon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon *
                    </label>
                    <div className="flex gap-2">
                      <div className="bg-gray-100 px-4 py-3 rounded-lg font-mono text-gray-700 flex items-center">
                        {countryCode}
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder={t.phonePlaceholder}
                        required
                        maxLength={10}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition font-mono"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t.phoneHint}
                    </p>
                  </div>

                  {/* Preview */}
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      Zavoláme na:
                    </p>
                    <p className="font-mono font-bold text-lg text-cyan-700">
                      {countryCode} {phone || '___-___-___'}
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!name || !isPhoneValid() || loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t.submitting : t.submit}
                  </button>
                </form>

                {/* Privacy note */}
                <p className="text-xs text-gray-400 text-center mt-4">
                  🔒 Tvé údaje jsou v bezpečí. Voláme pouze kvůli konzultaci.
                </p>
              </>
            ) : (
              // Success state
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                  {t.success}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t.successDesc}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-bold text-green-800">{name}</p>
                  <p className="font-mono text-green-700">{countryCode} {phone}</p>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setSubmitted(false)
                  }}
                  className="mt-6 text-gray-500 hover:text-gray-700 underline"
                >
                  Zavřít
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
