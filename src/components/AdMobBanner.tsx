import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAdMobBanner } from '../hooks/useAdMob';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// AdSense publisher ID for web ads
const ADSENSE_CLIENT_ID = 'ca-pub-6338497362113540';
// AdSense Banner ad slot
const ADSENSE_BANNER_SLOT = '4586258327';

export const AdMobBanner: React.FC = () => {
  // Use native AdMob banner on mobile
  const { isNative, bannerHeight } = useAdMobBanner();
  
  // Web-only: AdSense fallback
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  // On native, the banner is shown natively at the bottom
  // Just reserve the space
  if (isNative) {
    return <div style={{ height: `${bannerHeight}px` }} className="bg-[#1a1a2e]" />;
  }

  // Web fallback
  return (
    <div className="h-full bg-card/50 border-t border-border flex items-center justify-center">
      <ins 
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '50px'
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={ADSENSE_BANNER_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
