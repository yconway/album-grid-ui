# album-grid-ui

Svelte 5 frontend for Album Grid.

## Key references

- [documentation/FRAMEWORK.md](documentation/FRAMEWORK.md) — framework decisions and architectural rationale. Read this before making structural changes, and **keep it up to date** when decisions change.
- [documentation/DESIGN.md](documentation/DESIGN.md) — early-draft design brief (AI-generated). Covers color palette, slot interaction states, search panel layout, export flow, and auth flow. Treat as directional guidance and inspiration, not finalized decisions. Token values and interaction details may diverge from what's actually implemented.
- [documentation/DESIGN_MOBILE.md](documentation/DESIGN_MOBILE.md) — early-draft mobile design brief (AI-generated). Covers the mobile-first stacked layout, over-grid search, touch interactions, etc.... Same caveat as DESIGN.md — a useful reference for intent, not a spec.

## Structure

- `src/App.svelte` — root component
- `src/main.ts` — app entrypoint, mounts App
- `index.html` — Vite HTML entrypoint
- `tasks/` — task specs organized by milestone (e.g. `01-foundation/`, `02-components/`). Each file describes a unit of work with scope, requirements, and notes.

## Commands

```bash
yarn dev        # start dev server (Vite HMR)
yarn build      # production build → dist/
yarn preview    # preview production build locally
yarn svelte:check # svelte-check (type check + a11y + unused CSS + Svelte-specific warnings)
yarn format     # run standardize format of code in the codebase (prettier)
yarn format:check # check formatting without writing changes (prettier --check)
yarn lint       # run eslint against codebase
yarn test       # run vitest test suite
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request to `master`. Each check is its own job, so they run in parallel:

- **lint:** ESLint (`yarn lint`)
- **format:** Prettier format check (`yarn format:check`)
- **svelte-check:** Type checking, a11y, and unused CSS via `svelte-check` (`yarn svelte:check`)
- **test:** Vitest test suite (`yarn test`)

All jobs must pass before merging to `master`. Deployment will be added later — TODO.

## Conventions

- Use Svelte 5 runes (`$state`, `$derived`, `$effect`) — not legacy Svelte 4 reactive syntax.
- Components are `.svelte` files with `<script lang="ts">`.
- Keep components small and focused. Extract logic into `.ts` files when it doesn't need reactivity.
