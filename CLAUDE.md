# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pause is a Tauri 2 desktop app that reminds users to take breaks. A timer counts down, then a full-screen notification appears on all displays prompting the user to take a break. Targets macOS, Windows, and Linux.

## Build & Run Commands

```bash
cargo tauri dev     # Run in dev mode with HMR (Tauri + Vite)
cargo tauri build   # Build production app
yarn typecheck   # Run TypeScript type checking (Vue/renderer only)
yarn lint        # Lint with ESLint
yarn format      # Format with Prettier
```

**Prerequisites:** Rust stable, Node.js 20+, `cargo install tauri-cli`.

## Architecture

The app uses **Tauri 2** with a **Rust** backend and **Vue 3** + **TypeScript** frontend, built with **Vite**.

### Directory Structure

```
src-tauri/
├── Cargo.toml              — Rust dependencies
├── tauri.conf.json         — Tauri configuration
├── capabilities/default.json — Permission grants
├── icons/                  — App icons
└── src/
    ├── main.rs             — Entry point
    ├── lib.rs              — Tauri setup, commands, notification windows
    └── timer.rs            — Timer logic with 100ms ticks

src/renderer/
├── index.html              — Main window HTML entry
└── src/
    ├── main.ts             — Vue app entry
    ├── App.vue             — Main UI component
    └── env.d.ts            — Vite/Vue type declarations
└── notification/
    ├── index.html          — Notification window HTML entry
    └── notification.ts     — Notification window script

vite.config.ts              — Vite build configuration
```

### Process Model

- **Rust backend** (`src-tauri/src/`) — Creates the app window (400x200), manages the timer with wall-clock precision, spawns full-screen notification windows on all displays when the timer ends, handles all IPC via Tauri commands.
- **Renderer** (`src/renderer/`) — Vue 3 SFC with `<script setup>`. Communicates with backend via `@tauri-apps/api` (`invoke` for commands, `listen` for events).
- **Notification** (`src/renderer/notification/`) — Frameless, always-on-top overlay with Resume/Postpone buttons. Uses `invoke` for IPC.

### Tauri Commands

`start_timer`, `stop_timer`, `resume`, `postpone`

### Events (backend → frontend)

`timer-update` (progress string), `timer-stopped`, `timer-done`

## Packaging & Signing

- `src-tauri/tauri.conf.json` configures platform targets (DMG, NSIS, AppImage)
- macOS code signing and notarization handled natively by Tauri via environment variables
- CI uses `tauri-apps/tauri-action@v0` for building and releasing
- Release process: update version in `package.json` and `src-tauri/tauri.conf.json`, push a tag (`vX.Y.Z`)

## Styling

Plain CSS with scoped styles in Vue components. No CSS framework.
