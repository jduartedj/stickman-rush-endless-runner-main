import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdOptions } from '@capacitor-community/admob';

// Get AdMob configuration
const getAdMobConfig = () => ({
  ADMOB_APP_ID: import.meta.env.VITE_ADMOB_APP_ID || 'ca-app-pub-6338497362113540~3619678519',
  ADMOB_BANNER_AD_UNIT_ID: import.meta.env.VITE_ADMOB_BANNER_AD_UNIT_ID || 'ca-app-pub-6338497362113540/7042265813',
  ADMOB_INTERSTITIAL_AD_UNIT_ID: import.meta.env.VITE_ADMOB_INTERSTITIAL_AD_UNIT_ID || 'ca-app-pub-6338497362113540/1317119233',
});

const { ADMOB_BANNER_AD_UNIT_ID, ADMOB_INTERSTITIAL_AD_UNIT_ID } = getAdMobConfig();

let adMobInitialized = false;

// Initialize AdMob
export const initializeAdMob = async () => {
  if (!Capacitor.isNativePlatform() || adMobInitialized) return;
  
  try {
    await AdMob.initialize({
      testingDevices: [],
      initializeForTesting: false,
    });
    adMobInitialized = true;
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
  }
};

// Show interstitial ad
export const showInterstitial = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Interstitial ads only work on native platforms');
    return;
  }
  
  try {
    await AdMob.prepareInterstitial({ adId: ADMOB_INTERSTITIAL_AD_UNIT_ID });
    await AdMob.showInterstitial();
    console.log('Interstitial ad shown');
  } catch (error) {
    console.error('Failed to show interstitial ad:', error);
  }
};

// Hook for banner ads
export const useAdMobBanner = () => {
  const bannerShown = useRef(false);
  
  useEffect(() => {
    const showBanner = async () => {
      if (!Capacitor.isNativePlatform()) {
        console.log('AdMob banners only work on native platforms');
        return;
      }
      
      if (!bannerShown.current) {
        try {
          await initializeAdMob();
          
          const options: BannerAdOptions = {
            adId: ADMOB_BANNER_AD_UNIT_ID,
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
          };
          
          await AdMob.showBanner(options);
          bannerShown.current = true;
          console.log('Banner ad displayed');
        } catch (error) {
          console.error('Failed to show banner ad:', error);
        }
      }
    };
    
    showBanner();
    
    return () => {
      if (Capacitor.isNativePlatform() && bannerShown.current) {
        AdMob.removeBanner().catch(console.error);
      }
    };
  }, []);
  
  return Capacitor.isNativePlatform();
};

// Hook for interstitial ads - ONLY on game over, NOT on level up
interface InterstitialAdOptions {
  onGameOver?: boolean;
  onLevelUp?: boolean;  // Keep for API compatibility but default to false
  levelInterval?: number;
}

export const useInterstitialAds = (
  score: number,
  level: number,
  isGameOver: boolean,
  options: InterstitialAdOptions = {}
) => {
  const {
    onGameOver = true,
    onLevelUp = false,  // CHANGED: Default to false - no interstitials on level up
    levelInterval = 5,
  } = options;
  
  const lastLevelRef = useRef(0);
  const gameOverShownRef = useRef(false);
  
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    
    // Show interstitial on game over
    if (onGameOver && isGameOver && !gameOverShownRef.current) {
      showInterstitial();
      gameOverShownRef.current = true;
      return;
    }
    
    // Reset game over flag when game restarts
    if (!isGameOver && gameOverShownRef.current) {
      gameOverShownRef.current = false;
    }
    
    // Show interstitial on level up (disabled by default)
    if (onLevelUp && level > 0 && level !== lastLevelRef.current) {
      if (level % levelInterval === 0) {
        showInterstitial();
      }
      lastLevelRef.current = level;
    }
  }, [score, level, isGameOver, onGameOver, onLevelUp, levelInterval]);
};
