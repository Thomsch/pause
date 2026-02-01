# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pause is an Electron desktop app that reminds users to take breaks. A timer counts down, then a full-screen notification appears on all displays prompting the user to take a break. Targets macOS, Windows, and Linux.

## Build & Run Commands

```bash
yarn dev            # Run in dev mode with HMR
yarn start          # Preview production build
yarn build          # Typecheck + electron-vite build
yarn build:mac      # Build for macOS
yarn build:win      # Build for Windows
yarn build:linux    # Build for Linux
yarn deploy         # Build and publish to GitHub releases
yarn typecheck      # Run TypeScript type checking
yarn lint           # Lint with ESLint
yarn format         # Format with Prettier
yarn postinstall    # Install electron-builder dependencies
```

## Architecture

The app uses **electron-vite** with **Vue 3**, **TypeScript**, and follows Electron's multi-process model with the `@electron-toolkit` family of packages.

### Directory Structure

```
src/
├── main/index.ts           — Main process
├── preload/
│   ├── index.ts            — Main window preload
│   ├── index.d.ts          — Type declarations for preload API
│   └── notification.ts     — Notification window preload
├── renderer/
│   ├── index.html          — Main window HTML entry
│   └── src/
│       ├── main.ts         — Vue app entry
│       ├── App.vue         — Main UI component
│       └── env.d.ts        — Vite/Vue type declarations
│   └── notification/
│       ├── index.html      — Notification window HTML entry
│       └── notification.ts — Notification window script
```

### Process Model

- **Main process** (`src/main/index.ts`) — Creates the app window (400x200), manages the timer via `tiny-timer`, spawns full-screen notification windows on all displays when the timer ends, handles all IPC.
- **Preload** (`src/preload/index.ts`) — Uses `contextBridge` to expose `window.electron` (electronAPI) and `window.api` (startTimer, stopTimer, onTimerUpdate, onTimerStopped).
- **Notification preload** (`src/preload/notification.ts`) — Exposes `window.notificationApi` with `resume()` and `postpone()`. Context isolation enabled.
- **Renderer** (`src/renderer/`) — Vue 3 SFC with `<script setup>`. Duration input, start/stop button, and progress bar.
- **Notification** (`src/renderer/notification/`) — Frameless, transparent, always-on-top overlay with Resume/Postpone buttons. Uses plain CSS.

### IPC Events

`display-notification`, `resume`, `postpone`, `new-timer`, `stop-timer`, `timer-update`, `timer-stopped`.

## Packaging & Signing

- `electron-builder.yml` configures platform targets (DMG, NSIS, AppImage)
- macOS code signing and notarization via `scripts/notarize.js` using credentials from `.env`
- Release process: update version in `package.json`, create a GitHub release tag (`vX.Y.Z`), run `GH_TOKEN=<token> yarn deploy`

## Styling

Plain CSS with scoped styles in Vue components. No CSS framework.
