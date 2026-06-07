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

### `packages/ui` (`@firefly/ui`)

Shared UI component library.

- General UI primitives under `src/components/ui/`
- AI-specific elements under `src/components/ai-elements/`
- Exports: `@firefly/ui` and `@firefly/ui/index.css`
- After adding components, run `pnpm generate:exports` in the package

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

`tauri-pilot` requires `pnpm tauri dev` (debug builds only).

## Testing with tauri-pilot

Use the **tauri-pilot CLI** to operate and verify the running Tauri app. The plugin is enabled only in debug builds (`tauri_plugin_pilot` in `apps/app/src-tauri/src/lib.rs`).

Detailed command reference: `.agents/skills/tauri-pilot/SKILL.md`

### Workflow

```text
1. Start the app in dev mode (pnpm tauri dev)
2. ping          — verify connectivity
3. snapshot -i   — get interactive elements with refs
4. act on refs   — click, fill, type, select, check
5. assert        — verify result (exit 0 = pass, exit 1 = fail)
```

### Rules

1. **Always snapshot before interacting.** Refs reset on each snapshot.
2. **Prefer `snapshot -i`** to minimize output.
3. **Use `wait` after async actions** (navigation, data loading).
4. **One action at a time**, then re-snapshot to verify.
5. **Check `logs --level error`** after actions to catch JS errors.

### Quick Examples

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
- Verify Tauri UI behavior with tauri-pilot before marking work complete
