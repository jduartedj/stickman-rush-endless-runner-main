
import { Button } from './ui/button';
import { Play, Pause, ArrowClockwise } from '@phosphor-icons/react';

interface GameControlsProps {
  score: number;
  level: number;
  armySize: number;
  scoreForNextLevel: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
  onRestart: () => void;
  onPause: () => void;
}

export function GameControls({
  score,
  level,
  armySize,
  scoreForNextLevel,
  highScore,
  isGameOver,
  isPaused,
  onRestart,
  onPause
}: GameControlsProps) {
  return (
    <div className="flex items-center gap-6">
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="text-center">
          <div className="font-bold text-accent">{score}/{scoreForNextLevel}</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-primary">{level}</div>
          <div className="text-xs text-muted-foreground">Level</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-secondary">{armySize}</div>
          <div className="text-xs text-muted-foreground">Army</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-foreground">{highScore}</div>
          <div className="text-xs text-muted-foreground">Best</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onRestart}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <ArrowClockwise className="w-4 h-4" />
          Restart
        </Button>
        
        {!isGameOver && (
          <Button
            onClick={onPause}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}
      </div>

      {/* Game Over Status */}
      {isGameOver && (
        <div className="text-sm text-destructive font-medium">
          Game Over - Click to restart
        </div>
      )}
    </div>
  );
}