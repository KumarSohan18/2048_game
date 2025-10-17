# 2048 Game (Frontend: Next.js, Backend: Express, Deploy: Vercel)

This repository contains a monorepo with a Next.js frontend implementing the 2048 game (GUI only) and a minimal Express backend, both configured for Vercel deployment.

## Structure

- `frontend/` – Next.js app (game UI + logic)
- `backend/` – Express server (health/info endpoints)
- `vercel.json` – Vercel configs for deploying both apps

## Requirements Coverage

- Default board size 4x4 with two starting tiles (2 or 4)
- Slide with keyboard arrows or on-screen controls (↑ ← ↓ →)
- Merge equal tiles; new tile (2 or 4) spawns after each valid move
- Win at 2048; game over when no moves remain
- Board size configurable (3–8). Default 4.
- Functional, pure game logic in `frontend/lib/game.ts`
- Dynamic GUI updates with React state
- Score tracked from merged tiles
- Restart supported via GUI
- Modular and readable code

## Local Development

Install dependencies separately in `frontend` and `backend`.

Frontend (Next.js):
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

Backend (Express):
- Start: `npm start`

## Deployment (Vercel)

- `frontend` is a Next.js project.
- `backend` is a Node server exposed via routes in `vercel.json` mapping `/api/*` to `backend/server.js`.

## How to Play 2048

### Objective
The goal is to combine numbered tiles to create a tile with the value **2048**. You win when you successfully create a tile with the number 2048.

### Game Mechanics

#### Starting the Game
- The game begins with a 4×4 grid (configurable from 3×3 to 8×8)
- Two random tiles (either 2 or 4) are placed on the board initially
- Your score starts at 0

#### Movement Controls
- **Arrow Keys**: Use ↑ ← ↓ → to slide all tiles in that direction
- **On-screen Buttons**: Click the directional buttons if you prefer mouse/touch input
- All tiles move as far as possible in the chosen direction

#### Tile Merging
- When two tiles with the **same number** collide, they merge into one tile with **double the value**
- Examples: 2 + 2 = 4, 4 + 4 = 8, 8 + 8 = 16, 16 + 16 = 32, etc.
- Each merge adds points to your score equal to the value of the new tile

#### New Tiles
- After each valid move, a new tile appears in a random empty space
- 90% chance of spawning a "2" tile
- 10% chance of spawning a "4" tile

#### Game States
- **Win Condition**: Create a tile with the number 2048
- **Lose Condition**: The board fills up and no more moves are possible
- **Score**: Tracked in the header, increases with each tile merge

### Game Features

#### Board Size Options
- Change the board size using the size selector (3×3 to 8×8)
- The game automatically restarts when you change the board size
- Default size is 4×4

#### Controls
- **Restart**: Click the restart button to start a new game
- **Size Selection**: Use the dropdown to change board dimensions
- **Score Display**: Your current score is shown in the header

### Strategy Tips

1. **Keep your highest tile in a corner** (usually bottom-right)
2. **Build in one direction** - try to keep your largest numbers in one row or column
3. **Don't mix directions** - avoid moving tiles in different directions randomly
4. **Plan ahead** - think about where new tiles will appear and how they'll affect your strategy
5. **Use the "snake" pattern** - arrange tiles in descending order along one edge
6. **Avoid filling up the board** - try to keep some empty spaces for maneuvering

### Game Progression
- Start with 2s and 4s
- Combine to create: 4, 8, 16, 32, 64, 128, 256, 512, 1024, **2048**
- Continue beyond 2048 for higher scores: 4096, 8192, etc.

## Implementation Details

- Game logic is implemented with pure functions and immutable updates in `frontend/lib/game.ts`:
  - `initialize(size)` – creates starting grid with two random tiles
  - `step(state, direction)` – returns next state with merges and random spawn
  - `restart(size)` – fresh game state
- The UI in `frontend/app/page.tsx` wires keyboard listeners and buttons to modify state.

