# GitHub Environment Variables Setup

This document explains how to configure the GitHub "PROD" environment for AdMob integration.

## Setting up GitHub Environment Variables

### Step 1: Create Production Environment

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click on **Environments**
4. Click **New environment**
5. Name it `PROD`
6. Click **Configure environment**

### Step 2: Add Environment Variables

In the PROD environment configuration:

1. Scroll down to **Environment variables** section
2. Click **Add variable**
3. Add the following variables:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `VITE_ADMOB_APP_ID` | Your AdMob Application ID from Google AdMob Console | `ca-app-pub-1234567890123456~1234567890` |
| `VITE_ADMOB_BANNER_AD_UNIT_ID` | Your AdMob Banner Ad Unit ID | `ca-app-pub-1234567890123456/1234567890` |

### Step 3: Deployment Configuration

The application is configured to:
- Use test AdMob IDs during local development
- Pull production AdMob IDs from the GitHub PROD environment during deployment
- Fall back to test IDs if environment variables are not available

### Getting Your AdMob IDs

1. Sign in to [Google AdMob Console](https://admob.google.com/)
2. Create a new app or select your existing app
3. **App ID**: Found in Apps → Your App → App settings
4. **Ad Unit ID**: Found in Apps → Your App → Ad units → Your Banner Ad Unit

### Security Notes

- Environment variables in GitHub are encrypted and only accessible during workflows
- Test IDs are safe for development and won't generate real ad revenue
- Never commit real AdMob IDs to your repository code

### Local Development

For local development, the app uses test AdMob IDs defined in `.env` file. These are Google's official test IDs and are safe to use.

### Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) demonstrates how to:
1. Reference the PROD environment
2. Inject environment variables during build
3. Deploy the built application

Modify the deployment step according to your hosting platform (GitHub Pages, Vercel, Netlify, etc.).