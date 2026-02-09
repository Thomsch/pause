# Pause

[![Build Status](https://github.com/thomsch/pause/workflows/build/badge.svg)](https://github.com/thomsch/pause/actions)

A desktop app that reminds you to take breaks. Set a timer, focus on your work, and Pause will let you know when it's time to rest. The timer restarts automatically unless you stop it.

![Screenshot of the application](https://raw.githubusercontent.com/Thomsch/pause/develop/misc/app.png)

Available for **Windows**, **macOS**, and **Linux**. Download the latest version from the [releases](https://github.com/Thomsch/pause/releases) page.

## Getting Started

**Prerequisites:**
- [Rust](https://www.rust-lang.org/tools/install) (stable)
- [Node.js](https://nodejs.org/) 20+
- Tauri CLI: `cargo install tauri-cli`
- Linux only: `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, `librsvg2-dev`, `patchelf`

```bash
yarn install
cargo tauri dev
```

This launches the app in development mode with hot module replacement.

## Available Commands

| Command | Description |
|---|---|
| `cargo tauri dev` | Run with HMR for development |
| `cargo tauri build` | Build for production |
| `yarn lint` | Lint and auto-fix with ESLint |
| `yarn format` | Format with Prettier |
| `yarn typecheck` | Run TypeScript type checking |

## Tech Stack

[Tauri 2](https://tauri.app/) + [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Rust](https://www.rust-lang.org/), bundled with [Vite](https://vite.dev/).

## Releasing

1. Update `version` in `package.json` and `src-tauri/tauri.conf.json`.
2. Push a tag `vX.Y.Z` matching the version. The CI workflow will create a draft release with platform binaries.

## License

GNU General Public License v3. See [LICENSE](LICENSE) for details.
