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

## Development

```bash
# Install dependencies (repo root)
pnpm install

# Fast UI / frontend work (no Rust compile) — http://localhost:1520
cd apps/app && pnpm dev

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

### UI testing requirement

Every UI change (components, layout, interactions, visible copy or state) must be verified with **real user interaction** before marking work complete. Lint and build alone are not sufficient.

- Cover the main path affected by the change (e.g. open page → click/fill → confirm visible result or state change).
- After interactions, check for errors (`agent-browser` per its skill guidance; Tauri: `tauri-pilot logs --level error`).

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
2. snapshot       — get interactive elements with @eN refs
3. act on refs    — click, fill, type, select, check
4. assert         — verify result
5. check errors   — per agent-browser skill guidance
```

Full command reference: `agent-browser skills get core --full`

### Tauri dev — tauri-pilot

Use the **tauri-pilot CLI** to operate and verify the running Tauri app. The plugin is enabled only in debug builds (`tauri_plugin_pilot` in `apps/app/src-tauri/src/lib.rs`).

Detailed command reference: `.agents/skills/tauri-pilot/SKILL.md`

#### Workflow

```text
1. Start the app (pnpm tauri dev)
2. ping          — verify connectivity
3. snapshot -i   — get interactive elements with refs
4. act on refs   — click, fill, type, select, check
5. assert        — verify result (exit 0 = pass, exit 1 = fail)
```

#### Rules

1. **Always snapshot before interacting.** Refs reset on each snapshot.
2. **Prefer `snapshot -i`** to minimize output.
3. **Use `wait` after async actions** (navigation, data loading).
4. **One action at a time**, then re-snapshot to verify.
5. **Check `logs --level error`** after actions to catch JS errors.

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

- Put reusable code in `packages/*`; ship product logic in `apps/*`
- Prefer extending `@firefly/ui` over duplicating UI in apps
- UI changes must pass real interaction testing per the startup principles (`agent-browser` or `tauri-pilot`) before marking work complete
