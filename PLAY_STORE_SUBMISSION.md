# Play Store Submission Checklist

**Generated:** February 2, 2026  
**App:** Stickman Rush  
**Package:** com.stickmanrunner.game  
**Version:** 1.0 (Version Code: 1)

---

## ✅ COMPLETED ITEMS

### 1. Release Signing Key ✅
- **Location:** `/home/jduartedj/clawd/stickman-rush/secrets/stickman-rush-release.keystore`
- **Alias:** `stickman-rush`
- **Password:** `StickmanRush2026`
- **Validity:** 10,000 days
- **Algorithm:** RSA 2048-bit
- **⚠️ CRITICAL:** Keystore backed up and secured (never commit to git)

### 2. Build Configuration ✅
- Signing configured in `android/app/build.gradle`
- Release builds will be automatically signed
- Build in progress: APK + AAB

### 3. Store Assets ✅

#### App Icon
- ✅ 512x512 PNG created: `store-assets/icons/google-play/icon-512.png`

#### Feature Graphic
- ✅ 1024x500 PNG created: `store-assets/feature-graphics/google-play-feature.png`

#### Screenshots
- ✅ Phone screenshot 1 (Menu): `store-assets/screenshots/google-play/phone-1-menu.png`
- ✅ Phone screenshot 2 (Gameplay): `store-assets/screenshots/google-play/phone-2-gameplay.png`
- ✅ Phone screenshot 3 (Action): `store-assets/screenshots/google-play/phone-3-action.png`
- ✅ Phone screenshot 4 (Score): `store-assets/screenshots/google-play/phone-4-score.png`
- Resolution: 1080x2340 (perfect for Play Store)

### 4. GitHub Actions ✅
- Workflow already configured for Android builds
- Can be triggered manually or on git tags
- Builds both APK and AAB

---

## ⏳ IN PROGRESS

### Release Build
- **Status:** Building (mergeExtDexRelease phase)
- **Commands:** `assembleRelease` + `bundleRelease`
- **Output Locations:**
  - APK: `android/app/build/outputs/apk/release/app-release.apk`
  - AAB: `android/app/build/outputs/bundle/release/app-release.aab`

---

## ⚠️ REQUIRED BEFORE SUBMISSION

### 1. AdMob Production Setup
**Current:** Using test ad units  
**Required:**

1. Create AdMob account: https://admob.google.com
2. Register app "Stickman Rush"
3. Create ad units:
   - Banner ad unit
   - Interstitial ad unit
4. Update `.env` with production IDs:
   ```
   VITE_ADMOB_APP_ID=ca-app-pub-XXXXX~XXXXXXXXXX
   VITE_ADMOB_BANNER_AD_UNIT_ID=ca-app-pub-XXXXX/XXXXXXXXXX
   VITE_ADMOB_INTERSTITIAL_AD_UNIT_ID=ca-app-pub-XXXXX/XXXXXXXXXX
   ```
5. Update `android/app/src/main/AndroidManifest.xml` with real App ID
6. Rebuild: `npm run build && npx cap sync android && cd android && ./gradlew bundleRelease`

**⚠️ CRITICAL:** Do NOT submit to Play Store with test IDs - account will be suspended!

### 2. Privacy Policy Hosting
**Current:** Policy exists in `PRIVACY_POLICY.md`  
**Required:** Host publicly accessible URL

**Option 1: GitHub Pages (Quickest)**
```bash
mkdir -p docs
cp PRIVACY_POLICY.md docs/privacy-policy.md
# Enable GitHub Pages in repo Settings → Pages → Source: /docs
# URL will be: https://[username].github.io/stickman-rush/privacy-policy.html
```

**Option 2: Web Hosting**
- Upload to your web server
- Ensure publicly accessible
- Add URL to Play Store listing

### 3. Google Play Developer Account
- **Cost:** $25 (one-time)
- **URL:** https://play.google.com/console/signup
- **Time:** Usually instant, can take 24-48 hours

### 4. Content Rating Questionnaire
- Complete in Play Console
- Answer questions about content
- App will receive rating (likely "Everyone")

### 5. Store Listing Content

**App Title (30 chars max):**
```
Stickman Rush
```

**Short Description (80 chars max):**
```
Build your stickman army and survive endless obstacles in this runner game!
```

**Full Description (4000 chars max):**
```
Build your stickman army and survive endless obstacles in this infinite runner game! Control your growing army through dynamic challenges, collect bonuses, and see how far you can go.

🎮 FEATURES:
• Infinite runner gameplay with endless challenges
• Build and command your stickman army
• Dynamic obstacles and power-ups
• Progressive difficulty levels
• Intuitive touch controls
• Stunning visual effects
• Addictive casual gameplay

🏃 HOW TO PLAY:
Start with a single stickman and grow your army by collecting bonuses. Navigate through obstacles, avoid traps, and survive as long as possible. The further you go, the faster the game becomes!

Perfect for quick gaming sessions and challenging your high scores!

📱 REQUIREMENTS:
• Android 5.0 or higher
• Internet connection for ads (optional)

🎯 UPCOMING FEATURES:
• New character skins
• Power-up upgrades
• Leaderboards
• Daily challenges

Download now and start building your stickman army!
```

**Category:** Games → Casual  
**Tags:** runner, stickman, casual, arcade, endless

---

## 📋 PLAY STORE SUBMISSION STEPS

### Step 1: Create App Listing
1. Log in to Google Play Console
2. Click "Create app"
3. Enter app details:
   - App name: **Stickman Rush**
   - Default language: English (United States)
   - App or game: Game
   - Free or paid: Free
4. Accept declarations and click "Create app"

### Step 2: Set Up Store Listing
1. Navigate to "Store presence" → "Main store listing"
2. Upload assets:
   - App icon: `store-assets/icons/google-play/icon-512.png`
   - Feature graphic: `store-assets/feature-graphics/google-play-feature.png`
   - Screenshots: Upload all 4 from `store-assets/screenshots/google-play/`
3. Enter text content (see above)
4. Set category: Games → Casual
5. Add privacy policy URL
6. Save

### Step 3: Content Rating
1. Navigate to "Content rating"
2. Start questionnaire
3. Answer questions honestly:
   - Violence: Cartoon/fantasy violence (running game)
   - Ads: Yes (AdMob integration)
4. Submit for rating

### Step 4: Upload Release
1. Navigate to "Release" → "Production"
2. Click "Create new release"
3. Upload AAB: `android/app/build/outputs/bundle/release/app-release.aab`
4. Enter release notes:
   ```
   Initial release of Stickman Rush!
   
   Features:
   - Infinite runner gameplay
   - Build your stickman army
   - Collect bonuses and avoid obstacles
   - Progressive difficulty
   ```
5. Review and rollout

### Step 5: Submit for Review
1. Complete all required sections
2. Review summary
3. Click "Submit for review"
4. Wait 1-7 days for approval

---

## 🔍 PRE-SUBMISSION TESTING

### Device Testing (Mandatory)
- [ ] Install release APK on real device
- [ ] Test all game mechanics work smoothly
- [ ] Verify touch controls responsive
- [ ] Check ads display correctly (after AdMob setup)
- [ ] Play to high level to check difficulty scaling
- [ ] Test app pause/resume
- [ ] Test backgrounding/foregrounding
- [ ] Verify no crashes or ANRs
- [ ] Check performance (60 FPS)

### Release APK Install Command
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 📦 FILE LOCATIONS

### Build Outputs
```
android/app/build/outputs/
├── apk/release/app-release.apk          # For testing
└── bundle/release/app-release.aab       # For Play Store
```

### Store Assets
```
store-assets/
├── icons/google-play/icon-512.png
├── feature-graphics/google-play-feature.png
└── screenshots/google-play/
    ├── phone-1-menu.png
    ├── phone-2-gameplay.png
    ├── phone-3-action.png
    └── phone-4-score.png
```

### Secrets (DO NOT COMMIT)
```
secrets/
└── stickman-rush-release.keystore       # Signing key
```

---

## ⏱️ ESTIMATED TIMELINE

| Task | Time | Status |
|------|------|--------|
| AdMob setup | 30 min | ⏳ Required |
| Privacy policy hosting | 15 min | ⏳ Required |
| Play Console setup | 30 min | ⏳ Required |
| Store listing | 45 min | ⚠️ Content ready |
| Content rating | 15 min | ⏳ Required |
| Release build | 10 min | 🔄 Building now |
| Testing | 2 hours | ⏳ After build |
| Upload & submit | 20 min | ⏳ Final step |
| Google review | 1-7 days | ⏳ After submission |

**Total prep time:** ~4-5 hours (excluding Google review)

---

## 🚀 LAUNCH CHECKLIST

Before clicking "Submit":
- [ ] AdMob account created with production IDs
- [ ] Privacy policy publicly hosted
- [ ] Release AAB built and signed
- [ ] Release APK tested on real device
- [ ] All store assets uploaded
- [ ] Store listing complete
- [ ] Content rating obtained
- [ ] Pricing set to "Free"
- [ ] Countries selected (or "All countries")
- [ ] No test IDs in production build

---

## 📞 SUPPORT RESOURCES

- **Google Play Console:** https://play.google.com/console
- **AdMob Help:** https://support.google.com/admob
- **Play Console Help:** https://support.google.com/googleplay/android-developer
- **Policy Guidelines:** https://play.google.com/about/developer-content-policy/

---

## 🎯 SUCCESS CRITERIA

**App is ready for submission when:**
1. ✅ Release AAB builds successfully
2. ⏳ AdMob uses production IDs (not test IDs)
3. ⏳ Privacy policy publicly accessible
4. ✅ All store assets created and validated
5. ⏳ Release APK tested without issues
6. ⏳ Play Console account created and verified

**Current completion:** 50% ✅ (3/6 criteria met)

---

*Generated by Ralph - Stickman Rush Release Build Process*
*Last updated: February 2, 2026 17:35 GMT*
