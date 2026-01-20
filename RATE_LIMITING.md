# Rate Limiting Configuration

## Overview
Rate limiting has been implemented to protect the application from abuse and ensure fair usage for all users. Limits are applied per IP address.

## Rate Limits by Endpoint

### Translation Endpoints
- **`/translate`** (POST): **10 requests per minute**
  - Main text translation endpoint
  - Most commonly used feature

- **`/translate_batch`** (POST): **3 requests per minute**
  - Batch translation (can process multiple texts)
  - Lower limit due to higher resource usage

### File Upload Endpoints
- **`/upload_text_file`** (POST): **5 requests per minute**
  - Text file upload and translation
  - Lower limit to prevent file upload abuse

- **`/upload_audio`** (POST): **5 requests per minute**
  - Audio file upload and transcription
  - Lower limit due to processing overhead

### History Endpoints
- **`/history`** (GET): **30 requests per minute**
  - Retrieve translation history
  - Higher limit as it's a read-only operation

- **`/history/<id>`** (DELETE): **10 requests per minute**
  - Delete a specific history item
  - Moderate limit for safety

- **`/history/clear`** (DELETE): **5 requests per minute**
  - Clear all history (destructive action)
  - Lower limit to prevent accidental mass deletion

- **`/history/<id>/favorite`** (POST): **20 requests per minute**
  - Toggle favorite status
  - Moderate limit for quick interactions

### Utility Endpoints
- **`/statistics`** (POST): **20 requests per minute**
  - Get text statistics (word count, etc.)
  - Moderate limit for quick operations

- **`/export`** (POST): **10 requests per minute**
  - Export translations (TXT, JSON, CSV)
  - Moderate limit to prevent excessive exports

## Global Limits
- **200 requests per day** (per IP)
- **50 requests per hour** (per IP)

These global limits apply to all endpoints combined.

## Error Handling

When a rate limit is exceeded:
- HTTP Status Code: **429 (Too Many Requests)**
- Error Response:
  ```json
  {
    "error": "Rate limit exceeded",
    "message": "You have made too many requests. Please wait a moment before trying again.",
    "retry_after": null
  }
  ```

## Frontend Handling

The frontend automatically detects rate limit errors (HTTP 429) and displays user-friendly error messages:
- Real-time translation: Shows "Rate limit exceeded" status
- Regular translation: Shows error message with retry suggestion
- File uploads: Shows specific message for file upload limits
- Audio uploads: Shows specific message for audio upload limits

## Testing Rate Limits

### Test Locally
1. Start the app: `python app.py`
2. Open browser: `http://localhost:5000`
3. Try to translate 11 times quickly
4. You should see a rate limit error on the 11th request

### Test with curl
```bash
# Test translation endpoint (should fail after 10 requests)
for i in {1..15}; do
  echo "Request $i:"
  curl -X POST http://localhost:5000/translate \
    -H "Content-Type: application/json" \
    -d '{"text":"Hello","target_lang":"Spanish"}'
  echo ""
  sleep 1
done
```

## Production Considerations

### Current Setup
- **Storage**: In-memory (resets on server restart)
- **Key Function**: IP address (`get_remote_address`)

### For Production (Recommended)
1. **Use Redis for storage** (persists across restarts):
   ```python
   limiter = Limiter(
       app=app,
       key_func=get_remote_address,
       storage_uri="redis://localhost:6379"
   )
   ```

2. **User-based rate limiting** (if you add authentication):
   ```python
   from flask_limiter.util import get_user_id
   
   limiter = Limiter(
       app=app,
       key_func=get_user_id,  # Rate limit per user instead of IP
       default_limits=["200 per day", "50 per hour"]
   )
   ```

3. **Different limits for authenticated users**:
   ```python
   @app.route('/translate', methods=['POST'])
   @limiter.limit("10 per minute", key_func=lambda: get_user_id() or get_remote_address())
   def translate():
       # Authenticated users get higher limits
       if current_user.is_authenticated:
           limiter.limit("50 per minute")
       # ...
   ```

## Adjusting Limits

To change rate limits, edit the `@limiter.limit()` decorator on each route:

```python
# Example: Increase translation limit to 20 per minute
@app.route('/translate', methods=['POST'])
@limiter.limit("20 per minute")
def translate():
    # ...
```

### Common Limit Formats
- `"10 per minute"` - 10 requests per minute
- `"50 per hour"` - 50 requests per hour
- `"200 per day"` - 200 requests per day
- `"1 per second"` - 1 request per second
- `"100 per 5 minutes"` - 100 requests per 5 minutes

## Monitoring

To monitor rate limit usage, you can add logging:

```python
@app.errorhandler(RateLimitExceeded)
def handle_rate_limit(e):
    # Log rate limit violations
    app.logger.warning(f"Rate limit exceeded: {request.remote_addr}")
    return jsonify({
        'error': 'Rate limit exceeded',
        'message': 'You have made too many requests. Please wait a moment before trying again.'
    }), 429
```

## Summary

✅ **All endpoints are protected** with appropriate rate limits
✅ **Error handling** is implemented on both backend and frontend
✅ **User-friendly messages** are displayed when limits are exceeded
✅ **Ready for production** (consider Redis for persistent storage)

