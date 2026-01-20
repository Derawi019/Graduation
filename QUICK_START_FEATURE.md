# Quick Start: Adding Your First Feature

This guide shows you how to add a simple feature step-by-step.

## Example: Add Text Statistics Feature

This feature will show word count, character count, and other statistics about the translated text.

### Step 1: Add Backend Route

Open `app.py` and add this function before the `if __name__ == '__main__':` line:

```python
@app.route('/statistics', methods=['POST'])
def get_statistics():
    """Get statistics about the text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        words = text.split()
        characters = len(text)
        characters_no_spaces = len(text.replace(' ', ''))
        sentences = text.count('.') + text.count('!') + text.count('?')
        
        return jsonify({
            'word_count': len(words),
            'character_count': characters,
            'character_count_no_spaces': characters_no_spaces,
            'sentence_count': sentences,
            'average_word_length': sum(len(word) for word in words) / len(words) if words else 0
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### Step 2: Add Frontend Button

Open `templates/index.html` and add this button in the results section (after the copy button):

```html
<button onclick="showStatistics()" class="stats-btn">📊 Show Statistics</button>
```

### Step 3: Add JavaScript Function

Open `static/script.js` and add this function at the end:

```javascript
async function showStatistics() {
    const text = document.getElementById('translated-text').textContent;
    
    if (!text) {
        showError('No text to analyze');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/statistics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Failed to get statistics');
            return;
        }
        
        // Display statistics
        alert(`Word Count: ${data.word_count}\nCharacter Count: ${data.character_count}\nSentences: ${data.sentence_count}`);
        hideLoading();
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}
```

### Step 4: Add CSS Styling

Open `static/style.css` and add this at the end:

```css
.stats-btn {
    width: 100%;
    padding: 10px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 10px;
}

.stats-btn:hover {
    background: #2980b9;
}
```

### Step 5: Test the Feature

1. Restart your Flask app:
   ```bash
   python app.py
   ```

2. Open your browser and go to `http://localhost:5000`

3. Translate some text

4. Click the "📊 Show Statistics" button

5. You should see statistics about the translated text

## That's It!

You've successfully added your first feature. Now you can:

1. Modify the feature to show statistics in a better way (instead of alert)
2. Add more statistics (paragraphs, reading time, etc.)
3. Style it better
4. Add it to the original text as well

## Next Steps

- Read `UPGRADE_GUIDE.md` for more advanced features
- Check `FEATURES_EXAMPLES.py` for more example implementations
- Use `UPGRADE_CHECKLIST.md` when adding new features

## Common Modifications

### Show Statistics in a Modal Instead of Alert

Replace the alert in `showStatistics()` with:

```javascript
// Create modal
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
    <div class="modal-content">
        <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
        <h3>Text Statistics</h3>
        <p>Word Count: ${data.word_count}</p>
        <p>Character Count: ${data.character_count}</p>
        <p>Sentences: ${data.sentence_count}</p>
        <p>Average Word Length: ${data.average_word_length.toFixed(2)}</p>
    </div>
`;
document.body.appendChild(modal);
```

And add modal CSS:

```css
.modal {
    display: block;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
}

.modal-content {
    background-color: white;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
    border-radius: 6px;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover {
    color: black;
}
```

### Add Statistics to Results Display

Modify `showResults()` function to include statistics:

```javascript
function showResults(data) {
    // ... existing code ...
    
    // Get and display statistics
    fetch('/statistics', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: data.translated_text})
    })
    .then(res => res.json())
    .then(stats => {
        document.getElementById('stats-display').innerHTML = `
            <p>Words: ${stats.word_count} | Characters: ${stats.character_count}</p>
        `;
    });
}
```

And add a stats display element in HTML:

```html
<div id="stats-display" class="stats-display"></div>
```

