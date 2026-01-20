# 🔐 Google Sign-In Setup Guide

## ✅ What's Already Implemented

Your app **already has Google Sign-In fully integrated**! Here's what's working:

### Backend Features ✅
- ✅ OAuth integration using `authlib` library
- ✅ Google OAuth routes: `/login/google` and `/auth/google/callback`
- ✅ Automatic user creation/login with Google accounts
- ✅ Google users automatically verified (no email verification needed)
- ✅ Profile picture support from Google
- ✅ Security: Rate limiting on OAuth endpoints

### Frontend Features ✅
- ✅ "Continue with Google" button on login page
- ✅ "Sign up with Google" button on signup page
- ✅ Google-branded button styling
- ✅ Buttons only show when Google OAuth is configured

### Database ✅
- ✅ User model supports OAuth (`provider` and `provider_id` fields)
- ✅ Separate handling for local and Google OAuth users

---

## 🚀 Setup Steps (5 minutes)

You just need to get Google OAuth credentials and add them to your `.env` file:

### Step 1: Create Google Cloud Project

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
   - Sign in with your Google account

2. **Create a new project** (or select existing)
   - Click the project dropdown at the top
   - Click "New Project"
   - Enter name: `Translation App` (or any name)
   - Click "Create"

### Step 2: Enable Google OAuth API

1. **Navigate to APIs & Services**
   - In the left menu: "APIs & Services" > "Library"
   
2. **Search and enable Google Identity services**
   - Search for: "Google Identity" or "Google+ API"
   - Note: Google+ API is deprecated, but you can use "Google Identity Services"
   - Or just proceed to create credentials (APIs are enabled automatically)

### Step 3: Configure OAuth Consent Screen

1. **Go to OAuth consent screen**
   - "APIs & Services" > "OAuth consent screen"

2. **Select User Type**
   - Choose "External" (unless you have a Google Workspace)
   - Click "Create"

3. **Fill in App Information**
   - **App name**: `Translation App` (or your app name)
   - **User support email**: Your email
   - **App logo**: (optional) Upload a logo
   - **Application home page**: `http://localhost:5000` (or your domain)
   - **Authorized domains**: Leave blank for development

4. **Add Scopes** (usually auto-added)
   - `email`
   - `profile`
   - `openid`

5. **Add Test Users** (for development)
   - If your app is in "Testing" status, add your email as a test user
   - Click "Add Users" and enter your email

6. **Save and Continue** through all steps

### Step 4: Create OAuth Credentials

1. **Go to Credentials**
   - "APIs & Services" > "Credentials"

2. **Create OAuth Client ID**
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"

3. **Configure OAuth Client**
   - **Name**: `Translation App Client` (or any name)
   
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5000
     ```
     (Add production URL when deploying)
   
   - **Authorized redirect URIs**:
     ```
     http://localhost:5000/auth/google/callback
     ```
     (Add production URL when deploying: `https://yourdomain.com/auth/google/callback`)

4. **Click "Create"**

5. **Copy Your Credentials**
   - You'll see a popup with:
     - **Client ID**: `xxxxxxxxx.apps.googleusercontent.com`
     - **Client Secret**: `xxxxxxxxxxxxx`
   - **Save these!** You won't see the secret again

### Step 5: Add Credentials to Your App

1. **Open your `.env` file** in the project root

2. **Add these lines**:
   ```bash
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

   **Example:**
   ```bash
   GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789
   ```

3. **Save the `.env` file**

### Step 6: Restart Your App

1. **Stop the app** (Ctrl+C in terminal)
2. **Restart it**:
   ```bash
   source venv/bin/activate
   python app.py
   ```

### Step 7: Test Google Sign-In

1. **Open your app** in browser: `http://localhost:5000`
2. **Go to login page**
3. **You should see** "Continue with Google" button
4. **Click it** and sign in with your Google account
5. **You'll be redirected** back and logged in!

---

## 🎯 Quick Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth client ID created
- [ ] Authorized redirect URI added: `http://localhost:5000/auth/google/callback`
- [ ] Client ID and Secret added to `.env` file
- [ ] App restarted
- [ ] Google sign-in button appears on login page
- [ ] Can sign in with Google account

---

## 🐛 Troubleshooting

### Button doesn't appear
- **Check**: `.env` file has both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- **Check**: No typos in variable names
- **Check**: Restarted the app after adding credentials
- **Solution**: Check logs for errors

### "Redirect URI mismatch" error
- **Problem**: The redirect URI in your app doesn't match Google Cloud Console
- **Check**: Google Cloud Console > Credentials > OAuth Client > Authorized redirect URIs
- **Must match exactly**: `http://localhost:5000/auth/google/callback`
- **Note**: `http://` vs `https://` and trailing slashes matter!

### "Access blocked" error
- **Problem**: App is in testing mode and your email isn't a test user
- **Solution**: Add your email in OAuth consent screen > Test users

### "Invalid client" error
- **Check**: Client ID is correct in `.env` file
- **Check**: Client Secret is correct
- **Check**: No extra spaces in `.env` file

### Error: "OAuth consent screen not configured"
- **Solution**: Complete Step 3 (OAuth consent screen) above

---

## 📝 Production Setup

When deploying to production:

1. **Add production redirect URI** in Google Cloud Console:
   ```
   https://yourdomain.com/auth/google/callback
   ```

2. **Add production origin**:
   ```
   https://yourdomain.com
   ```

3. **Publish your app** in OAuth consent screen (if ready for public)

4. **Update environment variables** in your hosting platform:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

---

## 🔒 Security Notes

- ✅ Google OAuth users are automatically verified (no email verification needed)
- ✅ Rate limiting: 10 OAuth attempts per minute
- ✅ Passwords not required for OAuth users
- ✅ Each user can only link one Google account per email
- ⚠️ Keep your `GOOGLE_CLIENT_SECRET` secure - never commit it to Git!

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Authlib Documentation](https://docs.authlib.org/)

---

## ✅ Done!

Once you complete these steps, Google Sign-In will be fully functional in your app! Users can now sign in with their Google accounts with just one click.

