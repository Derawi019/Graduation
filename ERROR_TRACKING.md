# 🐛 Error Tracking with Sentry

## Overview

The Translation App now includes error tracking using **Sentry**, a powerful error monitoring and performance monitoring platform. Sentry automatically captures exceptions, errors, and performance issues, providing real-time alerts and detailed error reports.

---

## 🎯 Features

### ✅ What's Tracked

1. **Automatic Exception Capture**
   - All unhandled exceptions
   - 500 Internal Server Errors
   - Database errors
   - Translation API errors
   - Audio processing errors

2. **Request Context**
   - IP addresses
   - Request paths
   - User agents
   - Request parameters

3. **Performance Monitoring**
   - Request traces
   - Database query performance
   - Slow endpoints

4. **Release Tracking**
   - Track errors by app version
   - Deploy notifications

---

## 🚀 Quick Start

### 1. Create a Sentry Account

1. Go to [https://sentry.io](https://sentry.io)
2. Sign up for a free account
3. Create a new project (select "Flask")
4. Copy your **DSN** (Data Source Name)

### 2. Configure Sentry

Add your Sentry DSN to your `.env` file:

```bash
SENTRY_DSN=https://your-key@sentry.io/your-project-id
```

### 3. Restart the App

The app will automatically initialize Sentry when it detects the `SENTRY_DSN` environment variable.

---

## 📋 Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SENTRY_DSN` | - | **REQUIRED** Your Sentry project DSN |
| `SENTRY_ENABLED` | `true` | Enable/disable Sentry (`true`/`false`) |
| `SENTRY_TRACES_SAMPLE_RATE` | `0.1` | Performance monitoring sample rate (0.0-1.0) |
| `SENTRY_PROFILES_SAMPLE_RATE` | `0.1` | Profiling sample rate (0.0-1.0) |
| `SENTRY_RELEASE` | - | Release version (e.g., `v1.0.0`) |

### Example .env Configuration

```bash
# Sentry Error Tracking
SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
SENTRY_ENABLED=true
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1
SENTRY_RELEASE=v1.0.0
```

---

## 🔧 How It Works

### Automatic Error Capture

Sentry automatically captures:
- Unhandled exceptions
- 500 errors
- Database errors
- All exceptions logged with `app.logger.error()`

### Manual Error Capture

You can also manually capture errors:

```python
import sentry_sdk

try:
    # Your code here
    pass
except Exception as e:
    # Log to Sentry
    sentry_sdk.capture_exception(e)
    # Continue handling...
```

### Adding Context

Add user context to errors:

```python
import sentry_sdk

with sentry_sdk.configure_scope() as scope:
    scope.user = {
        "id": user_id,
        "email": user_email,
        "ip_address": request.remote_addr
    }
    scope.set_tag("feature", "translation")
    scope.set_extra("text_length", len(text))
```

---

## 📊 Sentry Dashboard

### Viewing Errors

1. Log in to [Sentry Dashboard](https://sentry.io)
2. Select your project
3. View errors in real-time
4. Click on errors for detailed stack traces

### Error Details Include

- **Stack Trace** - Full Python stack trace
- **Request Information** - URL, method, headers
- **User Context** - IP address, user agent
- **Environment** - Development/Production
- **Release** - App version
- **Breadcrumbs** - Events leading to error

---

## 🎛️ Advanced Configuration

### Filtering Events

Sentry can be disabled via environment variable:

```bash
SENTRY_ENABLED=false
```

### Sample Rates

Adjust performance monitoring:

```bash
# Capture 10% of transactions (default)
SENTRY_TRACES_SAMPLE_RATE=0.1

# Capture 50% of transactions
SENTRY_TRACES_SAMPLE_RATE=0.5

# Capture all transactions (not recommended for production)
SENTRY_TRACES_SAMPLE_RATE=1.0
```

### Release Tracking

Track errors by app version:

```bash
SENTRY_RELEASE=v1.0.0
```

This helps identify which version introduced bugs.

---

## 🔒 Privacy & Security

### What's Sent to Sentry

- Error messages and stack traces
- Request paths and methods
- IP addresses
- User agents
- Environment variables (if configured)

### What's NOT Sent

- Request body content (by default)
- Database passwords
- Secret keys
- File contents

### Sensitive Data Filtering

Sentry automatically filters:
- Passwords
- API keys
- Credit card numbers
- Social security numbers

You can configure additional filters in Sentry settings.

---

## 🧪 Testing Error Tracking

### Test Exception

Create a test route to verify Sentry is working:

```python
@app.route('/test-error')
def test_error():
    """Test route to verify Sentry error tracking"""
    raise Exception("This is a test error for Sentry")
```

Visit `/test-error` and check your Sentry dashboard.

### Verify Configuration

Check app logs on startup:

```
✅ Sentry error tracking: ENABLED
```

If you see:
```
⚠️  Sentry error tracking: DISABLED (set SENTRY_DSN to enable)
```

Then Sentry is not configured (which is fine for development).

---

## 📈 Monitoring Best Practices

### 1. Set Up Alerts

In Sentry dashboard:
- Go to **Alerts**
- Create alerts for:
  - New errors
  - High error rates
  - Critical errors

### 2. Organize by Environment

Use different Sentry projects for:
- Development
- Staging
- Production

Or use tags to filter:
```python
SENTRY_RELEASE=production-v1.0.0
```

### 3. Review Regularly

- Check Sentry dashboard daily
- Fix high-frequency errors first
- Monitor error trends

### 4. Use Releases

Tag releases to track:
- Which version introduced bugs
- Error rates per version
- Deployment impact

---

## 🆚 Sentry vs. Logging

### Sentry is Best For:
- ✅ Real-time error alerts
- ✅ Error aggregation and grouping
- ✅ Performance monitoring
- ✅ Release tracking
- ✅ Team collaboration

### Logging is Best For:
- ✅ Detailed application logs
- ✅ Debug information
- ✅ Audit trails
- ✅ Long-term storage
- ✅ Local development

**Use both together for comprehensive monitoring!**

---

## 🔍 Troubleshooting

### Sentry Not Capturing Errors

1. **Check DSN is set:**
   ```bash
   echo $SENTRY_DSN
   ```

2. **Check app logs:**
   ```
   ✅ Sentry error tracking: ENABLED
   ```

3. **Verify Sentry project is active:**
   - Log in to Sentry dashboard
   - Check project status

4. **Test with test route:**
   ```bash
   curl http://localhost:5000/test-error
   ```

### Too Many Events

1. **Reduce sample rate:**
   ```bash
   SENTRY_TRACES_SAMPLE_RATE=0.01
   ```

2. **Filter in Sentry:**
   - Go to Settings > Filters
   - Add filters for known issues

3. **Disable for development:**
   ```bash
   SENTRY_ENABLED=false
   ```

### Performance Impact

Sentry has minimal performance impact:
- Async error reporting
- Configurable sample rates
- Local buffering

If you notice performance issues:
- Reduce `SENTRY_TRACES_SAMPLE_RATE`
- Disable profiling: `SENTRY_PROFILES_SAMPLE_RATE=0`

---

## 📚 Related Files

- `app.py` - Sentry initialization and error handlers
- `.env.example` - Sentry configuration template
- `requirements.txt` - Includes `sentry-sdk[flask]`
- `ERROR_TRACKING.md` - This documentation

---

## ✅ Checklist

- [x] Sentry SDK added to requirements
- [x] Sentry initialization in app.py
- [x] Global error handlers with Sentry capture
- [x] Environment variable configuration
- [x] Startup logging for Sentry status
- [x] Documentation created

---

## 🎉 Next Steps

1. **Sign up for Sentry** (free tier available)
2. **Get your DSN** from Sentry dashboard
3. **Add to .env file**
4. **Restart the app**
5. **Test with `/test-error` route**
6. **Set up alerts in Sentry**

---

**Error tracking is now fully configured!** 🎉

Your app will automatically capture and report errors to Sentry, helping you monitor and fix issues in production.

