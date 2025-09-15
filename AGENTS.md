# Repository Guidelines

## Project Structure & Module Organization
- Root: Vite + React frontend (`src/`, `public/`, `index.html`), Node/Express API in `server/`.
- Build output goes to `dist/`.
- Config: `vite.config.ts`, `tsconfig*.json`, `tailwind.config.ts`, `postcss.config.js`, `eslint.config.js`.
- Assets live in `public/`; colocated component assets can sit next to components in `src/`.

## Build, Test, and Development Commands
- `pnpm install` — install dependencies.
- `pnpm dev` — start Vite dev server and (if configured) API watcher.
- `pnpm build` — type‑check and build the frontend to `dist/`.
- `pnpm preview` — serve the production build locally.
- `pnpm lint` — run ESLint on the project.
- Server: if separate, use `pnpm --filter server dev` or `node server/index.js` (check `server/README` if present).

## Coding Style & Naming Conventions
- TypeScript preferred; 2‑space indentation.
- Components: `PascalCase` (e.g., `UserCard.tsx`), hooks: `useCamelCase.ts`.
- Files in `src/` use kebab‑case folders; test files mirror source paths.
- Run `pnpm lint` before committing; follow ESLint and Tailwind conventions.

## Testing Guidelines
- Framework: Vitest + React Testing Library (typical Vite setup). If missing, add tests under `src/**/__tests__`.
- Test names: `*.test.ts(x)` next to the file or under `__tests__/`.
- Commands: `pnpm test` for unit tests; `pnpm test:watch` for watch mode (if defined).

## Commit & Pull Request Guidelines
- Commit style: concise, imperative subject (e.g., "feat: add pricing toggle").
- Scope tags: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`.
- PRs must include: summary, screenshots for UI changes, steps to verify, and linked issues.
- Keep PRs focused; update relevant docs (README, this file) when behavior changes.

## Security & Configuration Tips
- Do not commit secrets; use `.env` (already present) and document required keys in README.
- Validate all API inputs in `server/`; never trust client data.
- When in doubt, run locally with minimal privileges and review CORS settings.

## Agent‑Specific Instructions
- Respect this guide for all files under the repo root.
- Match existing patterns; avoid large refactors in unrelated areas.
- If adding commands or configs, update `package.json` scripts and this document.

