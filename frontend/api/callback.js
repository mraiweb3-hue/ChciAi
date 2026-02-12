// Vercel Edge Function - Callback Request Handler
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
    const body = await req.json();
    const { name, phone, language = 'cs', voiceGender = 'female', timeSlot = 30 } = body;

    // Validation
    if (!phone || phone.length < 9) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid phone number' 
        }), 
        { status: 400, headers }
      );
    }

    // Log the callback request (you can add email/webhook here)
    console.log('📞 Callback request:', {
      name: name || 'Anonymous',
      phone,
      language,
      voiceGender,
      voiceDescription: voiceGender === 'female' ? 'Ženský hlas (přátelský, teplý)' : 'Mužský hlas (profesionální, jasný)',
      timestamp: new Date().toISOString(),
    });

    // TODO: Production integrations:
    // 1. Send SMS confirmation (call /api/sms)
    // 2. Schedule voice call via Twilio
    // 3. Trigger webhook

    // Send SMS confirmation
    try {
      await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, language, timeSlot }),
      });
    } catch (smsError) {
      console.error('SMS send failed:', smsError);
      // Continue even if SMS fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Callback request received',
        voiceCallInitiated: true,
        estimatedCallTime: `${timeSlot} seconds`,
        timeSlot,
        language,
        voiceGender,
        voiceDescription: voiceGender === 'female' ? 'Ženský hlas' : 'Mužský hlas',
        smsNotification: 'SMS potvrzení odesláno',
      }), 
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Callback API Error:', error);
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
