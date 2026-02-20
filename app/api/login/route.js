import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getClientByEmail } from '@/lib/database'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validace
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email a heslo jsou povinné' },
        { status: 400 }
      )
    }

    // Get client from database
    const client = await getClientByEmail(email)
    
    if (!client) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, client.passwordHash)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      )
    }

    console.log('✅ Login successful for:', email)

    // Return client data for session
    return NextResponse.json({
      success: true,
      clientId: client.clientId,
      firstName: client.firstName,
      lastName: client.lastName,
      message: 'Přihlášení úspěšné'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Chyba serveru. Zkuste to prosím později.' },
      { status: 500 }
    )
  }
}
