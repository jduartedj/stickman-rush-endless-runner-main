# AdMob Integration

Stickman Rush uses `@capacitor-community/admob` for native ads and an AdSense fallback for the web version.

## Configuration

Set these environment variables (or they'll fall back to production defaults in code):

| Variable | Description |
|----------|-------------|
| `VITE_ADMOB_APP_ID` | AdMob Application ID |
| `VITE_ADMOB_BANNER_AD_UNIT_ID` | Banner ad unit ID |
| `VITE_ADMOB_INTERSTITIAL_AD_UNIT_ID` | Interstitial ad unit ID |

## Ad Placement

- **Banner:** Bottom of screen (persistent)
- **Interstitial:** Game over screen only (not on level up)

## Files

- `src/components/AdMobBanner.tsx` — Banner component (native + web fallback)
- `src/hooks/useAdMob.ts` — AdMob initialization, banner & interstitial hooks

## Testing

For development, use [Google's official test IDs](https://developers.google.com/admob/android/test-ads) and set `initializeForTesting: true` in `useAdMob.ts`.
