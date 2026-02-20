'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default function DashboardPage() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check session
    const sessionData = localStorage.getItem('chciai_session')
    
    if (!sessionData) {
      // Not logged in, redirect to signup
      router.push('/signup')
      return
    }

    const parsed = JSON.parse(sessionData)
    setSession(parsed)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return <DashboardClient initialEmail={session.email} />
}
