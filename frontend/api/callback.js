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
    const { name, phone, language = 'cs', voiceGender = 'female' } = body;

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

    // TODO: Integrate with your voice calling system
    // For now, just return success
    // In production, you would:
    // 1. Send to Twilio/Vonage for voice call
    // 2. Or send to your backend queue
    // 3. Or trigger webhook

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Callback request received',
        voiceCallInitiated: true,
        estimatedCallTime: '2 minutes',
        language,
        voiceGender,
        voiceDescription: voiceGender === 'female' ? 'Ženský hlas' : 'Mužský hlas',
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
