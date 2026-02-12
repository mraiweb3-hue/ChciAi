// Vercel Edge Function - Contact Form & Voice Call Handler
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
    const { 
      name, 
      phone, 
      email, 
      company, 
      message, 
      language = 'cs',
      voiceGender = 'female'
    } = body;

    // Validation
    if (!phone && !email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Phone or email required' 
        }), 
        { status: 400, headers }
      );
    }

    // Log the contact request
    console.log('📧 Contact form submission:', {
      name: name || 'Anonymous',
      phone: phone || 'N/A',
      email: email || 'N/A',
      company: company || 'N/A',
      message: message || 'N/A',
      language,
      voiceGender,
      voiceDescription: voiceGender === 'female' ? 'Ženský hlas (přátelský)' : 'Mužský hlas (profesionální)',
      timestamp: new Date().toISOString(),
    });

    // Check if this is a voice call request (phone-only, no email)
    const isVoiceCallRequest = phone && !email;

    // TODO: Production integrations:
    // 1. Send email notification (SendGrid, Resend, etc.)
    // 2. Store in database (MongoDB)
    // 3. If voice call: trigger Twilio/Vonage
    // 4. Send webhook to CRM

    // For now, simulate successful submission
    const response = {
      success: true,
      message: isVoiceCallRequest 
        ? 'Voice call request received - calling you shortly!' 
        : 'Thank you! We will contact you soon.',
      voiceCallInitiated: isVoiceCallRequest,
      estimatedCallTime: isVoiceCallRequest ? '2 minutes' : null,
      language,
      voiceGender,
      voiceDescription: voiceGender === 'female' ? 'Ženský hlas' : 'Mužský hlas',
      timestamp: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(response), 
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Contact API Error:', error);
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
