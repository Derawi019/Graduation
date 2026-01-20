# 🚀 Running the App with Database

## ✅ Database Setup Complete!

Your PostgreSQL database has been created and initialized successfully! 🎉

---

## 🔑 Important: Set Environment Variables

**Before running the app**, you need to set your database password in the terminal:

```bash
export DB_PASSWORD="your_password"
export DB_USER="postgres"
export DB_NAME="translation_app"
export DB_HOST="localhost"
export DB_PORT="5432"
```

---

## 🏃 Run the App

### Step 1: Activate Virtual Environment
```bash
cd "/Users/mezan/Desktop/Translation app"
source venv/bin/activate
```

### Step 2: Set Database Password
```bash
export DB_PASSWORD="your_password"  # Use your actual password
export DB_USER="postgres"
export DB_NAME="translation_app"
```

### Step 3: Run the App
```bash
python app.py
```

The app will start on `http://localhost:5000` (or the port shown in the terminal).

---

## 💾 Make Password Permanent (Optional)

To avoid setting the password every time, add it to your `~/.zshrc`:

```bash
# Add to ~/.zshrc
echo 'export DB_PASSWORD="your_password"' >> ~/.zshrc
echo 'export DB_USER="postgres"' >> ~/.zshrc
echo 'export DB_NAME="translation_app"' >> ~/.zshrc
echo 'export DB_HOST="localhost"' >> ~/.zshrc
echo 'export DB_PORT="5432"' >> ~/.zshrc

# Reload
source ~/.zshrc
```

**⚠️ Security Note:** This stores your password in plain text. For production, use a `.env` file with proper security.

---

## 🎯 Quick Start Script

Create a file `start.sh`:

```bash
#!/bin/bash
cd "/Users/mezan/Desktop/Translation app"
source venv/bin/activate
export DB_PASSWORD="your_password"
export DB_USER="postgres"
export DB_NAME="translation_app"
export DB_HOST="localhost"
export DB_PORT="5432"
python app.py
```

Make it executable:
```bash
chmod +x start.sh
```

Then just run:
```bash
./start.sh
```

---

## ✅ What to Expect

When you run the app, you should see:

```
✅ Database tables created/verified
 * Running on http://0.0.0.0:5000
```

This confirms the database connection is working!

---

## 🧪 Test the App

1. Open `http://localhost:5000` in your browser
2. Translate some text
3. Check the **History** tab - your translations should be saved!
4. Try marking translations as favorites
5. Search in history

All data is now stored in PostgreSQL and will persist even after restarting the app! 🎉

---

## 🔧 Troubleshooting

### "password authentication failed"
- Make sure you set `export DB_PASSWORD="your_password"` before running
- Use the same password you used in pgAdmin4

### "database does not exist"
- Make sure the database `translation_app` exists in pgAdmin4
- Or create it: `createdb translation_app` (if you have psql in PATH)

### "connection refused"
- Make sure PostgreSQL is running
- Check in pgAdmin4 that your server is connected

---

## 📝 Summary

✅ Database created  
✅ Tables initialized  
✅ Ready to run!

Just remember to set the environment variables before running the app! 🚀

