# 🚀 Quick Deployment Checklist

## ✅ Files Created for You

- ✅ `Procfile` - Tells Render/Heroku how to run your app
- ✅ `runtime.txt` - Specifies Python version
- ✅ `requirements.txt` - Updated with gunicorn
- ✅ `app.py` - Updated for production (uses PORT env variable)
- ✅ `DEPLOYMENT.md` - Full deployment guide

## 📋 Before Deploying

### **Critical: Add Database (Recommended)**

Your app currently uses in-memory storage. History will be lost on restart.

**Quick SQLite Setup:**
1. Add to `requirements.txt`:
   ```
   Flask-SQLAlchemy==3.1.1
   ```

2. Update `app.py` (see DEPLOYMENT.md for full code)

### **Optional but Recommended:**
- [ ] Add rate limiting (Flask-Limiter)
- [ ] Set up logging
- [ ] Add error tracking

---

## 🎯 Quick Deploy to Render (5 minutes)

### **Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/translation-app.git
git push -u origin main
```

### **Step 2: Deploy on Render**
1. Go to [render.com](https://render.com) → Sign up
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Settings:
   - **Name**: translation-app
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Click "Create Web Service"
6. Wait 5-10 minutes

### **Step 3: Done!**
Your app will be live at: `https://your-app-name.onrender.com`

---

## ⚠️ Important Notes

1. **Free tier spins down** after 15 minutes of inactivity
2. **First request** after spin-down takes ~30 seconds
3. **ffmpeg** may not work on free tier (audio features)
4. **Database** - Add SQLite or PostgreSQL for persistent history

---

## 🔧 Test Locally First

```bash
# Install gunicorn
pip install gunicorn

# Run production server
gunicorn app:app --bind 0.0.0.0:5000

# Test in browser
open http://localhost:5000
```

---

## 📚 Full Guide

See `DEPLOYMENT.md` for:
- Database setup
- Security best practices
- Other platform options
- Troubleshooting

