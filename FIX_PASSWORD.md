# Fix PostgreSQL Password Authentication Error

## 🔍 The Problem

You're getting this error:
```
FATAL: password authentication failed for user "postgres"
```

This means the password being used doesn't match your PostgreSQL password.

---

## ✅ Solution: Set the Correct Password

### Option 1: Find Your PostgreSQL Password (Recommended)

If you set a password when installing PostgreSQL, use that password.

**Common scenarios:**
- If you installed via **Postgres.app**: The default user might be your macOS username, not "postgres"
- If you installed via **Homebrew**: You might have set a custom password
- If you installed via **pgAdmin4**: Check what password you used during setup

### Option 2: Check pgAdmin4 Connection

1. Open **pgAdmin4**
2. Look at your server connection settings:
   - Right-click your PostgreSQL server → **Properties**
   - Check the **Connection** tab
   - See what **Username** and **Password** you're using

### Option 3: Reset PostgreSQL Password

If you forgot your password, you can reset it:

#### For macOS (Postgres.app):
1. Open **Postgres.app**
2. Click **Settings** → **Users**
3. Reset password for your user

#### For Homebrew installation:
```bash
# Connect to PostgreSQL
psql postgres

# Then in psql:
ALTER USER postgres WITH PASSWORD 'your_new_password';
\q
```

---

## 🚀 Quick Fix: Set Environment Variables

Once you know your password, set it as an environment variable:

### Method 1: Export in Terminal (Temporary)

```bash
export DB_USER=postgres
export DB_PASSWORD=your_actual_password
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=translation_app
```

Then run:
```bash
python init_database.py
```

### Method 2: Create .env File (Recommended)

Create a `.env` file in your project root:

```bash
cd "/Users/mezan/Desktop/Translation app"
cat > .env << 'EOF'
DB_USER=postgres
DB_PASSWORD=your_actual_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=translation_app
EOF
```

**⚠️ Important:** Replace `your_actual_password` with your real PostgreSQL password!

Then load it before running:
```bash
source .env  # This won't work for .env files
# Instead, use:
export $(cat .env | xargs)
python init_database.py
```

### Method 3: Use DATABASE_URL (Easiest)

```bash
export DATABASE_URL="postgresql://postgres:your_actual_password@localhost:5432/translation_app"
python init_database.py
```

---

## 🔧 Alternative: Use Your macOS Username

If your PostgreSQL user is your macOS username (not "postgres"):

```bash
export DB_USER=$(whoami)  # Your macOS username
export DB_PASSWORD=your_password
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=translation_app
```

---

## 🧪 Test Your Connection First

Before running the init script, test if you can connect:

```bash
psql -U postgres -h localhost -d translation_app
```

Or if your user is different:
```bash
psql -U your_username -h localhost -d translation_app
```

If this works, you know your credentials are correct!

---

## 📝 Step-by-Step Fix

1. **Find your PostgreSQL password:**
   - Check pgAdmin4 connection settings
   - Or try common passwords you might have used
   - Or reset it (see Option 3 above)

2. **Set environment variables:**
   ```bash
   export DB_PASSWORD=your_actual_password
   export DB_USER=postgres  # or your username
   export DB_NAME=translation_app
   ```

3. **Test connection:**
   ```bash
   psql -U $DB_USER -h localhost -d $DB_NAME
   ```
   (Enter password when prompted - if it works, credentials are correct)

4. **Initialize database:**
   ```bash
   python init_database.py
   ```

---

## 🎯 Quick Commands

```bash
# Set password (replace with your actual password)
export DB_PASSWORD="your_password_here"

# Set other variables
export DB_USER=postgres
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=translation_app

# Test connection
psql -U $DB_USER -h localhost -d postgres

# Initialize database
python init_database.py
```

---

## 💡 Pro Tip: Make it Permanent

Add to your `~/.zshrc` file:

```bash
# PostgreSQL for Translation App
export DB_USER=postgres
export DB_PASSWORD=your_actual_password
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=translation_app
```

Then reload:
```bash
source ~/.zshrc
```

---

## ❓ Still Having Issues?

1. **Check if PostgreSQL is running:**
   ```bash
   pg_isready
   ```

2. **Check what users exist:**
   ```bash
   psql -U postgres -c "\du"
   ```

3. **Try connecting without password (trust authentication):**
   - Check `pg_hba.conf` file location:
     ```bash
     psql -U postgres -c "SHOW hba_file;"
     ```
   - This is advanced - usually password is required

---

Once you set the correct password, the initialization should work! 🎉

