# Modelia — Mini AI Studio (Frontend Assignment)

## What it is
A small React + TypeScript app that simulates a simplified AI studio:
- Upload & preview image (PNG/JPG ≤10MB). Client-side downscale to ≤1920px.
- Enter prompt + choose style.
- Mock "Generate" API with 1–2s delay, 20% simulated "Model overloaded" error.
- Automatic retry with exponential backoff (max 3 attempts).
- Abort in-flight request.
- Save last 5 generations to `localStorage`. Click history to restore.
- Accessibility: keyboard navigable, visible focus states, and ARIA where useful.

## Tech
- Vite + React + TypeScript (strict)
- TailwindCSS
- ESLint + Prettier

## Run
```bash
pnpm install
pnpm dev
# open http://localhost:5173
