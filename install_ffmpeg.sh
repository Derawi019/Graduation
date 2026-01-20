#!/bin/bash

# Script to install ffmpeg on macOS without Homebrew
# Downloads static build and installs locally in the project

set -e

echo "🎬 Installing ffmpeg without Homebrew..."

# Detect architecture
ARCH=$(uname -m)
echo "📱 Detected architecture: $ARCH"

# Create bin directory in project
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="$SCRIPT_DIR/bin"
FFMPEG_PATH="$BIN_DIR/ffmpeg"

echo "📁 Project directory: $SCRIPT_DIR"
echo "📂 Bin directory: $BIN_DIR"

# Create bin directory if it doesn't exist
mkdir -p "$BIN_DIR"

# Check if both ffmpeg and ffprobe already exist
FFPROBE_PATH="$BIN_DIR/ffprobe"
if [ -f "$FFMPEG_PATH" ] && [ -f "$FFPROBE_PATH" ]; then
    echo "✅ ffmpeg already exists at $FFMPEG_PATH"
    "$FFMPEG_PATH" -version | head -n 1
    echo "✅ ffprobe already exists at $FFPROBE_PATH"
    "$FFPROBE_PATH" -version | head -n 1
    exit 0
elif [ -f "$FFMPEG_PATH" ]; then
    echo "✅ ffmpeg already exists at $FFMPEG_PATH"
    "$FFMPEG_PATH" -version | head -n 1
    echo "⚠️  ffprobe not found, downloading it..."
    # Continue to download ffprobe
fi

# Try downloading from evermeet.cx (fastest, no dependencies)
echo "⬇️  Downloading ffmpeg from evermeet.cx..."
TEMP_ZIP=$(mktemp /tmp/ffmpeg.XXXXXX.zip)
TEMP_DIR=$(mktemp -d /tmp/ffmpeg.XXXXXX)

# Download the latest version
if curl -L -f -o "$TEMP_ZIP" "https://evermeet.cx/ffmpeg/getrelease/zip" 2>/dev/null; then
    echo "✅ Downloaded successfully"
else
    echo "❌ Failed to download from evermeet.cx"
    echo "🔄 Trying alternative source (GitHub)..."
    
    # Alternative: Use ffmpeg-static from GitHub (Intel Mac)
    if [ "$ARCH" = "x86_64" ]; then
        GH_URL="https://github.com/eugeneware/ffmpeg-static/releases/download/b5.1.1/darwin-x64"
        if curl -L -f -o "$FFMPEG_PATH" "$GH_URL" 2>/dev/null; then
            chmod +x "$FFMPEG_PATH"
            echo "✅ Downloaded from GitHub"
            "$FFMPEG_PATH" -version | head -n 1
            exit 0
        fi
    fi
    
    echo "❌ All download attempts failed"
    echo "Please download ffmpeg manually from:"
    echo "  - https://evermeet.cx/ffmpeg/"
    echo "  - Or use: curl -L -o ffmpeg.zip https://evermeet.cx/ffmpeg/getrelease/zip"
    exit 1
fi

# Extract zip file
echo "📦 Extracting ffmpeg..."
unzip -q "$TEMP_ZIP" -d "$TEMP_DIR" 2>/dev/null || {
    echo "⚠️  unzip failed, trying alternative extraction..."
    cd "$TEMP_DIR" && ditto -xk "$TEMP_ZIP" . 2>/dev/null || {
        echo "❌ Failed to extract zip file"
        rm -rf "$TEMP_DIR" "$TEMP_ZIP"
        exit 1
    }
}

# Find ffmpeg and ffprobe binaries in extracted files
FFMPEG_BINARY=$(find "$TEMP_DIR" -name "ffmpeg" -type f -perm +111 | head -n 1)
FFPROBE_BINARY=$(find "$TEMP_DIR" -name "ffprobe" -type f -perm +111 | head -n 1)

if [ -z "$FFMPEG_BINARY" ] && [ ! -f "$FFMPEG_PATH" ]; then
    echo "❌ Could not find ffmpeg binary in downloaded archive"
    echo "📂 Contents of extracted directory:"
    ls -la "$TEMP_DIR"
    rm -rf "$TEMP_DIR" "$TEMP_ZIP"
    exit 1
fi

# Move ffmpeg to bin directory if we found it and it doesn't exist
if [ -n "$FFMPEG_BINARY" ] && [ ! -f "$FFMPEG_PATH" ]; then
    mv "$FFMPEG_BINARY" "$FFMPEG_PATH"
    chmod +x "$FFMPEG_PATH"
fi

# Move ffprobe to bin directory if found
if [ -n "$FFPROBE_BINARY" ]; then
    mv "$FFPROBE_BINARY" "$FFPROBE_PATH"
    chmod +x "$FFPROBE_PATH"
    echo "✅ ffprobe installed successfully!"
else
    echo "⚠️  ffprobe not found in archive, downloading separately..."
    # Try to download ffprobe separately from evermeet.cx
    TEMP_PROBE_ZIP=$(mktemp /tmp/ffprobe.XXXXXX.zip)
    TEMP_PROBE_DIR=$(mktemp -d /tmp/ffprobe.XXXXXX)
    
    # Try multiple download methods for ffprobe
    echo "⬇️  Downloading ffprobe..."
    
    # Method 1: Try direct download of ffprobe-8.0.zip
    if curl -L -f -o "$TEMP_PROBE_ZIP" "https://evermeet.cx/ffprobe/ffprobe-8.0.zip" 2>/dev/null; then
        echo "✅ Downloaded ffprobe-8.0.zip"
    # Method 2: Try getrelease endpoint
    elif curl -L -f -o "$TEMP_PROBE_ZIP" "https://evermeet.cx/ffprobe/getrelease/zip" 2>/dev/null; then
        echo "✅ Downloaded via getrelease endpoint"
    else
        echo "⚠️  Could not download ffprobe from evermeet.cx"
        rm -f "$TEMP_PROBE_ZIP"
    fi
    
    if [ -f "$TEMP_PROBE_ZIP" ]; then
        echo "📦 Extracting ffprobe..."
        # Extract using unzip or ditto
        if unzip -q "$TEMP_PROBE_ZIP" -d "$TEMP_PROBE_DIR" 2>/dev/null; then
            echo "✅ Extracted with unzip"
        elif ditto -xk "$TEMP_PROBE_ZIP" "$TEMP_PROBE_DIR" 2>/dev/null; then
            echo "✅ Extracted with ditto"
        else
            echo "⚠️  Failed to extract zip file"
            rm -rf "$TEMP_PROBE_DIR" "$TEMP_PROBE_ZIP"
        fi
        
        # Find ffprobe binary
        FFPROBE_BINARY=$(find "$TEMP_PROBE_DIR" -name "ffprobe" -type f -perm +111 2>/dev/null | head -n 1)
        
        if [ -n "$FFPROBE_BINARY" ] && [ -f "$FFPROBE_BINARY" ]; then
            mv "$FFPROBE_BINARY" "$FFPROBE_PATH"
            chmod +x "$FFPROBE_PATH"
            echo "✅ ffprobe installed successfully!"
            rm -rf "$TEMP_PROBE_DIR" "$TEMP_PROBE_ZIP"
        else
            echo "⚠️  Could not find ffprobe binary in extracted files"
            echo "📂 Contents of extracted directory:"
            ls -la "$TEMP_PROBE_DIR" 2>/dev/null | head -10
            rm -rf "$TEMP_PROBE_DIR" "$TEMP_PROBE_ZIP"
        fi
    else
        echo "⚠️  Could not download ffprobe, continuing without it..."
        echo "   (ffmpeg will work, but some audio formats may need ffprobe)"
    fi
fi

# Clean up
rm -rf "$TEMP_DIR" "$TEMP_ZIP"

# Verify installation
echo ""
echo "✅ ffmpeg installed successfully!"
echo "📍 Location: $FFMPEG_PATH"
echo "📊 Version:"
"$FFMPEG_PATH" -version | head -n 1

if [ -f "$FFPROBE_PATH" ]; then
    echo ""
    echo "✅ ffprobe installed successfully!"
    echo "📍 Location: $FFPROBE_PATH"
    echo "📊 Version:"
    "$FFPROBE_PATH" -version | head -n 1
fi

echo ""
echo "✅ Installation complete!"
echo "💡 The app will automatically use ffmpeg and ffprobe from: $BIN_DIR"

