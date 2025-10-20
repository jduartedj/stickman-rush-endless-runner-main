# AdMob GitHub Environment Variables Summary

## Configuration Overview

The Stickman Runner game is now configured to use GitHub environment variables from the "PROD" environment for AdMob integration.

### Environment Variables Required

| Variable | Purpose | Source |
|----------|---------|--------|
| `VITE_ADMOB_APP_ID` | AdMob Application ID | GitHub PROD environment |
| `VITE_ADMOB_BANNER_AD_UNIT_ID` | Banner Ad Unit ID | GitHub PROD environment |

### Local Development

- Uses test AdMob IDs for safe development
- Test IDs are Google's official development credentials
- No real ads will be served or revenue generated

### Production Deployment

1. Set up GitHub PROD environment with real AdMob credentials
2. GitHub Actions workflow pulls environment variables during build
3. Production app uses real AdMob IDs for live ad serving

### Files Modified

- `src/components/AdMobBanner.tsx` - Updated to use GitHub environment variables
- `.env` - Updated with development configuration and documentation
- `.env.example` - Added GitHub environment setup instructions
- `index.html` - Added comments about production App ID injection

### New Files Created

- `.github/workflows/deploy.yml` - Example deployment workflow
- `docs/github-environment-setup.md` - Detailed setup instructions

### Next Steps for Production

1. Create GitHub PROD environment in repository settings
2. Add real AdMob credentials as environment variables
3. Configure deployment workflow for your hosting platform
4. Test deployment to ensure environment variables are properly injected

The application will automatically fallback to test IDs if environment variables are not available, ensuring the app always works safely.