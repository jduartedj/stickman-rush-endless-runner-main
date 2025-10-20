# AdMob Integration Guide

## Overview
The AdMob banner has been integrated into the Stickman Runner game, positioned at the bottom of the screen with the same height as the top header for visual consistency.

## Implementation Details

### Component Structure
- **AdMobBanner**: New component handles both web testing (AdSense) and mobile app integration
- **Responsive Design**: Banner adapts to different screen sizes while maintaining consistent height
- **Fallback Display**: Shows placeholder during development/testing

### Integration Points

#### For Cordova/PhoneGap Apps:
```bash
# Install AdMob plugin
cordova plugin add cordova-plugin-admob-free
```

#### For Capacitor Apps:
```bash
# Install AdMob plugin
npm install @capacitor-community/admob
npx cap sync
```

### Production Configuration

1. **Replace Test Ad Unit ID**: Update the `adUnitId` prop with your actual AdMob unit ID
2. **Disable Testing**: Set `isTesting: false` in production builds
3. **Configure Ad Networks**: Set up mediation in AdMob console for optimal revenue

### Revenue Optimization Tips

- **Banner Placement**: Bottom placement ensures visibility without gameplay interference
- **Ad Refresh**: Consider implementing 30-60 second refresh intervals
- **Mediation**: Enable multiple ad networks (Facebook, Unity, etc.) for higher fill rates
- **Format Testing**: Test different banner sizes (320x50, 320x100, 728x90)

### Platform Considerations

- **Android**: Better fill rates, generally higher CPM in developed markets
- **iOS**: Higher user engagement, premium ad inventory
- **Targeting**: Enable demographic and interest-based targeting for better rates

## Next Steps

1. Set up AdMob account and create ad units
2. Configure app-ads.txt for better advertiser trust
3. Implement GDPR compliance for EU users
4. Add interstitial ads between levels for additional revenue