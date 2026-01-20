# 🏥 Health Check Endpoint

## Overview

The Translation App includes a health check endpoint (`/health`) that deployment platforms and monitoring tools can use to verify the application is running correctly.

---

## 🚀 Endpoint

**URL:** `GET /health`

**Purpose:** Check application health and service status

---

## 📋 Response Format

### Healthy Response (200 OK)

```json
{
  "status": "healthy",
  "timestamp": "2025-11-10T12:13:11.292299",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database connection successful"
    },
    "sentry": {
      "status": "enabled",
      "message": "Sentry error tracking enabled"
    }
  }
}
```

### Unhealthy Response (503 Service Unavailable)

```json
{
  "status": "unhealthy",
  "timestamp": "2025-11-10T12:13:11.292299",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "unhealthy",
      "message": "Database connection failed: [error details]"
    },
    "sentry": {
      "status": "enabled",
      "message": "Sentry error tracking enabled"
    }
  }
}
```

---

## ✅ Health Checks Performed

### 1. Database Connectivity
- **Check:** Executes `SELECT 1` query
- **Status:** `healthy` or `unhealthy`
- **Impact:** If database is unhealthy, overall status is `unhealthy` (503)

### 2. Sentry Status
- **Check:** Verifies if Sentry DSN is configured
- **Status:** `enabled` or `disabled`
- **Impact:** Does not affect overall health status (informational only)

---

## 🔧 Usage

### Test Locally

```bash
# Basic check
curl http://localhost:5000/health

# Pretty print JSON
curl http://localhost:5000/health | python -m json.tool

# Check HTTP status code
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:5000/health
# Should return: 200 (healthy) or 503 (unhealthy)
```

### In Browser

Visit: `http://localhost:5000/health`

---

## 🚢 Deployment Platform Integration

### Render

Render automatically checks `/health` endpoint. No configuration needed.

### Heroku

Heroku checks the root endpoint by default. To use `/health`:

1. Go to your app settings
2. Add config var: `HEALTH_CHECK_PATH=/health`
3. Or use a Procfile with health check:
   ```
   web: gunicorn app:app --bind 0.0.0.0:$PORT
   ```

### Railway

Railway automatically detects health checks. The `/health` endpoint will be used automatically.

### Docker

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1
```

### Kubernetes

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 5000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 5000
  initialDelaySeconds: 5
  periodSeconds: 5
```

---

## 📊 Monitoring Integration

### Uptime Monitoring Services

Configure these services to check `/health`:

- **UptimeRobot:** Add monitor with URL `https://yourapp.com/health`
- **Pingdom:** Create HTTP check for `/health`
- **StatusCake:** Add uptime test for `/health`
- **Datadog:** Configure HTTP check for `/health`

### Alerting

Set up alerts based on HTTP status code:
- **200:** Healthy ✅
- **503:** Unhealthy ❌ (trigger alert)

---

## 🔍 Troubleshooting

### Health Check Returns 503

1. **Check Database:**
   ```bash
   # Verify database is running
   # Check connection string in .env
   grep DATABASE_URL .env
   ```

2. **Check Logs:**
   ```bash
   tail -f logs/translation_app.log | grep -i health
   ```

3. **Test Database Manually:**
   ```python
   from app import app, db
   with app.app_context():
       db.session.execute(text('SELECT 1'))
   ```

### Health Check Returns 200 but Database is Down

The health check performs a real database query. If it returns 200, the database is definitely connected.

---

## 🎯 Best Practices

1. **Don't Rate Limit:**
   - Health checks should not be rate limited
   - They're called frequently by monitoring tools

2. **Keep It Fast:**
   - Health checks should complete quickly (< 1 second)
   - Don't perform heavy operations

3. **Don't Log Every Check:**
   - Only log failures, not successes
   - Prevents log flooding

4. **Use for Monitoring:**
   - Set up alerts for 503 responses
   - Monitor response time

---

## 📝 Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Overall health: `healthy` or `unhealthy` |
| `timestamp` | string | ISO 8601 timestamp of check |
| `version` | string | Application version |
| `checks` | object | Individual service checks |
| `checks.database` | object | Database connectivity check |
| `checks.database.status` | string | `healthy` or `unhealthy` |
| `checks.database.message` | string | Status message |
| `checks.sentry` | object | Sentry configuration check |
| `checks.sentry.status` | string | `enabled` or `disabled` |
| `checks.sentry.message` | string | Status message |

---

## ✅ Checklist

- [x] Health check endpoint created
- [x] Database connectivity check
- [x] Sentry status check
- [x] Returns appropriate HTTP status codes
- [x] JSON response format
- [x] Documentation created

---

**Health check endpoint is ready for deployment!** 🎉

