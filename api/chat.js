// Vercel Edge Function - Chat API Proxy
export const config = {
  runtime: 'edge',
};

export default async function handler(req, context) {
  const OPENAI_API_KEY = context.env?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Parse request
    const body = await req.json();
    const { message, language = 'cs', session_id } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers }
      );
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Jsi AI asistent pro ChciAI.cz - společnost poskytující AI automatizaci pro české firmy.

TVOJE ROLE:
- Proaktivní business konzultant
- Pomáháš firmám identifikovat, jak AI může ušetřit čas a peníze
- Mluvíš v jazyce: ${language}

CO NABÍZÍME:
- AI chatboti pro zákaznickou podporu 24/7
- Automatizace rezervací a objednávek
- WhatsApp/Messenger integrace
- Voice AI asistenti
- Nasazení za 48 hodin

TVŮJ STYL:
- Přátelský, ale profesionální
- Ptej se na konkrétní problémy byznysu
- Nabízej řešení
- Používej emotikony občas 😊

DŮLEŽITÉ:
- Odpovídej VŽDY v jazyce: ${language}
- Buď stručný (max 3-4 krátké odstavce)
- Zaměř se na hodnotu pro zákazníka`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Omlouvám se, něco se pokazilo.';

    return new Response(
      JSON.stringify({
        response: aiResponse,
        session_id: session_id || `session-${Date.now()}`,
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { status: 500, headers }
    );
  }
}
