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
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai import OpenAISpeechToText
import tempfile

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

# Store active chat sessions
chat_sessions = {}

# Initialize STT
stt = OpenAISpeechToText(api_key=EMERGENT_LLM_KEY)

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
        "system_prompt": """Jsi Aji, přátelský AI asistent pro web chciai.cz. 
Pomáháš návštěvníkům pochopit naše služby:
- Instalace a setup AI asistentů (Clawdbot/OpenClawd)
- Opensource automatizace (n8n, Make.com, API integrace)
- Training pro klienty
- Dlouhodobá podpora a partnerství

Odpovídej v češtině, buď přátelský a profesionální. Pokud se někdo ptá na ceny nebo konkrétní projekty, navrhni jim rezervaci konzultace.

Jsi technický AI partner Martina, který se stará o komunikaci s klienty. Společně pomáháte českým firmám s AI transformací."""
    },
    "en": {
        "name": "English",
        "system_prompt": """You are Aji, a friendly AI assistant for chciai.cz website.
You help visitors understand our services:
- AI assistant installation and setup (Clawdbot/OpenClawd)
- Opensource automation (n8n, Make.com, API integrations)
- Client training
- Long-term support and partnership

Respond in English, be friendly and professional. If someone asks about prices or specific projects, suggest booking a consultation.

You are Martin's technical AI partner. Together you help Czech companies with AI transformation."""
    },
    "de": {
        "name": "Deutsch",
        "system_prompt": """Du bist Aji, ein freundlicher KI-Assistent für die Website chciai.cz.
Du hilfst Besuchern, unsere Dienstleistungen zu verstehen:
- Installation und Setup von KI-Assistenten (Clawdbot/OpenClawd)
- Opensource-Automatisierung (n8n, Make.com, API-Integrationen)
- Kundenschulung
- Langfristige Unterstützung und Partnerschaft

Antworte auf Deutsch, sei freundlich und professionell. Wenn jemand nach Preisen oder konkreten Projekten fragt, schlage eine Beratung vor."""
    },
    "sk": {
        "name": "Slovenčina",
        "system_prompt": """Si Aji, priateľský AI asistent pre web chciai.cz.
Pomáhaš návštevníkom pochopiť naše služby:
- Inštalácia a setup AI asistentov (Clawdbot/OpenClawd)
- Opensource automatizácia (n8n, Make.com, API integrácie)
- Training pre klientov
- Dlhodobá podpora a partnerstvo

Odpovedaj po slovensky, buď priateľský a profesionálny. Ak sa niekto pýta na ceny alebo konkrétne projekty, navrhni mu rezerváciu konzultácie."""
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
        
        # Get or create chat session
        if session_key not in chat_sessions:
            chat_sessions[session_key] = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=session_key,
                system_message=LANGUAGE_CONFIGS[language]["system_prompt"]
            ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        chat = chat_sessions[session_key]
        
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
        
        # Send message and get response
        user_message = UserMessage(text=input.message)
        response = await chat.send_message(user_message)
        
        # Store assistant message in DB
        assistant_msg_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "language": language,
            "role": "assistant",
            "content": response,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_messages.insert_one(assistant_msg_doc)
        
        return ChatResponse(response=response, session_id=session_id)
        
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
