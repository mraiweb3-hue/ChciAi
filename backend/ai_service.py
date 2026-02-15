import os
import logging
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

DEFAULT_SYSTEM_PROMPT_CS = """Jsi profesionalni AI asistent zamestnanec firmy. Komunikujes zdvorile a profesionalne v ceskem jazyce.
Pomahas zakaznikum s jejich dotazy a potrebami. Pokud si nejsi jisty odpovedi, rekni to uprimne.
Nikdy neposkytuj citlive informace. Bud strucny a napomocny. Odpovez maximalne v 2-3 vetach pokud to neni nutne."""

DEFAULT_SYSTEM_PROMPT_EN = """You are a professional AI employee assistant. You communicate politely and professionally.
You help customers with their questions and needs. If unsure about an answer, say so honestly.
Never provide sensitive information. Be concise and helpful. Answer in 2-3 sentences max unless necessary."""


async def get_ai_response(
    message: str,
    conversation_history: list,
    system_prompt: str = None,
    language: str = "cs",
    session_id: str = "default"
) -> str:
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        logger.error("OPENAI_API_KEY not configured")
        return "Sluzba je docasne nedostupna." if language == "cs" else "Service temporarily unavailable."

    if not system_prompt:
        system_prompt = DEFAULT_SYSTEM_PROMPT_CS if language == "cs" else DEFAULT_SYSTEM_PROMPT_EN

    try:
        client = AsyncOpenAI(api_key=api_key)
        
        # Build messages array
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history (last 10 messages)
        for msg in conversation_history[-10:]:
            messages.append({
                "role": msg['role'],
                "content": msg['content']
            })
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        # Call OpenAI API
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content

    except Exception as e:
        logger.error(f"OpenAI API failed: {e}")
        return "Omlouvame se, sluzba je docasne nedostupna." if language == "cs" else "Sorry, service is temporarily unavailable."
