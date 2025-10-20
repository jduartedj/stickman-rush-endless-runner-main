# Stickman Runner - Infinite Runner Game

An endless runner game featuring stickman characters navigating through dynamic obstacles and collecting bonuses to grow their army.

**Experience Qualities**: 
1. **Addictive** - Simple mechanics with escalating difficulty that keeps players engaged
2. **Dynamic** - Procedurally generated obstacles and bonuses create unique gameplay experiences  
3. **Satisfying** - Visual feedback from growing/shrinking stickman army and score progression

**Complexity Level**: Light Application (multiple features with basic state)
- Game combines simple controls with complex procedural generation and physics

## Essential Features

**Infinite Runner Core**
- Functionality: Stickman characters run forward automatically in top-down view
- Purpose: Provides the foundation gameplay loop
- Trigger: Game starts immediately when loaded
- Progression: Character spawn → continuous forward movement → obstacle/bonus interaction → score tracking
- Success criteria: Smooth 60fps movement with responsive controls

**Dynamic Obstacle System**
- Functionality: Generates walls (40% width), rolling balls, and opening/closing doors
- Purpose: Creates challenge and requires player skill to navigate
- Trigger: Obstacles spawn at regular intervals ahead of player
- Progression: Obstacle generation → collision detection → character removal on impact
- Success criteria: Fair but challenging obstacle placement with clear visual feedback

**Bonus Collection System** 
- Functionality: Spawns barriers offering character multipliers (-20 to +20), multipliers (2x-10x), or percentages (2%-10%)
- Purpose: Allows army growth and strategic risk/reward decisions
- Trigger: Bonus barriers appear randomly between obstacles
- Progression: Bonus spawn → player choice to engage → army modification → visual feedback
- Success criteria: Clear bonus indicators and immediate visual response to collection

**Progressive Difficulty**
- Functionality: Increases movement speed and obstacle density over time
- Purpose: Maintains engagement as player skill improves
- Trigger: Score milestones trigger level increases
- Progression: Score threshold reached → speed increase → visual level indicator → continued gameplay
- Success criteria: Noticeable but manageable difficulty progression

**Score & Army Management**
- Functionality: Tracks score from obstacles passed and manages stickman count
- Purpose: Provides progression feedback and win/lose conditions
- Trigger: Continuous during gameplay
- Progression: Obstacle passed → score increment → army size display → game over when army reaches zero
- Success criteria: Clear UI showing current army size and score

## Edge Case Handling

- **All Characters Lost**: Game over screen with restart option and final score display
- **Massive Army Growth**: Cap visual representation to prevent performance issues while maintaining actual count
- **Rapid Bonus Collection**: Smooth animations even with quick successive bonuses
- **Screen Size Variations**: Responsive design that maintains playability across different device sizes
- **Performance on Lower-End Devices**: Optimized rendering with configurable quality settings

## Design Direction

The design should feel energetic and arcade-like with clean, minimalist graphics that emphasize clarity over detail. A rich interface with vibrant colors and smooth animations will enhance the fast-paced gameplay experience.

## Color Selection

Triadic color scheme using high-contrast colors for maximum visibility during fast gameplay.

- **Primary Color**: Electric Blue (oklch(0.7 0.15 240)) - Communicates energy and technology for UI elements
- **Secondary Colors**: Vibrant Orange (oklch(0.75 0.15 60)) for bonuses and Crimson Red (oklch(0.6 0.2 20)) for obstacles
- **Accent Color**: Bright Yellow (oklch(0.85 0.15 90)) - High-visibility color for important game elements and score displays
- **Foreground/Background Pairings**: 
  - Background (Dark Blue #1a1a2e): White text (#FFFFFF) - Ratio 12.6:1 ✓
  - Primary (Electric Blue): White text (#FFFFFF) - Ratio 5.2:1 ✓  
  - Secondary Orange: Black text (#000000) - Ratio 8.1:1 ✓
  - Accent Yellow: Black text (#000000) - Ratio 14.3:1 ✓

## Font Selection

Use a bold, geometric sans-serif font that conveys speed and clarity for optimal readability during fast gameplay.

- **Typographic Hierarchy**: 
  - H1 (Game Title): Inter Bold/32px/tight letter spacing
  - H2 (Score Display): Inter Semi-Bold/24px/normal spacing  
  - Body (UI Elements): Inter Medium/16px/normal spacing
  - Small (Instructions): Inter Regular/14px/relaxed spacing

## Animations

Smooth, physics-based animations that enhance gameplay feedback without distracting from core mechanics.

- **Purposeful Meaning**: Movement animations communicate character physics and game state changes clearly
- **Hierarchy of Movement**: Character movement takes priority, followed by obstacle animations, then UI feedback

## Component Selection

- **Components**: Canvas for game rendering, Button components for controls, Card for UI overlays, Progress for level indicators
- **Customizations**: Custom game canvas component with touch/mouse controls, custom stickman renderer, particle system for effects
- **States**: Game states (playing, paused, game over), character states (running, collision), obstacle states (active, destroyed)
- **Icon Selection**: Play/pause icons, restart icon, simple geometric shapes for game elements
- **Spacing**: Consistent 8px base unit for UI elements, generous touch targets (44px minimum)
- **Mobile**: Touch-optimized controls with swipe gestures, responsive canvas that maintains aspect ratio