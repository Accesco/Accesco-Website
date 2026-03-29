# 🔐 GOOGLE OAUTH SETUP GUIDE

## 📋 Your Google OAuth Credentials

```
Client ID: Enter your client Id
Client Secret: Enter your secret here
```

---

## 🚀 SUPABASE CONFIGURATION (Required)

### Step 1: Go to Supabase Dashboard

Open: https://supabase.com/dashboard/project/nfdrnbikwzfmijrqmoqt/auth/providers

### Step 2: Enable Google Provider

1. Click on **"Google"** in the providers list
2. Toggle **"Enable Sign in with Google"** to ON

### Step 3: Add Your Credentials

**Paste these values:**

```
Client ID (for OAuth):
Your client id

Client Secret (for OAuth):
your secret code
```

### Step 4: Configure Redirect URL

**Add this to Authorized Redirect URIs:**

```
https://nfdrnbikwzfmijrqmoqt.supabase.co/auth/v1/callback
```

### Step 5: Save Settings

Click **"Save"** button at the bottom.

---

## 🔧 GOOGLE CLOUD CONSOLE SETUP

### Step 1: Go to Google Cloud Console

Open: https://console.cloud.google.com/

### Step 2: Select Your Project

Make sure you're in the project: **762874105396**

### Step 3: Go to OAuth Consent Screen

**Path:** APIs & Services → OAuth consent screen

**Configure:**
- App name: Accesso
- User support email: your-email@example.com
- Developer contact: your-email@example.com

### Step 4: Add Authorized Domains

**Add these domains:**
- `supabase.co`
- `localhost` (for development)
- Your production domain (later)

### Step 5: Configure Scopes

**Add these OAuth scopes:**
- `email`
- `profile`
- `openid`

### Step 6: Add Redirect URIs

**Go to:** APIs & Services → Credentials → Your OAuth 2.0 Client

**Add Authorized redirect URIs:**

```
# For Supabase
https://nfdrnbikwzfmijrqmoqt.supabase.co/auth/v1/callback

# For Local Development
http://localhost:3000/auth/callback

# For Production (add your domain later)
https://yourdomain.com/auth/callback
```

### Step 7: Save Changes

Click **"Save"** button.

---

## ✅ TESTING GOOGLE OAUTH

### Test Flow:

1. **Start your app:**
   ```bash
   npm run dev
   ```

2. **Open:** http://localhost:3000

3. **Click LOGIN button**

4. **Click "Continue with Google"**

5. **Should see:**
   - Google account selection screen
   - Permission request
   - Redirect back to your app
   - You're logged in! ✅

---

## 🐛 TROUBLESHOOTING

### Error: "redirect_uri_mismatch"

**Fix:** Add the redirect URI to Google Cloud Console:
1. Go to Credentials
2. Edit OAuth client
3. Add: `https://nfdrnbikwzfmijrqmoqt.supabase.co/auth/v1/callback`
4. Save

### Error: "access_denied"

**Fix:** Make sure OAuth consent screen is configured:
1. Add your email as test user
2. Verify app is not in "Testing" mode (or add yourself as test user)
3. Configure scopes correctly

### Google Login Button Doesn't Work

**Fix:** Verify Supabase configuration:
1. Check Google provider is enabled
2. Verify Client ID and Secret are correct
3. Check redirect URL is added

### Login Works But Redirects to Wrong Page

**Fix:** Update Site URL in Supabase:
1. Go to Authentication → URL Configuration
2. Set Site URL: `http://localhost:3000`
3. Add Redirect URL: `http://localhost:3000/auth/callback`

---

## 🔒 SECURITY NOTES

### DO NOT:
- ❌ Commit Client Secret to git
- ❌ Share Client Secret publicly
- ❌ Use same credentials in multiple projects

### DO:
- ✅ Store Client Secret in Supabase only
- ✅ Use environment variables for sensitive data
- ✅ Enable 2FA on Google account
- ✅ Regularly review OAuth permissions

---

## 📱 PRODUCTION DEPLOYMENT

### When deploying to production:

1. **Update Supabase Site URL:**
   ```
   https://yourdomain.com
   ```

2. **Add Production Redirect URL:**
   ```
   https://yourdomain.com/auth/callback
   ```

3. **Update Google Console:**
   - Add production domain to Authorized domains
   - Add production redirect URI

4. **Test thoroughly:**
   - Test Google login on production
   - Verify redirect works
   - Check user data saves correctly

---

## 📊 OAUTH FLOW DIAGRAM

```
User clicks "Google Login"
    ↓
Redirect to Google
    ↓
User selects account
    ↓
User grants permissions
    ↓
Google redirects to Supabase callback
    ↓
Supabase creates session
    ↓
Redirect to your app (/auth/callback)
    ↓
AuthCallback page processes
    ↓
User logged in! ✅
```

---

## 🎯 VERIFICATION CHECKLIST

After setup, verify:

- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Redirect URI added to Supabase settings
- [ ] Redirect URI added to Google Console
- [ ] OAuth consent screen configured
- [ ] Authorized domains added
- [ ] Local redirect URL works
- [ ] Can see Google button in modal
- [ ] Google login completes successfully
- [ ] User session persists

---

## 🎉 SUCCESS!

If you can:
1. ✅ Click "Continue with Google"
2. ✅ See Google account selector
3. ✅ Grant permissions
4. ✅ Get redirected back logged in

**Your Google OAuth is working perfectly!** 🚀

---

## 📞 SUPPORT

- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth/social-login/auth-google
- **Google OAuth Docs:** https://developers.google.com/identity/protocols/oauth2
- **Your Supabase Dashboard:** https://supabase.com/dashboard/project/nfdrnbikwzfmijrqmoqt

---

## 💡 NEXT STEPS

1. ✅ Configure Google OAuth (this guide)
2. ✅ Test login locally
3. ✅ Add user profiles
4. ✅ Customize OAuth consent screen
5. ✅ Deploy to production
6. ✅ Add more social providers (Facebook, GitHub, etc.)
