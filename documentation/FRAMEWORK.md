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

## Styling (TBD)

No CSS framework has been chosen yet. Document the decision here when made, including: scoped component styles vs global, CSS variables strategy, any utility class approach.

## State management

Currently local component state only. If global state is introduced, document the approach here (e.g. Svelte stores, rune-based context, or an external store library) along with the rationale.
