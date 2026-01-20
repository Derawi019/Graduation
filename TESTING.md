# Testing Guide - Translation App

## Step-by-Step Setup and Testing

### 1. Install Dependencies

Open Terminal and navigate to the project directory:

```bash
cd "/Users/mezan/Desktop/Translation app"
```

#### Option A: Using Virtual Environment (Recommended)

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt
```

#### Option B: Install Directly (Not Recommended)

```bash
pip3 install -r requirements.txt
```

#### Install ffmpeg (Required for Audio Processing)

```bash
# Using Homebrew
brew install ffmpeg

# Verify installation
ffmpeg -version
```

### 2. Run the Application

Make sure you're in the project directory and virtual environment is activated (if using one):

```bash
# If using virtual environment, activate it first
source venv/bin/activate

# Run the Flask app
python app.py
```

You should see output like:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### 3. Open the App in Browser

Open your web browser and navigate to:
```
http://localhost:5000
```

or

```
http://127.0.0.1:5000
```

## Testing Each Feature

### Test 1: Text Translation

1. **Select Target Language**: Choose a language from the dropdown (e.g., "Spanish")
2. **Click "Type Text" tab** (should be active by default)
3. **Enter text**: Type or paste some text in any language, for example:
   - English: "Hello, how are you today?"
   - French: "Bonjour, comment allez-vous?"
   - Spanish: "Hola, ¿cómo estás?"
4. **Click "Translate" button**
5. **Expected Result**: 
   - Original text displayed
   - Detected language shown
   - Translated text in the target language
   - Target language displayed

**Test Cases:**
- ✅ Translate English to Spanish
- ✅ Translate French to English
- ✅ Translate Spanish to Italian
- ✅ Translate Arabic to French

### Test 2: Text File Upload

1. **Create a test file**: Create a `.txt` file with some text
   ```bash
   echo "This is a test file for translation." > test.txt
   ```

2. **Select Target Language**: Choose a language from the dropdown

3. **Click "Upload Text File" tab**

4. **Click the upload area** and select your `.txt` file

5. **Expected Result**: 
   - File is automatically processed
   - Original text from file displayed
   - Detected language shown
   - Translated text displayed

**Test Cases:**
- ✅ Upload English text file, translate to Spanish
- ✅ Upload French text file, translate to English
- ✅ Upload a file with multiple sentences

### Test 3: Audio Recording

1. **Select Target Language**: Choose a language from the dropdown

2. **Click "Audio Input" tab**

3. **Click "🎤 Start Recording"**
   - Browser will ask for microphone permission (click "Allow")
   - Button changes to "⏹ Stop Recording"
   - Status shows "Recording..."

4. **Speak clearly** in any language (e.g., "Hello, this is a test recording")

5. **Click "⏹ Stop Recording"**

6. **Expected Result**:
   - Audio is processed
   - Transcribed text displayed as original text
   - Detected language shown
   - Translated text displayed

**Test Cases:**
- ✅ Record English speech, translate to Spanish
- ✅ Record Spanish speech, translate to English
- ✅ Record short phrases and long sentences

### Test 4: Audio File Upload

1. **Prepare an audio file**: 
   - Use a `.wav`, `.mp3`, or other audio format
   - Make sure it contains clear speech

2. **Select Target Language**: Choose a language from the dropdown

3. **Click "Audio Input" tab**

4. **Click "📁 Upload Audio File"**

5. **Select your audio file**

6. **Expected Result**:
   - Audio file is processed
   - Transcribed text displayed
   - Detected language shown
   - Translated text displayed

**Test Cases:**
- ✅ Upload WAV file with English speech
- ✅ Upload MP3 file with Spanish speech
- ✅ Test with different audio formats

## Troubleshooting

### Issue: "Module not found" error

**Solution:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Microphone not working

**Solution:**
- Check browser permissions: Settings > Privacy > Microphone
- Make sure you clicked "Allow" when prompted
- Try a different browser (Chrome, Firefox, Safari)

### Issue: Audio transcription fails

**Solution:**
- Ensure audio is clear and not too noisy
- Speak slowly and clearly
- Check internet connection (requires Google Speech Recognition API)
- Make sure ffmpeg is installed: `brew install ffmpeg`

### Issue: Translation fails

**Solution:**
- Check internet connection
- Wait a moment and try again (rate limits may apply)
- Ensure text is not empty

### Issue: Port 5000 already in use

**Solution:**
```bash
# Find and kill the process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change the port in app.py (last line)
app.run(debug=True, port=5001)
```

## Quick Test Checklist

- [ ] App starts without errors
- [ ] Homepage loads correctly
- [ ] Language dropdown works
- [ ] Text translation works
- [ ] Text file upload works
- [ ] Audio recording works (with microphone permission)
- [ ] Audio file upload works
- [ ] Results display correctly
- [ ] Copy button works
- [ ] Error messages display properly

## Expected Behavior

- **Language Detection**: Should automatically detect the source language
- **Translation**: Should translate to the selected target language
- **UI Updates**: Should show loading state, then results or errors
- **File Handling**: Should handle .txt files and common audio formats
- **Error Handling**: Should display user-friendly error messages

## Notes

- First-time audio transcription may take a few seconds
- Translation speed depends on internet connection
- Google Speech Recognition has rate limits for free usage
- Some languages may have better recognition accuracy than others

