# GeoGuesser — TERRAPOINT

A satellite-view geography guessing game built with React, TypeScript, and Vite.

## Run locally

Requirements: Node.js 22 or newer.

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The production build was verified successfully by GitHub Actions on 2026-10-13. Vite generated a single-file build at `dist/index.html` (about 434 kB before gzip).

## Project structure

- `src/App.tsx` — main game
- `src/components/` — game UI components
- `src/game/` — locations, scoring, effects, sound, and storage
- `src/index.css` — styling
- `vite.config.ts` — Vite, React, Tailwind CSS, and single-file output configuration
