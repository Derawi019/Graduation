# 🐛 Sentry Error Tracking - Quick Setup Guide

## What is Sentry?

Sentry is an error tracking and performance monitoring service that automatically captures exceptions, errors, and performance issues from your application. It provides:

- **Real-time error alerts** via email/Slack
- **Detailed error reports** with stack traces
- **Performance monitoring** for slow requests
- **Release tracking** to see which version introduced bugs
- **User context** (IP, browser, etc.)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Sentry Account

1. Go to **[https://sentry.io](https://sentry.io)**
2. Click **"Sign Up"** (free tier available)
3. Choose **"Flask"** as your platform
4. Create a new project

### Step 2: Get Your DSN

After creating the project, Sentry will show you a **DSN** (Data Source Name). It looks like:

```
https://abc123def456@o123456.ingest.sentry.io/123456
```

**Copy this DSN** - you'll need it in the next step.

### Step 3: Configure Your App

Add the DSN to your `.env` file:

```bash
# Open .env file
nano .env  # or your favorite editor

# Add this line (replace with your actual DSN):
SENTRY_DSN=https://abc123def456@o123456.ingest.sentry.io/123456
```

### Step 4: Restart Your App

```bash
# Stop the app (Ctrl+C) and restart
./run.sh
```

You should see in the logs:
```
✅ Sentry error tracking: ENABLED
```

---

## ✅ Verify It's Working

### Option 1: Test Endpoint (Development Only)

Visit: `http://localhost:5000/test-error`

This will trigger a test error that gets sent to Sentry. Check your Sentry dashboard - you should see the error appear within seconds!

### Option 2: Check Logs

When the app starts, look for:
```
✅ Sentry error tracking: ENABLED
```

If you see:
```
⚠️  Sentry error tracking: DISABLED (set SENTRY_DSN to enable)
```

Then Sentry is not configured (which is fine for development).

---

## 📋 Optional Configuration

You can customize Sentry behavior in your `.env` file:

```bash
# Enable/disable Sentry (default: true)
SENTRY_ENABLED=true

# Performance monitoring sample rate (0.0-1.0)
# 0.1 = 10% of requests monitored (default)
# 1.0 = 100% of requests monitored (more data, higher cost)
SENTRY_TRACES_SAMPLE_RATE=0.1

# Profiling sample rate (0.0-1.0)
# Profiling shows detailed performance data
SENTRY_PROFILES_SAMPLE_RATE=0.1

# Release version (optional)
# Useful for tracking which version has bugs
SENTRY_RELEASE=v1.0.0
```

---

## 🎯 What Gets Tracked?

Sentry automatically captures:

- ✅ **All unhandled exceptions**
- ✅ **500 Internal Server Errors**
- ✅ **Database errors**
- ✅ **Translation API errors**
- ✅ **Audio processing errors**
- ✅ **Rate limit violations** (logged, not sent to Sentry)

**Plus context:**
- IP address
- Request path
- User agent (browser)
- Request parameters
- Stack traces

---

## 📊 Using Sentry Dashboard

### View Errors

1. Log in to [Sentry Dashboard](https://sentry.io)
2. Click on your project
3. See all errors in real-time
4. Click an error to see:
   - Full stack trace
   - Request details
   - User context
   - When it happened
   - How many times it occurred

### Set Up Alerts

1. Go to **Settings** → **Alerts**
2. Create alert rules:
   - Email me when error count > 10 in 1 hour
   - Slack notification for critical errors
   - PagerDuty for production issues

### Track Releases

Set `SENTRY_RELEASE` in `.env`:
```bash
SENTRY_RELEASE=v1.0.0
```

Then in Sentry, you can see:
- Which version introduced bugs
- Error trends over time
- Deploy impact

---

## 🔧 Troubleshooting

### Sentry Not Capturing Errors

1. **Check DSN is set:**
   ```bash
   echo $SENTRY_DSN
   # Or check .env file
   grep SENTRY_DSN .env
   ```

2. **Check app logs:**
   Look for:
   ```
   ✅ Sentry error tracking: ENABLED
   ```

3. **Verify Sentry project is active:**
   - Log in to Sentry dashboard
   - Make sure project is not paused
   - Check project settings

4. **Test with test endpoint:**
   Visit: `http://localhost:5000/test-error`
   Check Sentry dashboard for the error

### Too Many Events (Free Tier Limits)

Sentry free tier has limits. To reduce events:

1. **Lower sample rates:**
   ```bash
   SENTRY_TRACES_SAMPLE_RATE=0.01  # Only 1% of requests
   SENTRY_PROFILES_SAMPLE_RATE=0   # Disable profiling
   ```

2. **Filter in Sentry:**
   - Go to Settings → Filters
   - Ignore known errors
   - Set up rules to filter noise

3. **Disable in development:**
   ```bash
   SENTRY_ENABLED=false
   ```

---

## 💰 Pricing

**Free Tier:**
- 5,000 events/month
- 1 project
- 30-day retention
- Email alerts

**Paid Plans:**
- More events
- Longer retention
- More projects
- Advanced features

For most small apps, the free tier is sufficient!

---

## 🎓 Best Practices

1. **Use different projects for dev/prod:**
   - Development: `SENTRY_DSN=dev-dsn`
   - Production: `SENTRY_DSN=prod-dsn`

2. **Set release versions:**
   ```bash
   SENTRY_RELEASE=production-v1.0.0
   ```

3. **Monitor regularly:**
   - Check Sentry dashboard daily
   - Set up email alerts for critical errors
   - Review error trends weekly

4. **Don't ignore errors:**
   - Fix errors as they appear
   - Use Sentry to prioritize bug fixes
   - Track error resolution

---

## 📚 Related Files

- `app.py` - Sentry initialization and error handlers
- `.env.example` - Sentry configuration template
- `ERROR_TRACKING.md` - Detailed documentation
- `requirements.txt` - Includes `sentry-sdk[flask]`

---

## ✅ Checklist

- [ ] Created Sentry account
- [ ] Created Flask project in Sentry
- [ ] Copied DSN to `.env` file
- [ ] Restarted app
- [ ] Verified "✅ Sentry error tracking: ENABLED" in logs
- [ ] Tested with `/test-error` endpoint
- [ ] Confirmed error appears in Sentry dashboard
- [ ] Set up email alerts (optional)

---

**Sentry is now configured and ready to track errors!** 🎉

For detailed documentation, see `ERROR_TRACKING.md`.

