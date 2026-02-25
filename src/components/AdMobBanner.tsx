import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAdMobBanner } from '../hooks/useAdMob';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const ADSENSE_CLIENT_ID = 'ca-pub-6338497362113540';
const ADSENSE_BANNER_SLOT = '4586258327';

export const AdMobBanner: React.FC = () => {
  const { isNative, bannerHeight } = useAdMobBanner();
  const adPushedRef = useRef(false);
  const insRef = useRef<HTMLModElement>(null);

  // Push ad after the ins element is mounted
  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;
    if (adPushedRef.current) return;
    if (!insRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adPushedRef.current = true;
    } catch (error) {
      console.error('AdSense banner error:', error);
    }
  }, []);

  // On native, just reserve space for the AdMob banner
  if (isNative) {
    return <div style={{ height: `${bannerHeight}px` }} className="bg-[#1a1a2e]" />;
  }

  return (
    <div className="h-full bg-card/50 border-t border-border flex items-center justify-center">
      <ins
        ref={insRef}
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
