# Database Schema - ChciAI.cz
## Future-proof data structure for AI conversations & client data

---

## 📊 **Core Collections**

### **1. `users`** - Client Accounts
```javascript
{
  _id: ObjectId,
  email: String,
  phone: String,
  name: String,
  company: String,
  industry: String, // "autoservis", "kosmeticka", "restaurace", etc.
  language: String, // "cs", "en", "sk"
  voicePreference: String, // "female", "male"
  
  // Subscription & Billing
  plan: String, // "start", "business", "enterprise"
  status: String, // "trial", "active", "paused", "cancelled"
  subscriptionStart: Date,
  subscriptionEnd: Date,
  
  // AI Configuration
  aiSettings: {
    tone: String, // "friendly", "professional", "casual"
    autoReply: Boolean,
    workingHours: Object, // { monday: "9-17", ... }
    maxCallDuration: Number, // seconds
    dailyMessageLimit: Number,
  },
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  source: String, // "website", "referral", "demo_call"
}
```

---

### **2. `conversations`** - All Client Interactions
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users
  
  // Conversation Info
  type: String, // "chat", "voice", "email", "whatsapp", "instagram"
  channel: String, // "web", "whatsapp", "telegram", "phone"
  sessionId: String, // Unique session identifier
  
  // Client Contact (if not registered user)
  clientPhone: String,
  clientEmail: String,
  clientName: String,
  
  // Conversation Data
  messages: [
    {
      role: String, // "user", "assistant", "system"
      content: String,
      timestamp: Date,
      metadata: Object, // voice transcription, sentiment, etc.
    }
  ],
  
  // Voice Call Specific
  callData: {
    duration: Number, // seconds
    voiceGender: String,
    recordingUrl: String,
    transcription: String,
    sentiment: String, // "positive", "neutral", "negative"
  },
  
  // AI Analysis
  intent: String, // "booking", "question", "complaint", "sale"
  leadScore: Number, // 0-100
  conversionProbability: Number, // 0-1
  tags: [String], // ["hot_lead", "follow_up_needed", "vip"]
  
  // Outcomes
  outcome: String, // "booking_made", "info_provided", "escalated", "sale"
  bookingDetails: Object, // { service, date, time, price }
  saleAmount: Number,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  resolved: Boolean,
  escalatedToHuman: Boolean,
}
```

---

### **3. `bookings`** - Reservations & Appointments
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  conversationId: ObjectId,
  
  // Client Info
  clientName: String,
  clientPhone: String,
  clientEmail: String,
  
  // Booking Details
  service: String,
  date: Date,
  time: String,
  duration: Number, // minutes
  price: Number,
  currency: String, // "CZK", "EUR"
  
  // Status
  status: String, // "pending", "confirmed", "completed", "cancelled"
  confirmationSent: Boolean,
  reminderSent: Boolean,
  
  // AI Notes
  aiNotes: String, // AI summary of special requests
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  cancelledAt: Date,
  cancelReason: String,
}
```

---

### **4. `leads`** - Sales Leads
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Business owner
  conversationId: ObjectId,
  
  // Lead Info
  name: String,
  phone: String,
  email: String,
  company: String,
  
  // Lead Data
  source: String, // "voice_call", "chat", "whatsapp"
  interest: String, // "ai_assistant", "web_development", "app_development"
  budget: String, // "10k-50k", "50k-100k", "100k+"
  timeline: String, // "immediate", "1-3_months", "3-6_months"
  
  // Scoring
  leadScore: Number, // 0-100 (AI calculated)
  priority: String, // "hot", "warm", "cold"
  
  // Follow-up
  followUpDate: Date,
  followUpStatus: String, // "pending", "contacted", "converted", "lost"
  notes: String,
  
  // Conversion
  converted: Boolean,
  convertedAt: Date,
  dealValue: Number,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
}
```

---

### **5. `analytics`** - Performance Metrics
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date, // Daily aggregation
  
  // Conversation Metrics
  totalConversations: Number,
  chatConversations: Number,
  voiceConversations: Number,
  avgConversationDuration: Number, // seconds
  
  // Response Metrics
  avgResponseTime: Number, // seconds
  resolutionRate: Number, // 0-1
  escalationRate: Number, // 0-1
  
  // Business Metrics
  bookingsMade: Number,
  salesGenerated: Number,
  totalRevenue: Number,
  
  // Lead Metrics
  newLeads: Number,
  hotLeads: Number,
  leadsConverted: Number,
  conversionRate: Number, // 0-1
  
  // Customer Satisfaction
  avgSentiment: Number, // 0-1
  positiveInteractions: Number,
  negativeInteractions: Number,
  
  // Token Usage (for billing)
  tokensUsed: Number,
  voiceMinutesUsed: Number,
  smsMessagesSent: Number,
  
  // Metadata
  createdAt: Date,
}
```

---

### **6. `voice_calls`** - Detailed Call Records
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  conversationId: ObjectId,
  
  // Call Info
  phoneNumber: String,
  direction: String, // "inbound", "outbound"
  voiceGender: String, // "female", "male"
  language: String,
  
  // Call Details
  startTime: Date,
  endTime: Date,
  duration: Number, // seconds
  status: String, // "completed", "no_answer", "busy", "failed"
  
  // Recording & Transcription
  recordingUrl: String,
  recordingSize: Number, // bytes
  transcription: String,
  transcriptionConfidence: Number, // 0-1
  
  // AI Analysis
  intent: String,
  entities: [Object], // { type: "date", value: "2024-12-25" }
  sentiment: String,
  keywords: [String],
  
  // Outcomes
  outcome: String,
  actionTaken: String, // "booking_created", "info_sent", "escalated"
  
  // Costs
  twilioCallSid: String,
  callCost: Number, // USD
  elevenLabsChars: Number,
  elevenLabsCost: Number,
  groqTokens: Number,
  groqCost: Number,
  totalCost: Number,
  
  // Metadata
  createdAt: Date,
}
```

---

## 🔮 **Future-Ready Features**

### **AI Training Data:**
- Store anonymized conversations for model fine-tuning
- GDPR-compliant data export/deletion
- Multi-model support (GPT, Claude, Llama, custom)

### **Advanced Analytics:**
- Conversation clustering (topics, intents)
- Churn prediction
- Upsell opportunities
- Seasonal patterns

### **Integrations:**
- Webhooks for real-time events
- API for third-party CRM sync
- Zapier/Make.com connectors

---

## 🛠️ **Implementation:**

**Current:** MongoDB Atlas (already have `MONGO_URL` env var)  
**Future:** PostgreSQL for relational data + Vector DB for embeddings  
**Backup:** Automated daily backups to S3/Backblaze  

**Next Steps:**
1. Create collections in MongoDB
2. Build API endpoints for data storage
3. Add data visualization dashboard
4. Implement GDPR compliance (export/delete)
