# Gateway Setup pro Web Chat

## Přidání Web Channel Route do Clawdbot

Do `/root/.clawdbot/clawdbot.json` přidej do sekce `agents`:

```json
"agents": {
  "defaults": {
    // ... existing defaults ...
  },
  "overrides": {
    "web": {
      "workspace": "/root/clawd/chciai-chat-agent",
      "label": "Web Chat",
      "compaction": {
        "mode": "auto"
      }
    },
    "web-voice": {
      "workspace": "/root/clawd/chciai-chat-agent",
      "label": "Web Voice Chat"
    }
  }
}
```

## Restart Gateway

```bash
clawdbot gateway restart
```

## Test API Endpoint

```bash
# Test chat endpoint
curl http://localhost:18789/api/v1/chat \
  -H "Authorization: Bearer 263dfce1a3c5b9dde644a67966aa69dc8471dd3e5b4db34a6f42db4e30fd433d" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Ahoj, kolik stojí AI asistent?",
    "sessionKey": "test-123",
    "channel": "web",
    "language": "cs"
  }'
```

## Pro produkci (Vercel)

V Vercel nastav environment variables:

```
CLAWDBOT_GATEWAY_URL=https://your-public-url:18789
CLAWDBOT_GATEWAY_TOKEN=263dfce1a3c5b9dde644a67966aa69dc8471dd3e5b4db34a6f42db4e30fd433d
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=sk_...  (optional)
ELEVENLABS_VOICE_ID=...    (optional)
```

**⚠️ DŮLEŽITÉ:** Gateway musí být přístupný z internetu! 

Možnosti:
1. **Tailscale** - bezpečný VPN tunel
2. **Ngrok/Cloudflare Tunnel** - pro testování
3. **Veřejná IP + firewall** - pro produkci
