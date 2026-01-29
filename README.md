# 🏃 Stickman Rush - Endless Runner Game

A fast-paced endless runner game built with React, TypeScript, and Vite. Control a stickman army, dodge obstacles, and survive as long as possible!

## 🎮 Game Features

- **Endless Running**: Infinite procedurally generated gameplay
- **Army Building**: Grow your stickman army as you progress
- **Level System**: Difficulty increases with each level
- **High Score Tracking**: Compete against your best scores
- **Responsive Controls**: Smooth touch and keyboard controls
- **AdMob Integration**: Ready for mobile monetization

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI (Dialog, Slider, Accordion, etc.)
- **Styling**: Tailwind CSS
- **Icons**: Heroicons, Phosphor Icons
- **State Management**: React Hooks + GitHub Spark KV
- **Form Validation**: React Hook Form + Zod

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jduartedj/stickman-rush-endless-runner-main.git
cd stickman-rush-endless-runner-main

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run optimize     # Optimize Vite dependencies
npm run kill         # Kill process on port 5000
```

## 🎯 How to Play

1. **Start**: Click to begin running
2. **Jump**: Tap screen or press spacebar to jump over obstacles
3. **Survive**: Avoid obstacles and survive as long as possible
4. **Level Up**: Reach score milestones to increase level and army size
5. **Beat Your High Score**: Try to beat your personal best!

## 📱 Mobile Support

The game is designed to work on both desktop and mobile devices:
- Touch controls for mobile
- Keyboard controls for desktop
- Responsive layout adapts to screen size
- AdMob integration for mobile monetization

## 🎨 Game Mechanics

- **Score System**: Points increase as you survive longer
- **Army Growth**: Your stickman army grows with each level
- **Progressive Difficulty**: Speed and obstacles increase with levels
- **Level Requirements**: Each level requires more points to advance

## 📦 Project Structure

```
.
├── src/
│   ├── components/         # React components
│   │   ├── GameCanvas.tsx  # Main game rendering
│   │   ├── GameControls.tsx # UI controls
│   │   └── AdMobBanner.tsx # Ad integration
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── styles/             # CSS styles
│   ├── types/              # TypeScript types
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
└── package.json            # Dependencies
```

## 🔧 Configuration

### AdMob Setup

See `src/admob-integration.md` for detailed AdMob integration instructions.

### Android Build

See `src/android-ad-platforms-research.md` for Android platform research.

## 🎨 Customization

The game uses Radix UI's theming system. You can customize:
- Colors (via Tailwind config)
- UI components (Radix UI components)
- Game mechanics (in GameCanvas component)
- Obstacle generation logic

## 📝 Development Notes

- Built with GitHub Spark template
- Uses Vite for fast hot module replacement
- TypeScript for type safety
- React Error Boundary for graceful error handling
- KV storage for persistent high scores

## 🐛 Known Issues

- None currently reported

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📄 License

[Add your license here]

## 👤 Author

Duarte Ribeirinho (@jduartedj)

## 🙏 Acknowledgments

- Built with GitHub Spark
- UI components by Radix UI
- Icons by Heroicons and Phosphor Icons

---

**Have fun and beat that high score! 🏆**
