#!/bin/bash

# Android Build and Deploy Script for Stickman Runner
echo "🚀 Building Stickman Runner for Android..."

# Check if required tools are installed
command -v npx >/dev/null 2>&1 || { echo "❌ npx is required but not installed. Aborting." >&2; exit 1; }

# Build the web application
echo "📦 Building web application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Web build failed. Aborting."
    exit 1
fi

echo "✅ Web build completed successfully"

# Initialize Capacitor if not already done
if [ ! -d "android" ]; then
    echo "🔧 Initializing Capacitor for Android..."
    npx cap add android
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to add Android platform. Aborting."
        exit 1
    fi
    
    echo "✅ Android platform added successfully"
fi

# Copy web assets to Android
echo "📋 Copying web assets to Android platform..."
npx cap copy android

if [ $? -ne 0 ]; then
    echo "❌ Failed to copy assets. Aborting."
    exit 1
fi

echo "✅ Assets copied successfully"

# Sync Capacitor plugins
echo "🔄 Syncing Capacitor plugins..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Failed to sync plugins. Aborting."
    exit 1
fi

echo "✅ Plugins synced successfully"

# Check if Android Studio should be opened
read -p "📱 Open Android Studio to build the APK? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🎯 Opening Android Studio..."
    npx cap open android
else
    echo "📝 Manual steps to complete:"
    echo "1. Open Android Studio"
    echo "2. Open the 'android' folder in this project"
    echo "3. Build > Generate Signed Bundle/APK"
    echo "4. Follow the Google Play Store submission guide"
fi

echo "🎉 Android deployment preparation completed!"
echo "📄 See ANDROID_DEPLOYMENT.md for detailed deployment instructions"