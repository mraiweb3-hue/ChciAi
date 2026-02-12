// Vercel Edge Function - Text to Speech API (ElevenLabs)
export const config = {
  runtime: 'edge',
};

// ElevenLabs supported languages (29+ languages)
const ELEVENLABS_VOICES = {
  // European Languages
  'cs': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Czech
  'sk': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Slovak
  'en': { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' },     // English
  'de': { voice_id: 'ErXwobaYiN019PkySvjV', name: 'Antoni' },    // German
  'fr': { voice_id: 'ThT5KcBeYPX3keUQqHPh', name: 'Dorothy' },   // French
  'es': { voice_id: 'GBv7mTt0atIp3Br8iCZE', name: 'Charlotte' }, // Spanish
  'it': { voice_id: 'XB0fDUnXU5powFXDhCwa', name: 'Matilda' },   // Italian
  'pt': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Portuguese
  'pl': { voice_id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh' },      // Polish
  'nl': { voice_id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold' },    // Dutch
  'sv': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Swedish
  'da': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Danish
  'no': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Norwegian
  'fi': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Finnish
  'el': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Greek
  'hu': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Hungarian
  'ro': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Romanian
  'bg': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Bulgarian
  'hr': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Croatian
  
  // Slavic Languages
  'ru': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Russian
  'uk': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Ukrainian
  'sr': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Serbian
  
  // Asian Languages
  'zh': { voice_id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel' },    // Chinese
  'ja': { voice_id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie' },   // Japanese
  'ko': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Korean
  'vi': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Vietnamese
  'th': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Thai
  'id': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Indonesian
  'ms': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Malay
  'fil': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },     // Filipino
  'hi': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Hindi
  'bn': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Bengali
  'ta': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Tamil
  
  // Middle Eastern & African
  'ar': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Arabic
  'he': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Hebrew
  'tr': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Turkish
  'fa': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Persian
  'sw': { voice_id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },      // Swahili
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const { text, language = 'cs' } = body;

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Get voice for language (default to English if not found)
    const voiceConfig = ELEVENLABS_VOICES[language] || ELEVENLABS_VOICES['en'];

    // Call ElevenLabs API via Emergent
    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voice_id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || 'sk-emergent-bEcBa024324F8269f8',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      }
    );

    if (!elevenLabsResponse.ok) {
      throw new Error(`ElevenLabs API error: ${elevenLabsResponse.status}`);
    }

    // Get audio data
    const audioBuffer = await elevenLabsResponse.arrayBuffer();

    // Return audio
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename=speech.mp3',
      },
    });

  } catch (error) {
    console.error('TTS Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Text-to-Speech failed',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...headers, 'Content-Type': 'application/json' } 
      }
    );
  }
}
