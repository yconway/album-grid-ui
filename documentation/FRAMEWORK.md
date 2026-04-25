# UI Framework

## Component framework: Svelte 5

Using Svelte 5 with runes (`$state`, `$derived`, `$effect`). Do not use Svelte 4 legacy reactive syntax (`$:`, `export let` for props in the old style).

**Why:** Svelte 5 runes are more explicit and composable than the legacy reactive model. Runes work in `.svelte` files and plain `.ts` files alike, which makes extracting logic out of components straightforward.

## Build tool: Vite 6

Dev server with HMR via `@sveltejs/vite-plugin-svelte`. Production builds output to `dist/`.

**Why:** Vite is the standard build tool for Svelte projects. Fast cold starts and HMR make the dev loop tight.

## Language: TypeScript 5

All script blocks use `<script lang="ts">`. Type-checked with `svelte-check`.

**Why:** The UI exchanges data with the API — shared types catch contract mismatches at compile time rather than at runtime.

## Styling: Tailwind v4

Tailwind v4 via `@tailwindcss/vite`. Processed by the Vite plugin — no PostCSS config required.

**CSS file layout:**

- `src/styles/theme.css` — all `@theme` design tokens (colors, typography, spacing, radii). Edit only this file to change design tokens.
- `src/styles/global.css` — imports Tailwind (`@import "tailwindcss"`), imports the theme, and sets document-level base styles (box-sizing, body background/color/font).
- `src/main.ts` imports `global.css` as a side-effect entry point.

**Why separate theme from global:** keeps token definitions isolated from base resets, making token changes easy to review and diff without wading through structural CSS.

**No `tailwind.config.js`:** Tailwind v4 is CSS-first. All customization lives in `theme.css` via `@theme`. Do not use v3-style JS config.

**Component styles:** use Tailwind utility classes directly in markup. Use scoped `<style>` blocks only for styles that genuinely can't be expressed as utilities (e.g. complex animations).

**Design tokens in components:** every `@theme` token automatically generates a Tailwind utility — `--color-accent` → `text-accent`, `bg-accent`; `--color-button-border` → `border-button-border`, etc. Always prefer these utilities over inline `style=""`. Only use `style=""` for values that are dynamic or computed at runtime in JS.

**Dark/light mode:** tokens defined once in `theme.css` with dark values as defaults. Light mode overrides are applied in `global.css` via `html:not(.dark)` under `@media (prefers-color-scheme: light)` (system default) and `html.light` (manual). `App.svelte` manages a `themeMode` state (`'dark' | 'light' | 'system'`) that applies the class to `document.documentElement` and persists the choice to `localStorage` under the key `"theme"`.

**Design tokens (colors):**

| Token                    | Dark                    | Light             |
| ------------------------ | ----------------------- | ----------------- |
| `--color-background`     | `#121212`               | `#F5F5F5`         |
| `--color-surface`        | `#1E1E1E`               | `#FFFFFF`         |
| `--color-accent`         | `#BB86FC`               | `#7C3AED`         |
| `--color-text-primary`   | `#FFFFFF`               | `#111111`         |
| `--color-text-secondary` | `rgba(255,255,255,0.7)` | `rgba(0,0,0,0.6)` |
| `--color-button-border`  | `rgba(255,255,255,0.2)` | `rgba(0,0,0,0.2)` |

**Typography tokens:** `--font-sans`, `--font-size-sm` (0.875rem), `--font-size-base` (1rem), `--font-size-lg` (1.125rem).

**Layout tokens:** `--spacing-grid-gap` (0.75rem), `--radius-card` (0.5rem), `--radius-thumb` (0.25rem).

## File naming convention

Components that have extracted logic or tests follow a co-located naming pattern:

```
ThemeToggle.svelte   — component
ThemeToggle.ts       — extracted logic (pure functions, types, constants)
ThemeToggle.test.ts  — tests
```

All three files share the same base name as the component. This makes ownership clear and ensures renaming a component doesn't leave orphaned files with mismatched names.

Extract logic into a `.ts` file when it doesn't require reactivity — pure functions, types, and constants are good candidates. Keep reactive state (runes) in the `.svelte` file.

## Array and object manipulation: Lodash

Use Lodash for array and object manipulation. Prefer Lodash utilities over manually written `filter`, `map`, `reduce`, etc. where a Lodash equivalent exists.

**Why:** Lodash functions are well-typed (via `@types/lodash`), battle-tested, and reduce the amount of inline boilerplate for common operations. `_.compact`, `_.cloneDeep`, `_.groupBy`, etc. are clearer at a glance than their manual equivalents.

Import only what you use:

```ts
import compact from "lodash/compact"
import cloneDeep from "lodash/cloneDeep"
```

Do not import the full library (`import _ from "lodash"`) — per-function imports allow tree-shaking.

## State management

Global state uses Svelte 5 rune-based stores: a factory function closes over `$state`, returns a plain object with methods, and is exported as a singleton from a `.svelte.ts` file.

**Why:** Rune-based stores work in plain `.svelte.ts` files without the Svelte 4 store contract (`subscribe`/`set`/`update`). The factory pattern keeps reactive state private while exposing a clean, typed API surface. Logic that doesn't need reactivity lives in a companion `.ts` file and is imported by the store.

**Pattern:**

```ts
// grid.svelte.ts
function createGridStore(): GridStore {
	let grid = $state<Grid>(createEmptyGrid())
	return {
		get slots(): Grid {
			return grid
		},
		addItem(item: MediaItem): void {
			grid = addItem(grid, item)
		},
		// ...
	}
}
export const gridStore = createGridStore()
```

**Type definitions** live in a `.type.ts` file alongside the store (e.g. `grid.type.ts`), per the TypeScript convention. The store file re-exports types as the single public entry point for consumers.

## CI/CD: GitHub Actions

The CI workflow (`.github/workflows/ci.yml`) runs on every push and pull request to `master`. Each check is defined as its own job, which means GitHub Actions runs them in parallel by default — no explicit parallelism config needed.

**Jobs (all run in parallel):**

- `lint` — ESLint (`yarn lint`)
- `format` — Prettier format check (`yarn format:check`)
- `svelte-check` — `svelte-check` validation (types, a11y, unused CSS, Svelte-specific warnings)
- `test` — Vitest test suite (`yarn test`)

**Why split into separate jobs:** parallel execution gives faster feedback, and each job's pass/fail status surfaces individually in the GitHub UI — easier to see _which_ check failed without scrolling through a single combined log. Each job uses the official `actions/setup-node@v4` with built-in yarn caching to keep install times low.

**Deployment:** TODO — not yet configured. A deployment job will be added once deployment tooling and target environment are decided.
