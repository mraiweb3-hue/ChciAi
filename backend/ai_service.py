import os
import logging
from emergentintegrations.llm.chat import LlmChat, UserMessage

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
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        logger.error("EMERGENT_LLM_KEY not configured")
        return "Sluzba je docasne nedostupna." if language == "cs" else "Service temporarily unavailable."

    if not system_prompt:
        system_prompt = DEFAULT_SYSTEM_PROMPT_CS if language == "cs" else DEFAULT_SYSTEM_PROMPT_EN

    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=system_prompt
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        context_parts = []
        for msg in conversation_history[-10:]:
            role_label = "Customer" if msg['role'] == 'user' else "Assistant"
            context_parts.append(f"{role_label}: {msg['content']}")

        full_message = "\n".join(context_parts + [f"Customer: {message}"]) if context_parts else message

        user_message = UserMessage(text=full_message)
        response = await chat.send_message(user_message)
        return response

    except Exception as e:
        logger.warning(f"Claude failed, trying Gemini fallback: {e}")
        try:
            chat = LlmChat(
                api_key=api_key,
                session_id=f"fb-{session_id}",
                system_message=system_prompt
            ).with_model("gemini", "gemini-3-flash-preview")

            user_message = UserMessage(text=message)
            response = await chat.send_message(user_message)
            return response
        except Exception as e2:
            logger.error(f"All AI providers failed: {e2}")
            return "Omlouvame se, sluzba je docasne nedostupna." if language == "cs" else "Sorry, service is temporarily unavailable."
