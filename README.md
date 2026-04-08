# CLI Master

## 💸 Donations
If you find this project useful, consider supporting its development:

**Monero:** `45FaicSnwc8AC2MhJPHc9HXoXLLzA2KJxf8Ah67BtYeJhQTyAMJKkFB5pHhy4pFXwedjqGGMHCLkW3WouJWxvhLz5Spej3j`

---

CLI Master is a gamified terminal learning platform that teaches Linux command-line skills through interactive lessons, challenges, and a reward system. Built with React, TypeScript, and Vite, it provides a safe sandbox environment for mastering CLI commands.

## Features

**🏫 Learning System**
- Interactive lessons with step-by-step guidance
- 4 learning units: File Management, Text Processing, Process Management, Practice & Review
- Real-time command execution feedback
- Progress tracking with XP and leveling
- Streak system for daily engagement

**🎮 Gamification**
- Earn XP and Bits (in-game currency)
- Daily challenges with rewards
- Achievement system with milestones
- Spin wheel for random rewards
- Shop to spend Bits on cosmetic upgrades

**🛠️ Tools**
- Terminal emulator with command validation
- Quiz system for knowledge testing
- Review system to reinforce learning
- Settings with data reset option
- Progress persistence via localStorage

**📚 Curriculum**
- 14+ lessons covering essential Linux commands
- Units organized by topic for structured learning
- Hands-on challenges with simulated file system
- Gradual difficulty progression

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: CSS Modules with modern CSS features
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Deployment**: GitHub Pages ready

## Project Structure

```
src/
├── components/ # React components
│   ├── Terminal.tsx # Terminal emulator
│   ├── LessonView.tsx # Lesson interface
│   ├── UnitSelector.tsx # Unit navigation
│   └── (various UI components)
├── core/
│   ├── lessons.ts # Lesson definitions
│   ├── types.ts # TypeScript interfaces
│   ├── achievements.ts # Achievement system
│   └── dailyChallenges.ts # Daily challenges
└── main.tsx # App entry point
```

## Development

The project is configured for:
- TypeScript strict mode
- ESLint for code quality
- Hot module replacement
- Production-ready builds

### Key Design Decisions

1. **Modal-based Navigation**: Instead of page routing, the app uses modal overlays for different features (Shop, Settings, SpinWheel) to maintain state and avoid React Router hook conflicts.

2. **Simulated File System**: A virtual file system provides safe command practice without accessing the user's actual files.

3. **Unit-Based Learning**: Lessons are grouped into logical units for better learning progression.

4. **Gamification Layer**: XP, Bits, achievements, and daily challenges encourage consistent learning habits.

## Contributing

Feel free to submit issues or pull requests to enhance the platform. Suggestions for new lessons, gamification features, or UX improvements are welcome.

## License
MIT
<!-- triggered -->
