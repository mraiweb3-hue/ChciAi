// Vercel Serverless Function - Chat API
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, language = 'cs', session_id } = req.body;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY not found in environment');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Call Groq API (OpenAI-compatible)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
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
      const errorText = await response.text();
      console.error('Groq API Error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Omlouvám se, něco se pokazilo.';

    return res.status(200).json({
      response: aiResponse,
      session_id: session_id || `session-${Date.now()}`,
    });

  } catch (error) {
    console.error('Chat API Error:', error.message);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
