# Fix Email Configuration

## ❌ Problem Found

Your `.env` file has `MAIL_SERVER` set to an email address instead of the SMTP server:

```bash
# ❌ WRONG:
MAIL_SERVER=translatedemo2025@gmail.com

# ✅ CORRECT:
MAIL_SERVER=smtp.gmail.com
```

## 🔧 Quick Fix

Update your `.env` file with these correct settings:

```bash
# Email Server Configuration
MAIL_SERVER=smtp.gmail.com                    # ← FIX: Use smtp.gmail.com, not your email
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USE_SSL=false
MAIL_USERNAME=translatedemo2025@gmail.com   # ← Your email address goes here
MAIL_PASSWORD=your-app-password              # ← Your Gmail app password
MAIL_DEFAULT_SENDER=translatedemo2025@gmail.com
MAIL_SUPPRESS_SEND=false
```

## 📝 Complete .env Email Section

```bash
# ============================================
# EMAIL CONFIGURATION (For Verification & Password Reset)
# ============================================
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USE_SSL=false
MAIL_USERNAME=translatedemo2025@gmail.com
MAIL_PASSWORD=your-gmail-app-password-here
MAIL_DEFAULT_SENDER=translatedemo2025@gmail.com
MAIL_SUPPRESS_SEND=false
```

## 🔑 Getting Gmail App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** → **2-Step Verification** (enable if not enabled)
3. Scroll down to **App passwords**
4. Select **Mail** and your device
5. Click **Generate**
6. Copy the 16-character password
7. Paste it in `MAIL_PASSWORD` in your `.env` file

## ✅ After Fixing

1. **Restart the app**:
   ```bash
   # Stop the app (Ctrl+C) and restart
   ./run.sh
   ```

2. **Test signup again** - you should see in logs:
   ```
   📧 Email configured: smtp.gmail.com:587 (User: translatedemo2025@gmail.com)
   Verification email sent to user@example.com
   ```

3. **Check your email inbox** for the verification link

## 🐛 Still Not Working?

Check the logs:
```bash
tail -f logs/translation_app.log | grep -i mail
```

Look for:
- `📧 Email configured` - means config is loaded
- `Verification email sent` - means email was sent successfully
- `Error sending verification email` - means there's a problem

Common issues:
- Wrong app password (use app password, not regular password)
- 2FA not enabled (required for app passwords)
- Firewall blocking SMTP port 587

