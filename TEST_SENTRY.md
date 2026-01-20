# 🧪 Testing Sentry Error Tracking

## Quick Test Methods

### Method 1: Test Endpoint (Easiest) ⚡

Visit this URL in your browser:
```
http://localhost:5000/test-error
```

**What happens:**
- Triggers a test exception
- Sends error to Sentry
- Returns JSON response with status

**Expected Response:**
```json
{
  "sentry_enabled": true,
  "sentry_dsn_from_env": true,
  "module_level_dsn": true,
  "message": "Test error sent to Sentry (if configured)"
}
```

**Check Sentry:**
- Go to your Sentry dashboard
- You should see the error appear within seconds
- Error message: "This is a test error for Sentry error tracking"

---

### Method 2: Trigger Real Application Errors

#### A. Empty Translation Request
```bash
curl -X POST http://localhost:5000/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "", "target_lang": "Spanish"}'
```

#### B. Invalid File Upload
- Go to "Upload Text File" tab
- Try uploading a non-text file (e.g., image)
- This should trigger an error

#### C. Invalid API Endpoint
```bash
curl http://localhost:5000/invalid-endpoint
```

#### D. Database Error (if you want to test)
- Temporarily stop PostgreSQL
- Try to save a translation
- Database error will be captured

---

### Method 3: Check Logs

Check your app logs to see if errors are being logged:
```bash
tail -f logs/translation_app.log | grep -i error
```

Look for:
- `[ERROR]` entries
- `Test error triggered`
- `Failed to send to Sentry` (if there's an issue)

---

### Method 4: Sentry Dashboard

1. **Go to Sentry Dashboard:**
   - Visit: https://sentry.io
   - Log in to your account
   - Select your project

2. **Check Issues Tab:**
   - Click "Issues" in the sidebar
   - You should see all captured errors
   - Click an error to see details

3. **What to Look For:**
   - ✅ Error message
   - ✅ Stack trace
   - ✅ Request details (IP, path, user agent)
   - ✅ Timestamp
   - ✅ Environment (production/development)

---

### Method 5: Programmatic Test (Advanced)

You can also test from Python:

```python
import requests

# Test the test endpoint
response = requests.get('http://localhost:5000/test-error')
print(response.json())

# Test with invalid data
response = requests.post('http://localhost:5000/translate', 
    json={'text': '', 'target_lang': 'Spanish'})
print(response.json())
```

---

## 🎯 Recommended Testing Workflow

1. **Start with Test Endpoint:**
   ```
   Visit: http://localhost:5000/test-error
   ```

2. **Check Sentry Dashboard:**
   - Wait 5-10 seconds
   - Refresh your Sentry dashboard
   - You should see the error

3. **Verify Error Details:**
   - Click on the error in Sentry
   - Check stack trace
   - Verify request context

4. **Test Real Errors:**
   - Try actual error scenarios
   - Verify they appear in Sentry

---

## ✅ Verification Checklist

- [ ] Test endpoint returns `sentry_enabled: true`
- [ ] Error appears in Sentry dashboard
- [ ] Error has stack trace
- [ ] Error shows request details (IP, path)
- [ ] Error shows correct timestamp
- [ ] Real errors are also captured

---

## 🔍 Troubleshooting

### Error Not Appearing in Sentry

1. **Check Sentry Status:**
   ```bash
   curl http://localhost:5000/test-error
   ```
   Should show `sentry_enabled: true`

2. **Check Logs:**
   ```bash
   tail -20 logs/translation_app.log | grep -i sentry
   ```
   Should show: `✅ Sentry error tracking: ENABLED`

3. **Verify DSN:**
   ```bash
   grep SENTRY_DSN .env
   ```
   Should show your DSN

4. **Check Sentry Dashboard:**
   - Make sure project is active
   - Check if there are any filters blocking errors
   - Verify DSN matches

### Errors Appearing But No Details

- Check Sentry project settings
- Verify integrations are enabled
- Check if there are rate limits

---

## 📊 What Gets Captured

Sentry automatically captures:

- ✅ Exception message
- ✅ Full stack trace
- ✅ Request URL and method
- ✅ IP address
- ✅ User agent (browser)
- ✅ Request parameters
- ✅ Environment (production/development)
- ✅ Timestamp
- ✅ Release version (if set)

---

## 🎓 Best Practices

1. **Test Regularly:**
   - Test after each deployment
   - Verify errors are being captured
   - Check error details are correct

2. **Monitor Dashboard:**
   - Check Sentry dashboard daily
   - Set up email alerts for critical errors
   - Review error trends

3. **Use Test Endpoint:**
   - Quick way to verify Sentry is working
   - Use before important deployments
   - Test after configuration changes

---

**Happy Testing!** 🚀

