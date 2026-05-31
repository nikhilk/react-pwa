# Overview

A minimal progressive web app built with React, TypeScript, and Tailwind CSS.
Bundled with Bun. No framework overhead. Builds as a static site for GitHub
Pages.

- Works offline and installs to your home screen
- Light and dark mode with persistent preferences
- Configurable interactive landing page

## Documentation

- [Project overview](docs/project.md) — architecture, structure, and technical details
- [Coding guidelines](docs/code.md) — style conventions and patterns
- [Decisions](docs/decisions.md) — deferred tradeoffs and future options

## Workflow

### Install Dependencies

```sh
npm install
```

### Build

```sh
npm run dev:build
```

Compiles the app into `build/` for development use.

### Development Server

```sh
npm run dev:serve
```

Builds and starts a local server at [http://localhost:4001](http://localhost:4001)
with SSE-based live reload. Changes to files in `src/` or `static/` trigger an
automatic rebuild and browser refresh.

### Type Checking

```sh
npx tsc --noEmit
```

### Production Build

```sh
npm run pub:build
```

Builds the final static site into `public/` — bundled, minified, with
placeholder substitution and service worker asset list.

### Preview Production Build

```sh
npm run pub:serve
```

Builds and then serves `public/` with a local static file server on port 4000.

### Publish to GitHub Pages

```sh
npm run pub:pushg
```

Force-pushes the contents of `public/` to the repo configured in
`app.servingRepo` in `package.json`. Run `pub:build` first to ensure the
output is up to date. The GitHub Pages repo should be configured to serve
from the `main` branch root.
