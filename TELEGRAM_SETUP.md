# Kai Telegram Bot Setup

## 1. Create the Bot via @BotFather

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Name it: `Kai Fertility Coach` (or similar)
4. Username: `KaiFertilityBot` (must end in "bot", must be unique)
5. BotFather will give you a token like `7123456789:AAF...` -- copy it
6. Optional: Send `/setdescription` to BotFather and set:
   "I'm Kai, your personal AI fertility coach. Trained by Kirsten Karchmer with 25 years of fertility expertise. Chat with me about your fertility, cycle, supplements, or send me photos of your BBT charts."
7. Optional: Send `/setabouttext` for the short bio:
   "AI fertility coach by Conceivable"
8. Optional: Send `/setuserpic` and upload a Kai avatar

## 2. Set the Environment Variable

Add `TELEGRAM_BOT_TOKEN` to Vercel:

```bash
printf '%s' '7123456789:YOUR_TOKEN_HERE' | vercel env add TELEGRAM_BOT_TOKEN production
```

## 3. Set the Webhook URL

After deploying, tell Telegram where to send messages:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://conceivable-command-center.vercel.app/api/telegram/webhook"}'
```

You should get `{"ok":true,"result":true,"description":"Webhook was set"}`.

To verify:
```bash
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo"
```

## 4. Test It

1. Open Telegram and search for your bot's username
2. Hit "Start" or send `/start`
3. Kai should introduce herself and ask for your email
4. Send an email address to link your account
5. Start chatting! Try sending a BBT chart photo too.

## 5. Proactive Messaging

Send messages TO users via the API:

```bash
curl -X POST https://conceivable-command-center.vercel.app/api/telegram/send \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "message": "Hey! Just checking in -- how are your temps looking this week?"}'
```

## Bot Commands (optional, register with BotFather)

Send `/setcommands` to BotFather and paste:
```
start - Link your account and meet Kai
help - See what Kai can help with
unlink - Unlink your Telegram account
```

## How It Works

- User sends message -> Telegram webhook -> looks up email by chat ID -> forwards to kai-consult API -> sends response back
- Account linking: chat ID <-> email stored in SiteConfig table (bidirectional)
- Conversation history: stored in SiteConfig as JSON, last 30 messages kept
- Images: downloaded from Telegram, converted to base64, forwarded to kai-consult with type detection
- Proactive sends: POST to /api/telegram/send with email + message
