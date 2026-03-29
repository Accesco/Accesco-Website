# WhatsApp OTP Integration Guide

## Files Added / Modified

| File | Change |
|---|---|
| `app/api/whatsapp-otp/route.js` | **NEW** — API route to send & verify OTPs |
| `app/components/AuthModal.jsx` | **UPDATED** — Added WhatsApp OTP tab |
| `.env.local.example` | **NEW** — Required env vars |

---

## Step 1 — Set Up Meta WhatsApp Cloud API

1. Go to [https://developers.facebook.com](https://developers.facebook.com)
2. Create an App → Select **Business** type
3. Add **WhatsApp** product to your app
4. In **WhatsApp → API Setup**:
   - Note your **Phone Number ID** (not the phone number itself)
   - Generate a **Temporary Access Token** (valid 24h) for testing, or set up a **System User Token** for production

---

## Step 2 — Create an OTP Message Template

1. In Meta Business Manager → **WhatsApp Manager → Message Templates**
2. Click **Create Template**
3. Settings:
   - **Category**: Authentication
   - **Name**: `accesco_otp` (or your custom name — update `WHATSAPP_OTP_TEMPLATE` env var)
   - **Language**: English (US)
4. Body text example:
   ```
   Your Accesco Living verification code is: {{1}}
   This code expires in 10 minutes.
   ```
5. Submit for approval — usually takes **a few minutes to 24 hours**

---

## Step 3 — Add Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
WHATSAPP_TOKEN=your_access_token_from_meta
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_OTP_TEMPLATE=accesco_otp
OTP_SECRET=some-long-random-secret
```

> ⚠️ **If you leave `WHATSAPP_TOKEN` empty**, the system runs in **DEV MODE** — OTPs are printed to your server terminal instead of being sent. Great for testing!

---

## Step 4 — Test

```bash
npm run dev
```

Open the login modal → click **WhatsApp OTP** tab → enter your number with country code (e.g. `+919876543210`) → check your WhatsApp!

---

## Production Recommendations

- **Replace in-memory OTP store** with Redis for multi-instance deployments:
  ```js
  // In route.js, replace otpStore (Map) with:
  await redis.set(`otp:${phone}`, hash, 'EX', 600)
  const stored = await redis.get(`otp:${phone}`)
  ```
- Use a **permanent System User Token** instead of the 24h temporary one
- Add **Supabase phone auth** if you want to tie the verified phone to a user account

---

## Pricing

- **Authentication template messages** are charged by Meta per conversation
- Approximately **$0.01–0.05 per OTP** depending on recipient's country
- No monthly fee for the API itself — pay-per-use
- See current rates: https://business.whatsapp.com/products/platform-pricing
