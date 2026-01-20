# Email Verification & Password Reset Setup Guide

## ✅ Features Implemented

1. **Email Verification**
   - Users must verify their email before logging in
   - Verification email sent automatically on signup
   - Verification link expires in 24 hours
   - Resend verification email option

2. **Password Reset**
   - Forgot password functionality
   - Password reset link sent via email
   - Reset link expires in 1 hour
   - Secure token-based reset

3. **Google OAuth**
   - Google OAuth users are automatically verified (no email verification needed)

---

## 📧 Email Configuration

### Environment Variables

Add these to your `.env` file or set them as environment variables:

```bash
# Email Server Configuration
MAIL_SERVER=smtp.gmail.com          # SMTP server (Gmail, Outlook, etc.)
MAIL_PORT=587                        # Port (587 for TLS, 465 for SSL)
MAIL_USE_TLS=true                    # Use TLS (true/false)
MAIL_USE_SSL=false                    # Use SSL (true/false)
MAIL_USERNAME=your-email@gmail.com   # Your email address
MAIL_PASSWORD=your-app-password      # App password (not regular password)
MAIL_DEFAULT_SENDER=your-email@gmail.com  # Default sender email

# Optional: Suppress email sending (for testing)
MAIL_SUPPRESS_SEND=false              # Set to true to log emails instead of sending
```

### Gmail Setup

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password (not your regular Gmail password) in `MAIL_PASSWORD`

### Other Email Providers

**Outlook/Hotmail:**
```bash
MAIL_SERVER=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USE_TLS=true
```

**Yahoo:**
```bash
MAIL_SERVER=smtp.mail.yahoo.com
MAIL_PORT=587
MAIL_USE_TLS=true
```

**Custom SMTP:**
```bash
MAIL_SERVER=your-smtp-server.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
```

---

## 🧪 Testing Email Features

### Test Mode (Suppress Sending)

Set `MAIL_SUPPRESS_SEND=true` in your `.env` file. Emails will be logged to the console/logs instead of being sent:

```bash
MAIL_SUPPRESS_SEND=true
```

Check the logs for verification/reset URLs:
```
[MAIL SUPPRESSED] Verification URL: http://localhost:5000/verify-email/...
```

### Testing Flow

1. **Sign Up**:
   - Go to `/signup`
   - Create a new account
   - Check email (or logs if `MAIL_SUPPRESS_SEND=true`)
   - Click verification link

2. **Resend Verification**:
   - Go to `/resend-verification`
   - Enter your email
   - Check email for new link

3. **Forgot Password**:
   - Go to `/forgot-password`
   - Enter your email
   - Check email for reset link
   - Click link and set new password

---

## 🔒 Security Features

- **Token Expiration**: 
  - Verification tokens expire in 24 hours
  - Reset tokens expire in 1 hour
  
- **Rate Limiting**:
  - Verification resend: 5 per hour
  - Password reset: 5 per hour
  - Email verification: 10 per hour

- **Email Privacy**:
  - Doesn't reveal if email exists (for security)
  - Tokens are cryptographically secure (secrets.token_urlsafe)

---

## 📝 Routes

- `/signup` - Sign up (sends verification email)
- `/login` - Login (requires verified email)
- `/verify-email/<token>` - Verify email with token
- `/resend-verification` - Resend verification email
- `/forgot-password` - Request password reset
- `/reset-password/<token>` - Reset password with token

---

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check SMTP Settings**:
   - Verify `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USE_TLS` are correct
   - For Gmail, use app password (not regular password)

2. **Check Logs**:
   ```bash
   tail -f logs/translation_app.log | grep -i mail
   ```

3. **Test Connection**:
   ```python
   from app import app, mail
   with app.app_context():
       msg = Message('Test', recipients=['your@email.com'])
       mail.send(msg)
   ```

### "Email already verified" Error

- Existing users were automatically set to verified during migration
- New users must verify their email

### Verification Link Expired

- Links expire after 24 hours
- Use `/resend-verification` to get a new link

---

## 📚 Additional Resources

- [Flask-Mail Documentation](https://pythonhosted.org/Flask-Mail/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SMTP Server Settings](https://www.socketlabs.com/blog/smtp-settings/)

