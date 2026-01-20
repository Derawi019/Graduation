# Upgrade Guide - Adding New Features

## Table of Contents
1. [Code Structure](#code-structure)
2. [Adding New Languages](#adding-new-languages)
3. [Adding New Features](#adding-new-features)
4. [Backend Routes](#backend-routes)
5. [Frontend Updates](#frontend-updates)
6. [Example Features](#example-features)

## Code Structure

### Current Structure
```
Translation app/
├── app.py              # Main Flask application
├── templates/
│   └── index.html      # Frontend HTML
├── static/
│   ├── style.css       # Styling
│   └── script.js       # Frontend JavaScript
└── requirements.txt    # Python dependencies
```

## Adding New Languages

### Step 1: Update Language Mappings in `app.py`

Edit the `LANGUAGES` and `LANG_CODES` dictionaries:

```python
# Supported languages mapping
LANGUAGES = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'it': 'Italian',
    'ar': 'Arabic',
    'de': 'German',      # Add new language
    'pt': 'Portuguese',  # Add new language
    'ja': 'Japanese',    # Add new language
}

# Language code mapping for translation
LANG_CODES = {
    'English': 'en',
    'Spanish': 'es',
    'French': 'fr',
    'Italian': 'it',
    'Arabic': 'ar',
    'German': 'de',      # Add new language
    'Portuguese': 'pt',  # Add new language
    'Japanese': 'ja',    # Add new language
}
```

### Step 2: Update Frontend Dropdown

Edit `templates/index.html`:

```html
<select id="target_lang" name="target_lang">
    <option value="English">English</option>
    <option value="Spanish">Spanish</option>
    <option value="French">French</option>
    <option value="Italian">Italian</option>
    <option value="Arabic">Arabic</option>
    <option value="German">German</option>      <!-- Add new language -->
    <option value="Portuguese">Portuguese</option>  <!-- Add new language -->
    <option value="Japanese">Japanese</option>  <!-- Add new language -->
</select>
```

## Adding New Features

### Example 1: Add Batch Translation (Multiple Texts)

#### Backend (`app.py`)

Add a new route:

```python
@app.route('/translate_batch', methods=['POST'])
def translate_batch():
    try:
        data = request.get_json()
        texts = data.get('texts', [])  # List of texts
        target_lang = data.get('target_lang', 'English')
        
        if not texts:
            return jsonify({'error': 'No texts provided'}), 400
        
        results = []
        for text in texts:
            detected_lang = detect_language(text)
            translated_text = translate_text(text, target_lang)
            results.append({
                'original': text,
                'detected_language': detected_lang,
                'translated': translated_text
            })
        
        return jsonify({
            'target_language': target_lang,
            'results': results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

#### Frontend (`static/script.js`)

Add a function:

```javascript
async function translateBatch() {
    const texts = document.getElementById('batch-input').value
        .split('\n')
        .filter(text => text.trim());
    const targetLang = document.getElementById('target_lang').value;
    
    if (texts.length === 0) {
        showError('Please enter at least one text');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/translate_batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                texts: texts,
                target_lang: targetLang
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Batch translation failed');
            return;
        }
        
        // Display batch results
        displayBatchResults(data);
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}
```

### Example 2: Add Translation History

#### Backend (`app.py`)

Add storage (simple in-memory or use a database):

```python
# Simple in-memory storage (use database for production)
translation_history = []

@app.route('/translate', methods=['POST'])
def translate():
    # ... existing code ...
    
    # Save to history
    history_entry = {
        'original_text': text,
        'detected_language': detected_lang,
        'target_language': target_lang,
        'translated_text': translated_text,
        'timestamp': datetime.now().isoformat()
    }
    translation_history.append(history_entry)
    
    # Keep only last 100 translations
    if len(translation_history) > 100:
        translation_history.pop(0)
    
    return jsonify({
        'original_text': text,
        'detected_language': detected_lang,
        'target_language': target_lang,
        'translated_text': translated_text
    })

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify({'history': translation_history[-50:]})  # Last 50
```

### Example 3: Add Text-to-Speech (TTS)

#### Backend (`app.py`)

Install `gTTS` (Google Text-to-Speech):
```bash
pip install gtts
```

Add route:

```python
from gtts import gTTS
import io

@app.route('/text_to_speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.get_json()
        text = data.get('text', '')
        lang = data.get('lang', 'en')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Generate speech
        tts = gTTS(text=text, lang=lang, slow=False)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        # Return audio as base64
        import base64
        audio_base64 = base64.b64encode(audio_buffer.read()).decode()
        
        return jsonify({
            'audio': audio_base64,
            'format': 'mp3'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### Example 4: Add Export Functionality

#### Backend (`app.py`)

```python
@app.route('/export', methods=['POST'])
def export_translation():
    try:
        data = request.get_json()
        original = data.get('original_text', '')
        translated = data.get('translated_text', '')
        format_type = data.get('format', 'txt')  # txt, json, csv
        
        if format_type == 'txt':
            content = f"Original: {original}\n\nTranslated: {translated}"
            mimetype = 'text/plain'
        elif format_type == 'json':
            import json
            content = json.dumps({
                'original': original,
                'translated': translated
            }, indent=2)
            mimetype = 'application/json'
        elif format_type == 'csv':
            import csv
            import io
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(['Original', 'Translated'])
            writer.writerow([original, translated])
            content = output.getvalue()
            mimetype = 'text/csv'
        else:
            return jsonify({'error': 'Invalid format'}), 400
        
        from flask import Response
        return Response(
            content,
            mimetype=mimetype,
            headers={'Content-Disposition': f'attachment; filename=translation.{format_type}'}
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

## Backend Routes

### Adding a New Route

1. **Define the route function:**
```python
@app.route('/your_new_route', methods=['POST', 'GET'])
def your_new_function():
    try:
        # Get data from request
        if request.method == 'POST':
            data = request.get_json() or request.form
            # Process data
            result = process_data(data)
            return jsonify(result)
        else:
            # Handle GET request
            return jsonify({'message': 'Hello'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

2. **Add error handling:**
   - Always wrap in try-except
   - Return appropriate HTTP status codes
   - Provide meaningful error messages

## Frontend Updates

### Adding a New UI Element

1. **Update HTML** (`templates/index.html`):
```html
<div class="new-feature-section">
    <button id="new-feature-btn" onclick="newFeature()">New Feature</button>
</div>
```

2. **Add JavaScript** (`static/script.js`):
```javascript
async function newFeature() {
    showLoading();
    
    try {
        const response = await fetch('/your_new_route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Your data
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error);
            return;
        }
        
        // Handle success
        showResults(data);
    } catch (error) {
        showError('Error: ' + error.message);
    }
}
```

3. **Add CSS** (`static/style.css`):
```css
.new-feature-section {
    margin: 20px 0;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 6px;
}

#new-feature-btn {
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
```

## Example Features to Add

### 1. **Translation Quality Score**
   - Analyze translation confidence
   - Show similarity score

### 2. **Favorite Translations**
   - Save favorite translations
   - Quick access to saved translations

### 3. **Multiple Translation Services**
   - Switch between Google, DeepL, Microsoft Translator
   - Compare translations from different services

### 4. **Translation Memory**
   - Remember previous translations
   - Suggest translations for similar text

### 5. **Dark Mode**
   - Add theme switcher
   - Save user preference

### 6. **Keyboard Shortcuts**
   - Quick translate (Ctrl+Enter)
   - Copy translation (Ctrl+C)

### 7. **Real-time Translation**
   - Translate as user types
   - Debounce input

### 8. **Language Detection Confidence**
   - Show detection confidence score
   - Allow manual language selection

### 9. **Audio Playback Speed**
   - Control playback speed for audio
   - Pause/resume audio

### 10. **Translation Statistics**
    - Count words/characters
    - Show translation time
    - Track usage statistics

## Best Practices

### 1. **Code Organization**
   - Keep functions small and focused
   - Use meaningful variable names
   - Add comments for complex logic

### 2. **Error Handling**
   - Always handle errors gracefully
   - Provide user-friendly error messages
   - Log errors for debugging

### 3. **Security**
   - Validate user input
   - Sanitize file uploads
   - Limit file sizes
   - Use HTTPS in production

### 4. **Performance**
   - Cache translations when possible
   - Optimize database queries
   - Use async operations for long tasks

### 5. **Testing**
   - Test new features thoroughly
   - Test error cases
   - Test with different languages

## Updating Dependencies

### Add New Python Package

1. **Install package:**
```bash
source venv/bin/activate
pip install new-package-name
```

2. **Update requirements.txt:**
```bash
pip freeze > requirements.txt
```

3. **Update app.py:**
```python
from new_package import NewFeature
```

## Deployment Considerations

### For Production:

1. **Use Environment Variables:**
```python
import os
API_KEY = os.getenv('API_KEY', 'default_key')
```

2. **Add Database:**
   - Use SQLite for small apps
   - Use PostgreSQL for larger apps
   - Store translation history

3. **Add Logging:**
```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

4. **Add Rate Limiting:**
```python
from flask_limiter import Limiter
limiter = Limiter(app, key_func=get_remote_address)
```

5. **Add Caching:**
```python
from flask_caching import Cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
```

## Version Control

### Git Workflow:

1. **Create a branch for new features:**
```bash
git checkout -b feature/new-feature
```

2. **Commit changes:**
```bash
git add .
git commit -m "Add new feature: description"
```

3. **Merge to main:**
```bash
git checkout main
git merge feature/new-feature
```

## Need Help?

- Check Flask documentation: https://flask.palletsprojects.com/
- Check deep-translator docs: https://github.com/nidhaloff/deep-translator
- Check JavaScript MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript

