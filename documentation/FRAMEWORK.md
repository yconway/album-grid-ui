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

**Design tokens in components:** reference tokens as CSS custom properties (`var(--color-accent)`) when a utility class doesn't exist for the exact value.

**Dark/light mode:** tokens defined once in `theme.css`; mode toggled via `html.dark` / `html.light` class and `prefers-color-scheme` as the default. Persisted in `localStorage`.

## State management

Currently local component state only. If global state is introduced, document the approach here (e.g. Svelte stores, rune-based context, or an external store library) along with the rationale.
