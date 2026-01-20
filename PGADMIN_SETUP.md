# Creating Database in pgAdmin4 - Step by Step Guide

## 🎯 Quick Steps

### Step 1: Open pgAdmin4
1. Launch **pgAdmin4** from your Applications or Start menu
2. Enter your **master password** if prompted
3. You'll see the pgAdmin4 interface

---

### Step 2: Connect to PostgreSQL Server

1. In the left sidebar, expand **Servers**
2. Click on your PostgreSQL server (usually named "PostgreSQL" or version number)
3. If not connected, right-click → **Connect Server**
4. Enter your PostgreSQL password if prompted

---

### Step 3: Create the Database

#### Option A: Using Right-Click Menu

1. **Right-click** on **Databases** in the left sidebar
2. Select **Create** → **Database...**

#### Option B: Using Toolbar

1. Click on **Databases** in the left sidebar
2. Click the **Create Database** button (looks like a database icon with a +)

---

### Step 4: Configure Database Settings

A dialog window will open. Fill in the following:

#### **General Tab:**
- **Database name:** `translation_app`
- **Owner:** Leave as default (usually `postgres`) or select your user
- **Comment:** (Optional) "Translation App Database"

#### **Definition Tab:**
- **Encoding:** `UTF8` (default - recommended)
- **Template:** `template0` (default - recommended)
- **Collation:** Leave default
- **Character type:** Leave default

#### **Security Tab:**
- Leave default (no special privileges needed for now)

#### **Parameters Tab:**
- Leave default (no custom parameters needed)

---

### Step 5: Create the Database

1. Click **Save** button at the bottom
2. You should see `translation_app` appear in the Databases list
3. ✅ Database created successfully!

---

## 🔍 Verify Database Creation

1. Expand **Databases** in the left sidebar
2. You should see **translation_app** listed
3. Click on it to select it
4. The database is ready to use!

---

## 📝 Next Steps After Creating Database

### 1. Get Your Connection Details

From pgAdmin4, you can see your connection details:
- **Host:** Usually `localhost` (shown in server properties)
- **Port:** Usually `5432` (shown in server properties)
- **Database:** `translation_app` (the one you just created)
- **Username:** Usually `postgres` (shown in server properties)
- **Password:** Your PostgreSQL password

### 2. Set Environment Variables

Create a `.env` file in your project root:

```bash
# .env file
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=translation_app
```

**Or use DATABASE_URL:**
```bash
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/translation_app
```

### 3. Initialize Database Tables

Run the initialization script:
```bash
cd "/Users/mezan/Desktop/Translation app"
source venv/bin/activate
python init_database.py
```

This will create the `translations` table automatically.

---

## 🖼️ Visual Guide (What You'll See)

```
pgAdmin4 Interface:
├── Servers
│   └── PostgreSQL (your server)
│       ├── Databases
│       │   ├── postgres (default)
│       │   ├── template0
│       │   ├── template1
│       │   └── translation_app ← Your new database!
│       ├── Login/Group Roles
│       └── Tablespaces
```

---

## 🔧 Troubleshooting

### Can't see "Create Database" option?

**Solution:**
- Make sure you're right-clicking on **Databases** (not on a specific database)
- Or click on **Databases** first, then use the toolbar button

### "Permission denied" error?

**Solution:**
- Make sure you're connected as a user with database creation privileges
- Usually `postgres` user has these privileges
- Check your server connection settings

### Database name already exists?

**Solution:**
- Choose a different name (e.g., `translation_app_v2`)
- Or delete the existing database first:
  1. Right-click on the database
  2. Select **Delete/Drop**
  3. Confirm deletion
  4. Create it again

---

## ✅ Quick Checklist

- [ ] pgAdmin4 is open
- [ ] Connected to PostgreSQL server
- [ ] Right-clicked on "Databases"
- [ ] Selected "Create" → "Database..."
- [ ] Named it `translation_app`
- [ ] Clicked "Save"
- [ ] Database appears in the list
- [ ] Set environment variables
- [ ] Run `python init_database.py`

---

## 🎯 Alternative: Using SQL Query

If you prefer using SQL directly in pgAdmin4:

1. Click on your PostgreSQL server
2. Click **Tools** → **Query Tool** (or press `Alt+Shift+Q`)
3. Enter this SQL:
   ```sql
   CREATE DATABASE translation_app
       WITH 
       OWNER = postgres
       ENCODING = 'UTF8'
       TEMPLATE = template0;
   ```
4. Click **Execute** (or press `F5`)
5. ✅ Database created!

---

## 📚 Additional Information

### View Database Properties

1. Right-click on `translation_app`
2. Select **Properties**
3. You can see all database settings here

### View Database Size

1. Right-click on `translation_app`
2. Select **Properties** → **Statistics** tab
3. See database size and other stats

### Backup Database

1. Right-click on `translation_app`
2. Select **Backup...**
3. Choose backup location and options
4. Click **Backup**

---

## 🚀 After Database Creation

Once the database is created:

1. **Tables will be created automatically** when you run the app
2. Or run `python init_database.py` to create them manually
3. Your app will connect and start storing translations!

---

## 💡 Pro Tips

- **Database name:** Use lowercase with underscores (e.g., `translation_app`)
- **Owner:** Usually `postgres` is fine for development
- **Encoding:** Always use `UTF8` for text applications
- **Template:** `template0` is recommended for clean databases

---

That's it! Your database is ready. The app will automatically create the `translations` table when it starts. 🎉

