import { NextResponse } from 'next/server'
import { getClientByEmail } from '@/lib/database'
import { installOpenClawOnVPS, checkOpenClawStatus } from '@/lib/vps-installer'

/**
 * Manually trigger OpenClaw installation
 * Can be called from dashboard if installation failed during registration
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email je povinný' },
        { status: 400 }
      )
    }

    // Get client data
    const client = await getClientByEmail(email)
    
    if (!client) {
      return NextResponse.json(
        { error: 'Klient nenalezen' },
        { status: 404 }
      )
    }

    // Check if already installed
    const status = await checkOpenClawStatus(client.clientId)
    
    if (status.running) {
      return NextResponse.json({
        success: true,
        message: 'OpenClaw již běží',
        url: client.openclawUrl,
        status: 'running',
      })
    }

    // Extract port from URL
    const portMatch = client.openclawUrl.match(/:(\d+)/)
    const port = portMatch ? parseInt(portMatch[1]) : 9001

    console.log(`🚀 Manual installation triggered for ${client.clientId}`)

    // Install OpenClaw
    const result = await installOpenClawOnVPS(
      client.clientId,
      port,
      client.email
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OpenClaw byl úspěšně nainstalován',
        url: result.url,
        containerName: result.containerName,
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Instalace selhala: ' + result.error,
          details: result,
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Manual install error:', error)
    return NextResponse.json(
      { error: 'Chyba serveru: ' + error.message },
      { status: 500 }
    )
  }
}

/**
 * Check OpenClaw installation status
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

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

    const status = await checkOpenClawStatus(client.clientId)

    return NextResponse.json({
      success: true,
      clientId: client.clientId,
      url: client.openclawUrl,
      running: status.running,
      status: status.status,
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Chyba serveru: ' + error.message },
      { status: 500 }
    )
  }
}
