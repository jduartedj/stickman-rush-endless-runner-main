# Environment Configuration for Android Deployment

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# AdMob Configuration (Required for production)
VITE_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
VITE_ADMOB_BANNER_AD_UNIT_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

# Development vs Production
NODE_ENV=production
```

## GitHub Actions Deployment (Optional)

If using GitHub Actions for CI/CD, add these secrets to your repository:

1. Go to your GitHub repository
2. Settings > Secrets and variables > Actions
3. Add the following repository secrets:
   - `VITE_ADMOB_APP_ID`
   - `VITE_ADMOB_BANNER_AD_UNIT_ID`

## AdMob Setup Instructions

### 1. Create AdMob Account
1. Visit https://admob.google.com/
2. Sign in with your Google account
3. Accept terms and conditions

### 2. Add Your App
1. Click "Apps" in the sidebar
2. Click "Add app"
3. Select "Android"
4. Enter app name: "Stickman Runner"
5. Add to AdMob

### 3. Create Ad Units
1. Select your app
2. Click "Ad units"
3. Click "Add ad unit"
4. Select "Banner"
5. Name: "Stickman Runner Banner"
6. Save and note the Ad unit ID

### 4. Get Your App ID
1. In AdMob console, go to Apps
2. Select your app
3. Find the App ID (ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX)

## Test Ad Units (Current Configuration)

The app currently uses Google's test ad units:
- **App ID:** `ca-app-pub-3940256099942544~3347511713`
- **Banner Ad Unit:** `ca-app-pub-3940256099942544/6300978111`

**⚠️ Important:** Replace these with your real ad units before publishing to Google Play Store.

## Environment File Template

Copy this to `.env` and replace with your actual values:

```env
# Replace with your actual AdMob App ID
VITE_ADMOB_APP_ID=ca-app-pub-3940256099942544~3347511713

# Replace with your actual Banner Ad Unit ID  
VITE_ADMOB_BANNER_AD_UNIT_ID=ca-app-pub-3940256099942544/6300978111

# Set to production for builds
NODE_ENV=production
```

## Verification

To verify your configuration is working:

1. Build the app: `npm run build`
2. Check the browser console for AdMob logs
3. Ensure ads are displaying (test ads show "Test Ad" label)
4. Monitor AdMob dashboard for impressions

## Troubleshooting

### Ads Not Showing
- Check network connectivity
- Verify ad unit IDs are correct
- Ensure AdMob account is active
- Check browser console for errors

### Invalid Configuration
- Verify environment variables are loaded
- Check for typos in ad unit IDs
- Ensure app is added to AdMob console

### Production Issues
- Replace test ad units with real ones
- Verify app is approved in AdMob
- Check payment information is complete