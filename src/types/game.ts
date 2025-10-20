export interface Stickman {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  color: string;
  velocityX: number;
  velocityY: number;
  formationOffsetX: number;
  formationOffsetY: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'up-right' | 'up-left' | 'down-right' | 'down-left' | 'idle';
  lastX: number;
  lastY: number;
}

export interface DeathEffect {
  id: string;
  x: number;
  y: number;
  particles: Array<{
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
  }>;
  lifetime: number;
  maxLifetime: number;
}

export interface Obstacle {
  id: string;
  type: 'wall' | 'ball' | 'door';
  x: number;
  y: number;
  width: number;
  height: number;
  speed?: number;
  direction?: number;
  isOpen?: boolean;
  openTimer?: number;
}

export interface Bonus {
  id: string;
  type: 'add' | 'multiply' | 'percentage';
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  collected: boolean;
}

export interface GameState {
  stickmen: Stickman[];
  obstacles: Obstacle[];
  bonuses: Bonus[];
  score: number;
  level: number;
  speed: number;
  isGameOver: boolean;
  isPaused: boolean;
  deathEffects: DeathEffect[];
}

export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  BASE_SPEED: 1,
  SPEED_INCREMENT: 0.1, // Reduced from 0.2 to 0.1 (halved)
  OBSTACLE_SPAWN_RATE: 0.025,
  BONUS_SPAWN_RATE: 0.015,
  STICKMAN_SIZE: 12,
  FORMATION_SPACING: 30, // Increased to ensure at least 1 head size spacing between stickmen
  MAX_VISUAL_STICKMEN: 100,
  MAX_ROAD_WIDTH: 1500, // Maximum road width
} as {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  BASE_SPEED: number;
  SPEED_INCREMENT: number;
  OBSTACLE_SPAWN_RATE: number;
  BONUS_SPAWN_RATE: number;
  STICKMAN_SIZE: number;
  FORMATION_SPACING: number;
  MAX_VISUAL_STICKMEN: number;
  MAX_ROAD_WIDTH: number;
};