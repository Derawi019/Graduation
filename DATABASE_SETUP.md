# PostgreSQL Database Setup Guide

## ✅ What's Been Done

1. ✅ Added Flask-SQLAlchemy and psycopg2 to `requirements.txt`
2. ✅ Created `Translation` database model
3. ✅ Updated all routes to use database instead of in-memory storage
4. ✅ Added database initialization code

---

## 🚀 Quick Setup Steps

### Step 1: Install Dependencies

```bash
cd "/Users/mezan/Desktop/Translation app"
source venv/bin/activate
pip install -r requirements.txt
```

### Step 2: Create PostgreSQL Database

```bash
# Create the database (if not already created)
createdb translation_app

# Or using psql:
psql postgres
CREATE DATABASE translation_app;
\q
```

### Step 3: Set Environment Variables

Create a `.env` file in the project root (or set environment variables):

```bash
# .env file
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=translation_app

# Or use DATABASE_URL directly:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/translation_app
```

**Or set them in your terminal:**
```bash
export DB_USER=postgres
export DB_PASSWORD=your_password
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=translation_app
```

### Step 4: Initialize Database Tables

```bash
# Option 1: Run the initialization script
python init_database.py

# Option 2: The app will auto-create tables on first run
python app.py
```

### Step 5: Verify Database Connection

The app will automatically create tables when it starts. You should see:
```
✅ Database tables created/verified
```

---

## 🔧 Troubleshooting

### Error: "could not connect to server"

**Problem:** PostgreSQL is not running

**Solution:**
```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Or check if it's running
pg_isready
```

### Error: "database does not exist"

**Problem:** Database hasn't been created

**Solution:**
```bash
createdb translation_app
```

### Error: "password authentication failed"

**Problem:** Wrong password or user

**Solution:**
1. Check your PostgreSQL password
2. Update `.env` file or environment variables
3. Test connection:
   ```bash
   psql -U postgres -d translation_app
   ```

### Error: "relation 'translations' does not exist"

**Problem:** Tables not created

**Solution:**
```bash
python init_database.py
```

---

## 📝 Database Configuration

The app uses these environment variables (in order of priority):

1. **`DATABASE_URL`** - Full connection string (highest priority)
   ```
   postgresql://username:password@host:port/database
   ```

2. **Individual variables** (if DATABASE_URL not set):
   - `DB_USER` (default: `postgres`)
   - `DB_PASSWORD` (default: `postgres`)
   - `DB_HOST` (default: `localhost`)
   - `DB_PORT` (default: `5432`)
   - `DB_NAME` (default: `translation_app`)

---

## 🗄️ Database Schema

### `translations` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer (Primary Key) | Auto-incrementing ID |
| `original_text` | Text | Original text to translate |
| `translated_text` | Text | Translated text |
| `detected_language` | String(50) | Detected source language |
| `target_language` | String(50) | Target language |
| `timestamp` | DateTime | When translation was created |
| `is_favorite` | Boolean | Favorite status |

---

## 🔍 Verify Database

### Check if tables exist:
```bash
psql -U postgres -d translation_app
\dt
\q
```

### View translations:
```sql
SELECT * FROM translations ORDER BY timestamp DESC LIMIT 10;
```

### Count translations:
```sql
SELECT COUNT(*) FROM translations;
```

---

## 🚀 Production Setup

For production (e.g., Render, Railway, Heroku):

1. **Use `DATABASE_URL` environment variable** (usually set automatically by platform)
2. **No manual setup needed** - platform handles it
3. **Tables auto-create** on first app start

Example for Render:
- Add PostgreSQL service
- `DATABASE_URL` is automatically set
- App connects automatically

---

## 📚 Useful Commands

```bash
# Connect to database
psql -U postgres -d translation_app

# List all databases
psql -U postgres -l

# Drop database (careful!)
dropdb translation_app

# Backup database
pg_dump translation_app > backup.sql

# Restore database
psql translation_app < backup.sql
```

---

## ✅ Next Steps

1. ✅ Install dependencies: `pip install -r requirements.txt`
2. ✅ Create database: `createdb translation_app`
3. ✅ Set environment variables (`.env` file)
4. ✅ Initialize tables: `python init_database.py`
5. ✅ Run app: `python app.py`

Your translation history will now persist across server restarts! 🎉

