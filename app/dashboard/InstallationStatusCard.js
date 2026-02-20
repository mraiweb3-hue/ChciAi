'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function InstallationStatusCard({ email, openclawUrl }) {
  const [status, setStatus] = useState('checking') // checking, running, stopped, error
  const [installing, setInstalling] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkStatus()
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  async function checkStatus() {
    try {
      const response = await fetch(`/api/install-openclaw?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (data.success) {
        setStatus(data.running ? 'running' : 'stopped')
      } else {
        setStatus('error')
        setError(data.error)
      }
    } catch (err) {
      console.error('Status check failed:', err)
      setStatus('error')
      setError('Nepodařilo se zkontrolovat status')
    }
  }

  async function handleInstall() {
    setInstalling(true)
    setError(null)
    
    try {
      const response = await fetch('/api/install-openclaw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus('running')
        alert('✅ OpenClaw byl úspěšně nainstalován!\n\nMůžete nyní otevřít dashboard.')
      } else {
        setError(data.error)
        alert('❌ Instalace selhala:\n' + data.error)
      }
    } catch (err) {
      setError('Chyba při instalaci: ' + err.message)
      alert('❌ Chyba při instalaci:\n' + err.message)
    } finally {
      setInstalling(false)
    }
  }

  // If running, don't show this card
  if (status === 'running') {
    return null
  }

  // If checking, show loading
  if (status === 'checking') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Kontroluji OpenClaw...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ověřuji zda je instalace hotová
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  // If stopped or error, show install button
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border-2 border-yellow-400 dark:border-yellow-700"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {status === 'stopped' ? 'OpenClaw čeká na instalaci' : 'Problém s instalací'}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {status === 'stopped' 
              ? 'Váš OpenClaw ještě nebyl nainstalován. Klikněte níže pro spuštění instalace.'
              : 'Během instalace došlo k chybě. Zkuste to prosím znovu, nebo kontaktujte podporu.'
            }
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-sm text-red-800 dark:text-red-300">
              {error}
            </div>
          )}
          
          <button
            onClick={handleInstall}
            disabled={installing}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {installing ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Instaluji... (~2 minuty)
              </span>
            ) : (
              'Nainstalovat OpenClaw'
            )}
          </button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            💡 Instalace trvá přibližně 2 minuty. Stránka se automaticky aktualizuje.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
