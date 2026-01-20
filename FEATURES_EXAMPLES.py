"""
Example Feature Implementations
These are examples of how to add new features to the translation app.
Copy and modify these as needed.
"""

from flask import Flask, request, jsonify, Response
from datetime import datetime
import json
import io
import csv
import base64

# ============================================================================
# Example 1: Batch Translation
# ============================================================================

@app.route('/translate_batch', methods=['POST'])
def translate_batch():
    """Translate multiple texts at once"""
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        target_lang = data.get('target_lang', 'English')
        
        if not texts or not isinstance(texts, list):
            return jsonify({'error': 'Please provide a list of texts'}), 400
        
        results = []
        for text in texts:
            if not text.strip():
                continue
            detected_lang = detect_language(text)
            translated_text = translate_text(text, target_lang)
            results.append({
                'original': text,
                'detected_language': detected_lang,
                'translated': translated_text
            })
        
        return jsonify({
            'target_language': target_lang,
            'count': len(results),
            'results': results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Example 2: Translation History (In-Memory)
# ============================================================================

translation_history = []

@app.route('/translate', methods=['POST'])
def translate_with_history():
    """Translate text and save to history"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        target_lang = data.get('target_lang', 'English')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        detected_lang = detect_language(text)
        translated_text = translate_text(text, target_lang)
        
        # Save to history
        history_entry = {
            'id': len(translation_history) + 1,
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
            'translated_text': translated_text,
            'history_id': history_entry['id']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    """Get translation history"""
    limit = request.args.get('limit', 50, type=int)
    return jsonify({
        'history': translation_history[-limit:],
        'total': len(translation_history)
    })

@app.route('/history/<int:history_id>', methods=['DELETE'])
def delete_history_item(history_id):
    """Delete a specific history item"""
    global translation_history
    translation_history = [h for h in translation_history if h['id'] != history_id]
    return jsonify({'message': 'Deleted', 'id': history_id})


# ============================================================================
# Example 3: Export Translations
# ============================================================================

@app.route('/export', methods=['POST'])
def export_translation():
    """Export translation in different formats"""
    try:
        data = request.get_json()
        original = data.get('original_text', '')
        translated = data.get('translated_text', '')
        format_type = data.get('format', 'txt')  # txt, json, csv
        
        if format_type == 'txt':
            content = f"Original Text:\n{original}\n\nTranslated Text:\n{translated}"
            mimetype = 'text/plain'
            filename = 'translation.txt'
        elif format_type == 'json':
            content = json.dumps({
                'original': original,
                'translated': translated,
                'exported_at': datetime.now().isoformat()
            }, indent=2)
            mimetype = 'application/json'
            filename = 'translation.json'
        elif format_type == 'csv':
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(['Original', 'Translated'])
            writer.writerow([original, translated])
            content = output.getvalue()
            mimetype = 'text/csv'
            filename = 'translation.csv'
        else:
            return jsonify({'error': 'Invalid format. Use: txt, json, or csv'}), 400
        
        return Response(
            content,
            mimetype=mimetype,
            headers={'Content-Disposition': f'attachment; filename={filename}'}
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Example 4: Text Statistics
# ============================================================================

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
        paragraphs = text.count('\n\n') + 1
        
        return jsonify({
            'word_count': len(words),
            'character_count': characters,
            'character_count_no_spaces': characters_no_spaces,
            'sentence_count': sentences,
            'paragraph_count': paragraphs,
            'average_word_length': sum(len(word) for word in words) / len(words) if words else 0
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Example 5: Language Detection with Confidence
# ============================================================================

from langdetect import detect_langs

@app.route('/detect_language_detailed', methods=['POST'])
def detect_language_detailed():
    """Detect language with confidence scores"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Get all possible languages with confidence
        languages = detect_langs(text)
        
        result = {
            'primary_language': {
                'code': languages[0].lang,
                'name': LANGUAGES.get(languages[0].lang, 'Unknown'),
                'confidence': languages[0].prob
            },
            'all_possibilities': [
                {
                    'code': lang.lang,
                    'name': LANGUAGES.get(lang.lang, 'Unknown'),
                    'confidence': lang.prob
                }
                for lang in languages[:5]  # Top 5
            ]
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Example 6: Favorite Translations
# ============================================================================

favorites = []

@app.route('/favorites', methods=['GET'])
def get_favorites():
    """Get all favorite translations"""
    return jsonify({'favorites': favorites})

@app.route('/favorites', methods=['POST'])
def add_favorite():
    """Add a translation to favorites"""
    try:
        data = request.get_json()
        favorite = {
            'id': len(favorites) + 1,
            'original_text': data.get('original_text', ''),
            'translated_text': data.get('translated_text', ''),
            'source_lang': data.get('source_lang', ''),
            'target_lang': data.get('target_lang', ''),
            'created_at': datetime.now().isoformat()
        }
        favorites.append(favorite)
        return jsonify({'message': 'Added to favorites', 'favorite': favorite})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/favorites/<int:favorite_id>', methods=['DELETE'])
def remove_favorite(favorite_id):
    """Remove a favorite"""
    global favorites
    favorites = [f for f in favorites if f['id'] != favorite_id]
    return jsonify({'message': 'Removed from favorites', 'id': favorite_id})


# ============================================================================
# Example 7: Multiple Translation Services
# ============================================================================

from deep_translator import GoogleTranslator, MicrosoftTranslator

@app.route('/translate_multiple_services', methods=['POST'])
def translate_multiple_services():
    """Get translations from multiple services"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        target_lang = data.get('target_lang', 'English')
        services = data.get('services', ['google'])  # google, microsoft
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        source_lang = detect(text)
        target_code = LANG_CODES[target_lang]
        
        results = {}
        
        if 'google' in services:
            try:
                translator = GoogleTranslator(source=source_lang, target=target_code)
                results['google'] = translator.translate(text)
            except Exception as e:
                results['google'] = f'Error: {str(e)}'
        
        if 'microsoft' in services:
            try:
                # Note: Microsoft Translator requires API key
                # translator = MicrosoftTranslator(api_key='YOUR_KEY', source=source_lang, target=target_code)
                # results['microsoft'] = translator.translate(text)
                results['microsoft'] = 'Microsoft Translator requires API key'
            except Exception as e:
                results['microsoft'] = f'Error: {str(e)}'
        
        return jsonify({
            'original_text': text,
            'target_language': target_lang,
            'translations': results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Example 8: Translation Quality Check
# ============================================================================

def calculate_similarity(text1, text2):
    """Simple similarity calculation (Levenshtein distance based)"""
    # This is a simple example - use a proper library for production
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    
    if not words1 or not words2:
        return 0.0
    
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    return len(intersection) / len(union) if union else 0.0

@app.route('/translate_with_quality', methods=['POST'])
def translate_with_quality():
    """Translate and provide quality metrics"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        target_lang = data.get('target_lang', 'English')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        detected_lang = detect_language(text)
        translated_text = translate_text(text, target_lang)
        
        # Calculate quality metrics
        similarity = calculate_similarity(text, translated_text)
        word_count_original = len(text.split())
        word_count_translated = len(translated_text.split())
        length_ratio = word_count_translated / word_count_original if word_count_original > 0 else 0
        
        return jsonify({
            'original_text': text,
            'detected_language': detected_lang,
            'target_language': target_lang,
            'translated_text': translated_text,
            'quality_metrics': {
                'similarity_score': similarity,
                'word_count_original': word_count_original,
                'word_count_translated': word_count_translated,
                'length_ratio': length_ratio,
                'confidence': 'high' if similarity > 0.3 else 'medium' if similarity > 0.1 else 'low'
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

