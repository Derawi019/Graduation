let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let currentTtsUrl = null;
let realtimeEnabled = false;
let realtimeTimeout = null;
let isRealtimeTranslating = false;

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Stop recording if switching tabs
    if (isRecording) {
        stopRecording();
    }
    
    // Load history when history tab is clicked
    if (tabName === 'history') {
        loadHistory();
    }
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('results').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
    document.getElementById('error').textContent = message;
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
    hideLoading();
}

let currentHistoryId = null;

function showResults(data) {
    document.getElementById('original-text').textContent = data.original_text;
    document.getElementById('detected-lang').textContent = data.detected_language;
    document.getElementById('translated-text').textContent = data.translated_text;
    document.getElementById('target-lang-display').textContent = data.target_language;
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    hideLoading();
    
    originalTranslatedText = data.translated_text;  // حفظ النص المترجم الأصلي
    summarizedText = ""; 
    // Store current history ID if available
    currentHistoryId = data.history_id || null;
    updateResultFavoriteButton();
    
    // If history tab is active, refresh it to show new translation
    const historyTab = document.getElementById('history-tab');
    if (historyTab && historyTab.classList.contains('active')) {
        loadHistory();
    }
    
    // Trigger chatbot if available (non-invasive)
    if (typeof window.initChatbot === 'function') {
        window.initChatbot(data.original_text, data.translated_text);
    }
}

function updateResultFavoriteButton() {
    const btn = document.getElementById('result-favorite-btn');
    if (!btn) return;
    
    if (currentHistoryId) {
        const item = allHistory.find(h => h.id === currentHistoryId);
        if (item) {
            const isFavorite = item.is_favorite || false;
            btn.textContent = isFavorite ? '⭐' : '☆';
            btn.classList.toggle('favorite-active', isFavorite);
            btn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
        }
    } else {
        btn.textContent = '☆';
        btn.classList.remove('favorite-active');
        btn.title = 'Add to favorites';
    }
}

async function toggleCurrentFavorite() {
    if (!currentHistoryId) {
        showError('No translation to favorite');
        return;
    }
    await toggleFavorite(currentHistoryId);
    updateResultFavoriteButton();
}

function toggleRealtime() {
    const checkbox = document.getElementById('realtime-toggle');
    realtimeEnabled = checkbox.checked;
    
    if (realtimeEnabled) {
        // If there's text, translate it immediately
        const text = document.getElementById('text-input').value.trim();
        if (text) {
            handleTextInput();
        }
    } else {
        // Clear any pending real-time translation
        if (realtimeTimeout) {
            clearTimeout(realtimeTimeout);
            realtimeTimeout = null;
        }
        hideRealtimeStatus();
    }
}

function handleTextInput() {
    const text = document.getElementById('text-input').value.trim();
    
    // Clear previous timeout
    if (realtimeTimeout) {
        clearTimeout(realtimeTimeout);
    }
    
    // If real-time is disabled or text is empty, do nothing
    if (!realtimeEnabled || !text) {
        hideRealtimeStatus();
        return;
    }
    
    // Show "typing..." status
    showRealtimeStatus('Typing...');
    
    // Debounce: wait 800ms after user stops typing
    realtimeTimeout = setTimeout(() => {
        translateTextRealtime();
    }, 800);
}

async function translateTextRealtime() {
    const text = document.getElementById('text-input').value.trim();
    const targetLang = document.getElementById('target_lang').value;
    
    if (!text || isRealtimeTranslating) {
        return;
    }
    
    isRealtimeTranslating = true;
    showRealtimeStatus('Translating...');
    
    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                target_lang: targetLang
            })
        });
        
            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 429) {
                    showRealtimeStatus('Rate limit exceeded', true);
                } else {
                    showRealtimeStatus('Error', true);
                }
                setTimeout(() => hideRealtimeStatus(), 2000);
                return;
            }
        
        showResults(data);
        showRealtimeStatus('Translated!', false);
        setTimeout(() => hideRealtimeStatus(), 2000);
    } catch (error) {
        showRealtimeStatus('Network error', true);
        setTimeout(() => hideRealtimeStatus(), 2000);
    } finally {
        isRealtimeTranslating = false;
    }
}

function showRealtimeStatus(message, isError = false) {
    const status = document.getElementById('realtime-status');
    status.textContent = message;
    status.classList.remove('hidden');
    status.classList.toggle('error', isError);
}

function hideRealtimeStatus() {
    const status = document.getElementById('realtime-status');
    status.classList.add('hidden');
    status.classList.remove('error');
}

function handleLanguageChange() {
    // If real-time is enabled and there's text, translate it
    if (realtimeEnabled) {
        const text = document.getElementById('text-input').value.trim();
        if (text) {
            // Clear any pending timeout and translate immediately
            if (realtimeTimeout) {
                clearTimeout(realtimeTimeout);
            }
            translateTextRealtime();
        }
    }
}

async function translateText() {
    const text = document.getElementById('text-input').value.trim();
    const targetLang = document.getElementById('target_lang').value;
    
    if (!text) {
        showError('Please enter some text to translate');
        return;
    }
    
    // Clear any pending real-time translation
    if (realtimeTimeout) {
        clearTimeout(realtimeTimeout);
        realtimeTimeout = null;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                target_lang: targetLang
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Check for rate limit error (429)
            if (response.status === 429) {
                showError(data.error || 'Too many requests. Please wait a moment before trying again.');
            } else {
                showError(data.error || 'Translation failed');
            }
            return;
        }
        
        showResults(data);
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function uploadTextFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const targetLang = document.getElementById('target_lang').value;
    
    if (!file) {
        return;
    }
    
    showLoading();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_lang', targetLang);
    
    try {
        const response = await fetch('/upload_text_file', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 429) {
                showError(data.error || 'Too many file uploads. Please wait a moment before trying again.');
            } else {
                showError(data.error || 'File upload failed');
            }
            return;
        }
        
        showResults(data);
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function uploadAudioFile() {
    const audioInput = document.getElementById('audio-input');
    const file = audioInput.files[0];
    const targetLang = document.getElementById('target_lang').value;
    
    if (!file) {
        return;
    }
    
    showLoading();
    
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('target_lang', targetLang);
    
    try {
        const response = await fetch('/upload_audio', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 429) {
                showError(data.error || 'Too many audio uploads. Please wait a moment before trying again.');
            } else {
                showError(data.error || 'Audio upload failed');
            }
            return;
        }
        
        showResults(data);
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function toggleRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Determine the best audio format supported by the browser
        // Prefer WebM over MP4 for browser recordings - MP4 can have incomplete moov atom issues
        let mimeType = 'audio/webm';
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
            mimeType = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            // Only use MP4 if WebM/OGG are not available
            // Note: MP4 from MediaRecorder can sometimes be incomplete
            mimeType = 'audio/mp4';
        }
        
        mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = async () => {
            // Use the actual MIME type from MediaRecorder
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            await sendAudioBlob(audioBlob, mimeType);
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        isRecording = true;
        document.getElementById('record-btn').textContent = '⏹ Stop Recording';
        document.getElementById('record-btn').classList.add('recording');
        document.getElementById('recording-status').textContent = 'Recording... Click stop when finished.';
    } catch (error) {
        showError('Error accessing microphone: ' + error.message);
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        document.getElementById('record-btn').textContent = '🎤 Start Recording';
        document.getElementById('record-btn').classList.remove('recording');
        document.getElementById('recording-status').textContent = 'Processing audio...';
    }
}

async function sendAudioBlob(audioBlob, mimeType) {
    const targetLang = document.getElementById('target_lang').value;
    
    showLoading();
    
    // Determine file extension based on MIME type
    let extension = 'webm';
    if (mimeType.includes('webm')) {
        extension = 'webm';
    } else if (mimeType.includes('ogg')) {
        extension = 'ogg';
    } else if (mimeType.includes('mp4')) {
        extension = 'mp4';
    } else if (mimeType.includes('wav')) {
        extension = 'wav';
    }
    
    const formData = new FormData();
    formData.append('audio', audioBlob, `recording.${extension}`);
    formData.append('target_lang', targetLang);
    
    try {
        const response = await fetch('/upload_audio', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Audio processing failed');
            document.getElementById('recording-status').textContent = '';
            return;
        }
        
        document.getElementById('recording-status').textContent = '';
        showResults(data);
    } catch (error) {
        showError('Network error: ' + error.message);
        document.getElementById('recording-status').textContent = '';
    }
}

function copyTranslatedText() {
    const translatedText = document.getElementById('translated-text').textContent;
    navigator.clipboard.writeText(translatedText).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        showError('Failed to copy text');
    });
}

function copyOriginalText() {
    const originalText = document.getElementById('original-text').textContent;
    navigator.clipboard.writeText(originalText).then(() => {
        const copyBtn = document.querySelector('.copy-original-btn');
        const originalBtnText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalBtnText;
        }, 2000);
    }).catch(err => {
        showError('Failed to copy text');
    });
}

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
        
        // Display statistics in an alert (we'll improve this later)
        alert(`Text Statistics:\n\nWord Count: ${data.word_count}\nCharacter Count: ${data.character_count}\nCharacters (no spaces): ${data.character_count_no_spaces}\nSentences: ${data.sentence_count}\nAverage Word Length: ${data.average_word_length.toFixed(2)} characters`);
        hideLoading();
    } catch (error) {
        showError('Network error: ' + error.message);
        hideLoading();
    }
}

let allHistory = [];
let showFavoritesOnly = false;

async function loadHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '<p>Loading history...</p>';
    
    try {
        const response = await fetch('/history?limit=100');
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Failed to load history');
            return;
        }
        
        if (data.history.length === 0) {
            historyList.innerHTML = '<p class="history-empty">No translations yet. Start translating to see your history!</p>';
            allHistory = [];
            return;
        }
        
        allHistory = data.history;
        filterHistory();
        // Update result favorite button if viewing a translation
        if (currentHistoryId) {
            updateResultFavoriteButton();
        }
    } catch (error) {
        showError('Network error: ' + error.message);
        historyList.innerHTML = '<p class="history-empty">Error loading history</p>';
        allHistory = [];
    }
}

function displayHistory(history) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="history-empty">No translations found.</p>';
        return;
    }
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleString();
        const isFavorite = item.is_favorite || false;
        const starIcon = isFavorite ? '⭐' : '☆';
        const starClass = isFavorite ? 'favorite-active' : '';
        
        historyItem.innerHTML = `
            <div class="history-item-header">
                <div class="history-header-left">
                    <button onclick="toggleFavorite(${item.id})" class="favorite-btn ${starClass}" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                        ${starIcon}
                    </button>
                    <span class="history-date">${formattedDate}</span>
                </div>
                <button onclick="deleteHistoryItem(${item.id})" class="delete-history-btn">🗑️</button>
            </div>
            <div class="history-item-content">
                <div class="history-original">
                    <strong>Original (${item.detected_language}):</strong>
                    <p>${item.original_text.substring(0, 100)}${item.original_text.length > 100 ? '...' : ''}</p>
                </div>
                <div class="history-translated">
                    <strong>Translated (${item.target_language}):</strong>
                    <p>${item.translated_text.substring(0, 100)}${item.translated_text.length > 100 ? '...' : ''}</p>
                </div>
            </div>
            <button onclick="loadHistoryItem(${item.id})" class="view-history-btn">View Full Translation</button>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function filterHistory() {
    const searchTerm = document.getElementById('history-search').value.toLowerCase();
    let filtered = allHistory;
    
    // Filter by favorites if enabled
    if (showFavoritesOnly) {
        filtered = filtered.filter(item => item.is_favorite === true);
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(item => {
            return item.original_text.toLowerCase().includes(searchTerm) ||
                   item.translated_text.toLowerCase().includes(searchTerm) ||
                   item.detected_language.toLowerCase().includes(searchTerm) ||
                   item.target_language.toLowerCase().includes(searchTerm);
        });
    }
    
    displayHistory(filtered);
}

function toggleFavoritesFilter() {
    showFavoritesOnly = !showFavoritesOnly;
    const btn = document.getElementById('favorites-filter-btn');
    if (showFavoritesOnly) {
        btn.classList.add('active');
        btn.textContent = '⭐';
        btn.title = 'Show all translations';
    } else {
        btn.classList.remove('active');
        btn.textContent = '☆';
        btn.title = 'Show only favorites';
    }
    filterHistory();
}

async function toggleFavorite(id) {
    try {
        const response = await fetch(`/history/${id}/favorite`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Failed to toggle favorite');
            return;
        }
        
        // Update the item in allHistory
        const item = allHistory.find(h => h.id === id);
        if (item) {
            item.is_favorite = data.is_favorite;
        }
        
        // Re-filter to update display
        filterHistory();
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function deleteHistoryItem(id) {
    if (!confirm('Are you sure you want to delete this translation?')) {
        return;
    }
    
    try {
        const response = await fetch(`/history/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Failed to delete');
            return;
        }
        
        // Reload history
        loadHistory();
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function clearHistory() {
    if (!confirm('Are you sure you want to clear all translation history? This cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch('/history/clear', {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Failed to clear history');
            return;
        }
        
        // Clear history display
        document.getElementById('history-list').innerHTML = '<p class="history-empty">No translations yet. Start translating to see your history!</p>';
        alert(`History cleared! Deleted ${data.deleted_count} translations.`);
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function loadHistoryItem(id) {
    try {
        const response = await fetch('/history?limit=100');
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Failed to load history');
            return;
        }
        
        const item = data.history.find(h => h.id === id);
        if (!item) {
            showError('Translation not found');
            return;
        }
        
        // Display in results section
        document.getElementById('original-text').textContent = item.original_text;
        document.getElementById('detected-lang').textContent = item.detected_language;
        document.getElementById('translated-text').textContent = item.translated_text;
        document.getElementById('target-lang-display').textContent = item.target_language;
        document.getElementById('results').classList.remove('hidden');
        
        // Switch to text tab to show results
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById('text-tab').classList.add('active');
        document.querySelectorAll('.tab-button')[0].classList.add('active');
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function translateBatch() {
    const batchInput = document.getElementById('batch-input');
    const texts = batchInput.value.split('\n').filter(text => text.trim());
    const targetLang = document.getElementById('target_lang').value;
    
    if (texts.length === 0) {
        showError('Please enter at least one text to translate');
        return;
    }
    
    if (texts.length > 50) {
        showError('Maximum 50 texts per batch');
        return;
    }
    
    showLoading();
    document.getElementById('batch-results').classList.add('hidden');
    
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
            hideLoading();
            return;
        }
        
        displayBatchResults(data);
        hideLoading();
    } catch (error) {
        showError('Network error: ' + error.message);
        hideLoading();
    }
}

function displayBatchResults(data) {
    const batchResults = document.getElementById('batch-results');
    batchResults.classList.remove('hidden');
    batchResults.innerHTML = `<h3>Batch Translation Results (${data.count} translations)</h3>`;
    
    data.results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'batch-result-item';
        resultItem.innerHTML = `
            <div class="batch-item-header">
                <span class="batch-item-number">#${index + 1}</span>
                <span class="batch-item-lang">${result.detected_language} → ${data.target_language}</span>
            </div>
            <div class="batch-item-content">
                <div class="batch-original">
                    <strong>Original:</strong>
                    <p>${result.original}</p>
                </div>
                <div class="batch-translated">
                    <strong>Translated:</strong>
                    <p>${result.translated}</p>
                </div>
            </div>
        `;
        batchResults.appendChild(resultItem);
    });
    
    // Refresh history if history tab is active
    const historyTab = document.getElementById('history-tab');
    if (historyTab && historyTab.classList.contains('active')) {
        loadHistory();
    }
}

async function exportTranslation(format) {
    const originalText = document.getElementById('original-text').textContent;
    const translatedText = document.getElementById('translated-text').textContent;
    const sourceLang = document.getElementById('detected-lang').textContent;
    const targetLang = document.getElementById('target-lang-display').textContent;
    
    if (!originalText || !translatedText) {
        showError('No translation to export');
        return;
    }
    
    try {
        const response = await fetch('/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                original_text: originalText,
                translated_text: translatedText,
                source_language: sourceLang,
                target_language: targetLang,
                format: format
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            showError(error.error || 'Export failed');
            return;
        }
        
        // Get the blob and create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `translation.${format}`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up after a short delay to ensure download starts
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function speakText(type) {
    const originalText = document.getElementById('original-text').textContent;
    const translatedText = document.getElementById('translated-text').textContent;
    const sourceLang = document.getElementById('detected-lang').textContent;
    const targetLang = document.getElementById('target-lang-display').textContent;

    const text = type === 'original' ? originalText : translatedText;
    const lang = type === 'original' ? sourceLang : targetLang;

    if (!text) {
        showError('No text available for text-to-speech');
        return;
    }

    try {
        const response = await fetch('/text_to_speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                lang: lang
            })
        });

        if (!response.ok) {
            const error = await response.json();
            showError(error.error || 'Text-to-speech failed');
            return;
        }

        const blob = await response.blob();
        const audio = document.getElementById('tts-audio');

        if (currentTtsUrl) {
            URL.revokeObjectURL(currentTtsUrl);
        }

        currentTtsUrl = URL.createObjectURL(blob);
        audio.src = currentTtsUrl;
        audio.style.display = 'block';
        audio.play();
    } catch (error) {
        showError('Network error: ' + error.message);
    }
}

async function uploadVideoFile() {
    const videoInput = document.getElementById('video-input');
    const file = videoInput.files[0];
    const targetLang = document.getElementById('target_lang').value;

    if (!file) {
        return;
    }

    showLoading();

    const formData = new FormData();
    formData.append('video', file);
    formData.append('target_lang', targetLang);

    try {
        const response = await fetch('/upload_video', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();  // حاول هنا تحليل الاستجابة على أنها JSON

        if (!response.ok) {
            // إذا كانت الاستجابة غير ناجحة
            console.log('Error: ', data); // أظهر محتوى الاستجابة في الكونسول
            showError(data.error || 'Video upload failed');
            return;
        }

        console.log('Response:', data);  // عرض البيانات المستلمة من الخادم في الكونسول
        showResults(data);
    } catch (error) {
        // في حالة حدوث خطأ في الشبكة أو مشكلة في الاتصال
        console.error('Error:', error);
        showError('Network error: ' + error.message);
    }
}
let originalTranslatedText = ""; // Store original translated text before summarization
let summarizedText = ""; // Store summarized text after summarization

// Function to summarize the text using AI
async function summarizeText() {
    const textToSummarize = document.getElementById('translated-text').innerText;
    const targetLang = document.getElementById('target_lang').value;

    if (!textToSummarize) {
        showError('No text to summarize');
        return;
    }

    // حفظ النص الأصلي المترجم قبل التلخيص
    originalTranslatedText = textToSummarize;

    // إخفاء زر AI Summarizer أثناء التلخيص
    document.getElementById('ai-summarizer-btn').style.display = 'none';

    // إظهار رسالة "Summarizing..." مباشرة في منطقة النص
    const translatedTextElement = document.getElementById('translated-text');
    translatedTextElement.innerText = 'Summarizing...';
    translatedTextElement.style.opacity = '0.6';
    translatedTextElement.style.fontStyle = 'italic';

    // إخفاء رسائل الخطأ إن وجدت
    document.getElementById('error').classList.add('hidden');

    try {
        const response = await fetch('/summarize_text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: textToSummarize, target_lang: targetLang })
        });

        const data = await response.json();

        if (response.ok) {
            // حفظ النص الملخص
            summarizedText = data.summarized_text;
            
            // عرض النص الملخص
            translatedTextElement.innerText = summarizedText;
            translatedTextElement.style.opacity = '1';
            translatedTextElement.style.fontStyle = 'normal';

            // إظهار أزرار التبديل بين النص الأصلي والملخص
            document.getElementById('show-original-btn').style.display = 'inline-block';
            document.getElementById('show-summarized-btn').style.display = 'inline-block';
        } else {
            // في حالة الخطأ، استعادة النص الأصلي
            translatedTextElement.innerText = originalTranslatedText;
            translatedTextElement.style.opacity = '1';
            translatedTextElement.style.fontStyle = 'normal';
            showError(data.error || 'Summarization failed');
            
            // إعادة إظهار زر AI Summarizer
            document.getElementById('ai-summarizer-btn').style.display = 'inline-block';
        }
    } catch (error) {
        // في حالة خطأ الشبكة، استعادة النص الأصلي
        translatedTextElement.innerText = originalTranslatedText;
        translatedTextElement.style.opacity = '1';
        translatedTextElement.style.fontStyle = 'normal';
        showError('Network error: ' + error.message);
        
        // إعادة إظهار زر AI Summarizer
        document.getElementById('ai-summarizer-btn').style.display = 'inline-block';
    }
}

// Function to show the original translated text
function showOriginalText() {
    if (!originalTranslatedText) {
        showError('No original translated text available');
        return;
    }
    console.log("Showing original translated text");
    document.getElementById('translated-text').innerText = originalTranslatedText;
    document.getElementById('translated-text').style.opacity = '1';
    document.getElementById('translated-text').style.fontStyle = 'normal';
}

// Function to show the summarized text
function showSummarizedText() {
    if (!summarizedText) {
        showError('No summarized text available. Please summarize first.');
        return;
    }
    console.log("Showing summarized text");
    document.getElementById('translated-text').innerText = summarizedText;
    document.getElementById('translated-text').style.opacity = '1';
    document.getElementById('translated-text').style.fontStyle = 'normal';
}

// Function to show an error message
function showError(message) {
    document.getElementById('error').textContent = message;
    document.getElementById('error').classList.remove('hidden');
}
async function sendChatbotMessage() {
    const userInput = document.getElementById('chatbot-input').value;

    // إرسال النص إلى الـ Backend
    const response = await fetch('/api/chatbot/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            question: userInput
        })
    });

    const data = await response.json();

    if (data.error) {
        alert(data.error);
    } else {
        const chatbotMessages = document.getElementById('chatbot-messages');
        chatbotMessages.innerHTML += `<div class="chatbot-message chatbot-user">${userInput}</div>`;
        chatbotMessages.innerHTML += `<div class="chatbot-message chatbot-bot">${data.response}</div>`;
    }
}
