import React, { useRef, useEffect, useCallback } from 'react';
import { GameEngine } from '../lib/gameEngine';
import { GameRenderer } from '../lib/gameRenderer';
import { GAME_CONFIG } from '../types/game';

interface GameCanvasProps {
  onScoreUpdate: (score: number, level: number, armySize: number, scoreForNextLevel: number) => void;
  onGameOver: (finalScore: number) => void;
}

export function GameCanvas({ onScoreUpdate, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | undefined>(undefined);
  const rendererRef = useRef<GameRenderer | undefined>(undefined);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mouseXRef = useRef<number>(400); // Will be updated dynamically
  const mouseYRef = useRef<number>(420); // Will be updated dynamically
  const lastTouchXRef = useRef<number>(400); // Will be updated dynamically
  const lastTouchYRef = useRef<number>(420); // Will be updated dynamically
  const isTouchingRef = useRef<boolean>(false);
  const lastUpdateRef = useRef<{score: number, level: number, armySize: number} | null>(null);

  const gameLoop = useCallback(() => {
    if (!engineRef.current || !rendererRef.current) return;

    const engine = engineRef.current;
    const renderer = rendererRef.current;

    // Update game state first
    engine.update();
    const gameState = engine.getGameState();

    // Render everything in one pass - batch all rendering operations
    renderer.clear();
    renderer.renderBonuses(gameState.bonuses);
    renderer.renderObstacles(gameState.obstacles);
    renderer.renderStickmen(gameState.stickmen);
    renderer.renderDeathEffects(gameState.deathEffects);

    // Update React state only when values actually change to avoid unnecessary re-renders
    const currentScore = gameState.score;
    const currentLevel = gameState.level;
    const currentArmySize = gameState.stickmen.length;
    const scoreForNextLevel = engine.getScoreForNextLevel();
    
    // Use ref to track previous values to avoid unnecessary updates
    const lastUpdate = lastUpdateRef.current;
    if (!lastUpdate || 
        lastUpdate.score !== currentScore || 
        lastUpdate.level !== currentLevel || 
        lastUpdate.armySize !== currentArmySize) {
      
      lastUpdateRef.current = { score: currentScore, level: currentLevel, armySize: currentArmySize };
      onScoreUpdate(currentScore, currentLevel, currentArmySize, scoreForNextLevel);
    }

    if (gameState.isGameOver) {
      renderer.renderGameOver(gameState.score);
      onGameOver(gameState.score);
      return; // Don't schedule next frame
    }

    // Always schedule the next frame for continuous movement
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [onScoreUpdate, onGameOver]);

  const startGame = useCallback(() => {
    if (!engineRef.current) return;
    
    engineRef.current.restart();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    gameLoop();
  }, [gameLoop]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    mouseXRef.current = (e.clientX - rect.left) * scaleX;
    mouseYRef.current = (e.clientY - rect.top) * scaleY;
    
    engineRef.current.moveStickmen(mouseXRef.current, mouseYRef.current);
    engineRef.current.setMousePosition(mouseXRef.current, mouseYRef.current);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;
    
    e.preventDefault();
    
    // Check if game is over and restart on touch
    const gameState = engineRef.current.getGameState();
    if (gameState.isGameOver) {
      startGame();
      return;
    }
    
    // Get current touch position
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const touch = e.touches[0];
    const touchX = (touch.clientX - rect.left) * scaleX;
    const touchY = (touch.clientY - rect.top) * scaleY;
    
    // When starting a new touch, use the current army position as the reference
    // This prevents the stickmen from jumping to the new touch location
    const currentArmyPosition = engineRef.current.getCurrentArmyPosition();
    
    // Store the offset between touch position and current army position
    const touchOffsetX = touchX - currentArmyPosition;
    
    // Update our tracking variables
    mouseXRef.current = currentArmyPosition;
    mouseYRef.current = touchY;
    lastTouchXRef.current = currentArmyPosition;
    lastTouchYRef.current = touchY;
    
    // Store the touch offset for use during touch move
    (engineRef.current as any).touchOffsetX = touchOffsetX;
    
    isTouchingRef.current = true;
  }, [startGame]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current || !isTouchingRef.current) return;
    
    e.preventDefault();
    
    // Don't allow movement if game is over
    const gameState = engineRef.current.getGameState();
    if (gameState.isGameOver) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const touch = e.touches[0];
    const touchX = (touch.clientX - rect.left) * scaleX;
    const touchY = (touch.clientY - rect.top) * scaleY;
    
    // Apply the offset from touch start to maintain relative positioning
    const touchOffsetX = (engineRef.current as any).touchOffsetX || 0;
    const newX = touchX - touchOffsetX;
    const newY = touchY; // No offset needed for Y since we want direct positioning
    
    mouseXRef.current = newX;
    mouseYRef.current = newY;
    lastTouchXRef.current = newX;
    lastTouchYRef.current = newY;
    
    engineRef.current.moveStickmen(newX, newY);
    engineRef.current.setMousePosition(newX, newY);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    // Don't reset touch state if game is over
    if (!engineRef.current) return;
    const gameState = engineRef.current.getGameState();
    if (gameState.isGameOver) return;
    
    // Clear the touch offset
    (engineRef.current as any).touchOffsetX = 0;
    
    isTouchingRef.current = false;
    // lastTouchXRef.current preserves the position for next touch
  }, []);

  const handleClick = useCallback(() => {
    if (!engineRef.current) return;
    
    const gameState = engineRef.current.getGameState();
    if (gameState.isGameOver) {
      startGame();
    } else {
      engineRef.current.pause();
    }
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match container size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Update game config for this session
      GAME_CONFIG.CANVAS_WIDTH = rect.width;
      GAME_CONFIG.CANVAS_HEIGHT = rect.height;
      
      // Update canvas style to ensure it fills exactly
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    // Initial size with a slight delay to ensure DOM is ready
    setTimeout(resizeCanvas, 100);
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    engineRef.current = new GameEngine();
    rendererRef.current = new GameRenderer(canvas);

    // Initialize mouse position to center of canvas - will be updated after resize
    setTimeout(() => {
      if (canvas) {
        mouseXRef.current = canvas.width / 2;
        mouseYRef.current = canvas.height - 180; // Default Y position
        lastTouchXRef.current = canvas.width / 2;
        lastTouchYRef.current = canvas.height - 180;
        if (engineRef.current) {
          engineRef.current.setMousePosition(mouseXRef.current, mouseYRef.current);
        }
      }
    }, 150);

    startGame();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startGame]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-background cursor-crosshair touch-none select-none"
      style={{
        width: '100%',
        height: '100%',
      }}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    />
  );
}