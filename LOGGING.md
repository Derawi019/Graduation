# 📝 Logging Documentation

## Overview

The Translation App now includes comprehensive logging to help with debugging, monitoring, and troubleshooting in both development and production environments.

---

## 🎯 Features

### ✅ What's Logged

1. **Application Startup/Shutdown**
   - App initialization
   - Database connection
   - Server startup with port and debug mode

2. **Translation Requests**
   - All translation requests with IP address
   - Text length and target language
   - Detected source language
   - Success/failure status
   - Database save operations

3. **File Operations**
   - Text file uploads
   - Audio file uploads
   - File sizes and formats
   - Transcription results

4. **Error Handling**
   - All exceptions with full stack traces
   - Rate limit violations
   - Database errors
   - Audio processing errors
   - Translation API errors

5. **Database Operations**
   - Translation saves
   - History cleanup operations
   - Favorite toggles
   - Deletions

6. **Rate Limiting**
   - Rate limit exceeded events
   - IP addresses that hit limits

---

## 📁 Log File Location

Logs are stored in: `logs/translation_app.log`

The `logs/` directory is automatically created when the app starts.

---

## 🔧 Configuration

### Log Levels

Set the log level using the `LOG_LEVEL` environment variable:

```bash
export LOG_LEVEL=DEBUG    # Most verbose (development)
export LOG_LEVEL=INFO     # Default (production)
export LOG_LEVEL=WARNING  # Only warnings and errors
export LOG_LEVEL=ERROR    # Only errors
```

**Available levels:**
- `DEBUG` - Detailed information for debugging
- `INFO` - General informational messages
- `WARNING` - Warning messages (e.g., rate limits)
- `ERROR` - Error messages with stack traces

### Log Rotation

Logs are automatically rotated to prevent files from growing too large:

- **Max file size:** 10MB per log file
- **Backup count:** 10 rotated files kept
- **Format:** `translation_app.log`, `translation_app.log.1`, `translation_app.log.2`, etc.

---

## 📊 Log Format

Each log entry includes:

```
YYYY-MM-DD HH:MM:SS [LEVEL] flask.app: Message [filepath:line_number]
```

**Example:**
```
2024-11-09 23:45:12 [INFO] flask.app: Translation request from 127.0.0.1: 42 chars, target: Spanish [app.py:282]
2024-11-09 23:45:13 [INFO] flask.app: Translation saved to database (ID: 15) [app.py:305]
2024-11-09 23:45:13 [INFO] flask.app: Translation successful: en -> Spanish [app.py:318]
```

---

## 🖥️ Console vs File Logging

### Development Mode
- **Console:** Logs appear in terminal
- **File:** Logs also saved to file
- **Level:** Both use same log level

### Production Mode
- **Console:** No console output (unless errors)
- **File:** All logs saved to file
- **Level:** Set via `LOG_LEVEL` environment variable

---

## 📖 Example Log Entries

### Successful Translation
```
2024-11-09 23:45:12 [INFO] flask.app: Translation request from 127.0.0.1: 42 chars, target: Spanish
2024-11-09 23:45:12 [DEBUG] flask.app: Detected language: en for text: Hello, how are you?...
2024-11-09 23:45:13 [INFO] flask.app: Translation saved to database (ID: 15)
2024-11-09 23:45:13 [INFO] flask.app: Translation successful: en -> Spanish
```

### Rate Limit Exceeded
```
2024-11-09 23:46:00 [WARNING] flask.app: Rate limit exceeded for IP: 127.0.0.1
```

### Error with Stack Trace
```
2024-11-09 23:47:00 [ERROR] flask.app: Translation error from 127.0.0.1: Connection timeout
Traceback (most recent call last):
  File "app.py", line 293, in translate
    translated_text = translate_text(text, target_lang)
  ...
```

### Audio Transcription
```
2024-11-09 23:48:00 [INFO] flask.app: Audio upload from 127.0.0.1: recording.webm, target: English
2024-11-09 23:48:00 [DEBUG] flask.app: Starting audio transcription: /tmp/recording.webm
2024-11-09 23:48:01 [DEBUG] flask.app: Converting audio format: /tmp/recording.webm
2024-11-09 23:48:02 [INFO] flask.app: Audio transcribed successfully: 25 chars
2024-11-09 23:48:03 [INFO] flask.app: Audio translation saved (ID: 16)
```

---

## 🔍 Viewing Logs

### View Recent Logs
```bash
tail -f logs/translation_app.log
```

### Search for Errors
```bash
grep "ERROR" logs/translation_app.log
```

### Search by IP Address
```bash
grep "127.0.0.1" logs/translation_app.log
```

### Count Translations
```bash
grep "Translation successful" logs/translation_app.log | wc -l
```

### View Last 100 Lines
```bash
tail -100 logs/translation_app.log
```

---

## 🛠️ Troubleshooting

### Logs Not Appearing

1. **Check log directory exists:**
   ```bash
   ls -la logs/
   ```

2. **Check file permissions:**
   ```bash
   chmod 755 logs/
   chmod 644 logs/translation_app.log
   ```

3. **Check environment variable:**
   ```bash
   echo $LOG_LEVEL
   ```

### Log File Too Large

Logs are automatically rotated, but you can manually clean old logs:

```bash
# Keep only last 5 log files
cd logs/
ls -t translation_app.log* | tail -n +6 | xargs rm -f
```

### No Logs in Production

Make sure:
- `LOG_LEVEL` environment variable is set
- `logs/` directory is writable
- App has permissions to create files

---

## 🔒 Security Considerations

### What's NOT Logged

- **Passwords** - Database passwords are never logged
- **Full text content** - Only first 50 characters in DEBUG mode
- **Sensitive user data** - Only metadata is logged

### What IS Logged

- IP addresses (for rate limiting and security)
- Request metadata (file names, sizes, languages)
- Error messages and stack traces
- Database operation IDs

### Log File Security

- Log files are excluded from git (`.gitignore`)
- Log files should have restricted permissions in production:
  ```bash
  chmod 600 logs/translation_app.log
  ```

---

## 📈 Monitoring Recommendations

### Production Monitoring

1. **Set up log aggregation:**
   - Use services like Loggly, Papertrail, or CloudWatch
   - Or use `rsyslog` for centralized logging

2. **Monitor error rates:**
   ```bash
   grep -c "ERROR" logs/translation_app.log
   ```

3. **Track translation volume:**
   ```bash
   grep -c "Translation successful" logs/translation_app.log
   ```

4. **Monitor rate limit hits:**
   ```bash
   grep -c "Rate limit exceeded" logs/translation_app.log
   ```

---

## 🎛️ Advanced Configuration

### Custom Log Format

To change the log format, edit `app.py`:

```python
log_format = logging.Formatter(
    '%(asctime)s [%(levelname)s] %(name)s: %(message)s [%(pathname)s:%(lineno)d]'
)
```

### Add More Handlers

You can add additional handlers (e.g., email on errors):

```python
from logging.handlers import SMTPHandler

mail_handler = SMTPHandler(
    mailhost='smtp.example.com',
    fromaddr='app@example.com',
    toaddrs=['admin@example.com'],
    subject='Translation App Error'
)
mail_handler.setLevel(logging.ERROR)
app.logger.addHandler(mail_handler)
```

---

## ✅ Checklist

- [x] Logging configured with file and console handlers
- [x] Log rotation enabled (10MB, 10 backups)
- [x] All routes log important events
- [x] Errors logged with stack traces
- [x] Rate limits logged
- [x] Database operations logged
- [x] Log level configurable via environment variable
- [x] Logs directory excluded from git

---

## 📚 Related Files

- `app.py` - Main application with logging configuration
- `.gitignore` - Excludes `logs/` directory
- `PRE_DEPLOYMENT_CHECKLIST.md` - Deployment checklist

---

**Logging is now fully implemented and ready for production use!** 🎉

