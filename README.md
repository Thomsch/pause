# Pause

[![Build Status](https://github.com/thomsch/pause/workflows/build/badge.svg)](https://github.com/thomsch/pause/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/d08245ed4044c3580c97/maintainability)](https://codeclimate.com/github/Thomsch/pause/maintainability)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Thomsch_pause&metric=alert_status)](https://sonarcloud.io/dashboard?id=Thomsch_pause)

A desktop app that reminds you to take breaks. Set a timer, focus on your work, and Pause will let you know when it's time to rest. The timer restarts automatically unless you stop it.

![Screenshot of the application](https://raw.githubusercontent.com/Thomsch/pause/develop/misc/app.png)

Available for **Windows**, **macOS**, and **Linux**. Download the latest version from the [releases](https://github.com/Thomsch/pause/releases) page.

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) 18.17+ (via [nvm](https://github.com/nvm-sh/nvm)) and [Yarn](https://yarnpkg.com/).

```bash
nvm install 18.17.1 && nvm use 18.17.1
yarn install
yarn dev
```

This launches the app in development mode with hot module replacement.

## Available Commands

| Command | Description |
|---|---|
| `yarn dev` | Run with HMR for development |
| `yarn build` | Typecheck and build for production |
| `yarn lint` | Lint and auto-fix with ESLint |
| `yarn format` | Format with Prettier |
| `yarn typecheck` | Run TypeScript type checking |

## Tech Stack

[Electron](https://www.electronjs.org/) + [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/), bundled with [electron-vite](https://electron-vite.org/).

## Releasing

1. Update `version` in `package.json`.
2. Create a new release draft on GitHub with tag `vX.Y.Z` matching the version.
3. Run `GH_TOKEN=<Personal Access Token> yarn deploy`
4. Test signing conformance:
   - `spctl -a -t exec -vv dist/mac-universal/pause.app/Contents/MacOS/pause`
   - `codesign --verify --deep --strict --verbose=2 dist/mac-universal/pause.app/Contents/MacOS/pause`
   - Send the DMG to yourself via a website, messages, or AirDrop to trigger the GateKeeper check.

## License

GNU General Public License v3. See [LICENSE](LICENSE) for details.

## Acknowledgements

Thank you [Kilian Valkhof](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/) for the resources on code signing and notarizing Electron apps.
