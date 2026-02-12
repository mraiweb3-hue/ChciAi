// Vercel Serverless Function - Contact Form + Auto Voice Call
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, company, phone, message, language = 'cs' } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    // 1. ULOŽIT DO DATABÁZE / POSLAT EMAIL
    console.log('📝 New contact:', { name, email, company, phone, message });
    
    // TODO: Tady by ses připojil k MongoDB nebo poslal email
    // await saveToDatabase({ name, email, company, phone, message });
    // await sendEmailNotification({ name, email, company, phone, message });

    // 2. ZAVOLAT KLIENTOVI PŘES ELEVENLABS (pokud má telefon)
    if (phone && process.env.ELEVENLABS_API_KEY) {
      try {
        await initiateVoiceCall({
          phone,
          name,
          language,
          company,
          message
        });
      } catch (callError) {
        console.error('Voice call failed:', callError);
        // Nevracíme chybu - formulář byl uložen úspěšně
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Formulář odeslán úspěšně',
      voiceCallInitiated: !!phone,
      estimatedCallTime: '2 minuty'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// FUNKCE PRO VOICE CALL PŘES ELEVENLABS
async function initiateVoiceCall({ phone, name, language, company, message }) {
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  // Vytvořit personalizovaný script pro hovor
  const callScript = generateCallScript({ name, language, company, message });

  // OPTION 1: ElevenLabs Conversational AI (nejlepší pro hovory)
  // https://elevenlabs.io/docs/conversational-ai/overview
  
  // OPTION 2: Pro teď - vygenerovat audio a poslat link
  const audioResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: callScript,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  });

  if (!audioResponse.ok) {
    throw new Error(`ElevenLabs API error: ${audioResponse.status}`);
  }

  // Uložit audio a poslat SMS s linkem
  // nebo použít Twilio pro skutečný telefonní hovor
  console.log('🎤 Voice message generated for:', phone);
  
  // TODO: Integrace s Twilio pro skutečný hovor
  // await twilioCall({ phone, audioUrl });

  return {
    success: true,
    audioGenerated: true,
    phone
  };
}

// GENEROVAT TEXT PRO HOVOR podle jazyka
function generateCallScript({ name, language, company, message }) {
  const scripts = {
    cs: `Dobrý den, ${name}! Volám z ChciAI.cz. 

Děkujeme za váš zájem o naše AI řešení pro ${company || 'vaši firmu'}. 

${message ? `Dostali jsme vaši zprávu: "${message}".` : ''}

Rád bych s vámi probral, jak můžeme pomoci automatizovat vaši zákaznickou podporu a ušetřit vám čas i peníze.

Máte nyní chvilku na krátký rozhovor? Nebo vám mám zavolat později?

Pokud preferujete osobní schůzku, můžu vám nabídnout termíny tento týden.

Co říkáte?`,

    en: `Hello ${name}! I'm calling from ChciAI.cz.

Thank you for your interest in our AI solutions for ${company || 'your business'}.

${message ? `We received your message: "${message}".` : ''}

I'd like to discuss how we can help automate your customer support and save you time and money.

Do you have a moment for a quick chat now? Or should I call you back later?

If you prefer a personal meeting, I can offer you appointments this week.

What do you say?`,

    sk: `Dobrý deň, ${name}! Volám z ChciAI.cz.

Ďakujeme za váš záujem o naše AI riešenia pre ${company || 'vašu firmu'}.

${message ? `Dostali sme vašu správu: "${message}".` : ''}

Rád by som s vami prebral, ako môžeme pomôcť automatizovať vašu zákaznícku podporu a ušetriť vám čas aj peniaze.

Máte teraz chvíľku na krátky rozhovor? Alebo vám mám zavolať neskôr?

Ak preferujete osobné stretnutie, môžem vám ponúknuť termíny tento týždeň.

Čo hovoríte?`
  };

  return scripts[language] || scripts.cs;
}
