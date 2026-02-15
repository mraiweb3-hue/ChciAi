from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import asyncio
import resend
from emergentintegrations.llm.chat import LlmChat, UserMessage
from retell import Retell

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'kontakt@chciai.cz')

# LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Retell.ai setup
RETELL_API_KEY = os.environ.get('RETELL_API_KEY')
RETELL_AGENT_ID = os.environ.get('RETELL_AGENT_ID')
RETELL_FROM_NUMBER = os.environ.get('RETELL_FROM_NUMBER')
retell_client = Retell(api_key=RETELL_API_KEY) if RETELL_API_KEY else None

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Store chat sessions in memory (for simplicity, can be moved to MongoDB)
chat_sessions = {}

# ============== MODELS ==============

class ContactFormRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str
    form_type: str = "contact"  # contact, callback, meeting

class ContactFormResponse(BaseModel):
    id: str
    status: str
    message: str

class CallbackRequest(BaseModel):
    phone: str
    name: Optional[str] = None

class AICallRequest(BaseModel):
    phone: str
    name: Optional[str] = None

class AICallResponse(BaseModel):
    id: str
    status: str
    message: str
    call_id: Optional[str] = None

class ChatMessage(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    response: str

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "OpenClaw API is running"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Contact Form Endpoint
@api_router.post("/contact", response_model=ContactFormResponse)
async def submit_contact_form(request: ContactFormRequest):
    try:
        # Generate unique ID
        form_id = str(uuid.uuid4())
        
        # Store in MongoDB
        form_data = {
            "id": form_id,
            "name": request.name,
            "email": request.email,
            "phone": request.phone,
            "company": request.company,
            "message": request.message,
            "form_type": request.form_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "new"
        }
        await db.contact_forms.insert_one(form_data)
        
        # Determine email subject based on form type
        subject_map = {
            "contact": "Nová zpráva z kontaktního formuláře - OpenClaw",
            "callback": "Žádost o zavolání zpět - OpenClaw",
            "meeting": "Žádost o osobní setkání - OpenClaw",
            "pricing_zaklad": "Zájem o tarif Základ - OpenClaw",
            "pricing_rust": "Zájem o tarif Růst - OpenClaw"
        }
        subject = subject_map.get(request.form_type, "Nová zpráva - OpenClaw")
        
        # Create HTML email
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 10px; color: white;">
                <h1 style="margin: 0 0 20px 0; font-size: 24px;">🤖 OpenClaw - {subject}</h1>
                
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #00d9ff;">Kontaktní údaje</h2>
                    <p style="margin: 5px 0;"><strong>Jméno:</strong> {request.name}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> {request.email}</p>
                    <p style="margin: 5px 0;"><strong>Telefon:</strong> {request.phone or 'Neuvedeno'}</p>
                    <p style="margin: 5px 0;"><strong>Firma:</strong> {request.company or 'Neuvedeno'}</p>
                </div>
                
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                    <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #00d9ff;">Zpráva</h2>
                    <p style="margin: 0; white-space: pre-wrap;">{request.message}</p>
                </div>
                
                <p style="margin-top: 20px; font-size: 12px; color: #888;">Odesláno: {datetime.now(timezone.utc).strftime('%d.%m.%Y %H:%M')} UTC</p>
            </div>
        </body>
        </html>
        """
        
        # Try to send email via Resend
        email_sent = False
        try:
            params = {
                "from": SENDER_EMAIL,
                "to": [CONTACT_EMAIL],
                "subject": subject,
                "html": html_content,
                "reply_to": request.email
            }
            email_result = await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Email sent successfully: {email_result}")
            email_sent = True
        except Exception as email_error:
            logger.warning(f"Email sending failed (form saved to DB): {str(email_error)}")
            # Update form status to indicate email not sent
            await db.contact_forms.update_one(
                {"id": form_id},
                {"$set": {"email_sent": False, "email_error": str(email_error)}}
            )
        
        return ContactFormResponse(
            id=form_id,
            status="success",
            message="Děkujeme! Vaše zpráva byla přijata. Ozveme se vám co nejdříve."
        )
        
    except Exception as e:
        logger.error(f"Failed to process contact form: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Nepodařilo se odeslat zprávu: {str(e)}")

# Callback Request Endpoint
@api_router.post("/callback", response_model=ContactFormResponse)
async def request_callback(request: CallbackRequest):
    try:
        form_id = str(uuid.uuid4())
        
        # Store in MongoDB
        callback_data = {
            "id": form_id,
            "phone": request.phone,
            "name": request.name,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "pending",
            "type": "callback_request"
        }
        await db.callback_requests.insert_one(callback_data)
        
        # Try to send notification email
        try:
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 10px; color: white;">
                    <h1 style="margin: 0 0 20px 0; font-size: 24px;">📞 Žádost o zavolání</h1>
                    
                    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                        <p style="margin: 5px 0; font-size: 18px;"><strong>Telefon:</strong> {request.phone}</p>
                        <p style="margin: 5px 0;"><strong>Jméno:</strong> {request.name or 'Neuvedeno'}</p>
                    </div>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #888;">Požadavek: {datetime.now(timezone.utc).strftime('%d.%m.%Y %H:%M')} UTC</p>
                </div>
            </body>
            </html>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": [CONTACT_EMAIL],
                "subject": "📞 Nová žádost o zavolání - OpenClaw",
                "html": html_content
            }
            
            await asyncio.to_thread(resend.Emails.send, params)
        except Exception as email_error:
            logger.warning(f"Email sending failed for callback (saved to DB): {str(email_error)}")
        
        return ContactFormResponse(
            id=form_id,
            status="success",
            message="Děkujeme! Budeme vás kontaktovat na zadané číslo."
        )
        
    except Exception as e:
        logger.error(f"Failed to process callback request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Nepodařilo se odeslat požadavek: {str(e)}")

# AI Phone Call Endpoint (Retell.ai)
@api_router.post("/ai-call", response_model=AICallResponse)
async def initiate_ai_call(request: AICallRequest):
    """Initiate an AI phone call using Retell.ai"""
    try:
        call_id = str(uuid.uuid4())
        
        # Store call request in MongoDB
        call_data = {
            "id": call_id,
            "phone": request.phone,
            "name": request.name,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "pending",
            "type": "ai_call_request"
        }
        await db.ai_calls.insert_one(call_data)
        
        # Check if Retell is configured
        if not retell_client or not RETELL_AGENT_ID or not RETELL_FROM_NUMBER:
            logger.warning("Retell.ai not fully configured - storing request only")
            # Send notification email about call request
            try:
                html_content = f"""
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 10px; color: white;">
                        <h1 style="margin: 0 0 20px 0; font-size: 24px;">🤖 Žádost o AI hovor</h1>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
                            <p style="margin: 5px 0; font-size: 18px;"><strong>Telefon:</strong> {request.phone}</p>
                            <p style="margin: 5px 0;"><strong>Jméno:</strong> {request.name or 'Neuvedeno'}</p>
                        </div>
                        
                        <p style="margin-top: 20px; font-size: 12px; color: #888;">Požadavek: {datetime.now(timezone.utc).strftime('%d.%m.%Y %H:%M')} UTC</p>
                        <p style="color: #ffcc00; margin-top: 10px;">⚠️ AI hovor nebyl automaticky spuštěn - vyžaduje konfiguraci Retell.ai agenta</p>
                    </div>
                </body>
                </html>
                """
                params = {
                    "from": SENDER_EMAIL,
                    "to": [CONTACT_EMAIL],
                    "subject": "🤖 Žádost o AI hovor - OpenClaw",
                    "html": html_content
                }
                await asyncio.to_thread(resend.Emails.send, params)
            except Exception as email_error:
                logger.warning(f"Email sending failed: {str(email_error)}")
            
            return AICallResponse(
                id=call_id,
                status="pending",
                message="Děkujeme! Vaše žádost o AI hovor byla zaznamenána. Budeme vás kontaktovat.",
                call_id=None
            )
        
        # Format phone number to E.164 format
        phone = request.phone.strip()
        if not phone.startswith('+'):
            # Assume Czech number if no country code
            phone = '+420' + phone.replace(' ', '').replace('-', '')
        
        # Initiate call via Retell.ai
        try:
            call_response = await asyncio.to_thread(
                retell_client.call.create_phone_call,
                from_number=RETELL_FROM_NUMBER,
                to_number=phone,
                agent_id=RETELL_AGENT_ID
            )
            
            retell_call_id = call_response.call_id
            
            # Update call status in DB
            await db.ai_calls.update_one(
                {"id": call_id},
                {"$set": {
                    "status": "initiated",
                    "retell_call_id": retell_call_id
                }}
            )
            
            logger.info(f"AI call initiated: {retell_call_id}")
            
            return AICallResponse(
                id=call_id,
                status="success",
                message="Hovor byl zahájen. OpenClaw vám právě volá!",
                call_id=retell_call_id
            )
            
        except Exception as retell_error:
            logger.error(f"Retell.ai call failed: {str(retell_error)}")
            await db.ai_calls.update_one(
                {"id": call_id},
                {"$set": {"status": "failed", "error": str(retell_error)}}
            )
            return AICallResponse(
                id=call_id,
                status="pending",
                message="Děkujeme! Vaše žádost byla zaznamenána. Budeme vás kontaktovat co nejdříve.",
                call_id=None
            )
        
    except Exception as e:
        logger.error(f"Failed to process AI call request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Nepodařilo se zpracovat požadavek: {str(e)}")

# AI Chat Endpoints
SYSTEM_MESSAGE = """Jsi OpenClaw, přátelský AI asistent české firmy zaměřené na AI automatizaci a digitální asistenty pro podnikatele.

Tvoje hlavní vlastnosti:
- Mluvíš česky, přátelsky a profesionálně
- Pomáháš návštěvníkům pochopit, co OpenClaw umí
- Odpovídáš na dotazy o službách, cenách a možnostech spolupráce
- Sbíráš kontakty od zájemců

O OpenClaw:
- Digitální zaměstnanec s "digitálními rukama" - může pracovat v digitálním světě zákazníka
- Může: odpovídat na emaily, upravovat web, přidávat produkty, kontrolovat objednávky, spouštět reklamy, volat klientům
- Zákazník má plnou kontrolu - určuje, kam má OpenClaw přístup
- Dva tarify: Základ (chatbot, email, základní automatizace) a Růst (plné nástroje, marketing, SEO)

Když se někdo zajímá o služby, nabídni mu možnost zanechat kontakt nebo si nechat zavolat.
Buď stručný, ale užitečný. Odpovídej maximálně v 2-3 větách, pokud není potřeba více."""

@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatMessage):
    try:
        session_id = request.session_id
        
        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=session_id,
                system_message=SYSTEM_MESSAGE
            ).with_model("openai", "gpt-4o")
        
        chat = chat_sessions[session_id]
        
        # Store user message in DB
        await db.chat_messages.insert_one({
            "session_id": session_id,
            "role": "user",
            "content": request.message,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        # Get AI response
        user_message = UserMessage(text=request.message)
        response = await chat.send_message(user_message)
        
        # Store assistant response in DB
        await db.chat_messages.insert_one({
            "session_id": session_id,
            "role": "assistant",
            "content": response,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        return ChatResponse(
            session_id=session_id,
            response=response
        )
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chyba při zpracování zprávy: {str(e)}")

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    try:
        messages = await db.chat_messages.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", 1).to_list(100)
        return {"session_id": session_id, "messages": messages}
    except Exception as e:
        logger.error(f"Failed to get chat history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Status endpoints (from original)
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
