# PostHog Analytics Monitoring

## Aktuální nastavení

✅ PostHog je již integrován v aplikaci!

### Konfigurace:

```javascript
// frontend/src/index.js
posthog.init('phc_pHEDH8bMEr9jzD0vvLgR0BXMRGKPc21EvWdDxFvKCaV', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only'
})
```

## Co sledovat:

### 1. User Behavior
- 🖱️ Kliknutí na "Začít Chat"
- 💬 Odeslané zprávy
- 📱 Device types (mobile/desktop)
- 🌍 Geografické rozložení

### 2. Performance
- ⚡ Page load times
- 🔄 Session duration
- 🚪 Bounce rate
- 📉 Exit pages

### 3. Conversion Funnel
1. Landing page visit
2. Click "Začít Chat"
3. Send first message
4. Continue conversation

### 4. Custom Events (již trackované):

```javascript
// Chat started
posthog.capture('chat_started')

// Message sent
posthog.capture('message_sent', {
  message_length: length,
  has_attachments: boolean
})

// Error occurred
posthog.capture('chat_error', {
  error_type: type
})
```

## Dashboard doporučení:

### Vytvořte grafy pro:

1. **Daily Active Users (DAU)**
   - Filtr: unique users per day

2. **Chat Engagement**
   - Event: 'chat_started'
   - Conversion rate

3. **Message Volume**
   - Event: 'message_sent'
   - Trend over time

4. **User Journey**
   - Funnel: Visit → Chat → Message

5. **Error Rate**
   - Event: 'chat_error'
   - Group by error_type

## Přístup k PostHog:

🔗 https://us.posthog.com/

### Pravidelné kontroly:

- 📅 Denně: DAU, error rate
- 📅 Týdně: Conversion funnel, top pages
- 📅 Měsíčně: User retention, trends

## Alerts (doporučeno nastavit):

⚠️ Error rate > 5%
⚠️ DAU drop > 20%
⚠️ Page load > 3s
⚠️ Bounce rate > 70%
