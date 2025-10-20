import { GameState, Stickman, Obstacle, Bonus, DeathEffect, GAME_CONFIG } from '../types/game';

export class GameEngine {
  private gameState: GameState;
  private lastObstacleY: number = -50;
  private lastBonusY: number = -100;
  private lastEventSpawnY: number = 0;
  private mouseX: number = GAME_CONFIG.CANVAS_WIDTH / 2;
  private mouseY: number = GAME_CONFIG.CANVAS_HEIGHT - 180;
  private frameCounter: number = 0; // Add frame counter for optimization
  private lastScoreForLevel: number = 0; // Cache last score to avoid unnecessary level calculations

  private getRandomStrongColor(): string {
    const strongColors = [
      'oklch(0.65 0.25 0)',    // Red
      'oklch(0.65 0.25 30)',   // Orange-Red
      'oklch(0.70 0.20 60)',   // Yellow
      'oklch(0.65 0.25 120)',  // Green
      'oklch(0.65 0.25 180)',  // Cyan
      'oklch(0.65 0.25 240)',  // Blue
      'oklch(0.65 0.25 270)',  // Purple
      'oklch(0.65 0.25 300)',  // Magenta
      'oklch(0.70 0.20 15)',   // Coral
      'oklch(0.60 0.25 160)',  // Teal
      'oklch(0.65 0.25 90)',   // Lime
      'oklch(0.60 0.25 210)',  // Sky Blue
    ];
    return strongColors[Math.floor(Math.random() * strongColors.length)];
  }

  constructor() {
    this.gameState = this.createInitialState();
  }

  private createInitialState(): GameState {
    const centerX = GAME_CONFIG.CANVAS_WIDTH / 2;
    const startY = GAME_CONFIG.CANVAS_HEIGHT - 180; // Increased margin for finger clearance
    
    return {
      stickmen: [this.createStickman('initial', centerX, startY)],
      obstacles: [],
      bonuses: [],
      score: 0,
      level: 1,
      speed: GAME_CONFIG.BASE_SPEED,
      isGameOver: false,
      isPaused: false,
      deathEffects: [],
    };
  }

  private createStickman(id: string, x: number, y: number): Stickman {
    const spacing = GAME_CONFIG.FORMATION_SPACING;
    return {
      id,
      x,
      y,
      targetX: x,
      targetY: y,
      speed: 2,
      color: this.getRandomStrongColor(),
      velocityX: 0,
      velocityY: 0,
      formationOffsetX: (Math.random() - 0.5) * spacing * 0.3,
      formationOffsetY: (Math.random() - 0.5) * spacing * 0.3,
      direction: 'idle',
      lastX: x,
      lastY: y,
    };
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  restart() {
    this.gameState = this.createInitialState();
    this.lastObstacleY = -50;
    this.lastBonusY = -100;
    this.lastEventSpawnY = 0;
    this.mouseX = GAME_CONFIG.CANVAS_WIDTH / 2;
    this.mouseY = GAME_CONFIG.CANVAS_HEIGHT - 180;
    this.frameCounter = 0; // Reset frame counter
    this.lastScoreForLevel = 0; // Reset score cache
    (this as any).delayedSpawnCount = 0; // Clear any pending delayed spawns
  }

  pause() {
    this.gameState.isPaused = !this.gameState.isPaused;
  }

  getCurrentArmyPosition(): number {
    if (this.gameState.stickmen.length === 0) return this.mouseX;
    
    // Return the average X position of all stickmen
    const totalX = this.gameState.stickmen.reduce((sum, stickman) => sum + stickman.x, 0);
    return totalX / this.gameState.stickmen.length;
  }

  setMousePosition(x: number, y?: number) {
    this.mouseX = x;
    if (y !== undefined) {
      // Allow movement up to 75% of screen height, clamped between that and bottom margin
      const minY = GAME_CONFIG.CANVAS_HEIGHT * 0.25; // 75% of screen height (25% from top)
      const maxY = GAME_CONFIG.CANVAS_HEIGHT - 180; // Bottom margin for finger clearance
      this.mouseY = Math.max(minY, Math.min(maxY, y));
    }
  }

  moveStickmen(targetX: number, targetY?: number) {
    // Keep target within road bounds with max road width
    const roadMargin = 25;
    const effectiveCanvasWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.MAX_ROAD_WIDTH);
    const roadCenterX = GAME_CONFIG.CANVAS_WIDTH / 2;
    const roadHalfWidth = effectiveCanvasWidth / 2;
    const minX = Math.max(roadMargin, roadCenterX - roadHalfWidth + roadMargin);
    const maxX = Math.min(GAME_CONFIG.CANVAS_WIDTH - roadMargin, roadCenterX + roadHalfWidth - roadMargin);
    const boundedTargetX = Math.max(minX, Math.min(maxX, targetX));
    
    // Handle Y positioning if provided
    let boundedTargetY: number | undefined;
    if (targetY !== undefined) {
      const minY = GAME_CONFIG.CANVAS_HEIGHT * 0.25; // 75% of screen height (25% from top)
      const maxY = GAME_CONFIG.CANVAS_HEIGHT - 180; // Bottom margin for finger clearance
      boundedTargetY = Math.max(minY, Math.min(maxY, targetY));
    }
    
    // Set the center formation target for all stickmen
    // Individual formation positions will be calculated in updateStickmen()
    this.gameState.stickmen.forEach(stickman => {
      stickman.targetX = boundedTargetX; // This is the center X for formation
      if (boundedTargetY !== undefined) {
        stickman.targetY = boundedTargetY; // This is the center Y for formation
      }
    });
  }

  update() {
    if (this.gameState.isPaused || this.gameState.isGameOver) return;

    this.frameCounter++;
    
    // Always update these core game elements to maintain continuous movement
    this.updateObstacles();
    this.updateBonuses();
    this.spawnEvents(); // Combined spawn logic
    
    // Process any delayed spawning to prevent frame drops
    this.processDelayedSpawning();
    
    // Update stickmen every frame but with optimized processing
    this.updateStickmen();
    
    // Update death effects
    this.updateDeathEffects();
    
    // Check collisions every frame for responsiveness
    this.checkCollisions();
    
    // Only update level when score actually changes to prevent unnecessary calculations
    this.updateLevelIfNeeded();
    
    this.checkGameOver();
  }

  private updateStickmen() {
    // Keep army within bounds (road guardrails) with max road width
    const roadMargin = 25;
    const effectiveCanvasWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.MAX_ROAD_WIDTH);
    const roadCenterX = GAME_CONFIG.CANVAS_WIDTH / 2;
    const roadHalfWidth = effectiveCanvasWidth / 2;
    const minX = Math.max(roadMargin, roadCenterX - roadHalfWidth + roadMargin);
    const maxX = Math.min(GAME_CONFIG.CANVAS_WIDTH - roadMargin, roadCenterX + roadHalfWidth - roadMargin);
    const stickmenCount = this.gameState.stickmen.length;
    
    // Pre-calculate common values to avoid repeated calculations
    const baseY = this.mouseY; // Use mouse Y position instead of fixed position
    
    // Special handling for single stickman - direct positioning to avoid orbiting
    if (stickmenCount === 1) {
      const stickman = this.gameState.stickmen[0];
      if (stickman) {
        // Store last position for direction calculation
        stickman.lastX = stickman.x;
        stickman.lastY = stickman.y;
        
        // For single stickman, position directly at mouse cursor without formation offset
        const targetX = Math.max(minX, Math.min(maxX, stickman.targetX));
        const targetY = baseY;
        
        // Calculate distance to target
        const dx = targetX - stickman.x;
        const dy = targetY - stickman.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Use a tight threshold for single stickman - reduced to prevent orbiting
        const singleStickmanThreshold = 4; // Reduced from 8
        
        if (distance > singleStickmanThreshold) {
          // Move directly towards target with smooth acceleration
          const acceleration = 0.4; // Reduced from 0.6 to be less aggressive
          const maxSpeed = 4; // Reduced from 6
          
          const directionX = dx / distance;
          const directionY = dy / distance;
          
          stickman.velocityX += directionX * acceleration;
          stickman.velocityY += directionY * acceleration;
          
          // Limit speed
          const currentSpeed = Math.sqrt(stickman.velocityX * stickman.velocityX + stickman.velocityY * stickman.velocityY);
          if (currentSpeed > maxSpeed) {
            const speedRatio = maxSpeed / currentSpeed;
            stickman.velocityX *= speedRatio;
            stickman.velocityY *= speedRatio;
          }
        } else {
          // When close enough, stop completely to prevent orbiting
          stickman.velocityX *= 0.3; // Dampen instead of stop immediately
          stickman.velocityY *= 0.3;
          // Only snap if very close to prevent jitter
          if (distance < 2) {
            stickman.velocityX = 0;
            stickman.velocityY = 0;
            stickman.x = targetX;
            stickman.y = targetY;
          }
        }
        
        // Update position
        stickman.x += stickman.velocityX;
        stickman.y += stickman.velocityY;
        
        // Update direction based on movement
        this.updateStickmanDirection(stickman);
        
        // Keep within bounds
        if (stickman.x < minX) {
          stickman.x = minX;
          stickman.velocityX = 0;
        } else if (stickman.x > maxX) {
          stickman.x = maxX;
          stickman.velocityX = 0;
        }
      }
      return; // Early return for single stickman
    }
    
    // Multi-stickman formation logic
    // Physics constants for movement - reduced to minimize orbiting
    const acceleration = 0.6; // Reduced from 0.8
    const maxSpeed = 6; // Reduced from 8
    const friction = 0.8; // Increased friction from 0.85 to 0.8 for more damping
    
    // For large armies, only update position for a subset each frame
    const shouldOptimizeMovement = stickmenCount > 300;
    const updateBatchSize = shouldOptimizeMovement ? Math.min(50, Math.ceil(stickmenCount / 6)) : stickmenCount;
    const updateStartIndex = shouldOptimizeMovement ? (this.frameCounter * updateBatchSize) % stickmenCount : 0;
    const updateEndIndex = shouldOptimizeMovement ? Math.min(updateStartIndex + updateBatchSize, stickmenCount) : stickmenCount;
    
    // Process stickmen in batches for smooth movement, but optimize the calculation
    for (let i = updateStartIndex; i < updateEndIndex; i++) {
      const stickman = this.gameState.stickmen[i];
      
      if (!stickman) continue;
      
      // Store last position for direction calculation
      stickman.lastX = stickman.x;
      stickman.lastY = stickman.y;
      
      const formation = this.calculateFormationPosition(i, stickmenCount, stickman.formationOffsetX, stickman.formationOffsetY);
      
      // Calculate target position relative to mouse cursor
      const targetX = Math.max(minX, Math.min(maxX, stickman.targetX + formation.x));
      const targetY = baseY + formation.y;
      
      // Calculate distance to target
      const dx = targetX - stickman.x;
      const dy = targetY - stickman.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Use formation-aware threshold - reduced to minimize orbiting
      const formationThreshold = GAME_CONFIG.FORMATION_SPACING * 0.6; // Reduced from 0.8
      
      if (distance > formationThreshold) { 
        // Only move towards target if outside formation threshold
        // Calculate desired velocity direction
        const directionX = dx / distance;
        const directionY = dy / distance;
        
        // Apply acceleration towards target
        stickman.velocityX += directionX * acceleration;
        stickman.velocityY += directionY * acceleration;
        
        // Limit maximum speed
        const currentSpeed = Math.sqrt(stickman.velocityX * stickman.velocityX + stickman.velocityY * stickman.velocityY);
        if (currentSpeed > maxSpeed) {
          const speedRatio = maxSpeed / currentSpeed;
          stickman.velocityX *= speedRatio;
          stickman.velocityY *= speedRatio;
        }
      } else {
        // When in formation position, gradually slow down and run in place
        // Apply stronger friction when in formation to reduce orbiting
        stickman.velocityX *= friction;
        stickman.velocityY *= friction;
        
        // Stop tiny movements that cause jitter - increased threshold
        if (Math.abs(stickman.velocityX) < 0.2) stickman.velocityX = 0; // Increased from 0.1
        if (Math.abs(stickman.velocityY) < 0.2) stickman.velocityY = 0; // Increased from 0.1
      }
      
      // Update position based on velocity
      stickman.x += stickman.velocityX;
      stickman.y += stickman.velocityY;
      
      // Update direction based on movement
      this.updateStickmanDirection(stickman);
      
      // Keep within road bounds and stop at boundaries
      if (stickman.x < minX) {
        stickman.x = minX;
        stickman.velocityX = Math.max(0, stickman.velocityX); // Stop negative velocity
      } else if (stickman.x > maxX) {
        stickman.x = maxX;
        stickman.velocityX = Math.min(0, stickman.velocityX); // Stop positive velocity
      }
    }
  }

  private calculateFormationPosition(index: number, total: number, offsetX: number, offsetY: number) {
    const spacing = GAME_CONFIG.FORMATION_SPACING;
    
    // Use rectangular/square grid formation for all army sizes
    // Calculate optimal grid dimensions
    const cols = Math.min(Math.ceil(Math.sqrt(total)), 12); // Max 12 columns for wider formations
    const row = Math.floor(index / cols);
    const col = index % cols;
    const rowWidth = Math.min(cols, total - row * cols);
    
    // Calculate base position in grid
    const baseX = (col - (rowWidth - 1) / 2) * spacing;
    const baseY = row * spacing;
    
    // Use the pre-calculated stable offsets instead of generating new random values
    return {
      x: baseX + offsetX,
      y: baseY + offsetY,
    };
  }

  private updateObstacles() {
    this.gameState.obstacles = this.gameState.obstacles.filter(obstacle => {
      obstacle.y += this.gameState.speed;

      if (obstacle.type === 'ball') {
        obstacle.x += (obstacle.direction || 1) * (obstacle.speed || 1);
        const roadMargin = 25;
        const effectiveCanvasWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.MAX_ROAD_WIDTH);
        const roadCenterX = GAME_CONFIG.CANVAS_WIDTH / 2;
        const roadHalfWidth = effectiveCanvasWidth / 2;
        const roadStartX = Math.max(roadMargin, roadCenterX - roadHalfWidth + roadMargin);
        const roadEndX = Math.min(GAME_CONFIG.CANVAS_WIDTH - roadMargin, roadCenterX + roadHalfWidth - roadMargin);
        
        // Ensure ball actually touches the road edges by checking bounds more strictly
        if (obstacle.x <= roadStartX) {
          obstacle.x = roadStartX; // Snap to edge
          obstacle.direction = 1; // Move right
        } else if (obstacle.x + obstacle.width >= roadEndX) {
          obstacle.x = roadEndX - obstacle.width; // Snap to edge
          obstacle.direction = -1; // Move left
        }
      }

      if (obstacle.type === 'door') {
        obstacle.openTimer = (obstacle.openTimer || 0) + 1;
        if (obstacle.openTimer > 120) { // Increased from 60 to 120 frames (doubled duration)
          obstacle.isOpen = !obstacle.isOpen;
          obstacle.openTimer = 0;
        }
      }

      if (obstacle.y > GAME_CONFIG.CANVAS_HEIGHT + 50) {
        // Award points equal to current army size when obstacle despawns
        this.gameState.score += this.gameState.stickmen.length;
        return false;
      }

      return true;
    });
  }

  private updateBonuses() {
    this.gameState.bonuses = this.gameState.bonuses.filter(bonus => {
      // Remove collected bonuses
      if (bonus.collected) {
        return false;
      }
      
      bonus.y += this.gameState.speed;
      return bonus.y < GAME_CONFIG.CANVAS_HEIGHT + 50;
    });
  }

  private spawnEvents() {
    // Ensure there's always at least one obstacle or bonus on screen
    const hasActiveEvents = this.gameState.obstacles.length > 0 || this.gameState.bonuses.length > 0;
    const minSpawnDistance = 100;
    
    // Force spawn if no events or if enough distance has passed
    const shouldForceSpawn = !hasActiveEvents || this.lastEventSpawnY > minSpawnDistance;
    const randomSpawnChance = Math.random() < 0.04; // Increased spawn rate
    
    if (shouldForceSpawn || randomSpawnChance) {
      // Check if we can spawn without overlapping
      const canSpawnObstacle = this.canSpawnAtY(-50, 'obstacle');
      const canSpawnBonus = this.canSpawnAtY(-50, 'bonus');
      
      // Decide whether to spawn obstacle or bonus (70% obstacle, 30% bonus)
      if (Math.random() < 0.7 && canSpawnObstacle) {
        this.spawnObstacle();
        this.lastEventSpawnY = 0;
      } else if (canSpawnBonus) {
        this.spawnBonus();
        this.lastEventSpawnY = 0;
      }
    } else {
      this.lastEventSpawnY += this.gameState.speed;
    }
  }

  private canSpawnAtY(y: number, type: 'obstacle' | 'bonus'): boolean {
    const minDistance = 120; // Increased vertical spacing between events
    
    // Check against existing obstacles
    for (const obstacle of this.gameState.obstacles) {
      if (Math.abs(obstacle.y - y) < minDistance) {
        return false;
      }
    }
    
    // Check against existing bonuses
    for (const bonus of this.gameState.bonuses) {
      if (Math.abs(bonus.y - y) < minDistance) {
        return false;
      }
    }
    
    return true;
  }

  private spawnObstacle() {
    const obstacleType = Math.random();
    let obstacle: Obstacle;

    if (obstacleType < 0.4) {
      obstacle = this.createWallObstacle();
    } else if (obstacleType < 0.7) {
      obstacle = this.createBallObstacle();
    } else {
      obstacle = this.createDoorObstacle();
    }

    this.gameState.obstacles.push(obstacle);
    this.lastObstacleY = obstacle.y;
  }

  private spawnBonus() {
    const bonus = this.createBonus();
    this.gameState.bonuses.push(bonus);
    this.lastBonusY = bonus.y;
  }

  private createWallObstacle(): Obstacle {
    const roadMargin = 25;
    const effectiveCanvasWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.MAX_ROAD_WIDTH);
    const roadCenterX = GAME_CONFIG.CANVAS_WIDTH / 2;
    const roadHalfWidth = effectiveCanvasWidth / 2;
    const roadStartX = Math.max(roadMargin, roadCenterX - roadHalfWidth + roadMargin);
    const roadEndX = Math.min(GAME_CONFIG.CANVAS_WIDTH - roadMargin, roadCenterX + roadHalfWidth - roadMargin);
    const roadWidth = roadEndX - roadStartX;
    const laneWidth = roadWidth / 2;
    const maxWidth = laneWidth * 0.8; // Obstacle can be up to 80% of lane width
    const width = Math.random() * maxWidth + 25;
    
    // Place randomly in left or right lane
    const leftLane = Math.random() > 0.5;
    const x = leftLane 
      ? roadStartX + Math.random() * (laneWidth - width) // Random position in left lane
      : roadStartX + laneWidth + Math.random() * (laneWidth - width); // Random position in right lane
    
    return {
      id: Math.random().toString(36),
      type: 'wall',
      x,
      y: -25,
      width,
      height: 15,
    };
  }

  private createBallObstacle(): Obstacle {
    const roadMargin = 25;
    const effectiveCanvasWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.MAX_ROAD_WIDTH);
    const roadCenterX = GAME_CONFIG.CANVAS_WIDTH / 2;
    const roadHalfWidth = effectiveCanvasWidth / 2;
    const roadStartX = Math.max(roadMargin, roadCenterX - roadHalfWidth + roadMargin);
    const roadEndX = Math.min(GAME_CONFIG.CANVAS_WIDTH - roadMargin, roadCenterX + roadHalfWidth - roadMargin);
    const roadWidth = roadEndX - roadStartX;
    const laneWidth = roadWidth / 2;
    const size = 20;
    
    // Place randomly in left or right lane
    const leftLane = Math.random() > 0.5;
    const laneStartX = leftLane ? roadStartX : roadStartX + laneWidth;
    const x = laneStartX + Math.random() * (laneWidth - size);
    
    return {
      id: Math.random().toString(36),
      type: 'ball',
      x,
      y: -25,
      width: size,
      height: size,
      speed: 0.3 + Math.random() * 0.4, // Reduced from 1-3 to 0.3-0.7
      direction: Math.random() > 0.5 ? 1 : -1, // Random initial direction
    };
  }

  private createDoorObstacle(): Obstacle {
    const roadMargin = 25;
    const effectiveCanvasWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.MAX_ROAD_WIDTH);
    const roadCenterX = GAME_CONFIG.CANVAS_WIDTH / 2;
    const roadHalfWidth = effectiveCanvasWidth / 2;
    const roadStartX = Math.max(roadMargin, roadCenterX - roadHalfWidth + roadMargin);
    const roadEndX = Math.min(GAME_CONFIG.CANVAS_WIDTH - roadMargin, roadCenterX + roadHalfWidth - roadMargin);
    const roadWidth = roadEndX - roadStartX;
    const laneWidth = roadWidth / 2;
    const maxWidth = laneWidth * 0.8; // Obstacle can be up to 80% of lane width
    const width = Math.random() * maxWidth + 25;
    
    // Place randomly in left or right lane
    const leftLane = Math.random() > 0.5;
    const x = leftLane 
      ? roadStartX + Math.random() * (laneWidth - width) // Random position in left lane
      : roadStartX + laneWidth + Math.random() * (laneWidth - width); // Random position in right lane
    
    return {
      id: Math.random().toString(36),
      type: 'door',
      x,
      y: -25,
      width,
      height: 15,
      isOpen: Math.random() > 0.5,
      openTimer: 0,
    };
  }

  private createBonus(): Bonus {
    const roadMargin = 25;
    const effectiveCanvasWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.MAX_ROAD_WIDTH);
    const roadCenterX = GAME_CONFIG.CANVAS_WIDTH / 2;
    const roadHalfWidth = effectiveCanvasWidth / 2;
    const roadStartX = Math.max(roadMargin, roadCenterX - roadHalfWidth + roadMargin);
    const roadEndX = Math.min(GAME_CONFIG.CANVAS_WIDTH - roadMargin, roadCenterX + roadHalfWidth - roadMargin);
    const roadWidth = roadEndX - roadStartX;
    const laneWidth = roadWidth / 2;
    const maxWidth = laneWidth * 0.9; // Bonus can be up to 90% of lane width
    const width = Math.random() * maxWidth + 50;
    
    // Place randomly in left or right lane
    const leftLane = Math.random() > 0.5;
    const x = leftLane 
      ? roadStartX + Math.random() * (laneWidth - width) // Random position in left lane
      : roadStartX + laneWidth + Math.random() * (laneWidth - width); // Random position in right lane
    
    const typeRand = Math.random() * 100; // Use percentage for clearer odds
    const currentArmySize = this.gameState.stickmen.length;
    
    let type: 'add' | 'multiply' | 'percentage';
    let value: number;

    // Adjust odds: +35%, -35%, %20%, x10%
    // If army size > 50, don't spawn multiplier bonuses (redistribute to other types)
    if (currentArmySize > 50) {
      // No multiplier bonuses: +38.9%, -38.9%, %22.2%
      if (typeRand < 38.9) {
        type = 'add';
        value = Math.floor(Math.random() * 21) + 1; // +1 to +21
      } else if (typeRand < 77.8) {
        type = 'add';
        value = -(Math.floor(Math.random() * 20) + 1); // -1 to -20
      } else {
        type = 'percentage';
        value = Math.floor(Math.random() * 4) + 2; // 2 to 5 (division value)
      }
    } else {
      // Normal odds: +35%, -35%, %20%, x10%
      if (typeRand < 35) {
        type = 'add';
        value = Math.floor(Math.random() * 21) + 1; // +1 to +21
      } else if (typeRand < 70) {
        type = 'add';
        value = -(Math.floor(Math.random() * 20) + 1); // -1 to -20
      } else if (typeRand < 90) {
        type = 'percentage';
        value = Math.floor(Math.random() * 4) + 2; // 2 to 5 (division value)
      } else {
        type = 'multiply';
        value = Math.floor(Math.random() * 4) + 2; // 2x to 5x
      }
    }

    return {
      id: Math.random().toString(36),
      type,
      x,
      y: -25,
      width,
      height: 20,
      value,
      collected: false,
    };
  }

  private checkCollisions() {
    // Optimize collision checks by limiting frequency for large armies
    const stickmenCount = this.gameState.stickmen.length;
    const shouldOptimize = stickmenCount > 100; // Reduced threshold
    
    // For large armies, only check a smaller subset of stickmen per frame
    const batchSize = shouldOptimize ? Math.min(25, Math.ceil(stickmenCount / 8)) : stickmenCount; // Reduced batch size
    const checkStartIndex = shouldOptimize ? (this.frameCounter * batchSize) % stickmenCount : 0;
    const checkEndIndex = shouldOptimize ? Math.min(checkStartIndex + batchSize, stickmenCount) : stickmenCount;
    
    const stickmenToRemove: number[] = [];
    
    // Check obstacle collisions efficiently
    for (let i = checkStartIndex; i < checkEndIndex; i++) {
      const stickman = this.gameState.stickmen[i];
      if (!stickman) continue; // Safety check
      
      for (const obstacle of this.gameState.obstacles) {
        // Skip if door is open
        if (obstacle.type === 'door' && obstacle.isOpen) continue;
        
        // Early exit if obstacle is too far away vertically
        if (Math.abs(obstacle.y - stickman.y) > 30) continue;
        
        if (this.isColliding(stickman, obstacle)) {
          stickmenToRemove.push(i);
          break; // No need to check more obstacles for this stickman
        }
      }
    }

    // Remove collided stickmen efficiently (in reverse order to maintain indices)
    for (let i = stickmenToRemove.length - 1; i >= 0; i--) {
      const indexToRemove = stickmenToRemove[i];
      if (indexToRemove >= 0 && indexToRemove < this.gameState.stickmen.length) {
        const stickman = this.gameState.stickmen[indexToRemove];
        // Create death effect before removing stickman
        this.createDeathEffect(stickman.x, stickman.y, stickman.color);
        this.gameState.stickmen.splice(indexToRemove, 1);
      }
    }

    // Check bonus collections efficiently - check all stickmen for bonuses
    for (const bonus of this.gameState.bonuses) {
      if (bonus.collected) continue;
      
      // Check all stickmen for bonus collision, not just the first few
      for (let i = 0; i < stickmenCount; i++) {
        const stickman = this.gameState.stickmen[i];
        if (!stickman) continue;
        
        // Early exit if bonus is too far away vertically
        if (Math.abs(bonus.y - stickman.y) > 30) continue;
        
        if (this.isColliding(stickman, bonus)) {
          bonus.collected = true;
          // Apply bonus immediately to prevent lag accumulation
          this.applyBonus(bonus);
          break; // Stop checking other stickmen for this bonus
        }
      }
    }
  }

  private isColliding(stickman: Stickman, obj: Obstacle | Bonus): boolean {
    const stickmanSize = GAME_CONFIG.STICKMAN_SIZE;
    return (
      stickman.x - stickmanSize < obj.x + obj.width &&
      stickman.x + stickmanSize > obj.x &&
      stickman.y - stickmanSize < obj.y + obj.height &&
      stickman.y + stickmanSize > obj.y
    );
  }

  private applyBonus(bonus: Bonus) {
    const currentCount = this.gameState.stickmen.length;
    let newCount = currentCount;

    switch (bonus.type) {
      case 'add':
        newCount = Math.max(0, currentCount + bonus.value);
        break;
      case 'multiply':
        newCount = currentCount * bonus.value;
        break;
      case 'percentage':
        // Divide by the value and round down to int
        newCount = Math.floor(currentCount / bonus.value);
        break;
    }

    // Clamp the new count to prevent excessive stickmen - increased limit
    newCount = Math.min(newCount, 2000); // Increased from 1000 to 2000 to allow larger armies

    if (newCount > currentCount) {
      // Increase spawn rate for better responsiveness
      const maxSpawnPerFrame = 15; // Increased from 10 to 15
      const actualNewCount = Math.min(newCount, currentCount + maxSpawnPerFrame);
      
      // Pre-calculate common values once with road width limit
      const roadMargin = 50;
      const effectiveCanvasWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.MAX_ROAD_WIDTH);
      const roadCenterX = GAME_CONFIG.CANVAS_WIDTH / 2;
      const roadHalfWidth = effectiveCanvasWidth / 2;
      const minX = Math.max(roadMargin, roadCenterX - roadHalfWidth + roadMargin);
      const maxX = Math.min(GAME_CONFIG.CANVAS_WIDTH - roadMargin, roadCenterX + roadHalfWidth - roadMargin);
      const boundedMouseX = Math.max(minX, Math.min(maxX, this.mouseX));
      const spawnY = this.mouseY; // Use mouse Y position for spawning
      
      // Batch create stickmen to minimize individual object creation overhead
      const spawnCount = actualNewCount - currentCount;
      if (spawnCount > 0) {
        const newStickmen: Stickman[] = new Array(spawnCount);
        
        for (let i = 0; i < spawnCount; i++) {
          // More scattered spawn positioning around mouse cursor
          const angle = Math.random() * 2 * Math.PI;
          const radius = Math.random() * 40 + 10; // 10-50 pixel radius from mouse
          const spreadX = Math.cos(angle) * radius;
          const spreadY = Math.sin(angle) * radius;
          const spawnX = Math.max(minX, Math.min(maxX, boundedMouseX + spreadX));
          
          newStickmen[i] = this.createStickman(`stickman-${Date.now()}-${i}`, spawnX, spawnY + spreadY);
        }
        
        // Add all new stickmen at once
        this.gameState.stickmen.push(...newStickmen);
      }
      
      // If we still need more stickmen, defer spawning to prevent frame drops
      if (actualNewCount < newCount) {
        this.scheduleDelayedSpawning(newCount - actualNewCount);
      }
    } else if (newCount < currentCount) {
      // Remove stickmen efficiently
      this.gameState.stickmen.length = newCount;
    }
  }

  private scheduleDelayedSpawning(count: number) {
    // Store delayed spawn count to process over multiple frames
    (this as any).delayedSpawnCount = ((this as any).delayedSpawnCount || 0) + count;
  }

  private processDelayedSpawning() {
    const delayedCount = (this as any).delayedSpawnCount || 0;
    if (delayedCount <= 0) return;

    // Spawn more each frame for better responsiveness
    const spawnThisFrame = Math.min(delayedCount, 8); // Increased from 5 to 8
    
    const currentCount = this.gameState.stickmen.length;
    const roadMargin = 50;
    const effectiveCanvasWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.MAX_ROAD_WIDTH);
    const roadCenterX = GAME_CONFIG.CANVAS_WIDTH / 2;
    const roadHalfWidth = effectiveCanvasWidth / 2;
    const minX = Math.max(roadMargin, roadCenterX - roadHalfWidth + roadMargin);
    const maxX = Math.min(GAME_CONFIG.CANVAS_WIDTH - roadMargin, roadCenterX + roadHalfWidth - roadMargin);
    const boundedMouseX = Math.max(minX, Math.min(maxX, this.mouseX));
    const spawnY = this.mouseY; // Use mouse Y position for spawning
    
    // Batch create for efficiency
    const newStickmen: Stickman[] = new Array(spawnThisFrame);
    for (let i = 0; i < spawnThisFrame; i++) {
      // More scattered spawn positioning around mouse cursor
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 40 + 10; // 10-50 pixel radius from mouse
      const spreadX = Math.cos(angle) * radius;
      const spreadY = Math.sin(angle) * radius;
      const spawnX = Math.max(minX, Math.min(maxX, boundedMouseX + spreadX));
      
      newStickmen[i] = this.createStickman(`stickman-delayed-${Date.now()}-${i}`, spawnX, spawnY + spreadY);
    }
    
    this.gameState.stickmen.push(...newStickmen);
    (this as any).delayedSpawnCount = delayedCount - spawnThisFrame;
  }

  private updateLevelIfNeeded() {
    // Only recalculate level if score has changed
    if (this.gameState.score === this.lastScoreForLevel) return;
    
    this.lastScoreForLevel = this.gameState.score;
    this.updateLevel();
  }

  private updateLevel() {
    // Simplified level calculation to prevent periodic lag
    let newLevel = 1;
    let score = this.gameState.score;
    
    // First 5 levels: every 100 points
    if (score >= 100) {
      newLevel = Math.min(5, Math.floor(score / 100) + 1);
      score -= (newLevel - 1) * 100;
    }
    
    // After level 5: progressively harder (200, 300, 400, etc.)
    if (newLevel === 5 && score >= 100) {
      score -= 100; // Remove the 100 points for level 5
      let extraLevels = 0;
      let threshold = 200;
      
      while (score >= threshold) {
        score -= threshold;
        extraLevels++;
        threshold += 100; // Next threshold increases by 100
      }
      
      newLevel = 5 + extraLevels;
    }
    
    if (newLevel > this.gameState.level) {
      this.gameState.level = newLevel;
      this.gameState.speed = GAME_CONFIG.BASE_SPEED + (newLevel - 1) * GAME_CONFIG.SPEED_INCREMENT;
    }
  }

  getScoreForNextLevel(): number {
    const currentLevel = this.gameState.level;
    const nextLevel = currentLevel + 1;
    
    if (nextLevel <= 5) {
      return nextLevel * 100;
    } else {
      // Calculate cumulative score needed for the next level beyond 5
      let cumulativeScore = 500; // First 5 levels (100 each)
      let threshold = 200;
      
      for (let level = 6; level <= nextLevel; level++) {
        cumulativeScore += threshold;
        threshold += 100;
      }
      
      return cumulativeScore;
    }
  }

  private updateStickmanDirection(stickman: Stickman) {
    const dx = stickman.x - stickman.lastX;
    const dy = stickman.y - stickman.lastY;
    const minMovement = 0.5; // Threshold to avoid jitter when idle
    
    // If movement is too small, keep current direction or set to idle
    if (Math.abs(dx) < minMovement && Math.abs(dy) < minMovement) {
      if (stickman.direction !== 'idle') {
        // Only change to idle if currently moving
        stickman.direction = 'idle';
      }
      return;
    }
    
    // Calculate angle of movement
    const angle = Math.atan2(dy, dx);
    const degrees = (angle * 180) / Math.PI;
    
    // Convert angle to 8-directional movement
    // Normalize degrees to 0-360
    const normalizedDegrees = ((degrees + 360) % 360);
    
    // 8 directions with 45-degree segments
    if (normalizedDegrees >= 337.5 || normalizedDegrees < 22.5) {
      stickman.direction = 'right';
    } else if (normalizedDegrees >= 22.5 && normalizedDegrees < 67.5) {
      stickman.direction = 'down-right';
    } else if (normalizedDegrees >= 67.5 && normalizedDegrees < 112.5) {
      stickman.direction = 'down';
    } else if (normalizedDegrees >= 112.5 && normalizedDegrees < 157.5) {
      stickman.direction = 'down-left';
    } else if (normalizedDegrees >= 157.5 && normalizedDegrees < 202.5) {
      stickman.direction = 'left';
    } else if (normalizedDegrees >= 202.5 && normalizedDegrees < 247.5) {
      stickman.direction = 'up-left';
    } else if (normalizedDegrees >= 247.5 && normalizedDegrees < 292.5) {
      stickman.direction = 'up';
    } else if (normalizedDegrees >= 292.5 && normalizedDegrees < 337.5) {
      stickman.direction = 'up-right';
    }
  }

  private createDeathEffect(x: number, y: number, color: string) {
    const particles: Array<{
      x: number;
      y: number;
      velocityX: number;
      velocityY: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }> = [];
    const particleCount = 8; // Number of particles for death effect
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3; // Random speed between 2-5
      const life = 30 + Math.random() * 20; // Random life between 30-50 frames
      
      particles.push({
        x: x,
        y: y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: life,
        maxLife: life,
        color: color,
        size: 2 + Math.random() * 2, // Size between 2-4
      });
    }
    
    const deathEffect: DeathEffect = {
      id: `death-${Date.now()}-${Math.random()}`,
      x: x,
      y: y,
      particles: particles,
      lifetime: 0,
      maxLifetime: 60, // Total effect duration
    };
    
    this.gameState.deathEffects.push(deathEffect);
  }

  private updateDeathEffects() {
    this.gameState.deathEffects = this.gameState.deathEffects.filter(effect => {
      effect.lifetime++;
      
      // Update particles
      effect.particles = effect.particles.filter(particle => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityX *= 0.98; // Slight friction
        particle.velocityY *= 0.98;
        particle.life--;
        
        return particle.life > 0;
      });
      
      // Remove effect if expired or no particles left
      return effect.lifetime < effect.maxLifetime && effect.particles.length > 0;
    });
  }

  private checkGameOver() {
    if (this.gameState.stickmen.length === 0) {
      this.gameState.isGameOver = true;
    }
  }
}