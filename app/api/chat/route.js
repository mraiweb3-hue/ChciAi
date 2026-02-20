// /api/chat - Text chat endpoint connected to Clawdbot Gateway
import { NextResponse } from 'next/server'

const GATEWAY_URL = process.env.CLAWDBOT_GATEWAY_URL || 'http://localhost:18789'
const GATEWAY_TOKEN = process.env.CLAWDBOT_GATEWAY_TOKEN

// Session storage (in-memory for MVP, use Redis/DB for production)
const sessions = new Map()

export async function POST(request) {
  try {
    const { message, language, sessionId } = await request.json()
    
    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 })
    }

    if (!GATEWAY_TOKEN) {
      console.error('[Chat] Missing CLAWDBOT_GATEWAY_TOKEN in environment')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Get or create session
    let session = sessionId && sessions.has(sessionId) 
      ? sessions.get(sessionId)
      : {
          id: `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          language: language || 'cs',
          createdAt: Date.now(),
          lastActivity: Date.now()
        }
    
    session.lastActivity = Date.now()
    sessions.set(session.id, session)

    console.log(`[Chat] Session: ${session.id} | Lang: ${session.language} | Message: ${message.substring(0, 50)}...`)
    
    // Send to Clawdbot Gateway
    const response = await fetch(`${GATEWAY_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`
      },
      body: JSON.stringify({
        message,
        sessionKey: session.id,
        channel: 'web',
        language: session.language,
        metadata: {
          source: 'chciai.cz',
          type: 'text',
          timestamp: new Date().toISOString()
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Chat] Gateway error: ${response.status} - ${errorText}`)
      
      return NextResponse.json({
        error: 'AI assistant temporarily unavailable',
        details: process.env.NODE_ENV === 'development' ? errorText : undefined
      }, { status: 502 })
    }

    const data = await response.json()
    
    return NextResponse.json({
      response: data.response || data.text || 'No response',
      sessionId: session.id,
      language: session.language,
      timestamp: new Date().toISOString(),
      // Include audio URL if available
      audioUrl: data.audioUrl || null
    })
    
  } catch (error) {
    console.error('[Chat API Error]', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    endpoint: 'chat',
    methods: ['POST'],
    gateway: GATEWAY_URL,
    connected: !!GATEWAY_TOKEN,
    activeSessions: sessions.size
  })
}

// Cleanup old sessions (older than 1 hour)
setInterval(() => {
  const now = Date.now()
  const ONE_HOUR = 60 * 60 * 1000
  
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActivity > ONE_HOUR) {
      sessions.delete(id)
      console.log(`[Chat] Cleaned up inactive session: ${id}`)
    }
  }
}, 5 * 60 * 1000) // Run every 5 minutes
