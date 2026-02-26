import { useState, useCallback, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Capacitor } from '@capacitor/core';
import { GameCanvas } from './components/GameCanvas';
import { GameControls } from './components/GameControls';
import { AdMobBanner } from './components/AdMobBanner';
import { AdSenseInterstitial } from './components/AdSenseInterstitial';
import { initializeAdMob, useInterstitialAds } from './hooks/useAdMob';

function App() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [armySize, setArmySize] = useState(1);
  const [scoreForNextLevel, setScoreForNextLevel] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useKV<number>('stickman-runner-high-score', 0);

  // Initialize AdMob on mount
  useEffect(() => {
    initializeAdMob();
    // Ensure status bar doesn't overlap content
    if (Capacitor.isNativePlatform()) {
      import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
        StatusBar.setOverlaysWebView({ overlay: false });
        StatusBar.setStyle({ style: Style.Dark });
        StatusBar.setBackgroundColor({ color: '#1a1a2e' });
      }).catch(() => {});
    }
    console.log('Game initialized');
  }, []);

  // Show interstitial ads ONLY on game over, NOT on level up
  useInterstitialAds(score, level, isGameOver, {
    onGameOver: true,
    onLevelUp: false,  // Disabled - too intrusive
    levelInterval: 5,
  });

  const handleScoreUpdate = useCallback((newScore: number, newLevel: number, newArmySize: number, newScoreForNextLevel: number) => {
    setScore(newScore);
    setLevel(newLevel);
    setArmySize(newArmySize);
    setScoreForNextLevel(newScoreForNextLevel);
    setIsGameOver(false);
    setIsPaused(false);
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setIsGameOver(true);
    setHighScore((currentHigh) => Math.max(currentHigh || 0, finalScore));
  }, [setHighScore]);

  const handleRestart = useCallback(() => {
    window.location.reload();
  }, []);

  const handlePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header with game title and controls - compact */}
      <div className="px-4 py-2 bg-card/50 border-b border-border flex-shrink-0" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))' }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-2 flex-wrap">
          <h1 className="text-lg sm:text-2xl font-bold text-primary whitespace-nowrap">Stickman Runner</h1>
          
          <GameControls
            score={score}
            level={level}
            armySize={armySize}
            scoreForNextLevel={scoreForNextLevel}
            highScore={highScore || 0}
            isGameOver={isGameOver}
            isPaused={isPaused}
            onRestart={handleRestart}
            onPause={handlePause}
          />
        </div>
      </div>

      {/* Full screen game canvas */}
      <div className="flex-1 min-h-0 relative">
        <GameCanvas
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
        />
      </div>

      {/* Bottom instructions - only on web (not useful on mobile touch devices) */}
      {!Capacitor.isNativePlatform() && (
        <div className="px-4 py-2 bg-card/30 border-t border-border flex-shrink-0">
          <div className="text-center text-sm text-muted-foreground max-w-7xl mx-auto">
            <p>Move your mouse or touch the screen to control your army • Click to pause/unpause</p>
          </div>
        </div>
      )}

      {/* Ad Banner - adaptive height, always visible */}
      <div className="flex-shrink-0 bg-[#1a1a2e] overflow-hidden">
        <AdMobBanner />
      </div>

      {/* AdSense Interstitial - web only, shown on game over */}
      <AdSenseInterstitial
        isGameOver={isGameOver}
        level={level}
        score={score}
        onRestart={handleRestart}
      />
    </div>
  );
}

export default App;
