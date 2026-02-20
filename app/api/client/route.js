import { NextResponse } from 'next/server'
import { getClientByEmail, getRemainingTrialTime } from '@/lib/database'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email je povinný' },
        { status: 400 }
      )
    }

    const client = await getClientByEmail(email)

    if (!client) {
      return NextResponse.json(
        { error: 'Klient nenalezen' },
        { status: 404 }
      )
    }

    // Calculate remaining trial time
    const trialInfo = getRemainingTrialTime(client)

    return NextResponse.json({
      success: true,
      client: {
        clientId: client.clientId,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        status: client.status,
        openclawUrl: client.openclawUrl,
        trialStartedAt: client.trialStartedAt,
        trialEndsAt: client.trialEndsAt,
        trialRemaining: trialInfo,
        paidAt: client.paidAt,
      }
    })
  } catch (error) {
    console.error('Client fetch error:', error)
    return NextResponse.json(
      { error: 'Chyba serveru' },
      { status: 500 }
    )
  }
}
