# EDH Tracker

A web application for tracking life totals in multiplayer Commander (EDH) games of Magic: The Gathering. Designed for tablet use with players sharing the same device at the gaming table. Built with Windsurf to test its capabilities.

Deployed at https://edh-tracker.jmreardon.com/

## Features

- **Touch-Optimized Interface**: Large, easy-to-tap life total displays
- **Persistent State**: Game state automatically saves to localStorage and restores on reload
- **Offline-First**: Works completely offline as a Progressive Web App
- **Responsive Design**: Optimized for tablets and mobile devices
- **Player Management**: Add/remove players, random player selection, reset game
- **Visual Feedback**: Selection highlights and smooth animations

## How to Use

### Basic Gameplay
- **Tap Top Half**: Increase life by 1
- **Tap Bottom Half**: Decrease life by 1
- **Hold (1 second)**: Rapid increment/decrement by 5

### Controls
- **Add Player**: Add a new player to the game (max 6)
- **Remove Player**: Remove the last player from the game (min 2)
- **Random Player**: Randomly select a player (useful for determining turn order)
- **Reset Game**: Reset all life totals to 40

## Technology Stack

- **TypeScript** - Type-safe JavaScript
- **React 19** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Development

### Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd edh-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### State Management

The application uses React's `useReducer` hook for state management with the following state structure:



## Deployment

The application is configured for deployment to GitHub Pages:

```bash
# Deploy to GitHub Pages
npm run deploy
```

This builds the application and deploys it to the `gh-pages` branch.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
