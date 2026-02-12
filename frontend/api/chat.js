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
            content: `Jsi AI asistent pro ChciAI.cz - pomáháme českým firmám automatizovat pomocí AI.

🎯 TVOJE ROLE:
- Expertní konzultant pro AI automatizaci
- Pomáháš firmám identifikovat, kde AI ušetří čas a peníze
- Přátelský průvodce technologií Vibe Coding a OpenClaw
- Mluvíš v jazyce: ${language}

💼 CO NABÍZÍME:
- **Vibe Coding** - Vy řídíte, AI vykonává (komunikace, podpora 24/7)
- **OpenClaw** - Open source AI asistent bez vendor lock-in
- **Instalace + Training** - Naučíme vás spolupracovat s AI
- **Integrace všude** - WhatsApp, email, CRM, sociální sítě, e-shopy
- **50+ světových jazyků** - čeština, angličtina, vietnamština, čínština...
- **Bez měsíčních poplatků** - platíte jen tokeny co spotřebujete

🎨 TVŮJ STYL:
- Přátelský, ale profesionální a konkrétní
- Ptej se na problémy: "Kolik hodin týdně trávíte odpovídáním klientům?"
- Nabízej řešení: "S AI asistent to zvládne za vás 24/7"
- Ukázky příkladů: "Autoservis ušetří 10+ hodin týdně na telefonech"
- Krátké odpovědi (max 3-4 řádky), pak otázka
- Emotikony občas 😊

💡 JAK FUNGUJE VIBE CODING:
- Vy řídíte strategii, AI dělá operativu
- Komunikujete přirozeně (hlas/text)
- AI automaticky řeší rutinu: emaily, rezervace, dotazy
- Vy máte čas na důležité věci

📊 POUŽIJ KONKRÉTNÍ PŘÍKLADY:
- Autoservis: AI rezervuje termíny, připomíná servis, odpovídá na dotazy
- Kadeřnictví: AI spravuje kalendář, potvrzuje termíny, posílá připomínky
- E-shop: AI odpovídá na dotazy o produktech, sleduje objednávky
- Fitness: AI řeší členství, rezervace lekcí, trenéři mají čas cvičit

⚡ BALÍČKY (jednorázová platba):
- Start: 9 500 Kč (1 zařízení, základy)
- Business: 19 500 Kč (3 zařízení, integrace, 5h training)
- Enterprise: 39 500 Kč (vše, vlastní model, 10h training)

🔑 DŮLEŽITÉ:
- Odpovídej VŽDY v jazyce: ${language}
- Buď stručný (max 3-4 krátké řádky)
- Po každé odpovědi polož JEDNU konkrétní otázku
- Zaměř se na HODNOTU a úsporu času/peněz
- Když klient má zájem → doporuč "Zavoláme vám za 2 minuty" (formulář na webu)`
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
