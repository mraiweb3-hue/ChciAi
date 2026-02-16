from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import secrets
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from collections import defaultdict

from models import (
    RegisterRequest, LoginRequest, ChatbotCreate, ChatbotUpdate,
    WidgetInitRequest, WidgetChatRequest, WidgetLeadCreate,
    GDPRConsentRequest, ProfileUpdate, PasswordChange,
    ClawixCallbackRequest, ClawixCallbackCancel, ContactRequest
)
from auth import hash_password, verify_password, create_token, get_current_client
from ai_service import get_ai_response

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="CHCIAI.CZ API", version="1.0.0")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===== Rate Limiting =====
rate_store = defaultdict(list)
RATE_WINDOW = 60
RATE_MAX_WIDGET = 30
RATE_MAX_CHAT = 20


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host


def check_rate_limit(key: str, max_req: int = RATE_MAX_WIDGET) -> bool:
    now = time.time()
    rate_store[key] = [t for t in rate_store[key] if now - t < RATE_WINDOW]
    if len(rate_store[key]) >= max_req:
        return False
    rate_store[key].append(now)
    return True


# ===== Startup =====
@app.on_event("startup")
async def startup():
    await db.clients.create_index("email", unique=True)
    await db.clients.create_index("id", unique=True)
    await db.chatbot_instances.create_index("client_id")
    await db.chatbot_instances.create_index("id", unique=True)
    await db.conversations.create_index([("client_id", 1), ("updated_at", -1)])
    await db.conversations.create_index("id", unique=True)
    await db.leads.create_index("client_id")
    await db.leads.create_index("id", unique=True)
    logger.info("Database indexes created")


# ===== AUTH =====
@api_router.post("/auth/register")
async def register(data: RegisterRequest, request: Request):
    ip = get_client_ip(request)
    if not check_rate_limit(f"auth:{ip}", 10):
        raise HTTPException(status_code=429, detail="Too many requests")
    existing = await db.clients.find_one({"email": data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    client_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    doc = {
        "id": client_id,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "company_name": data.company_name,
        "plan": "starter",
        "created_at": now,
        "updated_at": now,
    }
    await db.clients.insert_one(doc)
    token = create_token(client_id, data.email)

    return {
        "token": token,
        "client": {
            "id": client_id, "email": data.email,
            "company_name": data.company_name,
            "plan": "starter", "created_at": now,
        }
    }


@api_router.post("/auth/login")
async def login(data: LoginRequest, request: Request):
    ip = get_client_ip(request)
    if not check_rate_limit(f"auth:{ip}", 10):
        raise HTTPException(status_code=429, detail="Too many requests")
    doc = await db.clients.find_one({"email": data.email}, {"_id": 0})
    if not doc or not verify_password(data.password, doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(doc["id"], data.email)
    return {
        "token": token,
        "client": {
            "id": doc["id"], "email": doc["email"],
            "company_name": doc["company_name"],
            "plan": doc["plan"], "created_at": doc["created_at"],
        }
    }


@api_router.get("/auth/me")
async def get_me(client_id: str = Depends(get_current_client)):
    doc = await db.clients.find_one({"id": client_id}, {"_id": 0, "password_hash": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Client not found")
    return doc


# ===== CHATBOTS =====
@api_router.get("/chatbots")
async def list_chatbots(client_id: str = Depends(get_current_client)):
    return await db.chatbot_instances.find(
        {"client_id": client_id}, {"_id": 0}
    ).to_list(100)


@api_router.post("/chatbots")
async def create_chatbot(data: ChatbotCreate, client_id: str = Depends(get_current_client)):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "client_id": client_id,
        "name": data.name,
        "system_prompt": data.system_prompt,
        "welcome_message": data.welcome_message,
        "primary_color": data.primary_color,
        "position": data.position,
        "language": data.language,
        "is_active": True,
        "widget_token": secrets.token_urlsafe(32),
        "created_at": now,
        "updated_at": now,
    }
    await db.chatbot_instances.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.get("/chatbots/{chatbot_id}")
async def get_chatbot(chatbot_id: str, client_id: str = Depends(get_current_client)):
    bot = await db.chatbot_instances.find_one(
        {"id": chatbot_id, "client_id": client_id}, {"_id": 0}
    )
    if not bot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    return bot


@api_router.put("/chatbots/{chatbot_id}")
async def update_chatbot(chatbot_id: str, data: ChatbotUpdate, client_id: str = Depends(get_current_client)):
    existing = await db.chatbot_instances.find_one(
        {"id": chatbot_id, "client_id": client_id}, {"_id": 0}
    )
    if not existing:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    updates = {k: v for k, v in data.model_dump(exclude_none=True).items()}
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.chatbot_instances.update_one(
        {"id": chatbot_id, "client_id": client_id},
        {"$set": updates}
    )
    return await db.chatbot_instances.find_one(
        {"id": chatbot_id, "client_id": client_id}, {"_id": 0}
    )


@api_router.delete("/chatbots/{chatbot_id}")
async def delete_chatbot(chatbot_id: str, client_id: str = Depends(get_current_client)):
    result = await db.chatbot_instances.delete_one(
        {"id": chatbot_id, "client_id": client_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    await db.conversations.delete_many({"chatbot_id": chatbot_id, "client_id": client_id})
    return {"message": "Chatbot deleted"}


# ===== WIDGET (PUBLIC) =====
@api_router.post("/widget/init")
async def widget_init(data: WidgetInitRequest, request: Request):
    ip = get_client_ip(request)
    if not check_rate_limit(f"wi:{ip}"):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    bot = await db.chatbot_instances.find_one(
        {"id": data.chatbot_id, "widget_token": data.widget_token, "is_active": True},
        {"_id": 0}
    )
    if not bot:
        raise HTTPException(status_code=403, detail="Invalid chatbot credentials")

    visitor_id = data.visitor_id or str(uuid.uuid4())
    conv_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    await db.conversations.insert_one({
        "id": conv_id,
        "client_id": bot["client_id"],
        "chatbot_id": data.chatbot_id,
        "chatbot_name": bot["name"],
        "visitor_id": visitor_id,
        "messages": [],
        "created_at": now,
        "updated_at": now,
    })

    return {
        "conversation_id": conv_id,
        "visitor_id": visitor_id,
        "welcome_message": bot["welcome_message"],
        "config": {
            "name": bot["name"],
            "primary_color": bot["primary_color"],
            "language": bot["language"],
        }
    }


@api_router.post("/widget/chat")
async def widget_chat(data: WidgetChatRequest, request: Request):
    ip = get_client_ip(request)
    if not check_rate_limit(f"wc:{ip}", RATE_MAX_CHAT):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    bot = await db.chatbot_instances.find_one(
        {"id": data.chatbot_id, "widget_token": data.widget_token, "is_active": True},
        {"_id": 0}
    )
    if not bot:
        raise HTTPException(status_code=403, detail="Invalid chatbot credentials")

    conv = await db.conversations.find_one(
        {"id": data.conversation_id, "chatbot_id": data.chatbot_id},
        {"_id": 0}
    )
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    now = datetime.now(timezone.utc).isoformat()
    user_msg = {"role": "user", "content": data.message, "timestamp": now}

    ai_text = await get_ai_response(
        message=data.message,
        conversation_history=conv.get("messages", []),
        system_prompt=bot.get("system_prompt") or None,
        language=bot.get("language", "cs"),
        session_id=data.conversation_id
    )

    assistant_msg = {"role": "assistant", "content": ai_text, "timestamp": now}

    await db.conversations.update_one(
        {"id": data.conversation_id},
        {
            "$push": {"messages": {"$each": [user_msg, assistant_msg]}},
            "$set": {"updated_at": now}
        }
    )

    return {"response": ai_text, "conversation_id": data.conversation_id}


@api_router.post("/widget/lead")
async def widget_lead(data: WidgetLeadCreate, request: Request):
    ip = get_client_ip(request)
    if not check_rate_limit(f"wl:{ip}"):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    bot = await db.chatbot_instances.find_one(
        {"id": data.chatbot_id, "widget_token": data.widget_token, "is_active": True},
        {"_id": 0}
    )
    if not bot:
        raise HTTPException(status_code=403, detail="Invalid chatbot credentials")

    now = datetime.now(timezone.utc).isoformat()
    lead = {
        "id": str(uuid.uuid4()),
        "client_id": bot["client_id"],
        "chatbot_id": data.chatbot_id,
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "message": data.message,
        "created_at": now,
    }
    await db.leads.insert_one(lead)
    return {k: v for k, v in lead.items() if k != "_id"}


# ===== CONVERSATIONS =====
@api_router.get("/conversations")
async def list_conversations(
    chatbot_id: Optional[str] = None,
    client_id: str = Depends(get_current_client)
):
    query = {"client_id": client_id}
    if chatbot_id:
        query["chatbot_id"] = chatbot_id
    return await db.conversations.find(
        query, {"_id": 0}
    ).sort("updated_at", -1).to_list(200)


@api_router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, client_id: str = Depends(get_current_client)):
    conv = await db.conversations.find_one(
        {"id": conversation_id, "client_id": client_id}, {"_id": 0}
    )
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv


# ===== LEADS =====
@api_router.get("/leads")
async def list_leads(client_id: str = Depends(get_current_client)):
    return await db.leads.find(
        {"client_id": client_id}, {"_id": 0}
    ).sort("created_at", -1).to_list(200)


@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, client_id: str = Depends(get_current_client)):
    result = await db.leads.delete_one({"id": lead_id, "client_id": client_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted"}


# ===== DASHBOARD =====
@api_router.get("/dashboard/stats")
async def dashboard_stats(client_id: str = Depends(get_current_client)):
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    return {
        "total_chatbots": await db.chatbot_instances.count_documents({"client_id": client_id}),
        "active_chatbots": await db.chatbot_instances.count_documents({"client_id": client_id, "is_active": True}),
        "total_conversations": await db.conversations.count_documents({"client_id": client_id}),
        "total_leads": await db.leads.count_documents({"client_id": client_id}),
        "conversations_today": await db.conversations.count_documents({"client_id": client_id, "created_at": {"$gte": today}}),
        "leads_today": await db.leads.count_documents({"client_id": client_id, "created_at": {"$gte": today}}),
    }


# ===== GDPR =====

# ===== PUBLIC CONTACT =====
@api_router.post("/contact/callback")
async def request_callback(request: Request):
    ip = get_client_ip(request)
    if not check_rate_limit(f"cb:{ip}", 5):
        raise HTTPException(status_code=429, detail="Too many requests")
    data = await request.json()
    phone = data.get("phone")
    if not phone:
        raise HTTPException(status_code=400, detail="Phone required")
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "type": data.get("type", "callback"),
        "phone": phone,
        "name": data.get("name", ""),
        "email": data.get("email", ""),
        "source": "landing_page",
        "created_at": now,
    }
    await db.contact_requests.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.get("/contact/requests")
async def list_contact_requests(client_id: str = Depends(get_current_client)):
    return await db.contact_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api_router.post("/gdpr/consent")
async def record_consent(data: GDPRConsentRequest):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "visitor_id": data.visitor_id,
        "consent_types": data.consent_types,
        "granted": data.granted,
        "timestamp": now,
    }
    await db.gdpr_consents.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.delete("/gdpr/data/{visitor_id}")
async def delete_visitor_data(visitor_id: str):
    await db.conversations.delete_many({"visitor_id": visitor_id})
    await db.gdpr_consents.delete_many({"visitor_id": visitor_id})
    return {"message": "All visitor data deleted", "visitor_id": visitor_id}


@api_router.get("/gdpr/export/{visitor_id}")
async def export_visitor_data(visitor_id: str):
    return {
        "visitor_id": visitor_id,
        "conversations": await db.conversations.find({"visitor_id": visitor_id}, {"_id": 0}).to_list(1000),
        "consents": await db.gdpr_consents.find({"visitor_id": visitor_id}, {"_id": 0}).to_list(1000),
    }


# ===== SETTINGS =====
@api_router.put("/settings/profile")
async def update_profile(data: ProfileUpdate, client_id: str = Depends(get_current_client)):
    updates = {k: v for k, v in data.model_dump(exclude_none=True).items()}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.clients.update_one({"id": client_id}, {"$set": updates})
    return await db.clients.find_one({"id": client_id}, {"_id": 0, "password_hash": 0})


@api_router.put("/settings/password")
async def change_password(data: PasswordChange, client_id: str = Depends(get_current_client)):
    doc = await db.clients.find_one({"id": client_id}, {"_id": 0})
    if not verify_password(data.current_password, doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    await db.clients.update_one(
        {"id": client_id},
        {"$set": {"password_hash": hash_password(data.new_password), "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Password updated"}


# ===== HEALTH =====
@api_router.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


# ===== CLAWIX CALLBACK SYSTEM =====
def generate_confirmation_code():
    """Generate 6-digit confirmation code"""
    import random
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])

def calculate_scheduled_time(call_time: str) -> str:
    """Calculate scheduled time based on call_time option"""
    from datetime import timedelta
    now = datetime.now(timezone.utc)
    if call_time == "30s":
        scheduled = now + timedelta(seconds=30)
    elif call_time == "5m":
        scheduled = now + timedelta(minutes=5)
    elif call_time == "30m":
        scheduled = now + timedelta(minutes=30)
    elif call_time == "tomorrow":
        scheduled = now + timedelta(days=1)
        scheduled = scheduled.replace(hour=10, minute=0, second=0)
    else:
        scheduled = now + timedelta(seconds=30)
    return scheduled.isoformat()

@api_router.post("/clawix/callback")
async def create_clawix_callback(data: ClawixCallbackRequest, request: Request):
    """Create a callback request for Clawix AI assistant"""
    ip = get_client_ip(request)
    if not check_rate_limit(f"clawix:{ip}", 5):
        raise HTTPException(status_code=429, detail="Příliš mnoho požadavků. Zkuste to za chvíli.")
    
    callback_id = str(uuid.uuid4())
    confirmation_code = generate_confirmation_code()
    scheduled_time = calculate_scheduled_time(data.call_time)
    now = datetime.now(timezone.utc).isoformat()
    
    doc = {
        "id": callback_id,
        "name": data.name,
        "phone": data.phone,
        "language": data.language,
        "call_time": data.call_time,
        "scheduled_time": scheduled_time,
        "website": data.website,
        "consent_sms": data.consent_sms,
        "consent_call": data.consent_call,
        "confirmation_code": confirmation_code,
        "status": "pending",  # pending, confirmed, cancelled, completed, rescheduled
        "created_at": now,
        "updated_at": now,
        "ip_address": ip,
        "sms_sent": False,
        "call_attempted": False,
    }
    
    await db.clawix_callbacks.insert_one(doc)
    
    # Log for SMS sending (would integrate with SMS provider)
    logger.info(f"Clawix callback created: {callback_id} for {data.phone}, scheduled: {scheduled_time}")
    
    return {
        "id": callback_id,
        "status": "pending",
        "confirmation_code": confirmation_code,
        "scheduled_time": scheduled_time,
        "message": f"Děkujeme {data.name}! Clawix vám zavolá v požadovaném čase. Před hovorem obdržíte SMS s možností potvrzení nebo změny termínu."
    }

@api_router.post("/clawix/callback/action")
async def clawix_callback_action(data: ClawixCallbackCancel, request: Request):
    """Handle callback cancellation or rescheduling"""
    callback = await db.clawix_callbacks.find_one(
        {"id": data.callback_id, "confirmation_code": data.confirmation_code},
        {"_id": 0}
    )
    
    if not callback:
        raise HTTPException(status_code=404, detail="Callback nenalezen nebo neplatný kód")
    
    if callback["status"] in ["completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Tento callback již nelze upravit")
    
    now = datetime.now(timezone.utc).isoformat()
    
    if data.action == "cancel":
        await db.clawix_callbacks.update_one(
            {"id": data.callback_id},
            {"$set": {"status": "cancelled", "updated_at": now}}
        )
        return {"message": "Hovor byl zrušen. Děkujeme za zpětnou vazbu.", "status": "cancelled"}
    
    elif data.action == "reschedule":
        if not data.new_time:
            raise HTTPException(status_code=400, detail="Pro přeplánování je nutné zadat nový čas")
        new_scheduled = calculate_scheduled_time(data.new_time)
        await db.clawix_callbacks.update_one(
            {"id": data.callback_id},
            {"$set": {
                "status": "rescheduled",
                "call_time": data.new_time,
                "scheduled_time": new_scheduled,
                "updated_at": now
            }}
        )
        return {"message": f"Hovor byl přeplánován.", "status": "rescheduled", "new_time": new_scheduled}
    
    elif data.action == "confirm":
        await db.clawix_callbacks.update_one(
            {"id": data.callback_id},
            {"$set": {"status": "confirmed", "updated_at": now}}
        )
        return {"message": "Hovor byl potvrzen. Clawix vám brzy zavolá.", "status": "confirmed"}
    
    raise HTTPException(status_code=400, detail="Neplatná akce")

@api_router.get("/clawix/callback/{callback_id}")
async def get_clawix_callback(callback_id: str, code: str):
    """Get callback status (requires confirmation code for security)"""
    callback = await db.clawix_callbacks.find_one(
        {"id": callback_id, "confirmation_code": code},
        {"_id": 0, "ip_address": 0}
    )
    if not callback:
        raise HTTPException(status_code=404, detail="Callback nenalezen")
    return callback

# ===== SEO STRUCTURED DATA =====
@api_router.get("/seo/structured-data")
async def get_structured_data():
    """Return JSON-LD structured data for SEO"""
    return {
        "service": {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Chci AI - Digitální AI zaměstnanec",
            "description": "AI asistent pro automatizaci komunikace, zákaznického servisu a marketingu",
            "provider": {
                "@type": "Organization",
                "name": "Chci AI",
                "url": "https://chciai.cz"
            },
            "areaServed": "CZ",
            "availableLanguage": ["cs", "en", "de", "sv", "vi", "uk"]
        },
        "organization": {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Chci AI",
            "url": "https://chciai.cz",
            "logo": "https://chciai.cz/logo.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+420-XXX-XXX-XXX",
                "contactType": "customer service",
                "availableLanguage": ["cs", "en"]
            }
        },
        "faq": {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Co je Chci AI?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Chci AI je platforma pro vytváření AI zaměstnanců, kteří automatizují komunikaci se zákazníky."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Jak funguje Clawix?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Clawix je náš AI asistent, který může komunikovat s vašimi klienty přes chat nebo telefonní hovory."
                    }
                }
            ]
        }
    }

# ===== CONTENT SECTIONS (MongoDB dynamic) =====
@api_router.get("/content/sections")
async def get_content_sections():
    """Get dynamic content sections from database"""
    sections = await db.content_sections.find({}, {"_id": 0}).to_list(100)
    if not sections:
        # Return default sections if none in DB
        return [
            {
                "section_id": "hero",
                "title": "AI zaměstnanec pro malé a střední firmy",
                "description": "Automatizujte komunikaci, získejte více klientů",
                "robot_message": "Váš AI zaměstnanec nikdy nespí.",
                "seo_title": "Chci AI - Digitální AI zaměstnanec",
                "seo_description": "Vytvořte si AI zaměstnance pro automatizaci komunikace"
            },
            {
                "section_id": "how_it_works",
                "title": "Jak to funguje",
                "description": "Jednoduché nastavení, okamžité výsledky",
                "robot_message": "Automatizujeme komunikaci za vás.",
                "seo_title": "Jak funguje AI asistent",
                "seo_description": "Zjistěte jak náš AI asistent pomáhá firmám"
            },
            {
                "section_id": "contact",
                "title": "Kontaktujte nás",
                "description": "Začněte ještě dnes",
                "robot_message": "Začněme ještě dnes.",
                "seo_title": "Kontakt - Chci AI",
                "seo_description": "Kontaktujte nás pro více informací"
            }
        ]
    return sections


# ===== LEADS MANAGEMENT =====
@api_router.post("/leads")
async def create_lead(request: Request):
    """Create a qualified lead from chatbot"""
    ip = get_client_ip(request)
    if not check_rate_limit(f"lead:{ip}", 10):
        raise HTTPException(status_code=429, detail="Příliš mnoho požadavků")
    
    data = await request.json()
    now = datetime.now(timezone.utc).isoformat()
    
    lead_id = str(uuid.uuid4())
    doc = {
        "id": lead_id,
        "industry": data.get("industry", ""),
        "company_size": data.get("company_size", ""),
        "problem": data.get("problem", ""),
        "tech_level": data.get("tech_level", ""),
        "source": data.get("source", "chatbot"),
        "status": data.get("status", "new"),  # new, qualified, contacted, converted
        "recommended_variant": "personal" if data.get("tech_level") in ["Začátečník", "Pokročilý uživatel"] else "online",
        "created_at": now,
        "updated_at": now,
        "ip_address": ip,
        "notes": []
    }
    
    await db.leads.insert_one(doc)
    logger.info(f"New lead created: {lead_id} from {data.get('source', 'unknown')}")
    
    return {k: v for k, v in doc.items() if k not in ["_id", "ip_address"]}

@api_router.get("/leads")
async def list_leads(client_id: str = Depends(get_current_client)):
    """List all leads (admin only)"""
    leads = await db.leads.find({}, {"_id": 0, "ip_address": 0}).sort("created_at", -1).to_list(500)
    return leads

@api_router.get("/leads/{lead_id}")
async def get_lead(lead_id: str, client_id: str = Depends(get_current_client)):
    """Get single lead details"""
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0, "ip_address": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead nenalezen")
    return lead

@api_router.put("/leads/{lead_id}")
async def update_lead(lead_id: str, request: Request, client_id: str = Depends(get_current_client)):
    """Update lead status or notes"""
    data = await request.json()
    now = datetime.now(timezone.utc).isoformat()
    
    updates = {"updated_at": now}
    if "status" in data:
        updates["status"] = data["status"]
    if "note" in data:
        updates["$push"] = {"notes": {"text": data["note"], "timestamp": now}}
    
    if "$push" in updates:
        push_update = updates.pop("$push")
        await db.leads.update_one({"id": lead_id}, {"$set": updates, "$push": push_update})
    else:
        await db.leads.update_one({"id": lead_id}, {"$set": updates})
    
    return await db.leads.find_one({"id": lead_id}, {"_id": 0, "ip_address": 0})


# ===== CLIENT ONBOARDING =====
@api_router.post("/onboarding/start")
async def start_onboarding(request: Request, client_id: str = Depends(get_current_client)):
    """Start onboarding process for a client"""
    data = await request.json()
    now = datetime.now(timezone.utc).isoformat()
    
    onboarding_id = str(uuid.uuid4())
    doc = {
        "id": onboarding_id,
        "client_id": client_id,
        "status": "started",
        "variant": data.get("variant", "personal"),  # personal or online
        "checklist": {
            "account_created": True,
            "audit_scheduled": False,
            "openclaw_installed": False,
            "ai_partner_created": False,
            "vibe_coding_completed": False,
            "first_automation": False
        },
        "ai_partner": {
            "name": None,
            "tone": None,
            "role": None
        },
        "access_credentials": [],
        "training_materials": [],
        "notes": [],
        "created_at": now,
        "updated_at": now
    }
    
    await db.onboarding.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api_router.get("/onboarding/status")
async def get_onboarding_status(client_id: str = Depends(get_current_client)):
    """Get onboarding status for current client"""
    onboarding = await db.onboarding.find_one({"client_id": client_id}, {"_id": 0})
    if not onboarding:
        return {"status": "not_started", "message": "Onboarding ještě nezačal"}
    return onboarding

@api_router.put("/onboarding/update")
async def update_onboarding(request: Request, client_id: str = Depends(get_current_client)):
    """Update onboarding progress"""
    data = await request.json()
    now = datetime.now(timezone.utc).isoformat()
    
    updates = {"updated_at": now}
    
    if "checklist" in data:
        for key, value in data["checklist"].items():
            updates[f"checklist.{key}"] = value
    
    if "ai_partner" in data:
        for key, value in data["ai_partner"].items():
            updates[f"ai_partner.{key}"] = value
    
    if "note" in data:
        await db.onboarding.update_one(
            {"client_id": client_id},
            {"$push": {"notes": {"text": data["note"], "timestamp": now}}}
        )
    
    await db.onboarding.update_one({"client_id": client_id}, {"$set": updates})
    return await db.onboarding.find_one({"client_id": client_id}, {"_id": 0})


# ===== ACADEMY / MODULES =====
@api_router.get("/academy/modules")
async def get_academy_modules(client_id: str = Depends(get_current_client)):
    """Get available academy modules"""
    # Check if user has access (based on variant)
    onboarding = await db.onboarding.find_one({"client_id": client_id})
    
    modules = [
        {
            "id": "intro",
            "title": "Úvod do AI automatizace",
            "description": "Základní koncepty a možnosti",
            "duration": "15 min",
            "type": "video",
            "free": True
        },
        {
            "id": "openclaw-basics",
            "title": "OpenClaw základy",
            "description": "Jak nastavit a používat OpenClaw",
            "duration": "30 min",
            "type": "video",
            "free": False
        },
        {
            "id": "vibe-coding-1",
            "title": "Vibe Coding 101",
            "description": "Jak komunikovat s AI",
            "duration": "45 min",
            "type": "video",
            "free": False
        },
        {
            "id": "vibe-coding-2",
            "title": "Vibe Coding pokročilé",
            "description": "Vytváření komplexních workflow",
            "duration": "60 min",
            "type": "video",
            "free": False
        },
        {
            "id": "automation-templates",
            "title": "Automatizační šablony",
            "description": "Připravené scénáře k použití",
            "duration": "30 min",
            "type": "pdf",
            "free": False
        }
    ]
    
    # Add progress tracking
    progress = await db.academy_progress.find_one({"client_id": client_id}) or {"completed": []}
    
    for module in modules:
        module["completed"] = module["id"] in progress.get("completed", [])
    
    return modules

@api_router.post("/academy/progress/{module_id}")
async def update_module_progress(module_id: str, client_id: str = Depends(get_current_client)):
    """Mark module as completed"""
    now = datetime.now(timezone.utc).isoformat()
    
    await db.academy_progress.update_one(
        {"client_id": client_id},
        {
            "$addToSet": {"completed": module_id},
            "$set": {"updated_at": now}
        },
        upsert=True
    )
    
    return {"message": f"Modul {module_id} označen jako dokončený"}


# ===== ADMIN DASHBOARD STATS =====
@api_router.get("/admin/stats")
async def get_admin_stats(client_id: str = Depends(get_current_client)):
    """Get admin dashboard statistics"""
    # Count leads by status
    total_leads = await db.leads.count_documents({})
    qualified_leads = await db.leads.count_documents({"status": "qualified"})
    converted_leads = await db.leads.count_documents({"status": "converted"})
    
    # Count callbacks
    total_callbacks = await db.clawix_callbacks.count_documents({})
    pending_callbacks = await db.clawix_callbacks.count_documents({"status": "pending"})
    
    # Count onboardings
    total_onboardings = await db.onboarding.count_documents({})
    completed_onboardings = await db.onboarding.count_documents({"checklist.first_automation": True})
    
    return {
        "leads": {
            "total": total_leads,
            "qualified": qualified_leads,
            "converted": converted_leads,
            "conversion_rate": round(converted_leads / total_leads * 100, 1) if total_leads > 0 else 0
        },
        "callbacks": {
            "total": total_callbacks,
            "pending": pending_callbacks
        },
        "onboarding": {
            "total": total_onboardings,
            "completed": completed_onboardings,
            "completion_rate": round(completed_onboardings / total_onboardings * 100, 1) if total_onboardings > 0 else 0
        }
    }


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
