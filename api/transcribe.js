// Vercel Edge Function - Speech to Text API (Whisper)
export const config = {
  runtime: 'edge',
};

// Whisper supports 99 languages automatically
export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const formData = await req.formData();
    const audio = formData.get('audio');
    const language = formData.get('language') || 'cs';

    if (!audio) {
      return new Response(
        JSON.stringify({ error: 'Audio file is required' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Call Whisper API via Emergent
    const whisperFormData = new FormData();
    whisperFormData.append('file', audio);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', language);

    const whisperResponse = await fetch(
      'https://api.emergent.sh/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer sk-emergent-bEcBa024324F8269f8`,
        },
        body: whisperFormData,
      }
    );

    if (!whisperResponse.ok) {
      throw new Error(`Whisper API error: ${whisperResponse.status}`);
    }

    const result = await whisperResponse.json();

    return new Response(
      JSON.stringify({
        text: result.text,
        language: language,
      }),
      {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('STT Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Speech-to-Text failed',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...headers, 'Content-Type': 'application/json' } 
      }
    );
  }
}
