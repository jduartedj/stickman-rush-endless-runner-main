# Google Play Store Submission Guide

## App Information

**App Name:** Stickman Runner  
**Package Name:** com.stickmanrunner.game  
**Category:** Games > Casual  
**Content Rating:** Everyone  

## App Description

### Short Description (80 characters max)
Build your stickman army and survive endless obstacles!

### Full Description
Build your stickman army and survive endless obstacles in this infinite runner game! Control your growing army through dynamic challenges, collect bonuses, and see how far you can go.

🎮 **Features:**
• Infinite runner gameplay with endless challenges
• Build and command your stickman army
• Dynamic obstacles and power-ups
• Progressive difficulty levels
• Intuitive touch controls
• Stunning visual effects
• Addictive casual gameplay

🏃 **Gameplay:**
Start with a single stickman and grow your army by collecting bonuses. Navigate through obstacles, avoid traps, and survive as long as possible. The further you go, the faster the game becomes!

Perfect for quick gaming sessions and challenging your high scores!

## Required Assets

### App Icons
- **High-res icon:** 512 x 512 px (PNG)
- **Adaptive icon:** Foreground and background layers

### Screenshots (Required)
- **Phone screenshots:** Minimum 2, maximum 8
- **Dimensions:** 16:9 or 9:16 aspect ratio
- **Resolution:** 1080 x 1920 px (portrait) recommended

### Feature Graphic
- **Dimensions:** 1024 x 500 px
- **Format:** PNG or JPEG
- **Usage:** Google Play Store listing

### Promo Video (Optional)
- **Duration:** 30 seconds to 2 minutes
- **Format:** YouTube link

## Privacy Policy Requirements

Since the app includes AdMob ads, a privacy policy is required. Include:

1. Data collection practices
2. AdMob/Google advertising disclosures
3. How user data is used
4. Data sharing practices
5. User rights and choices

## AdMob Configuration

### Test vs Production
- **Development:** Uses test ad units (current configuration)
- **Production:** Replace with real AdMob ad unit IDs

### Required AdMob Setup
1. Create AdMob account
2. Register your app
3. Create ad units (banner ads)
4. Update environment variables with real IDs

## Google Play Console Setup

### Developer Account
1. Create Google Play Console account ($25 fee)
2. Verify developer identity
3. Complete tax and banking information

### App Release Process
1. **Internal Testing:** Test with internal team
2. **Alpha/Beta Testing:** Limited audience testing
3. **Production Release:** Public release

### Release Checklist
- [ ] App successfully builds and runs
- [ ] All features tested on multiple devices
- [ ] AdMob integration working
- [ ] Privacy policy published
- [ ] App description and metadata complete
- [ ] Screenshots and graphics uploaded
- [ ] Content rating completed
- [ ] Pricing and distribution set
- [ ] Release notes written

## Build Process

### Environment Setup
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Android
npm run deploy:android
```

### Signing Configuration
1. Generate keystore for release signing
2. Configure signing in Android Studio
3. Build signed APK/AAB (Android App Bundle recommended)

## Marketing Tips

### ASO (App Store Optimization)
- Use relevant keywords in title and description
- Include compelling screenshots
- Respond to user reviews
- Regular updates with new features

### Launch Strategy
- Start with friends and family testing
- Gather feedback and iterate
- Plan social media promotion
- Consider influencer partnerships

## Monetization Strategy

### AdMob Integration
- Banner ads at bottom of screen
- Strategically placed to not interfere with gameplay
- Consider rewarded video ads for extra lives/bonuses

### Future Monetization Options
- In-app purchases for cosmetic upgrades
- Premium version without ads
- Season passes or battle passes

## Legal Considerations

### Required Disclosures
- Data collection practices
- Advertisement policies
- Age-appropriate content
- Terms of service

### Compliance
- COPPA compliance (if targeting children)
- GDPR compliance (for EU users)
- Google Play policies adherence

## Post-Launch

### User Engagement
- Monitor crash reports and fix issues
- Respond to user reviews
- Regular content updates
- Community building

### Analytics
- Track user engagement metrics
- Monitor retention rates
- Analyze revenue performance
- A/B test new features

## Troubleshooting Common Issues

### Build Problems
- Ensure Android SDK is properly installed
- Check Java version compatibility
- Verify signing configuration

### Store Rejection
- Review Google Play policies
- Ensure privacy policy compliance
- Check content rating accuracy
- Verify all required assets are uploaded

### Performance Issues
- Optimize game assets
- Implement proper memory management
- Test on various device specifications
- Monitor crash analytics