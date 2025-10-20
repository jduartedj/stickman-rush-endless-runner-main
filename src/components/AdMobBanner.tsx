import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Get AdMob configuration from GitHub environment variables (PROD environment)
const getAdMobConfig = () => {
  // In production, these will be injected by GitHub Actions/Deployment from PROD environment
  const ADMOB_APP_ID = process.env.VITE_ADMOB_APP_ID || import.meta.env.VITE_ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713';
  const ADMOB_BANNER_AD_UNIT_ID = process.env.VITE_ADMOB_BANNER_AD_UNIT_ID || import.meta.env.VITE_ADMOB_BANNER_AD_UNIT_ID || 'ca-app-pub-3940256099942544/6300978111';
  
  return { ADMOB_APP_ID, ADMOB_BANNER_AD_UNIT_ID };
};

const { ADMOB_APP_ID, ADMOB_BANNER_AD_UNIT_ID } = getAdMobConfig();

export const AdMobBanner: React.FC = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="h-full bg-card/50 border-t border-border flex items-center justify-center">
      <ins 
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '50px'
        }}
        data-ad-client={ADMOB_APP_ID}
        data-ad-slot={ADMOB_BANNER_AD_UNIT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};



