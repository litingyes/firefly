import { Badge } from '@firefly/ui/components/ui/badge'
import { Button } from '@firefly/ui/components/ui/button'
import { BoxesIcon, PaletteIcon, SparklesIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useOpenDocsSearch } from '@/components/docs-search-context'
import { docsType } from '@/lib/docs-type'
import { aiDemos, uiDemos } from '@/registry/load-demos'
import { AI_ELEMENT_NAMES, UI_COMPONENT_NAMES } from '@/registry/names'

const uiDemoCount = Object.keys(uiDemos).length
const aiDemoCount = Object.keys(aiDemos).length

export function OverviewPage() {
  const openSearch = useOpenDocsSearch()

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="docs-overview-hero -mx-4 space-y-3 rounded-xl px-4 py-5 sm:-mx-6 sm:px-6">
        <p className={`${docsType.eyebrow} text-primary`}>@firefly/ui</p>
        <h1 className={docsType.pageTitle}>
          <span className="text-primary">Firefly</span> UI
        </h1>
        <p className={`${docsType.lead} text-muted-foreground`}>
          Shared primitives and AI elements for the Firefly ecosystem. Browse components, inspect
          design tokens, and verify interactions before shipping them in product apps.
        </p>
        <p className={`${docsType.tagline} text-muted-foreground/75`}>
          Pure AI. Every scene, a glow.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className={docsType.sectionTitle}>Get started</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link className="docs-start-card block rounded-lg border p-4" to="/components/ui/button">
            <BoxesIcon aria-hidden className="docs-card-icon mb-2 size-4 text-primary" />
            <p className={docsType.sectionTitle}>Browse UI primitives</p>
            <p className={`${docsType.meta} mt-1 text-muted-foreground`}>
              {UI_COMPONENT_NAMES.length} components · {uiDemoCount} live demos
            </p>
          </Link>
          <Link
            className="docs-start-card block rounded-lg border p-4"
            to="/components/ai-elements/message"
          >
            <SparklesIcon aria-hidden className="docs-card-icon mb-2 size-4 text-primary" />
            <p className={docsType.sectionTitle}>Explore AI elements</p>
            <p className={`${docsType.meta} mt-1 text-muted-foreground`}>
              {AI_ELEMENT_NAMES.length} elements · {aiDemoCount} live demos
            </p>
          </Link>
          <Link className="docs-start-card block rounded-lg border p-4 sm:col-span-2" to="/theme">
            <PaletteIcon aria-hidden className="docs-card-icon mb-2 size-4 text-primary" />
            <p className={docsType.sectionTitle}>Inspect theme tokens</p>
            <p className={`${docsType.meta} mt-1 text-muted-foreground`}>
              OKLCH palette with light/dark previews and contrast checks
            </p>
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={docsType.sectionTitle}>Quick start</h2>
        <pre
          className={`${docsType.codeBlock} overflow-x-auto rounded-lg border border-border bg-muted/40 p-4`}
        >
          {`import { Button } from '@firefly/ui/components/ui/button'
import '@firefly/ui/index.css'`}
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className={docsType.sectionTitle}>Package exports</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">@firefly/ui/components/ui/*</Badge>
          <Badge variant="secondary">@firefly/ui/components/ai-elements/*</Badge>
          <Badge variant="secondary">@firefly/ui/lib/*</Badge>
          <Badge variant="secondary">@firefly/ui/index.css</Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={docsType.sectionTitle}>Search</h2>
        <p className={`${docsType.body} text-muted-foreground`}>
          Press{' '}
          <kbd
            className={`${docsType.inlineCode} rounded border border-border bg-muted px-1.5 py-0.5`}
          >
            ⌘K
          </kbd>{' '}
          anywhere in the docs to jump to a component.
        </p>
        <Button onClick={openSearch} size="sm" type="button">
          Open component search
        </Button>
      </section>
    </div>
  )
}
