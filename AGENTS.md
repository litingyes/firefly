# Firefly

Pure AI. Every scene, a glow.

## Current Project Status

Early-stage monorepo. Foundational packages and the first Tauri app are in place; the full AI ecosystem is still being built out.

## Goal

Build a complete **AI application ecosystem** — shared libraries, UI primitives, and product apps that work together as one platform.

## Monorepo Layout

| Path         | Role                                                 |
| ------------ | ---------------------------------------------------- |
| `packages/*` | Foundational libraries shared across products        |
| `apps/*`     | User-facing products built on top of those libraries |

This is a **pnpm workspace** (`pnpm-workspace.yaml`). Use `pnpm` from the repo root; packages reference each other via `workspace:*`.

## Current Packages & Apps

### Package exports (`packages/*`)

All workspace packages use **subpath exports** — no barrel `index.ts`. Import paths mirror source files under `src/` (patterns include file extensions so TypeScript and Node resolve correctly):

```json
// @firefly/ai, @firefly/web-search — flat src/*.ts
"exports": { "./*": "./src/*.ts" }

// @firefly/ui — nested components + index.css
"exports": {
  "./components/ui/*": "./src/components/ui/*.tsx",
  "./components/ai-elements/*": "./src/components/ai-elements/*.tsx",
  "./lib/*": "./src/lib/*.ts",
  "./hooks/*": "./src/hooks/*.ts",
  "./index.css": "./src/index.css"
}
```

Examples:

```ts
import { Button } from '@firefly/ui/components/ui/button'
import { cn } from '@firefly/ui/lib/utils'
import type { ProviderId } from '@firefly/ai/types'
import { createFireflyChatTransport } from '@firefly/ai/create-firefly-chat-transport'
import type { WebSearchOutput } from '@firefly/web-search/types'
```

Adding a new public API = add a source file; no re-export list to maintain.

### `packages/ui` (`@firefly/ui`)

Shared UI component library.

- General UI primitives under `src/components/ui/`
- AI-specific elements under `src/components/ai-elements/`
- Also exports `@firefly/ui/index.css` for global styles
- Package-internal shadcn aliases use `imports` (`#components/*`, `#lib/*`)

### `packages/ai` (`@firefly/ai`)

AI provider runtime, model listing, and chat transport. Key entry points: `types`, `model-types`, `defaults`, `create-firefly-chat-transport`, `connection-test`, `list-models`.

### `packages/web-search` (`@firefly/web-search`)

Web search providers (Brave, Exa, Tavily). Key entry points: `types`, `defaults`, `search`, `connection-test`.

### `apps/app` (`@firefly/app`)

Primary Tauri v2 desktop app for product development.

- Frontend: React 19 + Vite + Tailwind CSS 4
- Backend: Rust (`apps/app/src-tauri/`)
- Depends on `@firefly/ui`
- **Debug builds** include `tauri-plugin-pilot` for automated testing (see below)

### `apps/ui-docs` (`@firefly/ui-docs`)

Component documentation site for `@firefly/ui`: browse UI primitives and AI elements, inspect design tokens on a dedicated Theme page, and verify interactions in the browser.

- Frontend: React 19 + Vite + Tailwind CSS 4 + react-router-dom
- Dev server: `pnpm ui-docs:dev` → http://localhost:1522
- Build: `pnpm ui-docs:build` (static output in `dist/`, deployable to Vercel)
- Depends on `@firefly/ui` only (no Tauri)

## Development

```bash
# Install dependencies (repo root)
pnpm install

# Fast UI / frontend work (no Rust compile) — http://localhost:1520
cd apps/app && pnpm dev

# UI component docs site — http://localhost:1522
pnpm ui-docs:dev

# Full desktop app (store file, plugin-http, tauri-pilot)
cd apps/app && pnpm tauri dev
```

### Browser dev vs Tauri dev

| Mode        | Command          | Persistence                                                            | HTTP                                                                      |
| ----------- | ---------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Browser dev | `pnpm dev`       | `localStorage` key `firefly-settings.json` (same shape as Tauri store) | Native `fetch`; prefer AI Gateway or Ollama (some vendor APIs block CORS) |
| Tauri dev   | `pnpm tauri dev` | `tauri-plugin-store` → `firefly-settings.json`                         | `tauri-plugin-http` (no CORS limits)                                      |

Settings use the same keys in both modes (`provider-config`, `model-settings`). Legacy `localStorage` keys are migrated automatically on first load.

Choose browser dev or Tauri dev based on the startup principles below — not every task needs `pnpm tauri dev`.

### Static checks

After editing any source file, run `vp check --fix` on **each changed file**:

```bash
vp check --fix <file-path>
```

`vp check` (configured in `vite.config.ts` with `typeAware` and `typeCheck`) runs format (Oxfmt), lint (Oxlint), and TypeScript type checks in one pass. Use `--fix` to auto-fix format and lint issues.

For multiple files, run per file or pass several paths at once:

```bash
vp check --fix path/a.ts path/b.tsx
```

Pre-commit runs `vp staged` on staged files only. During development, check changed files proactively — do not wait until commit.

**Done when:** every changed file passes `vp check --fix` with no remaining errors. Keep any fixes `--fix` applies.

### UI testing requirement

Every UI change (components, layout, interactions, visible copy or state) must be verified with **real user interaction** before marking work complete. Lint, build, and `vp check` alone are not sufficient.

Follow this test-case-first workflow:

| Step                | Requirement                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| 1. Analyze changes  | List what changed: components, state, interactions, copy                                            |
| 2. Write test cases | **1–3** complete cases; each with name, preconditions, steps, expected results                      |
| 3. Execute          | Run cases with `agent-browser` or `tauri-pilot`; assert after each step                             |
| 4. Check errors     | After interactions: `agent-browser` per its skill guidance; Tauri: `tauri-pilot logs --level error` |

**Do not** treat these as sufficient verification:

- Opening the page or taking a snapshot only to confirm it loads
- Generic clicks that do not exercise the changed behavior
- Assertions without explicit expected outcomes from your test cases

Example test case:

```text
Test Case: Enable web search from chat composer
- Precondition: App at chat workspace; at least one search provider configured
- Steps: Open capability dialog → toggle Web Search on → close dialog → type "latest news" → submit
- Expected: Web search badge/indicator visible; search runs before assistant reply; no console errors
```

### `apps/app` startup principles

| Scenario                | Start                           | Test CLI          | Notes                                         |
| ----------------------- | ------------------------------- | ----------------- | --------------------------------------------- |
| No system APIs involved | `cd apps/app && pnpm dev`       | **agent-browser** | Faster iteration, no Rust compile             |
| System APIs involved    | `cd apps/app && pnpm tauri dev` | **tauri-pilot**   | Requires Tauri plugins or native capabilities |

**Counts as system API** (use Tauri dev + tauri-pilot):

- `tauri-plugin-http` (direct calls to vendor APIs blocked by CORS)
- `tauri-plugin-store` file persistence (behavior beyond localStorage equivalence)
- Rust commands, filesystem, window/system integration
- Bugs or features reproducible only in the Tauri environment

**Prefer web dev** (use `pnpm dev` + agent-browser):

- Pure React UI, routing, styling, form validation
- Settings read/write (browser dev uses `localStorage`; see table above)
- Chat flows via Ollama, AI Gateway, or other APIs reachable with browser `fetch`

## UI interaction testing

### Browser dev — agent-browser

Use the **agent-browser CLI** to drive and verify the running web dev server at `http://localhost:1520`.

Load the CLI skill before running commands (keeps docs in sync with the installed version):

```bash
agent-browser skills get core
```

#### Workflow

```text
1. Start the app (pnpm dev) and open http://localhost:1520
2. Write 1–3 test cases from the change (see UI testing requirement)
3. snapshot       — get interactive elements with @eN refs
4. Execute each test case step-by-step — click, fill, type, select, check
5. assert         — verify each expected result per test case
6. check errors   — per agent-browser skill guidance
```

Full command reference: `agent-browser skills get core --full`

### Tauri dev — tauri-pilot

Use the **tauri-pilot CLI** to operate and verify the running Tauri app. The plugin is enabled only in debug builds (`tauri_plugin_pilot` in `apps/app/src-tauri/src/lib.rs`).

Detailed command reference: `.agents/skills/tauri-pilot/SKILL.md`

#### Workflow

```text
1. Start the app (pnpm tauri dev)
2. Write 1–3 test cases from the change (see UI testing requirement)
3. ping          — verify connectivity
4. snapshot -i   — get interactive elements with refs
5. Execute each test case step-by-step — click, fill, type, select, check
6. assert        — verify each expected result per test case (exit 0 = pass, exit 1 = fail)
7. check errors  — tauri-pilot logs --level error
```

#### Rules

1. **Test cases before interaction.** Write cases before operating the UI; do not skip.
2. **Always snapshot before interacting.** Refs reset on each snapshot.
3. **Prefer `snapshot -i`** to minimize output.
4. **Use `wait` after async actions** (navigation, data loading).
5. **One action at a time**, then re-snapshot to verify.
6. **Check `logs --level error`** after actions to catch JS errors.

#### Quick Examples

```bash
tauri-pilot ping
tauri-pilot snapshot -i
tauri-pilot click @e3
tauri-pilot assert visible @e3
tauri-pilot logs --level error
```

For structured CI tests, use declarative scenarios: `tauri-pilot run scenario.toml`.

## Conventions

- After editing a file, run `vp check --fix <file-path>` and ensure it passes
- Put reusable code in `packages/*`; ship product logic in `apps/*`
- Prefer extending `@firefly/ui` over duplicating UI in apps
- UI/interaction changes: write 1–3 test cases first, then verify with `agent-browser` or `tauri-pilot` per the startup principles before marking work complete
