# Translation App

A simple web application for translating text and audio input into one of five languages: English, Spanish, French, Italian, or Arabic.

## Features

- **Text Translation**: Type text manually and translate it
- **File Upload**: Upload a `.txt` file for translation
- **Audio Input**: Record audio or upload an audio file for transcription and translation
- **Language Detection**: Automatically detects the source language
- **Multiple Target Languages**: Translate to English, Spanish, French, Italian, or Arabic

## Requirements

- Python 3.7 or higher
- macOS (tested on macOS 12+)
- Internet connection (for translation and speech recognition services)
- ffmpeg (for audio format conversion) - **Easily installed without Homebrew using the included script!**

## Installation

1. **Navigate to the project directory**:
   ```bash
   cd "/Users/mezan/Desktop/Translation app"
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Install ffmpeg (without Homebrew - fast and easy!)**:
   ```bash
   bash install_ffmpeg.sh
   ```
   This script downloads and installs ffmpeg locally in the project's `bin/` directory. No Homebrew needed!

## Running the Application

1. **Activate the virtual environment** (if you created one):
   ```bash
   source venv/bin/activate
   ```

2. **Run the Flask app**:
   ```bash
   python app.py
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### Text Translation
1. Select your target language from the dropdown
2. Click on the "Type Text" tab
3. Enter or paste your text in the text area
4. Click "Translate"
5. View the original text, detected language, and translated text

### File Upload
1. Select your target language from the dropdown
2. Click on the "Upload Text File" tab
3. Click to upload a `.txt` file
4. The file will be automatically processed and translated

### Audio Input
1. Select your target language from the dropdown
2. Click on the "Audio Input" tab
3. Choose one of the following:
   - **Record Audio**: Click "Start Recording", speak, then click "Stop Recording"
   - **Upload Audio**: Click "Upload Audio File" and select an audio file
4. The audio will be transcribed and translated automatically

## Notes

- **Translation Service**: Uses Google Translate (via `deep-translator` library) - free but with rate limits
- **Speech Recognition**: Uses Google Speech Recognition API (free for limited use)
- **Audio Formats**: For best results with audio recording, use WAV format. Uploaded audio files should be in common formats (WAV, MP3, etc.)
- **File Size Limit**: Maximum file size is 16MB

## Troubleshooting

### Microphone Access
If you get an error accessing the microphone:
- Make sure your browser has permission to access the microphone
- Check System Preferences > Security & Privacy > Microphone

### Translation Errors
If translation fails:
- Check your internet connection
- The translation service may have rate limits - wait a moment and try again

### Audio Transcription Issues
If audio transcription fails:
- Ensure the audio is clear and not too noisy
- Try speaking more slowly and clearly
- For uploaded files, ensure the audio format is supported
- Make sure ffmpeg is installed: Run `bash install_ffmpeg.sh` (no Homebrew needed!)

## Dependencies

- Flask: Web framework
- deep-translator: Translation service
- langdetect: Language detection
- SpeechRecognition: Audio transcription
- pydub: Audio processing
- Werkzeug: File upload handling

## License

This is a simple demonstration app. Use at your own discretion.

