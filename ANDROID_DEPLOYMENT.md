# Android App Deployment Guide

## Prerequisites

1. Install Android Studio and Android SDK
2. Install Java Development Kit (JDK) 11 or higher
3. Set up Android device or emulator

## Environment Variables Setup

Create a `.env` file in the project root with your AdMob configuration:

```
VITE_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
VITE_ADMOB_BANNER_AD_UNIT_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

## Build and Deploy Steps

### 1. Initialize Capacitor (First time only)
```bash
npx cap init
```

### 2. Build the web app
```bash
npm run build
```

### 3. Add Android platform (First time only)
```bash
npx cap add android
```

### 4. Copy web assets to Android
```bash
npx cap copy android
```

### 5. Sync Capacitor with Android
```bash
npx cap sync android
```

### 6. Open in Android Studio
```bash
npx cap open android
```

### Quick Deploy Command
```bash
npm run deploy:android
```

## Android Studio Configuration

### 1. App Signing
- Generate a keystore for release builds
- Configure signing in `android/app/build.gradle`

### 2. AdMob Configuration
- Add your AdMob App ID to `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
```

### 3. Permissions
The following permissions are automatically added:
- `INTERNET` - For AdMob ads
- `ACCESS_NETWORK_STATE` - For checking network connectivity

### 4. Build Release APK
1. In Android Studio, go to Build > Generate Signed Bundle/APK
2. Select APK
3. Choose your keystore and alias
4. Select "release" build variant
5. Build the APK

## Google Play Store Submission

### 1. Create Google Play Console Account
- Visit https://play.google.com/console
- Pay the $25 registration fee

### 2. App Information Required
- App name: "Stickman Runner"
- Package name: `com.stickmanrunner.game`
- App description (see app-description.txt)
- Screenshots (1080x1920 portrait recommended)
- App icon (512x512 PNG)

### 3. Content Rating
- Fill out the content rating questionnaire
- Game should be rated for all ages

### 4. Privacy Policy
- Required for apps with ads
- Must include AdMob data collection disclosure

### 5. App Category
- Category: Games > Casual
- Tags: action, runner, casual

## AdMob Integration Notes

The app is configured to use test ads by default. For production:

1. Replace test ad unit IDs with your real AdMob IDs
2. Add your AdMob App ID to the environment variables
3. Ensure proper ad loading and error handling

## Troubleshooting

### Common Issues
1. **Build errors**: Check Android SDK and build tools versions
2. **AdMob not showing**: Verify App ID and Ad Unit ID configuration
3. **Touch not working**: Enable hardware acceleration in Android manifest

### Performance Optimization
- Enable ProGuard for release builds
- Optimize images and assets
- Test on various Android devices and API levels

## Testing Checklist

- [ ] Game runs smoothly on Android device
- [ ] Touch controls work properly
- [ ] AdMob ads display correctly
- [ ] No memory leaks during gameplay
- [ ] Back button handling works
- [ ] App handles network connectivity changes
- [ ] Splash screen displays properly
- [ ] Status bar styling is correct