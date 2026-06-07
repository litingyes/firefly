import { Badge } from '@firefly/ui/components/ui/badge'

import { aiDemos, uiDemos } from '@/registry/load-demos'
import { AI_ELEMENT_NAMES, UI_COMPONENT_NAMES } from '@/registry/names'

const uiDemoCount = Object.keys(uiDemos).length
const aiDemoCount = Object.keys(aiDemos).length

export function OverviewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <p className="text-muted-foreground text-sm">@firefly/ui</p>
        <h1 className="font-semibold text-2xl tracking-tight">Firefly UI</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Shared primitives and AI elements for the Firefly ecosystem. Browse components, inspect
          design tokens, and verify interactions before shipping them in product apps.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="font-medium text-sm">UI primitives</p>
          <p className="mt-1 font-semibold text-2xl">{UI_COMPONENT_NAMES.length}</p>
          <p className="text-muted-foreground text-xs">{uiDemoCount} live demos</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="font-medium text-sm">AI elements</p>
          <p className="mt-1 font-semibold text-2xl">{AI_ELEMENT_NAMES.length}</p>
          <p className="text-muted-foreground text-xs">{aiDemoCount} live demos</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="font-medium text-sm">Theme</p>
          <p className="mt-1 font-semibold text-2xl">OKLCH</p>
          <p className="text-muted-foreground text-xs">Light and dark tokens</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm">Quick start</h2>
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed">
          {`import { Button } from '@firefly/ui/components/ui/button'
import '@firefly/ui/index.css'`}
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-sm">Package exports</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">@firefly/ui/components/ui/*</Badge>
          <Badge variant="secondary">@firefly/ui/components/ai-elements/*</Badge>
          <Badge variant="secondary">@firefly/ui/lib/*</Badge>
          <Badge variant="secondary">@firefly/ui/index.css</Badge>
        </div>
      </section>
    </div>
  )
}
