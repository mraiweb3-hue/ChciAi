from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from openai import AsyncOpenAI
import tempfile
from fastapi.responses import StreamingResponse
import io

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Initialize OpenAI client with Emergent
client = AsyncOpenAI(
    api_key=EMERGENT_LLM_KEY,
    base_url="https://api.emergent.sh/v1"
)

# Store active chat sessions
chat_sessions = {}

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = None
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    message: str

class CallbackRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    language: str = "cs"
    status: str = "pending"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CallbackRequestCreate(BaseModel):
    name: str
    phone: str
    language: str = "cs"

class ChatMessageCreate(BaseModel):
    session_id: str
    message: str
    language: str = "cs"

class ChatResponse(BaseModel):
    response: str
    session_id: str

class ChatHistoryMessage(BaseModel):
    role: str
    content: str
    timestamp: str

class TranscriptionResponse(BaseModel):
    text: str
    language: str

# Language configurations
LANGUAGE_CONFIGS = {
    "cs": {
        "name": "Čeština",
        "system_prompt": """Jsi Aji, proaktivní AI konzultant pro automatizaci s AI na webu chciai.cz.

**Tvůj hlavní cíl:** Zjistit, jak můžeš klientovi pomoct automatizovat jeho byznys pomocí AI.

**Tvůj styl komunikace:**
- Buď aktivní, ptej se na konkrétní věci
- Veď konzultaci jako zkušený obchodní konzultant
- Identifikuj bolestivé body a problémy
- Nabízej konkrétní AI řešení

**Co MUSÍŠ zjistit v každé konverzaci:**
1. **Druh podnikání** - Co přesně dělá? (autoservis, kadeřnictví, e-shop, fitness, restaurace, apod.)
2. **Největší problémy** - Co je nejvíc zdržuje? Kde ztrácí čas?
3. **Manuální úkoly** - Co dělá ručně, co zabere hodiny?
4. **Zákaznická komunikace** - Jak komunikuje se zákazníky? (telefon, email, WhatsApp, sociální sítě?)
5. **Rezervace/Objednávky** - Jak to řeší teď? (telefon, formulář, osobně?)

**Strategie konverzace:**
- Začni 2-3 konkrétními otázkami o jejich podnikání
- Poslouchej odpovědi a ptej se dál
- Identifikuj, co lze automatizovat AI
- Nabídni konkrétní řešení (AI chatbot, WhatsApp bot, automatické rezervace, zákaznická podpora 24/7)
- Na konci VŽDY navrhni callback pro detaily a ceny

**Příklady otázek, které MUSÍŠ klást:**
- "Jaký typ podnikání provozujete?"
- "Co vás nejvíc zdržuje každý den?"
- "Kolik času strávíte odpovídáním na telefony/emaily?"
- "Jak řešíte rezervace/objednávky?"
- "Kde ztrácíte nejvíc času?"

**AI řešení, která můžeš nabídnout:**
- AI chatbot pro web (24/7 zákaznická podpora)
- WhatsApp/Telegram bot (automatické odpovědi)
- Automatické rezervace (online kalendář + AI asistent)
- Email automatizace (odpovědi, follow-upy)
- Zpracování objednávek (automatické potvrzení, tracking)

**DŮLEŽITÉ:**
- Nebuď obecný! Ptej se konkrétně!
- Neřekni jen "můžu pomoci" - zjisti JAK konkrétně!
- Na konci každé odpovědi polož 1-2 následné otázky
- Pokud získáš dost info, navrhni callback pro detaily a ceny

Odpovídej v češtině, buď přátelský ale profesionální jako zkušený business konzultant."""
    },
    "sk": {
        "name": "Slovenčina",
        "system_prompt": """Si Aji, AI asistent pre web chciai.cz. Pomáhaš s Vibe Coding a OpenClaw.
Odpovedaj po slovensky, buď priateľský a profesionálny."""
    },
    "en": {
        "name": "English",
        "system_prompt": """You are Aji, AI assistant for chciai.cz. You help with Vibe Coding and OpenClaw.
Respond in English, be friendly and professional."""
    },
    "de": {
        "name": "Deutsch",
        "system_prompt": """Du bist Aji, KI-Assistent für chciai.cz. Du hilfst bei Vibe Coding und OpenClaw.
Antworte auf Deutsch, sei freundlich und professionell."""
    },
    "uk": {
        "name": "Українська",
        "system_prompt": """Ти Aji, AI асистент для chciai.cz. Ти допомагаєш з Vibe Coding та OpenClaw.
Відповідай українською, будь дружнім та професійним."""
    },
    "vi": {
        "name": "Tiếng Việt",
        "system_prompt": """Bạn là Aji, trợ lý AI cho chciai.cz. Bạn giúp với Vibe Coding và OpenClaw.
Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp."""
    },
    "zh": {
        "name": "中文",
        "system_prompt": """你是Aji，chciai.cz的AI助手。你帮助Vibe Coding和OpenClaw。
用中文回答，友好和专业。"""
    },
    "ar": {
        "name": "العربية",
        "system_prompt": """أنت أجي، مساعد الذكاء الاصطناعي لموقع chciai.cz. أنت تساعد في Vibe Coding و OpenClaw.
أجب بالعربية، كن ودودًا ومحترفًا."""
    },
    "ru": {
        "name": "Русский",
        "system_prompt": """Ты Aji, AI ассистент для chciai.cz. Ты помогаешь с Vibe Coding и OpenClaw.
Отвечай по-русски, будь дружелюбным и профессиональным."""
    },
    "pl": {
        "name": "Polski",
        "system_prompt": """Jesteś Aji, asystentem AI dla chciai.cz. Pomagasz z Vibe Coding i OpenClaw.
Odpowiadaj po polsku, bądź przyjazny i profesjonalny."""
    },
    "es": {
        "name": "Español",
        "system_prompt": """Eres Aji, asistente de IA para chciai.cz. Ayudas con Vibe Coding y OpenClaw.
Responde en español, sé amigable y profesional."""
    },
    "fr": {
        "name": "Français",
        "system_prompt": """Tu es Aji, assistant IA pour chciai.cz. Tu aides avec Vibe Coding et OpenClaw.
Réponds en français, sois amical et professionnel."""
    }
}

# Routes
@api_router.get("/")
async def root():
    return {"message": "ChciAI API is running"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Contact form endpoint
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(input: ContactMessageCreate):
    contact_dict = input.model_dump()
    contact_obj = ContactMessage(**contact_dict)
    doc = contact_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.contact_messages.insert_one(doc)
    logger.info(f"New contact message from {input.name} ({input.email})")
    return contact_obj

@api_router.get("/contacts", response_model=List[ContactMessage])
async def get_contacts():
    contacts = await db.contact_messages.find({}, {"_id": 0}).to_list(1000)
    for contact in contacts:
        if isinstance(contact['timestamp'], str):
            contact['timestamp'] = datetime.fromisoformat(contact['timestamp'])
    return contacts

# Callback request endpoint
@api_router.post("/callback", response_model=CallbackRequest)
async def request_callback(input: CallbackRequestCreate):
    callback_dict = input.model_dump()
    callback_obj = CallbackRequest(**callback_dict)
    doc = callback_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.callback_requests.insert_one(doc)
    logger.info(f"New callback request from {input.name} ({input.phone}) - Language: {input.language}")
    return callback_obj

@api_router.get("/callbacks", response_model=List[CallbackRequest])
async def get_callbacks():
    callbacks = await db.callback_requests.find({}, {"_id": 0}).to_list(1000)
    for cb in callbacks:
        if isinstance(cb['timestamp'], str):
            cb['timestamp'] = datetime.fromisoformat(cb['timestamp'])
    return callbacks

# Chat endpoints
@api_router.post("/chat", response_model=ChatResponse)
async def chat(input: ChatMessageCreate):
    try:
        session_id = input.session_id
        language = input.language if input.language in LANGUAGE_CONFIGS else "cs"
        
        # Create unique session key with language
        session_key = f"{session_id}_{language}"
        
        # Get or create chat history
        if session_key not in chat_sessions:
            chat_sessions[session_key] = []
        
        # Store user message in DB
        user_msg_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "language": language,
            "role": "user",
            "content": input.message,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_messages.insert_one(user_msg_doc)
        
        # Build messages for API
        messages = [
            {"role": "system", "content": LANGUAGE_CONFIGS[language]["system_prompt"]}
        ]
        
        # Add history
        for msg in chat_sessions[session_key][-10:]:  # Last 10 messages for context
            messages.append(msg)
        
        # Add current message
        messages.append({"role": "user", "content": input.message})
        
        # Call OpenAI API (Anthropic via Emergent)
        completion = await client.chat.completions.create(
            model="anthropic/claude-sonnet-4-5",
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        response_text = completion.choices[0].message.content
        
        # Store in session history
        chat_sessions[session_key].append({"role": "user", "content": input.message})
        chat_sessions[session_key].append({"role": "assistant", "content": response_text})
        
        # Store assistant message in DB
        assistant_msg_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "language": language,
            "role": "assistant",
            "content": response_text,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_messages.insert_one(assistant_msg_doc)
        
        return ChatResponse(response=response_text, session_id=session_id)
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/chat/history/{session_id}", response_model=List[ChatHistoryMessage])
async def get_chat_history(session_id: str):
    messages = await db.chat_messages.find(
        {"session_id": session_id},
        {"_id": 0, "role": 1, "content": 1, "timestamp": 1}
    ).sort("timestamp", 1).to_list(100)
    return messages

# Voice to text endpoint
@api_router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: str = Form("cs")
):
    try:
        # Map language codes for Whisper
        whisper_lang_map = {
            "cs": "cs",
            "en": "en",
            "de": "de",
            "sk": "sk"
        }
        whisper_lang = whisper_lang_map.get(language, "cs")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            content = await audio.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Transcribe
        with open(tmp_path, "rb") as audio_file:
            response = await stt.transcribe(
                file=audio_file,
                model="whisper-1",
                language=whisper_lang,
                response_format="json"
            )
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        logger.info(f"Transcription successful: {response.text[:50]}...")
        return TranscriptionResponse(text=response.text, language=language)
        
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Text to Speech endpoint
@api_router.post("/speak")
async def text_to_speech(
    text: str = Form(...),
    language: str = Form("cs")
):
    try:
        # Map language codes to OpenAI TTS voices
        voice_map = {
            "cs": "alloy",      # Czech - alloy (neutral)
            "sk": "alloy",      # Slovak - alloy
            "en": "nova",       # English - nova (warm)
            "de": "onyx",       # German - onyx (deep)
            "uk": "shimmer",    # Ukrainian - shimmer (warm)
            "vi": "echo",       # Vietnamese - echo
            "zh": "fable",      # Chinese - fable
            "ar": "onyx",       # Arabic - onyx
            "ru": "alloy",      # Russian - alloy
            "pl": "shimmer",    # Polish - shimmer
            "es": "nova",       # Spanish - nova
            "fr": "shimmer",    # French - shimmer
        }
        voice = voice_map.get(language, "alloy")
        
        # Generate speech
        audio_bytes = await tts.generate_speech(
            text=text,
            voice=voice,
            model="tts-1",
            response_format="mp3"
        )
        
        logger.info(f"TTS successful for language: {language}, text length: {len(text)}")
        
        # Return audio as streaming response
        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": f"inline; filename=speech.mp3"
            }
        )
        
    except Exception as e:
        logger.error(f"TTS error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get available languages
@api_router.get("/languages")
async def get_languages():
    return {code: config["name"] for code, config in LANGUAGE_CONFIGS.items()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
