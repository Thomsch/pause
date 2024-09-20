# Pause
[![Build Status](https://github.com/thomsch/pause/workflows/build/badge.svg)](https://github.com/thomsch/pause/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/d08245ed4044c3580c97/maintainability)](https://codeclimate.com/github/Thomsch/pause/maintainability)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Thomsch_pause&metric=alert_status)](https://sonarcloud.io/dashboard?id=Thomsch_pause)

Pause allows you to set a timer to remind you to take a break from your work on the computer. The timer will restart itself automatically when the time is up unless you stop it or close the application.

<p align="center">
  <img src="https://raw.githubusercontent.com/Thomsch/pause/develop/misc/app.png" alt="Screenshot of the application"/>
</p>

## Installation
Pause is available for Windows, MacOS and Linux.

1. Download the latest version from the [releases](https://github.com/Thomsch/pause/releases) page.

## Developing
- Install Yarn
- Install nvm 
- `nvm install 18.17.1 && nvm use 18.17.1`
- Install dependencies: `yarn install`
- Build and run: `yarn start`

### Releasing
- Create a new release draft on GitHub. You can use any name.
  - Add tag 'vX.Y.Z', matching the `version` in package.json (but with a 'v' appended).
- Run `GH_TOKEN=<Personal Access Token> yarn deploy`
- Test signing conformance
  - `spctl -a -t exec -vv dist/mac-universal/pause.app/Contents/MacOS/pause`
  - `codesign --verify --deep --strict --verbose=2 dist/mac-universal/pause.app/Contents/MacOS/pause`
  - Send the DMG to yourself from website, messages, or air drop. This will trigger the GateKeeper check during installation or first opening.

## Licensing

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation version 3.

See [LICENSE](LICENSE) for details.

## Acknowledgements
Thank you [Kilian Valkhof](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/) for the resources on code signing and notarizing Electron apps.