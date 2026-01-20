# 🔐 Authentication Setup Guide

## Overview

The Translation App now requires user authentication. Users must sign up or login before accessing the application. The app supports:

1. **Email/Password Authentication** - Manual signup and login
2. **Google OAuth** - Sign in with Google (optional)

---

## 🚀 Quick Start

### 1. Database Migration

Since authentication adds new database tables, you need to initialize the database:

```bash
# Activate virtual environment
source venv/bin/activate

# Run database initialization
python init_database.py
```

This will create:
- `users` table - User accounts
- `translations` table - Translation history (updated with `user_id` foreign key)

### 2. Start the App

```bash
# Run the app
python app.py
```

### 3. Create Your First Account

1. Navigate to `http://localhost:5000`
2. You will be redirected to the login page
3. Click "Sign up" to create an account
4. Fill in your details:
   - Email (required)
   - Password (required, min 8 characters)
   - Name (optional)
   - Username (optional)
5. Click "Sign Up"
6. You will be automatically logged in

---

## 🔑 Authentication Features

### Email/Password Authentication

- **Sign Up**: Create a new account with email and password
- **Login**: Login with email and password
- **Remember Me**: Check "Remember me" to stay logged in
- **Password Requirements**: Minimum 8 characters

### Google OAuth (Optional)

To enable Google OAuth login:

1. **Set up Google OAuth credentials** (see [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md))
2. **Add to `.env` file**:
   ```bash
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```
3. **Restart the app**
4. **Google login button** will appear on login/signup pages

**Note:** Google OAuth is optional. Users can still sign up and login with email/password even if Google OAuth is not configured.

---

## 🔒 Security Features

### Password Security

- Passwords are hashed using `werkzeug.security.generate_password_hash`
- Passwords are never stored in plain text
- OAuth users don't have passwords (password_hash is NULL)

### Session Security

- Flask-Login manages user sessions
- Sessions are secured with `SECRET_KEY`
- Remember me option stores session in secure cookie

### User Isolation

- Each user can only see their own translations
- Translation history is filtered by `user_id`
- Users cannot access other users' translations

### Rate Limiting

- Login attempts: 10 per minute
- Signup attempts: 5 per minute
- OAuth attempts: 10 per minute
- All other routes: Rate limited per IP

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    username VARCHAR(80) UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(100),
    picture VARCHAR(255),
    provider VARCHAR(50) NOT NULL DEFAULT 'local',
    provider_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

### Translations Table (Updated)

```sql
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    detected_language VARCHAR(50),
    target_language VARCHAR(50),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE
);
```

**Changes:**
- Added `user_id` foreign key (required)
- Translations are now linked to users
- Cascade delete: When a user is deleted, their translations are also deleted

---

## 🛠️ Troubleshooting

### Database Migration Issues

**Problem:** Database tables not created

**Solution:**
```bash
# Run database initialization
python init_database.py

# Or manually in Python
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
```

### Cannot Login

**Problem:** "Invalid email or password" error

**Solutions:**
1. Check if email is correct (case-insensitive)
2. Check if password is correct
3. Make sure user exists in database
4. Check database connection

### Google OAuth Not Working

**Problem:** Google login button not appearing or not working

**Solutions:**
1. Check if `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`
2. Verify redirect URI is correct:
   - Development: `http://localhost:5000/auth/google/callback`
   - Production: `https://yourdomain.com/auth/google/callback`
3. Check Google Cloud Console credentials
4. Restart the app after adding credentials

### User Cannot See Translations

**Problem:** User sees empty history after login

**Solutions:**
1. Make sure translations are saved with `user_id`
2. Check if user is logged in: `current_user.is_authenticated`
3. Verify database queries filter by `user_id`

### Session Not Persisting

**Problem:** User is logged out after page refresh

**Solutions:**
1. Check if `SECRET_KEY` is set in `.env`
2. Verify cookies are enabled in browser
3. Check if "Remember me" was checked during login
4. Verify session storage is working

---

## 📝 API Changes

### Protected Routes

All translation routes now require authentication:

- `GET /` - Main app page (requires login)
- `POST /translate` - Translate text (requires login)
- `POST /upload_text_file` - Upload text file (requires login)
- `POST /upload_audio` - Upload audio file (requires login)
- `GET /history` - Get translation history (requires login, user-specific)
- `DELETE /history/<id>` - Delete translation (requires login, user-specific)
- `POST /history/<id>/favorite` - Toggle favorite (requires login, user-specific)
- `POST /translate_batch` - Batch translation (requires login)
- `POST /export` - Export translation (requires login)

### Public Routes

- `GET /login` - Login page
- `POST /login` - Login handler
- `GET /signup` - Signup page
- `POST /signup` - Signup handler
- `GET /logout` - Logout handler (requires login)
- `GET /login/google` - Google OAuth initiation
- `GET /auth/google/callback` - Google OAuth callback
- `GET /health` - Health check (public)
- `GET /test-error` - Test error endpoint (public, optional)

### Response Changes

**Translation History:**
- Now returns only translations for the current user
- Includes user-specific translation count
- Translations are filtered by `user_id`

**Error Responses:**
- Unauthenticated users are redirected to login page
- 401 Unauthorized for invalid credentials
- 403 Forbidden for unauthorized access

---

## 🔄 Migration from Non-Authenticated Version

If you're upgrading from a version without authentication:

### Option 1: Fresh Start (Recommended)

1. **Backup existing translations** (if needed)
2. **Drop and recreate database**:
   ```bash
   # Drop database
   psql -U postgres -c "DROP DATABASE translation_app;"
   
   # Create database
   psql -U postgres -c "CREATE DATABASE translation_app;"
   
   # Initialize new database
   python init_database.py
   ```
3. **Users need to sign up** for new accounts
4. **Translations will be empty** (fresh start)

### Option 2: Data Migration (Advanced)

1. **Create migration script** to assign existing translations to a default user
2. **Create a default user** in the database
3. **Update all translations** to have `user_id` set to default user
4. **Users can then claim their translations** (manual process)

**Note:** Option 2 is complex and not recommended unless you have existing important data.

---

## ✅ Checklist

- [x] Flask-Login installed and configured
- [x] User model created with password hashing
- [x] Translation model updated with user_id foreign key
- [x] Login and signup routes created
- [x] Google OAuth integration (optional)
- [x] All routes protected with @login_required
- [x] User-specific translation filtering
- [x] Flash messages for user feedback
- [x] Error handling for authentication
- [x] Database migration support
- [x] Documentation created

---

## 🎉 Authentication is Now Configured!

**Next Steps:**
1. Initialize the database: `python init_database.py`
2. Start the app: `python app.py`
3. Create your first account
4. (Optional) Set up Google OAuth for easier login

**Important:**
- All users must sign up or login before using the app
- Translations are now user-specific
- Each user can only see their own translation history
- Google OAuth is optional but recommended for better UX

---

**Authentication system is ready to use!** 🔐

