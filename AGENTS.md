# Repository Guidelines

## Project Structure & Module Organization
- Maintain all client code inside `src/`; `src/main.tsx` should wire Vite, React, and the base MapLibre canvas.
- Group feature logic in `src/features/` (e.g., `src/features/bearSightings/` for Sapporo bear data panels and API hooks).
- Keep map-specific primitives under `src/map/` with subfolders such as `src/map/layers/`, `src/map/styles/`, and `src/map/controls/`; extract shared helpers to `src/map/lib.ts`.
- Share utilities and hooks through `src/lib/` and `src/hooks/`, and centralize reusable types in `src/types/`.
- Place GeoJSON or CSV fixtures in `public/data/`; large or generated tiles belong in IndexedDB caches, not the repo.
- Co-locate tests as `*.test.tsx` or within `__tests__/` directories; snapshots should sit beside the component they cover.

## Build, Test, and Development Commands
- `npm install` installs dependencies and keeps `package-lock.json` in sync.
- `npm run dev` starts the Vite dev server with hot reload against Sapporo sample data.
- `npm run lint` runs ESLint + Prettier; add the script if missing and ensure zero warnings before committing.
- `npm run test` executes the Vitest suite (watch mode by default); extend it for integration cases as needed.
- `npm run build` produces the production bundle in `dist/`; run it before tagging releases or deploying previews.
- `npm run preview` serves the built assets for a final smoke check; add the script if it is not already defined.

## Coding Style & Naming Conventions
- Use TypeScript strict mode, 2-space indentation, trailing commas, and single quotes; rely on the shared ESLint and Prettier configs.
- Components, providers, and contexts use PascalCase; hooks begin with `use`, utilities are camelCase, and constants are SCREAMING_SNAKE_CASE.
- Folder names in `src/features/` and `src/map/` stay kebab-case; dataset files in `public/data/` match their content (e.g., `bear-sightings-2024.geojson`).
- Version MapLibre styles (`sapporo-base.v1.json`) and document schema revisions in code comments or CHANGELOG entries.

## Testing Guidelines
- Write unit and integration tests with Vitest and React Testing Library; mock MapLibre using `@maplibre/maplibre-gl-js-mock` or `maplibre-gl-js-mock`.
- Seed deterministic fixtures in `src/test/fixtures/` to cover city-specific scenarios.
- Target ≥80% coverage for new modules; verify with `npm run test -- --coverage`.
- Add exploratory smoke tests for complex map gestures (drawing, clustering, offline cache) before requesting review.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat(map):`, `fix(features):`, `chore(ci):`); align scopes with top-level folders.
- PR descriptions must summarize map behavior changes, data migrations, manual QA steps, and link to tracking issues.
- Attach screenshots or clips for UI or map layer updates; clarify which tokens or API endpoints reviewers need.
- Confirm `npm run lint`, `npm run test`, and `npm run build` succeed locally before asking for review.

## Configuration & Environment
- Store secrets such as MapLibre tokens in `.env.local`; provide safe defaults in `.env.example` and load them via `VITE_*` variables.
- Update `README.md` and any docs whenever endpoints, tile sources, or environment variables change so future contributors stay aligned.
