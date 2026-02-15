from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional, List
import uuid


# ===== Auth =====
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    company_name: str = Field(min_length=1)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ===== Chatbot =====
class ChatbotCreate(BaseModel):
    name: str = Field(min_length=1)
    system_prompt: str = ""
    welcome_message: str = "Dobry den! Jak vam mohu pomoci?"
    primary_color: str = "#6366F1"
    position: str = "bottom-right"
    language: str = "cs"

class ChatbotUpdate(BaseModel):
    name: Optional[str] = None
    system_prompt: Optional[str] = None
    welcome_message: Optional[str] = None
    primary_color: Optional[str] = None
    is_active: Optional[bool] = None
    language: Optional[str] = None
    position: Optional[str] = None

# ===== Widget =====
class WidgetInitRequest(BaseModel):
    chatbot_id: str
    widget_token: str
    visitor_id: Optional[str] = None

class WidgetChatRequest(BaseModel):
    chatbot_id: str
    widget_token: str
    conversation_id: str
    message: str
    visitor_id: str

class WidgetLeadCreate(BaseModel):
    chatbot_id: str
    widget_token: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None

# ===== GDPR =====
class GDPRConsentRequest(BaseModel):
    visitor_id: str
    consent_types: List[str]
    granted: bool

# ===== Settings =====
class ProfileUpdate(BaseModel):
    company_name: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)
