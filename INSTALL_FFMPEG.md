# Installing ffmpeg on macOS

## Option 1: Quick Install Script (Recommended - No Homebrew!)

The easiest way to install ffmpeg without Homebrew:

1. **Run the installation script**:
   ```bash
   bash install_ffmpeg.sh
   ```

2. **That's it!** The script will:
   - Download ffmpeg from evermeet.cx (fast, no dependencies)
   - Install it locally in the project's `bin/` directory
   - Configure the app to use it automatically

The app will automatically detect and use the locally installed ffmpeg. No need to modify PATH or system settings!

This is much faster than installing Homebrew and takes only seconds!

## Option 2: Install Homebrew (Traditional Method)

Homebrew is a package manager for macOS. To install it:

1. **Open Terminal** (Applications > Utilities > Terminal)

2. **Run this command:**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. **Follow the prompts:**
   - You'll be asked for your password (for sudo access)
   - Press Enter when prompted
   - Wait for installation to complete (5-10 minutes)

4. **After installation, you may need to add Homebrew to your PATH:**
   ```bash
   echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
   eval "$(/opt/homebrew/bin/brew shellenv)"
   ```

5. **Install ffmpeg:**
   ```bash
   brew install ffmpeg
   ```

6. **Verify installation:**
   ```bash
   ffmpeg -version
   ```

## Option 3: Download ffmpeg Binary Manually (No Homebrew)

If you prefer not to install Homebrew or use the script:

1. **Download ffmpeg:**
   - Visit: https://evermeet.cx/ffmpeg/
   - Download the latest ffmpeg build for macOS

2. **Extract and move to a system path:**
   ```bash
   # Extract the downloaded file
   # Move ffmpeg to /usr/local/bin (requires sudo)
   sudo mv ffmpeg /usr/local/bin/
   ```

3. **Verify:**
   ```bash
   ffmpeg -version
   ```

## Option 4: Use MacPorts (Alternative to Homebrew)

1. Install MacPorts from: https://www.macports.org/install.php
2. Then run: `sudo port install ffmpeg`

## Why is ffmpeg needed?

ffmpeg is required to convert audio formats (like webm from browser recordings) to WAV format, which is needed for speech recognition.

## After Installing ffmpeg

Once ffmpeg is installed, restart your Flask app and try recording audio again. The audio recording feature should work properly.

The app will automatically detect:
- Local ffmpeg in `bin/` directory (if installed via script)
- System ffmpeg in PATH (if installed via Homebrew or manually)
