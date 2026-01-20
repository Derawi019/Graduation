# 🔐 Quick Fix: Set PostgreSQL Password

## The Problem
You're getting: `password authentication failed for user "postgres"`

This means the app doesn't know your PostgreSQL password.

---

## ✅ Solution: 3 Simple Steps

### Step 1: Find Your Password in pgAdmin4

1. **Open pgAdmin4**
2. **Right-click** on your PostgreSQL server (in the left sidebar)
3. Click **Properties**
4. Go to the **Connection** tab
5. **Look at the "Password" field** - this is your password!

**Note:** If the password field is empty or shows dots, that's the password you entered when you first connected. You'll need to remember it or reset it.

---

### Step 2: Set the Password in Terminal

Open your terminal and run these commands (replace `YOUR_PASSWORD` with the actual password):

```bash
cd "/Users/mezan/Desktop/Translation app"
export DB_PASSWORD="YOUR_PASSWORD"
export DB_USER="postgres"
export DB_HOST="localhost"
export DB_PORT="5432"
export DB_NAME="translation_app"
```

**Example:**
```bash
export DB_PASSWORD="mypassword123"
export DB_USER="postgres"
export DB_NAME="translation_app"
```

---

### Step 3: Initialize Database

```bash
source venv/bin/activate
python init_database.py
```

---

## 🎯 Alternative: If You Don't Know the Password

### Option A: Reset PostgreSQL Password

1. Open **pgAdmin4**
2. Connect to your server
3. Right-click on **Login/Group Roles** → **postgres** → **Properties**
4. Go to **Definition** tab
5. Enter a new password
6. Click **Save**

Then use that new password in Step 2 above.

### Option B: Use Your macOS Username

If you installed PostgreSQL via Postgres.app, your username might be your macOS username, not "postgres":

```bash
export DB_USER=$(whoami)  # Your macOS username
export DB_PASSWORD="YOUR_PASSWORD"
export DB_NAME="translation_app"
python init_database.py
```

---

## 🧪 Test Your Connection First

Before running init, test if your password works:

```bash
# Try to connect (you'll be prompted for password)
psql -U postgres -h localhost -d postgres
```

If this works, your password is correct!

---

## 💾 Make It Permanent (Optional)

To avoid setting this every time, add to `~/.zshrc`:

```bash
echo 'export DB_PASSWORD="YOUR_PASSWORD"' >> ~/.zshrc
echo 'export DB_USER="postgres"' >> ~/.zshrc
echo 'export DB_NAME="translation_app"' >> ~/.zshrc
source ~/.zshrc
```

---

## ✅ Quick Checklist

- [ ] Opened pgAdmin4
- [ ] Found password in Connection settings
- [ ] Set `export DB_PASSWORD="your_password"` in terminal
- [ ] Set `export DB_USER="postgres"` (or your username)
- [ ] Ran `python init_database.py`
- [ ] Got ✅ success message

---

**Once you set the password and run the init script, you're all set!** 🎉

