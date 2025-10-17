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

## Gameplay

- Use Arrow keys to slide tiles.
- Use on-screen buttons if preferred.
- Change board size from the size selector; restarting occurs automatically when size changes.
- Score is displayed in the header.
- Win: reaching 2048. Loss: no available moves.

## Implementation Details

- Game logic is implemented with pure functions and immutable updates in `frontend/lib/game.ts`:
  - `initialize(size)` – creates starting grid with two random tiles
  - `step(state, direction)` – returns next state with merges and random spawn
  - `restart(size)` – fresh game state
- The UI in `frontend/app/page.tsx` wires keyboard listeners and buttons to modify state.

