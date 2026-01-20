# 🔐 Environment Variables Guide

## Overview

The Translation App uses environment variables for configuration. This makes it easy to:
- Configure the app for different environments (development, production)
- Keep sensitive data (passwords, keys) out of code
- Deploy to different platforms without code changes

---

## 🚀 Quick Start

### 1. Create Your .env File

```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env  # or use your favorite editor
```

### 2. Generate a Secret Key

```bash
# Generate a secure random key
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the output and use it as your `SECRET_KEY` in `.env`.

---

## 📋 Available Environment Variables

### Flask Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | `production` | Flask environment: `development` or `production` |
| `SECRET_KEY` | `dev-key-change-in-production-12345` | **REQUIRED** Secret key for Flask sessions |
| `PORT` | `5000` | Server port number |
| `MAX_CONTENT_LENGTH` | `16777216` | Max file upload size in bytes (16MB) |
| `UPLOAD_FOLDER` | System temp | Path for temporary file uploads |

### Database Configuration

**Option 1: DATABASE_URL (Recommended)**
```bash
DATABASE_URL=postgresql://username:password@host:port/database
```

**Option 2: Individual Variables**
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USER` | `postgres` | Database username |
| `DB_PASSWORD` | - | Database password (REQUIRED) |
| `DB_HOST` | `localhost` | Database host |
| `DB_PORT` | `5432` | Database port |
| `DB_NAME` | `translation_app` | Database name |

### Logging Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_LEVEL` | `INFO` | Log level: `DEBUG`, `INFO`, `WARNING`, `ERROR` |

### Authentication & OAuth Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `GOOGLE_CLIENT_ID` | - | Google OAuth Client ID (optional, for Google login) |
| `GOOGLE_CLIENT_SECRET` | - | Google OAuth Client Secret (optional, for Google login) |

**Note:** Google OAuth is optional. If not configured, users can still sign up and login with email/password.

### AI Chatbot Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | - | OpenAI API key (optional, for AI-powered chatbot responses) |

**Note:** The AI chatbot is optional. If not configured, the chatbot will use basic keyword-based responses.

---

## 🔐 Google OAuth Setup

To enable Google OAuth login:

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API:**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:5000/auth/google/callback`
     - Production: `https://yourdomain.com/auth/google/callback`

4. **Copy Credentials:**
   - Copy the Client ID and Client Secret
   - Add them to your `.env` file:
     ```bash
     GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your-client-secret
     ```

5. **Restart the App:**
   - Restart your Flask app to load the new credentials
   - Google login button will appear on login/signup pages

---

## 🤖 AI Chatbot Setup (Optional)

The chatbot can use OpenAI's API to provide intelligent, context-aware responses. Without it, the chatbot will use basic keyword-based responses.

### Setup Instructions:

1. **Get an OpenAI API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to [API Keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy your API key (starts with `sk-`)

2. **Add to .env File:**
   ```bash
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

3. **Restart the App:**
   - Restart your Flask app to load the API key
   - The chatbot will now use AI for intelligent responses

**Note:** Using OpenAI API may incur costs. Check [OpenAI Pricing](https://openai.com/pricing) for details. The app falls back to basic responses if the API key is not configured or if there's an error.

---

## 🔧 Configuration Examples

### Development Environment

```bash
# .env (development)
FLASK_ENV=development
SECRET_KEY=dev-secret-key-12345
PORT=5000
LOG_LEVEL=DEBUG
DB_USER=postgres
DB_PASSWORD=dev_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=translation_app_dev
```

### Production Environment

```bash
# .env (production)
FLASK_ENV=production
SECRET_KEY=<strong-random-key-generated-with-secrets>
PORT=5000
LOG_LEVEL=INFO
DATABASE_URL=postgresql://user:strong_password@db.example.com:5432/translation_app
MAX_CONTENT_LENGTH=16777216
```

### Using DATABASE_URL

```bash
# .env
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/translation_app
LOG_LEVEL=INFO
```

---

## 🔒 Security Best Practices

### ✅ DO:

1. **Generate Strong Secret Keys**
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

2. **Never Commit .env to Git**
   - `.env` is in `.gitignore`
   - Only commit `.env.example` (without real values)

3. **Use Different Keys for Each Environment**
   - Development: Can use simple keys
   - Production: Must use strong, random keys

4. **Protect Database Passwords**
   - Use strong passwords
   - Never share `.env` files
   - Use environment variables in deployment platforms

5. **Rotate Keys Regularly**
   - Change `SECRET_KEY` periodically
   - Update database passwords regularly

### ❌ DON'T:

1. **Don't Hardcode Secrets**
   ```python
   # BAD
   SECRET_KEY = "my-secret-key"
   
   # GOOD
   SECRET_KEY = os.getenv('SECRET_KEY')
   ```

2. **Don't Commit .env Files**
   - Never commit `.env` to version control
   - Never share `.env` files publicly

3. **Don't Use Default Values in Production**
   - Always set `SECRET_KEY` in production
   - Never use default database passwords

---

## 🛠️ Setting Environment Variables

### Method 1: .env File (Recommended for Development)

1. Copy `.env.example` to `.env`
2. Edit `.env` with your values
3. The app automatically loads `.env` on startup

### Method 2: Export in Terminal (Temporary)

```bash
export SECRET_KEY="your-secret-key"
export DB_PASSWORD="your-password"
python app.py
```

### Method 3: System Environment Variables (Production)

**macOS/Linux:**
```bash
# Add to ~/.zshrc or ~/.bashrc
export SECRET_KEY="your-secret-key"
export DB_PASSWORD="your-password"
```

**Windows:**
```powershell
# Set in System Properties > Environment Variables
# Or use setx command
setx SECRET_KEY "your-secret-key"
```

### Method 4: Platform-Specific (Deployment)

**Render:**
- Go to Dashboard > Environment
- Add environment variables

**Heroku:**
```bash
heroku config:set SECRET_KEY=your-secret-key
```

**Railway:**
- Go to Project > Variables
- Add environment variables

---

## 🧪 Testing Your Configuration

### Check if Variables are Loaded

```bash
# Start Python and check
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('SECRET_KEY:', os.getenv('SECRET_KEY', 'NOT SET'))"
```

### Verify in App

The app logs configuration on startup:
```
[INFO] Translation App Starting
[INFO] Log Level: INFO
[INFO] Environment: production
[INFO] Database: translation_app@localhost:5432
```

---

## 📝 Example .env File

```bash
# Flask
FLASK_ENV=production
SECRET_KEY=8f42a73054b1749f8f58848be5e6502c8d8d8d8d8d8d8d8d8d8d8d8d8d8d8d8d
PORT=5000
MAX_CONTENT_LENGTH=16777216

# Database
DB_USER=postgres
DB_PASSWORD=my_secure_password_123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=translation_app

# Logging
LOG_LEVEL=INFO

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# AI Chatbot (Optional)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

---

## 🔍 Troubleshooting

### Variables Not Loading

1. **Check .env file exists:**
   ```bash
   ls -la .env
   ```

2. **Check file location:**
   - `.env` must be in the project root (same directory as `app.py`)

3. **Check python-dotenv is installed:**
   ```bash
   pip install python-dotenv
   ```

4. **Verify variable names:**
   - Variable names are case-sensitive
   - No spaces around `=` sign

### Wrong Values Being Used

1. **Check for typos:**
   ```bash
   cat .env | grep SECRET_KEY
   ```

2. **Restart the app:**
   - Environment variables are loaded on startup
   - Changes require app restart

3. **Check for multiple .env files:**
   - Only one `.env` file should exist in project root

---

## 📚 Related Files

- `.env.example` - Template file (safe to commit)
- `.env` - Your actual configuration (DO NOT COMMIT)
- `.gitignore` - Excludes `.env` from git
- `app.py` - Loads environment variables using `python-dotenv`

---

## ✅ Checklist

- [x] `.env.example` created with all variables
- [x] `.env` added to `.gitignore`
- [x] `python-dotenv` added to requirements
- [x] `SECRET_KEY` configuration added
- [x] All configurable values use environment variables
- [x] Google OAuth configuration added (optional)
- [x] Documentation created

---

**Environment variables are now fully configured!** 🎉

**Note:** Authentication is now required. Users must sign up or login before accessing the app. Google OAuth is optional but recommended for better user experience.

