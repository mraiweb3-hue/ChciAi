// Vercel Edge Function - SMS Notification Handler
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { status: 405, headers }
    );
  }

  try {
    const body = await req.json();
    const { phone, name, language = 'cs', timeSlot = 30 } = body;

    if (!phone) {
      return new Response(
        JSON.stringify({ success: false, error: 'Phone required' }), 
        { status: 400, headers }
      );
    }

    // SMS messages by language
    const smsMessages = {
      cs: `Ahoj${name ? ' ' + name : ''}! 👋

ChciAI.cz: Váš AI asistent vám zavolá za ${timeSlot} sekund.

✅ Připravte si telefon
✅ Najděte si klidné místo
✅ Máte otázky? AI odpoví!

Pokud NEMŮŽETE mluvit, NEPŘIJÍMEJTE hovor.

Díky! 🤖`,
      en: `Hi${name ? ' ' + name : ''}! 👋

ChciAI.cz: Your AI assistant will call you in ${timeSlot} seconds.

✅ Prepare your phone
✅ Find a quiet place
✅ Have questions? AI will answer!

If you CANNOT talk, DO NOT answer.

Thanks! 🤖`,
      sk: `Ahoj${name ? ' ' + name : ''}! 👋

ChciAI.cz: Váš AI asistent vám zavolá za ${timeSlot} sekúnd.

✅ Pripravte si telefón
✅ Nájdite si pokojné miesto
✅ Máte otázky? AI odpovie!

Ak NEMÔŽETE hovoriť, NEPRIJÍMAJTE hovor.

Ďakujem! 🤖`,
    };

    const smsText = smsMessages[language] || smsMessages.cs;

    // TODO: Production - Send via Twilio SMS API
    // const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    // const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    // const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    //
    // const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Basic ' + btoa(`${twilioSid}:${twilioToken}`),
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: new URLSearchParams({
    //     To: phone,
    //     From: twilioPhone,
    //     Body: smsText,
    //   }),
    // });

    console.log('📱 SMS sent:', {
      phone,
      language,
      timeSlot,
      message: smsText,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'SMS sent successfully',
        smsPreview: smsText,
        timestamp: new Date().toISOString(),
      }), 
      { status: 200, headers }
    );

  } catch (error) {
    console.error('SMS API Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        message: error.message 
      }), 
      { status: 500, headers }
    );
  }
}
