import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const ADSENSE_CLIENT_ID = 'ca-pub-6338497362113540';
const ADSENSE_INTERSTITIAL_SLOT = '5940061387';

// Cooldown and minimum level settings (matching AdMob behavior)
const INTERSTITIAL_COOLDOWN_MS = 60000; // 1 minute
const MIN_LEVEL_FOR_INTERSTITIAL = 3; // Only show after level 2
const PLAY_AGAIN_DELAY_MS = 3500; // Delay before showing Play Again button

let lastInterstitialTime = 0;

interface AdSenseInterstitialProps {
  isGameOver: boolean;
  level: number;
  score: number;
  onRestart: () => void;
}

export const AdSenseInterstitial: React.FC<AdSenseInterstitialProps> = ({
  isGameOver,
  level,
  score,
  onRestart,
}) => {
  const [showAd, setShowAd] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const adPushedRef = useRef(false);

  useEffect(() => {
    // Only on web, only on game over, only past minimum level, respect cooldown
    if (Capacitor.isNativePlatform()) return;
    if (!isGameOver) {
      setShowAd(false);
      setShowButton(false);
      adPushedRef.current = false;
      return;
    }

    const now = Date.now();
    if (level < MIN_LEVEL_FOR_INTERSTITIAL) return;
    if (now - lastInterstitialTime < INTERSTITIAL_COOLDOWN_MS) return;

    setShowAd(true);
    lastInterstitialTime = now;

    // Delay the Play Again button
    const timer = setTimeout(() => setShowButton(true), PLAY_AGAIN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isGameOver, level]);

  // Push the ad once the ins element is mounted
  useEffect(() => {
    if (showAd && adRef.current && !adPushedRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushedRef.current = true;
      } catch (e) {
        console.error('AdSense interstitial push error:', e);
      }
    }
  }, [showAd]);

  // Don't render on native or when not showing
  if (Capacitor.isNativePlatform() || !showAd) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      {/* Score display */}
      <div style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>
        Game Over — Score: {score}
      </div>

      {/* Ad container — fixed size for best CPM */}
      <div
        style={{
          width: '336px',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
        }}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '336px', height: '280px' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={ADSENSE_INTERSTITIAL_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="false"
        />
      </div>

      {/* Play Again button — delayed */}
      {showButton ? (
        <button
          onClick={onRestart}
          style={{
            padding: '12px 32px',
            fontSize: '18px',
            fontWeight: 700,
            color: '#fff',
            backgroundColor: '#6366f1',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Play Again
        </button>
      ) : (
        <div style={{ color: '#888', fontSize: '14px' }}>Loading...</div>
      )}
    </div>
  );
};
