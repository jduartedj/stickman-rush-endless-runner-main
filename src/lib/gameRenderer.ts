import { Stickman, Obstacle, Bonus, DeathEffect, GAME_CONFIG } from '../types/game';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  
  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
  }

  clear() {
    // Use faster fillRect instead of complex background
    this.ctx.fillStyle = 'oklch(0.1 0.05 240)';
    this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    
    // Draw simplified guardrails
    this.renderGuardrails();
  }

  private renderGuardrails() {
    const roadMargin = 25;
    const effectiveCanvasWidth = Math.min(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.MAX_ROAD_WIDTH);
    const roadCenterX = GAME_CONFIG.CANVAS_WIDTH / 2;
    const roadHalfWidth = effectiveCanvasWidth / 2;
    const roadStartX = Math.max(roadMargin, roadCenterX - roadHalfWidth + roadMargin);
    const roadEndX = Math.min(GAME_CONFIG.CANVAS_WIDTH - roadMargin, roadCenterX + roadHalfWidth - roadMargin);
    
    // Left side background (before road)
    if (roadStartX > roadMargin) {
      this.ctx.fillStyle = 'oklch(0.4 0.1 240)';
      this.ctx.fillRect(0, 0, roadStartX - roadMargin, GAME_CONFIG.CANVAS_HEIGHT);
    }
    
    // Left guardrail
    this.ctx.fillStyle = 'oklch(0.4 0.1 240)';
    this.ctx.fillRect(roadStartX - roadMargin, 0, roadMargin, GAME_CONFIG.CANVAS_HEIGHT);
    
    // Right guardrail
    this.ctx.fillRect(roadEndX, 0, roadMargin, GAME_CONFIG.CANVAS_HEIGHT);
    
    // Right side background (after road)
    if (roadEndX + roadMargin < GAME_CONFIG.CANVAS_WIDTH) {
      this.ctx.fillStyle = 'oklch(0.4 0.1 240)';
      this.ctx.fillRect(roadEndX + roadMargin, 0, GAME_CONFIG.CANVAS_WIDTH - (roadEndX + roadMargin), GAME_CONFIG.CANVAS_HEIGHT);
    }
    
    // Road surface
    this.ctx.fillStyle = 'oklch(0.15 0.02 240)';
    this.ctx.fillRect(roadStartX, 0, roadEndX - roadStartX, GAME_CONFIG.CANVAS_HEIGHT);
    
    // Simplified center line (reduce visual complexity for performance)
    this.ctx.strokeStyle = 'oklch(0.6 0.05 60)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([15, 15]);
    this.ctx.beginPath();
    const centerX = (roadStartX + roadEndX) / 2;
    this.ctx.moveTo(centerX, 0);
    this.ctx.lineTo(centerX, GAME_CONFIG.CANVAS_HEIGHT);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  renderStickmen(stickmen: Stickman[]) {
    this.ctx.lineWidth = 2;

    const visibleCount = Math.min(stickmen.length, GAME_CONFIG.MAX_VISUAL_STICKMEN);
    const time = Date.now() * 0.005; // Slower animation for more realistic running
    
    for (let i = 0; i < visibleCount; i++) {
      const stickman = stickmen[i];
      // Offset animation slightly for each stickman to avoid synchronized movement
      const animationOffset = i * 0.3;
      this.renderSingleStickman(stickman.x, stickman.y, stickman.color, time + animationOffset, stickman.direction);
    }

    if (stickmen.length > GAME_CONFIG.MAX_VISUAL_STICKMEN) {
      this.ctx.fillStyle = 'oklch(0.85 0.15 90)';
      this.ctx.font = 'bold 12px Inter';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        `+${stickmen.length - GAME_CONFIG.MAX_VISUAL_STICKMEN}`,
        GAME_CONFIG.CANVAS_WIDTH / 2,
        20
      );
    }
  }

  private renderSingleStickman(x: number, y: number, color: string, time: number = 0, direction: string = 'idle') {
    const size = GAME_CONFIG.STICKMAN_SIZE;
    
    // Set stickman color
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    
    // Calculate running animation phases based on direction
    const runSpeed = 3; // Running cycle speed
    const runCycle = time * runSpeed;
    
    // Different animation cycles for different directions
    let armSwingIntensity = 0.6;
    let legStepIntensity = 0.4;
    let bodyBobIntensity = 1;
    
    // Adjust animation based on direction
    switch (direction) {
      case 'idle':
        armSwingIntensity = 0.2; // Very subtle arm movement when idle
        legStepIntensity = 0.1; // Minimal leg movement
        bodyBobIntensity = 0.3; // Less bobbing when idle
        break;
      case 'up':
      case 'down':
        // More pronounced forward/backward arm extension for vertical movement
        armSwingIntensity = 0.8;
        legStepIntensity = 0.6;
        break;
      case 'left':
      case 'right':
        // Side-to-side movement emphasis
        armSwingIntensity = 0.7;
        legStepIntensity = 0.5;
        break;
      case 'up-left':
      case 'up-right':
      case 'down-left':
      case 'down-right':
        // Diagonal movement - moderate intensity
        armSwingIntensity = 0.7;
        legStepIntensity = 0.5;
        break;
    }
    
    // Calculate animation phases
    const leftArmPhase = Math.sin(runCycle) * armSwingIntensity;
    const rightArmPhase = Math.sin(runCycle + Math.PI) * armSwingIntensity;
    const leftLegPhase = Math.sin(runCycle + Math.PI/2) * legStepIntensity;
    const rightLegPhase = Math.sin(runCycle + Math.PI/2 + Math.PI) * legStepIntensity;
    const bodyBob = Math.abs(Math.sin(runCycle * 2)) * bodyBobIntensity;
    
    // Head (circle)
    this.ctx.beginPath();
    this.ctx.arc(x, y - size * 0.8 - bodyBob, size / 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Body (thin line for stick figure)
    this.ctx.lineWidth = 3; // Thin stick body
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size * 0.6 - bodyBob); // Top of body (below head)
    this.ctx.lineTo(x, y + size * 0.2 - bodyBob); // Bottom of body (above hips)
    this.ctx.stroke();
    
    // Arms - extend forward and backward alternately from shoulders
    const shoulderY = y - size * 0.4 - bodyBob;
    const armLength = size * 0.7;
    
    // Reset line width for arms
    this.ctx.lineWidth = 2;
    
    // Arm positioning varies by direction
    let leftArmEndX = x - size * 0.2;
    let leftArmEndY = shoulderY + leftArmPhase * armLength;
    let rightArmEndX = x + size * 0.2;
    let rightArmEndY = shoulderY + rightArmPhase * armLength;
    
    // Adjust arm positions based on direction
    switch (direction) {
      case 'left':
        leftArmEndX = x - size * 0.2 + leftArmPhase * armLength * 0.3;
        rightArmEndX = x + size * 0.2 + rightArmPhase * armLength * 0.3;
        break;
      case 'right':
        leftArmEndX = x - size * 0.2 - leftArmPhase * armLength * 0.3;
        rightArmEndX = x + size * 0.2 - rightArmPhase * armLength * 0.3;
        break;
      case 'up-left':
        leftArmEndX = x - size * 0.2 + leftArmPhase * armLength * 0.2;
        rightArmEndX = x + size * 0.2 + rightArmPhase * armLength * 0.2;
        leftArmEndY = shoulderY + leftArmPhase * armLength * 0.7;
        rightArmEndY = shoulderY + rightArmPhase * armLength * 0.7;
        break;
      case 'up-right':
        leftArmEndX = x - size * 0.2 - leftArmPhase * armLength * 0.2;
        rightArmEndX = x + size * 0.2 - rightArmPhase * armLength * 0.2;
        leftArmEndY = shoulderY + leftArmPhase * armLength * 0.7;
        rightArmEndY = shoulderY + rightArmPhase * armLength * 0.7;
        break;
      case 'down-left':
        leftArmEndX = x - size * 0.2 + leftArmPhase * armLength * 0.2;
        rightArmEndX = x + size * 0.2 + rightArmPhase * armLength * 0.2;
        leftArmEndY = shoulderY - leftArmPhase * armLength * 0.7;
        rightArmEndY = shoulderY - rightArmPhase * armLength * 0.7;
        break;
      case 'down-right':
        leftArmEndX = x - size * 0.2 - leftArmPhase * armLength * 0.2;
        rightArmEndX = x + size * 0.2 - rightArmPhase * armLength * 0.2;
        leftArmEndY = shoulderY - leftArmPhase * armLength * 0.7;
        rightArmEndY = shoulderY - rightArmPhase * armLength * 0.7;
        break;
    }
    
    // Draw arms
    this.ctx.beginPath();
    this.ctx.moveTo(x - size * 0.2, shoulderY);
    this.ctx.lineTo(leftArmEndX, leftArmEndY);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + size * 0.2, shoulderY);
    this.ctx.lineTo(rightArmEndX, rightArmEndY);
    this.ctx.stroke();
    
    // Legs - form /\ shape when stationary, alternate forward/backward when running
    const hipY = y + size * 0.2 - bodyBob;
    const legLength = size * 0.6;
    const legSpread = size * 0.3; // Base spread for /\ shape
    
    // Leg positioning varies by direction
    let leftLegEndX = x - legSpread;
    let leftLegEndY = hipY + legLength + leftLegPhase * legLength * 0.3;
    let rightLegEndX = x + legSpread;
    let rightLegEndY = hipY + legLength + rightLegPhase * legLength * 0.3;
    
    // Adjust leg positions based on direction
    switch (direction) {
      case 'left':
        leftLegEndX = x - legSpread + leftLegPhase * legLength * 0.2;
        rightLegEndX = x + legSpread + rightLegPhase * legLength * 0.2;
        break;
      case 'right':
        leftLegEndX = x - legSpread - leftLegPhase * legLength * 0.2;
        rightLegEndX = x + legSpread - rightLegPhase * legLength * 0.2;
        break;
      case 'up':
        leftLegEndY = hipY + legLength + leftLegPhase * legLength * 0.5;
        rightLegEndY = hipY + legLength + rightLegPhase * legLength * 0.5;
        break;
      case 'down':
        leftLegEndY = hipY + legLength - leftLegPhase * legLength * 0.5;
        rightLegEndY = hipY + legLength - rightLegPhase * legLength * 0.5;
        break;
    }
    
    // Draw legs
    this.ctx.beginPath();
    this.ctx.moveTo(x, hipY);
    this.ctx.lineTo(leftLegEndX, leftLegEndY);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, hipY);
    this.ctx.lineTo(rightLegEndX, rightLegEndY);
    this.ctx.stroke();
  }

  renderObstacles(obstacles: Obstacle[]) {
    obstacles.forEach(obstacle => {
      switch (obstacle.type) {
        case 'wall':
          this.renderWall(obstacle);
          break;
        case 'ball':
          this.renderBall(obstacle);
          break;
        case 'door':
          this.renderDoor(obstacle);
          break;
      }
    });
  }

  private renderWall(obstacle: Obstacle) {
    this.ctx.fillStyle = 'oklch(0.6 0.2 20)';
    this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    
    this.ctx.strokeStyle = 'oklch(0.4 0.2 20)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }

  private renderBall(obstacle: Obstacle) {
    this.ctx.fillStyle = 'oklch(0.6 0.2 20)';
    this.ctx.beginPath();
    this.ctx.arc(
      obstacle.x + obstacle.width / 2,
      obstacle.y + obstacle.height / 2,
      obstacle.width / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    this.ctx.strokeStyle = 'oklch(0.4 0.2 20)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  private renderDoor(obstacle: Obstacle) {
    if (obstacle.isOpen) {
      this.ctx.fillStyle = 'oklch(0.3 0.1 20)';
      this.ctx.globalAlpha = 0.3;
    } else {
      this.ctx.fillStyle = 'oklch(0.6 0.2 20)';
      this.ctx.globalAlpha = 1;
    }
    
    this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    
    this.ctx.strokeStyle = 'oklch(0.4 0.2 20)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    this.ctx.globalAlpha = 1;
  }

  renderBonuses(bonuses: Bonus[]) {
    bonuses.forEach(bonus => {
      if (!bonus.collected) {
        this.renderBonus(bonus);
      }
    });
  }

  private renderBonus(bonus: Bonus) {
    this.ctx.fillStyle = 'oklch(0.75 0.15 60)';
    this.ctx.fillRect(bonus.x, bonus.y, bonus.width, bonus.height);
    
    this.ctx.strokeStyle = 'oklch(0.85 0.15 90)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(bonus.x, bonus.y, bonus.width, bonus.height);
    
    this.ctx.fillStyle = 'oklch(0.1 0 0)';
    this.ctx.font = 'bold 16px Inter'; // Increased from 14px to 16px
    this.ctx.textAlign = 'center';
    
    let text = '';
    switch (bonus.type) {
      case 'add':
        text = bonus.value >= 0 ? `+${bonus.value}` : `${bonus.value}`;
        break;
      case 'multiply':
        text = `x${bonus.value}`;
        break;
      case 'percentage':
        text = `/${bonus.value}`;
        break;
    }
    
    this.ctx.fillText(
      text,
      bonus.x + bonus.width / 2,
      bonus.y + bonus.height / 2 + 3
    );
  }

  renderDeathEffects(deathEffects: DeathEffect[]) {
    for (const effect of deathEffects) {
      this.ctx.save();
      
      for (const particle of effect.particles) {
        // Calculate fade based on remaining life
        const fadeRatio = particle.life / particle.maxLife;
        
        // Create a faded version of the particle color
        this.ctx.globalAlpha = fadeRatio * 0.8; // Start with 80% opacity
        this.ctx.fillStyle = particle.color;
        
        // Draw particle as a small circle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * fadeRatio, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.restore();
    }
  }


  renderGameOver(score: number) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    
    this.ctx.fillStyle = 'oklch(0.98 0 0)';
    this.ctx.font = 'bold 32px Inter';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 - 30);
    
    this.ctx.font = 'bold 18px Inter';
    this.ctx.fillText(`Final Score: ${score}`, GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2);
    
    this.ctx.font = '14px Inter';
    this.ctx.fillText('Click to restart', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 + 30);
  }
}