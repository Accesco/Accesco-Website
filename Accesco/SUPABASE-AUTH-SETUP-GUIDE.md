# 🔐 SUPABASE AUTHENTICATION SETUP GUIDE

## 📦 What You're Getting

Complete login/signup system with:
- ✅ Email & Password authentication
- ✅ Google OAuth login
- ✅ Password reset functionality
- ✅ User session management
- ✅ Protected routes
- ✅ Beautiful login modal
- ✅ User profile dropdown

---

## 🚀 INSTALLATION (5 Steps)

### Step 1: Install Supabase Package

```bash
npm install @supabase/supabase-js
```

### Step 2: Add Environment Variables

Create/update `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nfdrnbikwzfmijrqmoqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZHJuYmlrd3pmbWlqcnFtb3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NzQ4NzcsImV4cCI6MjA1MTA1MDg3N30.u4ThkmfWiCOJrfcxm0RB-oaVysQSY8kha7k66UdUuH0
```

### Step 3: Copy Files to Your Project

```
lib/supabase.js                 ← supabase.js
app/components/AuthModal.jsx    ← AuthModal.jsx
app/components/AuthProvider.jsx ← AuthProvider.jsx
app/auth/callback/page.jsx      ← auth-callback-page.jsx
```

### Step 4: Wrap Your App with AuthProvider

Edit `app/layout.js`:

```jsx
import { AuthProvider } from './components/AuthProvider'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Step 5: Add Login Button to Your Header/Navbar

See `Header-with-auth.jsx` for complete example.

---

## 📁 FILE STRUCTURE

```
your-project/
├── .env.local (create this)
├── lib/
│   └── supabase.js ✨
├── app/
│   ├── layout.js (update this)
│   ├── components/
│   │   ├── AuthModal.jsx ✨
│   │   └── AuthProvider.jsx ✨
│   └── auth/
│       └── callback/
│           └── page.jsx ✨
```

---

## 🎯 HOW TO USE

### Show Login Modal

```jsx
'use client'

import { useState } from 'react'
import AuthModal from './components/AuthModal'

export default function YourComponent() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <button onClick={() => setShowAuth(true)}>
        Login
      </button>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={(user) => {
          console.log('Logged in:', user)
        }}
      />
    </>
  )
}
```

### Check if User is Logged In

```jsx
'use client'

import { useAuth } from './components/AuthProvider'

export default function YourComponent() {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>

  return (
    <div>
      {user ? (
        <p>Welcome, {user.email}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

### Sign Out User

```jsx
import { useAuth } from './components/AuthProvider'

export default function YourComponent() {
  const { user, signOut } = useAuth()

  return (
    <button onClick={signOut}>
      Sign Out
    </button>
  )
}
```

---

## 🔧 SUPABASE DASHBOARD SETUP

### 1. Configure Authentication

Go to: https://supabase.com/dashboard/project/nfdrnbikwzfmijrqmoqt/auth/users

**Settings to Configure:**

#### A. Email Settings
- **Path:** Authentication > Settings > Auth Providers > Email
- Enable: ✅ Email Auth
- Disable: ❌ Confirm email (for testing)
- Later enable it for production!

#### B. Site URL
- **Path:** Authentication > URL Configuration
- Set **Site URL** to: `http://localhost:3000` (development)
- For production: `https://yourdomain.com`

#### C. Redirect URLs
- **Path:** Authentication > URL Configuration
- Add **Redirect URL**: 
  ```
  http://localhost:3000/auth/callback
  https://yourdomain.com/auth/callback
  ```

---

### 2. Enable Google OAuth (Optional)

**Path:** Authentication > Providers > Google

1. Create Google OAuth credentials:
   - Go to: https://console.cloud.google.com/
   - Create project
   - Enable Google+ API
   - Create OAuth 2.0 credentials

2. Add credentials to Supabase:
   - Client ID: `your-google-client-id`
   - Client Secret: `your-google-client-secret`

3. Add authorized redirect URI in Google Console:
   ```
   https://nfdrnbikwzfmijrqmoqt.supabase.co/auth/v1/callback
   ```

---

## 🎨 CUSTOMIZATION

### Change Colors

Edit `AuthModal.jsx`:

```jsx
// Line ~200: Primary button color
background: linear-gradient(135deg, #8b0a14 0%, #c03b3b 100%);

// Change to your brand colors:
background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR_2 100%);
```

### Change Modal Size

```jsx
// Line ~35
max-width: 480px;  // Make larger or smaller
```

### Add More Social Logins

In `lib/supabase.js`, add:

```jsx
// Facebook
export const signInWithFacebook = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  return { data, error }
}

// GitHub
export const signInWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  return { data, error }
}
```

---

## 🔒 PROTECTING ROUTES

### Create Protected Page

```jsx
// app/dashboard/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../components/AuthProvider'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) return <p>Loading...</p>

  if (!user) return null

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  )
}
```

---

## 📊 USER DATA STORAGE

### Create User Profile Table

Run in Supabase SQL Editor:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policy to allow users to view their own profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Create policy to allow users to update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Fetch User Profile

```jsx
import { supabase } from '../lib/supabase'

const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}
```

---

## 🐛 TROUBLESHOOTING

### Login Not Working
1. Check `.env.local` has correct credentials
2. Restart dev server: `npm run dev`
3. Clear browser cache

### Google OAuth Error
1. Verify redirect URI in Google Console
2. Check Site URL in Supabase settings
3. Make sure Google provider is enabled

### Email Not Sending
1. Check Supabase email settings
2. For development, disable email confirmation
3. For production, configure SMTP

### Session Not Persisting
1. Check cookies are enabled
2. Verify Site URL matches your domain
3. Check browser console for errors

---

## ✅ TESTING CHECKLIST

After setup, test:

- [ ] Open login modal
- [ ] Sign up with email/password
- [ ] Check email for verification (if enabled)
- [ ] Sign in with email/password
- [ ] User avatar shows in header
- [ ] Dropdown menu appears on hover
- [ ] Sign out works
- [ ] Google login works (if configured)
- [ ] Password reset works
- [ ] Session persists on page refresh

---

## 📱 MOBILE RESPONSIVE

The auth modal is fully responsive:
- Desktop: 480px width
- Tablet: 90% width
- Mobile: Full width with padding

---

## 🎉 FEATURES

### ✅ Email & Password
- Sign up
- Sign in
- Email verification
- Password reset

### ✅ Google OAuth
- One-click login
- Auto profile creation

### ✅ Session Management
- Persistent sessions
- Auto-refresh tokens
- Secure cookies

### ✅ User Experience
- Beautiful UI
- Loading states
- Error handling
- Success messages
- Mobile responsive

---

## 🚀 PRODUCTION CHECKLIST

Before deploying:

1. ✅ Enable email confirmation
2. ✅ Update Site URL to production domain
3. ✅ Add production redirect URLs
4. ✅ Configure SMTP for emails
5. ✅ Enable RLS on all tables
6. ✅ Test all auth flows
7. ✅ Check error handling
8. ✅ Monitor Supabase logs

---

## 💡 NEXT STEPS

1. **User Profiles:** Add avatar upload, profile editing
2. **Social Login:** Enable Facebook, GitHub, etc.
3. **Email Templates:** Customize verification/reset emails
4. **Analytics:** Track login/signup events
5. **Multi-factor Auth:** Add 2FA for extra security

---

## 📞 SUPPORT

- **Supabase Docs:** https://supabase.com/docs/guides/auth
- **Dashboard:** https://supabase.com/dashboard/project/nfdrnbikwzfmijrqmoqt
- **Issues:** Check browser console and Supabase logs

---

## 🎊 YOU'RE READY!

Your complete authentication system is set up! Users can now:
- ✅ Sign up/Sign in
- ✅ Use Google login
- ✅ Reset passwords
- ✅ Stay logged in
- ✅ Access protected pages

**Test it now:** Run `npm run dev` and click the LOGIN button! 🚀
