import { useEffect, useState } from 'react'

import { TokenSwatch } from '@/components/token-swatch'
import { useRotatingMessage } from '@/hooks/use-rotating-message'
import { docsType } from '@/lib/docs-type'
import {
  mountThemePreview,
  type ResolvedThemeTokens,
  type ResolvedToken,
} from '@/lib/theme-preview'

const LIGHT_LOADING_MESSAGES = [
  'Reading OKLCH values from @firefly/ui/index.css…',
  'Mounting isolated light preview…',
  'Computing contrast ratios…',
] as const

const DARK_LOADING_MESSAGES = [
  'Reading OKLCH values from @firefly/ui/index.css…',
  'Mounting isolated dark preview…',
  'Resolving sidebar and chart tokens…',
] as const

function TokenGrid({ tokens }: { tokens: ResolvedToken[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tokens.map((token) => (
        <TokenSwatch
          key={token.name}
          contrastRatio={token.contrastRatio}
          name={token.name}
          swatchBackground={token.swatchBackground || token.value || '—'}
          swatchForeground={token.swatchForeground}
          value={token.value || '—'}
        />
      ))}
    </div>
  )
}

function ThemeColumn({ label, mode }: { label: string; mode: 'light' | 'dark' }) {
  const [tokens, setTokens] = useState<ResolvedThemeTokens | null>(null)
  const [error, setError] = useState<string | null>(null)
  const loadingMessage = useRotatingMessage(
    mode === 'light' ? LIGHT_LOADING_MESSAGES : DARK_LOADING_MESSAGES,
  )

  useEffect(() => {
    setError(null)
    setTokens(null)

    let cancelled = false
    let loaded = false
    let timeoutId = 0

    const cleanup = mountThemePreview(mode, (resolved) => {
      if (cancelled) return
      loaded = true
      window.clearTimeout(timeoutId)
      setTokens(resolved)
    })

    timeoutId = window.setTimeout(() => {
      if (cancelled || loaded) return
      setError('Token preview timed out. Refresh the page to try again.')
    }, 5000)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
      cleanup()
    }
  }, [mode])

  return (
    <div className="space-y-8">
      <h2 className={docsType.columnTitle}>{label}</h2>
      {error ? (
        <p className={`${docsType.body} text-destructive`} role="alert">
          {error}
        </p>
      ) : null}
      {tokens ? (
        <>
          <section className="space-y-3">
            <h3 className={docsType.sectionTitle}>Core</h3>
            <TokenGrid tokens={tokens.core} />
          </section>
          <section className="space-y-3">
            <h3 className={docsType.sectionTitle}>Surface</h3>
            <TokenGrid tokens={tokens.surface} />
          </section>
          <section className="space-y-3">
            <h3 className={docsType.sectionTitle}>Sidebar</h3>
            <TokenGrid tokens={tokens.sidebar} />
          </section>
          <section className="space-y-3">
            <h3 className={docsType.sectionTitle}>Charts</h3>
            <TokenGrid tokens={tokens.charts} />
          </section>
          <section className="space-y-3">
            <h3 className={docsType.sectionTitle}>Radius</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {tokens.radius.map((token) => (
                <div
                  key={token.name}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <div
                    className="size-12 border border-border bg-muted"
                    style={{ borderRadius: token.value }}
                  />
                  <div>
                    <p className={docsType.tableName}>{token.name}</p>
                    <p className={`${docsType.meta} text-muted-foreground`}>{token.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : error ? null : (
        <p className={`${docsType.meta} docs-token-loading text-muted-foreground`}>
          {loadingMessage}
        </p>
      )}
    </div>
  )
}

export function ThemePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="space-y-2">
        <h1 className={docsType.pageTitle}>Theme</h1>
        <p className={`${docsType.lead} text-muted-foreground`}>
          Design tokens from <code className={docsType.inlineCode}>@firefly/ui/index.css</code>.
          Light and dark columns read from isolated previews, so ratios stay accurate no matter
          which mode the site is in. Contrast labels show paired text on each surface (4.5:1 AA).
        </p>
      </header>

      <section className="space-y-3">
        <h2 className={docsType.sectionTitle}>Typography</h2>
        <div className="space-y-4 rounded-lg border border-border p-6">
          <p className={docsType.pageTitle}>Geist Variable</p>
          <p className={docsType.body}>
            Body text for settings, chat, and documentation.{' '}
            <span className="font-medium text-primary">Primary accent</span> marks actions and
            focus.
          </p>
          <p className={`${docsType.meta} text-muted-foreground`}>
            Muted supporting copy and metadata.
          </p>
          <p className={docsType.codeBlock}>
            import {'{'} Button {'}'} from &apos;@firefly/ui/...&apos;
          </p>
        </div>
      </section>

      <div className="grid gap-10 xl:grid-cols-2">
        <ThemeColumn label="Light" mode="light" />
        <ThemeColumn label="Dark" mode="dark" />
      </div>
    </div>
  )
}
