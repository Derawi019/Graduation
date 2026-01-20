# Deployment Guide - Translation App

## 📋 What You Need to Deploy

### 1. **Required Changes Before Deployment**

#### ✅ Critical Issues to Fix:

1. **Database (MUST HAVE)**
   - Currently using in-memory storage (`translation_history = []`)
   - History is lost on server restart
   - **Solution**: Add SQLite (simple) or PostgreSQL (production)

2. **Production Server**
   - Currently using Flask's development server (`debug=True`)
   - Not suitable for production
   - **Solution**: Use Gunicorn or uWSGI

3. **Environment Variables**
   - Hardcoded configuration
   - **Solution**: Use environment variables for sensitive data

4. **Error Handling & Logging**
   - Basic error handling
   - **Solution**: Add proper logging and error tracking

5. **Security**
   - No rate limiting
   - **Solution**: Add rate limiting to prevent abuse

---

## 🚀 Deployment Platform Options

### **Option 1: Render (Recommended - Easiest)**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy database setup
- ✅ Auto-deploy from GitHub
- ✅ Handles Python apps well

**Requirements:**
- GitHub account
- `Procfile` (we'll create this)
- `runtime.txt` (Python version)

### **Option 2: Railway**
- ✅ Free tier available
- ✅ Simple deployment
- ✅ Built-in PostgreSQL
- ✅ Good for beginners

### **Option 3: Heroku**
- ⚠️ No free tier (paid only)
- ✅ Well-documented
- ✅ Add-ons available
- ✅ Good for production

### **Option 4: DigitalOcean App Platform**
- ⚠️ Paid (starts at $5/month)
- ✅ Simple deployment
- ✅ Good performance
- ✅ Managed databases

### **Option 5: VPS (DigitalOcean, AWS EC2, etc.)**
- ⚠️ Requires server management
- ✅ Full control
- ✅ Most flexible
- ✅ Can be cost-effective

---

## 📦 Required Files for Deployment

### 1. **Procfile** (for Render/Heroku)
```
web: gunicorn app:app
```

### 2. **runtime.txt** (Python version)
```
python-3.11.0
```

### 3. **gunicorn** (add to requirements.txt)
```
gunicorn==21.2.0
```

### 4. **.env.example** (template for environment variables)
```
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///translations.db
```

### 5. **wsgi.py** (alternative entry point)
```python
from app import app

if __name__ == "__main__":
    app.run()
```

---

## 🔧 Step-by-Step Deployment (Render - Recommended)

### **Step 1: Prepare Your Code**

1. **Update `requirements.txt`**:
```txt
Flask==3.0.0
deep-translator==1.11.4
langdetect==1.0.9
SpeechRecognition==3.10.0
pydub==0.25.1
Werkzeug==3.0.1
gunicorn==21.2.0
```

2. **Create `Procfile`**:
```
web: gunicorn app:app --bind 0.0.0.0:$PORT
```

3. **Create `runtime.txt`**:
```
python-3.11.0
```

4. **Update `app.py`** for production:
```python
import os

# At the bottom of app.py, replace:
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

### **Step 2: Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/translation-app.git
git push -u origin main
```

### **Step 3: Deploy on Render**

1. Go to [render.com](https://render.com)
2. Sign up/login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: translation-app
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)

### **Step 4: Add Database (Optional but Recommended)**

1. In Render dashboard: "New +" → "PostgreSQL"
2. Create database
3. Get connection string
4. Add to environment variables:
   - `DATABASE_URL=postgresql://...`

---

## 🗄️ Database Setup (SQLite - Simple)

### **Option A: SQLite (Easiest)**

1. **Install SQLite support**:
```bash
pip install Flask-SQLAlchemy
```

2. **Update `requirements.txt`**:
```
Flask-SQLAlchemy==3.1.1
```

3. **Update `app.py`**:
```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///translations.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Translation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_text = db.Column(db.Text, nullable=False)
    translated_text = db.Column(db.Text, nullable=False)
    detected_language = db.Column(db.String(50))
    target_language = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_favorite = db.Column(db.Boolean, default=False)

# Initialize database
with app.app_context():
    db.create_all()
```

### **Option B: PostgreSQL (Production)**

Same as SQLite but use PostgreSQL connection string:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
```

---

## 🔒 Security Considerations

### **1. Environment Variables**
```python
import os

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
```

### **2. Rate Limiting**
```bash
pip install Flask-Limiter
```

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/translate', methods=['POST'])
@limiter.limit("10 per minute")
def translate():
    # ... existing code
```

### **3. CORS (if needed)**
```bash
pip install flask-cors
```

```python
from flask_cors import CORS
CORS(app)
```

---

## 📝 Environment Variables to Set

### **Required:**
- `FLASK_ENV=production`
- `PORT=5000` (usually set by platform)

### **Recommended:**
- `SECRET_KEY=your-random-secret-key`
- `DATABASE_URL=postgresql://...` (if using PostgreSQL)
- `DEBUG=False`

### **Optional:**
- `MAX_CONTENT_LENGTH=16777216` (16MB in bytes)
- `LOG_LEVEL=INFO`

---

## 🐳 Docker Deployment (Alternative)

### **Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Expose port
EXPOSE 5000

# Run app
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
```

### **.dockerignore**:
```
venv/
__pycache__/
*.pyc
.env
.git/
```

---

## ✅ Pre-Deployment Checklist

- [ ] Update `app.py` to use production server (Gunicorn)
- [ ] Add database (SQLite or PostgreSQL)
- [ ] Remove `debug=True`
- [ ] Add rate limiting
- [ ] Set environment variables
- [ ] Test locally with production settings
- [ ] Update `requirements.txt` with all dependencies
- [ ] Create `Procfile` (for Render/Heroku)
- [ ] Create `runtime.txt` (Python version)
- [ ] Test all features work
- [ ] Check error handling
- [ ] Review security settings

---

## 🧪 Testing Production Locally

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn app:app --bind 0.0.0.0:5000

# Test
curl http://localhost:5000
```

---

## 📊 Monitoring & Logging

### **Add Logging**:
```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/translation.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Translation app startup')
```

---

## 🚨 Common Deployment Issues

### **Issue 1: Port Binding**
**Error**: `Address already in use`
**Solution**: Use `$PORT` environment variable:
```python
port = int(os.environ.get('PORT', 5000))
```

### **Issue 2: ffmpeg Not Found**
**Error**: Audio conversion fails
**Solution**: Install ffmpeg in build process or use Docker

### **Issue 3: Database Connection**
**Error**: Can't connect to database
**Solution**: Check `DATABASE_URL` environment variable

### **Issue 4: Static Files Not Loading**
**Error**: CSS/JS not found
**Solution**: Check `static_folder` path in Flask config

---

## 💰 Cost Estimates

### **Free Options:**
- **Render**: Free tier (spins down after inactivity)
- **Railway**: $5 free credit/month
- **Vercel**: Free (but needs serverless conversion)

### **Paid Options:**
- **Heroku**: $7/month (Hobby tier)
- **DigitalOcean**: $5/month (Basic)
- **AWS**: Pay-as-you-go (~$5-10/month)

---

## 🎯 Recommended Deployment Path

1. **Start Simple**: Deploy to Render with SQLite
2. **Add Database**: Upgrade to PostgreSQL when needed
3. **Add Monitoring**: Set up logging and error tracking
4. **Scale**: Add caching and rate limiting as traffic grows

---

## 📚 Additional Resources

- [Flask Deployment Guide](https://flask.palletsprojects.com/en/latest/deploying/)
- [Render Documentation](https://render.com/docs)
- [Gunicorn Documentation](https://gunicorn.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

---

## 🆘 Need Help?

If you encounter issues:
1. Check platform logs
2. Verify environment variables
3. Test locally with production settings
4. Check platform-specific documentation

