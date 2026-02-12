// Vercel Edge Function - API Health Check
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  return new Response(
    JSON.stringify({ 
      message: 'ChciAI API is running',
      status: 'ok',
      version: '1.0.0',
      endpoints: {
        chat: '/api/chat',
        health: '/api/'
      }
    }),
    { status: 200, headers }
  );
}
