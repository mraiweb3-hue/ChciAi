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
