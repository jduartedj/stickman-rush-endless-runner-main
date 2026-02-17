
import { Card } from './ui/card';

export function GameInstructions() {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-foreground mb-4">How to Play</h2>
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
          <p><strong className="text-foreground">Move your army</strong> by moving your mouse or finger across the game area</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
          <p><strong className="text-foreground">Collect bonuses</strong> (orange barriers) to grow your army with multipliers (x2-x5), additions (+/-), or division (÷2-÷10)</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
          <p><strong className="text-foreground">Avoid obstacles</strong> - red walls, rolling balls, and closing doors will destroy stickmen on contact</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
          <p><strong className="text-foreground">Survive</strong> as long as possible - speed increases each level and the game ends when all stickmen are gone</p>
        </div>
      </div>
    </Card>
  );
}