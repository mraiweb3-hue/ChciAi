// /api/voice - Voice chat endpoint with Whisper STT + Clawdbot + optional ElevenLabs TTS
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const GATEWAY_URL = process.env.CLAWDBOT_GATEWAY_URL || 'http://localhost:18789'
const GATEWAY_TOKEN = process.env.CLAWDBOT_GATEWAY_TOKEN
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL' // Default: Bella

// OpenAI client for Whisper
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null

// Session storage
const sessions = new Map()

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio')
    const language = formData.get('language') || 'cs'
    const sessionId = formData.get('sessionId')
    
    if (!audioFile) {
      return NextResponse.json({ error: 'Missing audio file' }, { status: 400 })
    }

    if (!GATEWAY_TOKEN) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    console.log(`[Voice] Session: ${sessionId || 'new'} | Lang: ${language} | Audio: ${audioFile.size} bytes`)
    
    // Get or create session
    let session = sessionId && sessions.has(sessionId)
      ? sessions.get(sessionId)
      : {
          id: `voice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          language,
          createdAt: Date.now(),
          lastActivity: Date.now()
        }
    
    session.lastActivity = Date.now()
    sessions.set(session.id, session)

    // Step 1: Speech-to-Text using Whisper
    let transcript = ''
    
    if (!openai) {
      return NextResponse.json({
        error: 'Voice feature not configured (missing OpenAI API key)',
        hasVoice: false
      }, { status: 503 })
    }

    try {
      // Convert Blob to File for OpenAI
      const buffer = Buffer.from(await audioFile.arrayBuffer())
      const file = new File([buffer], 'audio.webm', { type: audioFile.type })
      
      const transcription = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: language === 'cs' ? 'cs' : language, // Whisper language code
        response_format: 'text'
      })
      
      transcript = typeof transcription === 'string' ? transcription : transcription.text
      console.log(`[Voice] Transcript: ${transcript}`)
      
    } catch (error) {
      console.error('[Voice] Whisper STT error:', error)
      return NextResponse.json({
        error: 'Speech recognition failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 })
    }

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({
        transcript: '',
        response: 'Omlouvám se, neslyšel jsem tě dobře. Zkus to prosím znovu.',
        hasVoice: false,
        sessionId: session.id
      })
    }

    // Step 2: Send to Clawdbot Gateway
    let aiResponse = ''
    
    try {
      const response = await fetch(`${GATEWAY_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GATEWAY_TOKEN}`
        },
        body: JSON.stringify({
          message: transcript,
          sessionKey: session.id,
          channel: 'web-voice',
          language: session.language,
          metadata: {
            source: 'chciai.cz',
            type: 'voice',
            timestamp: new Date().toISOString()
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gateway error: ${response.status}`)
      }

      const data = await response.json()
      aiResponse = data.response || data.text || 'Omlouvám se, nemám odpověď.'
      
      console.log(`[Voice] AI Response: ${aiResponse.substring(0, 100)}...`)
      
    } catch (error) {
      console.error('[Voice] Gateway error:', error)
      aiResponse = 'Omlouvám se, mám technický problém. Zkus to prosím znovu.'
    }

    // Step 3: Optional TTS with ElevenLabs
    let audioUrl = null
    const hasVoice = !!ELEVENLABS_API_KEY

    if (hasVoice && aiResponse) {
      try {
        const ttsResponse = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
          {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
              text: aiResponse,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
              }
            })
          }
        )

        if (ttsResponse.ok) {
          // In production, save to storage and return URL
          // For MVP, we'll return base64 data URL
          const audioBuffer = await ttsResponse.arrayBuffer()
          const base64Audio = Buffer.from(audioBuffer).toString('base64')
          audioUrl = `data:audio/mpeg;base64,${base64Audio}`
          console.log(`[Voice] TTS generated: ${audioBuffer.byteLength} bytes`)
        } else {
          console.error('[Voice] ElevenLabs TTS error:', ttsResponse.status)
        }
        
      } catch (error) {
        console.error('[Voice] TTS error:', error)
        // Non-critical - continue without voice
      }
    }

    return NextResponse.json({
      transcript,
      response: aiResponse,
      audioUrl,
      hasVoice,
      sessionId: session.id,
      language: session.language,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('[Voice API Error]', error)
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
    endpoint: 'voice',
    methods: ['POST'],
    accepts: 'multipart/form-data (audio file)',
    gateway: GATEWAY_URL,
    features: {
      stt: !!openai,
      tts: !!ELEVENLABS_API_KEY,
      connected: !!GATEWAY_TOKEN
    },
    activeSessions: sessions.size
  })
}

// Cleanup old sessions
setInterval(() => {
  const now = Date.now()
  const ONE_HOUR = 60 * 60 * 1000
  
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActivity > ONE_HOUR) {
      sessions.delete(id)
    }
  }
}, 5 * 60 * 1000)
