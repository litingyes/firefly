# Product

## Register

product

## Users

Developers and power users building with AI across the Firefly desktop app. They configure API credentials locally, switch between model vendors, and expect settings to feel as trustworthy as tools like Linear or Raycast.

## Product Purpose

Firefly is an AI application ecosystem: shared libraries, UI primitives, and desktop products that work together. The first app helps users connect multiple model providers and route work through a unified interface. Success means credentials are easy to configure, status is always clear, and the UI disappears into the task.

## Brand Personality

Precise, calm, capable. Firefly should feel like a focused workshop lamp: bright where you need it, quiet everywhere else. Tagline: Pure AI. Every scene, a glow.

## Anti-references

- Generic SaaS marketing dashboards with hero metrics and gradient accents
- Identical icon-card grids for every provider
- Cream-tinted warm-neutral backgrounds as default AI aesthetic
- Modal-first configuration when inline settings would work
- Buzzword-heavy copy that restates the heading

## Design Principles

1. **Earned familiarity** — Use patterns users already know from best-in-class tools; surprise only where it helps the task.
2. **State clarity** — Connection status, errors, and required fields must be obvious at a glance.
3. **Shared primitives** — Extend `@firefly/ui` rather than one-off styling in apps.
4. **Security by default** — Secrets hidden by default, explicit reveal, no accidental exposure in toasts or logs.
5. **Platform coherence** — Packages hold reusable logic; apps hold product flows.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Respect `prefers-reduced-motion`. Ensure form labels, focus rings, and status announcements for connection tests and errors. Keyboard paths for all provider toggles and actions.
