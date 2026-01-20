#!/bin/bash

# Quick start script for Translation App

echo "🚀 Starting Translation App..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
fi

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  Warning: ffmpeg is not installed. Audio conversion may not work."
    echo "   Install it with: brew install ffmpeg"
    echo ""
fi

# Check if database environment variables are set
if [ -z "$DB_PASSWORD" ]; then
    echo "⚠️  Database password not set!"
    echo "   Set it with: export DB_PASSWORD='your_password'"
    echo "   Or use: export DATABASE_URL='postgresql://user:pass@host:port/dbname'"
    echo ""
    echo "💡 To make it permanent, add to ~/.zshrc:"
    echo "   export DB_PASSWORD='your_password'"
    echo "   export DB_USER='postgres'"
    echo "   export DB_NAME='translation_app'"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Exiting. Please set DB_PASSWORD first."
        exit 1
    fi
fi

echo "✅ Starting Flask server..."
echo "🌐 Open your browser to: http://localhost:5000"
echo "📝 Press Ctrl+C to stop the server"
echo ""

# Run the app
python app.py

