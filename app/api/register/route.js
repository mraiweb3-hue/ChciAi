import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient as createClientDB, getClientByEmail } from '@/lib/database'

export async function POST(request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, company, password } = body

    // Validace
    if (!firstName || !lastName || !email || !phone || !company || !password) {
      return NextResponse.json(
        { error: 'Všechna pole jsou povinná' },
        { status: 400 }
      )
    }

    // Validace emailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatný formát emailu' },
        { status: 400 }
      )
    }

    // Validace hesla
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Heslo musí mít minimálně 8 znaků' },
        { status: 400 }
      )
    }

    // Zkontrolovat zda email již neexistuje
    const existingClient = await getClientByEmail(email)
    if (existingClient) {
      return NextResponse.json(
        { error: 'Email je již registrován. Zkuste se přihlásit.' },
        { status: 400 }
      )
    }

    // Generuj unikátní client ID
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Prepare client data
    const clientData = {
      clientId,
      firstName,
      lastName,
      email,
      phone,
      company,
      passwordHash,
      status: 'trial', // trial -> active after payment
      vpsIp: process.env.VPS_IP || '46.28.111.185',
      dashboardUrl: `http://46.28.111.185:${8000 + Math.floor(Math.random() * 1000)}`, // Random port for now
    }

    console.log('📝 New registration:', { ...clientData, passwordHash: '[REDACTED]' })

    // Save to database
    let savedClient
    try {
      savedClient = await createClientDB(clientData)
      console.log('✅ Client saved to database')
    } catch (dbError) {
      console.error('❌ Database error:', dbError)
      
      if (dbError.message === 'Email already registered') {
        return NextResponse.json(
          { error: 'Email je již registrován. Zkuste se přihlásit.' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Chyba při ukládání dat. Kontaktujte podporu.' },
        { status: 500 }
      )
    }

    // Spustit OpenClaw instalaci na VPS (asynchronně)
    if (process.env.ENABLE_VPS_INSTALL === 'true') {
      console.log('🚀 Starting OpenClaw installation for:', clientId)
      
      // Import dynamically and run in background
      import('@/lib/vps-installer')
        .then(({ installOpenClawOnVPS }) => {
          // Extract port from URL
          const portMatch = savedClient.openclawUrl.match(/:(\d+)/)
          const port = portMatch ? parseInt(portMatch[1]) : 9001
          
          return installOpenClawOnVPS(clientId, port, email)
        })
        .then((result) => {
          if (result.success) {
            console.log(`✅ OpenClaw installed: ${result.url}`)
            // Could update database here with installation status
          } else {
            console.error(`❌ Installation failed:`, result.error)
            // Send alert to admin
          }
        })
        .catch((error) => {
          console.error('❌ Installation error:', error)
        })
    } else {
      console.log('⏭️ VPS installation disabled (set ENABLE_VPS_INSTALL=true)')
    }

    // TODO: Poslat email s přihlašovacími údaji
    try {
      // await sendWelcomeEmail(clientData)
      console.log('📧 Welcome email queued for:', email)
    } catch (emailError) {
      console.error('❌ Email error:', emailError)
      // Continue anyway - client can login
    }

    return NextResponse.json({
      success: true,
      clientId,
      openclawUrl: savedClient.openclawUrl,
      trialEndsAt: savedClient.trialEndsAt,
      message: 'Účet byl vytvořen! Instalace OpenClaw...',
      dashboardUrl: '/dashboard',
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Chyba serveru. Zkuste to prosím později.' },
      { status: 500 }
    )
  }
}

// TODO: Funkce pro instalaci OpenClaw na VPS
async function installOpenClaw(clientData) {
  // 1. SSH připojení k VPS
  // 2. Spuštění install scriptu
  // 3. Vytvoření Docker kontejneru
  // 4. Konfigurace OpenClaw
  
  console.log('🚀 Installing OpenClaw for:', clientData.clientId)
  
  // Příklad SSH příkazu:
  /*
  ssh root@46.28.111.185 << EOF
    docker run -d \
      --name openclaw_${clientData.clientId} \
      --restart unless-stopped \
      -e CLIENT_ID=${clientData.clientId} \
      -e CLIENT_EMAIL=${clientData.email} \
      -v /opt/chciai/instances/${clientData.clientId}:/data \
      -p 0:8080 \
      clawdbot/clawdbot:latest
  EOF
  */
}

// TODO: Funkce pro odeslání welcome emailu
async function sendWelcomeEmail(clientData) {
  // SMTP přes WEDOS
  console.log('📧 Sending welcome email to:', clientData.email)
  
  /*
  const emailContent = `
    Vítejte v ChciAI.cz!
    
    Váš OpenClaw účet byl vytvořen.
    
    Přihlašovací údaje:
    URL: ${clientData.dashboardUrl}
    Email: ${clientData.email}
    Heslo: (vaše zvolené heslo)
    
    Začněte zde: ${clientData.dashboardUrl}
    
    Potřebujete pomoc? Napište nám na info@chciai.cz
    
    Tým ChciAI.cz
  `
  */
}
