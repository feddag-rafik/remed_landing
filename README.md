# Remed landing

Independent static landing project. No source imports, build steps, or running services from `remed_web` are required.

```sh
bun install
bun run build       # dist/index.html and dist/landing/*
bun run start       # serve the existing build at http://localhost:3001/home
bun run dev         # standalone server: http://localhost:3001/home (also /)
bun run studio      # Remotion compositions
bun run test
bun run check
```

`start` serves the current `dist/` without rebuilding it. `dev` rebuilds when sources or public assets change; refresh the page to see changes. Both servers default to port 3001. Set `PORT=3002` to use another port.

Edit `src/landing/home.template.html` for content, `src/landing/` for demos, and `public/landing/` for static assets. Local presentation components and theme tokens are independent snapshots; update them here when the landing design changes. Generated output lives only in `dist/` and `.landing-build/`.

The build minifies `public/landing/landing.css` and `public/landing/landing.js`, writes them with content-hashed filenames under `dist/landing/`, and injects those filenames into `dist/index.html`.

Login buttons use ordinary `/login` links by default, suitable for backend hosting. For standalone hosting or local preview alongside the app, build with `LANDING_APP_URL=https://app.example.com bun run build` (or `LANDING_APP_URL=http://localhost:3000 PORT=3002 bun run dev`). The app URL is a base URL; `/login` is appended. No iframe or authentication runtime is bundled.

## Backend deployment

Build this project separately and deploy the entire `dist/` directory. The existing Remed backend serves its `index.html` at `/home` and `/home/`, and assets at `/landing/*`. Its default location is the sibling `remed_landing/dist` directory. Set `LANDING_DIST_DIR=/absolute/path/to/landing/dist` on the backend for other deployment layouts. The frontend dev server proxies `/home` and `/landing/*` to the backend.

App and backend builds do not build or copy this project. The app continues working if landing output is absent; landing requests return 404. `/` on the backend keeps its application behavior. Keep previous hashed files under `dist/landing/generated/` during deployment if already-open pages must continue loading deferred assets.

This directory is outside the `remed_web` Git repository; version and deploy it separately.
