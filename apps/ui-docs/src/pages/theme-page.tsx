import { useEffect, useState } from 'react'

import { TokenSwatch } from '@/components/token-swatch'
import {
  CHART_COLOR_TOKENS,
  CORE_COLOR_TOKENS,
  getContrastRatio,
  getCssVarValue,
  RADIUS_TOKENS,
  SIDEBAR_COLOR_TOKENS,
  SURFACE_COLOR_TOKENS,
  type ColorToken,
} from '@/lib/theme-tokens'

type ResolvedToken = {
  name: string
  value: string
  contrastRatio: number | null
}

function readTokens(element: Element, tokens: ColorToken[]): ResolvedToken[] {
  const foreground = getCssVarValue(element, '--foreground')

  return tokens.map((token) => {
    const value = getCssVarValue(element, token.cssVar)
    const contrastRatio =
      token.name.includes('foreground') || !value ? null : getContrastRatio(foreground, value)

    return { name: token.name, value, contrastRatio }
  })
}

function TokenGrid({ tokens }: { tokens: ResolvedToken[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tokens.map((token) => (
        <TokenSwatch
          key={token.name}
          contrastRatio={token.contrastRatio}
          name={token.name}
          value={token.value || '—'}
        />
      ))}
    </div>
  )
}

function ThemeColumn({ label, mode }: { label: string; mode: 'light' | 'dark' }) {
  const [tokens, setTokens] = useState<{
    core: ResolvedToken[]
    surface: ResolvedToken[]
    sidebar: ResolvedToken[]
    charts: ResolvedToken[]
    radius: { name: string; value: string }[]
  } | null>(null)

  useEffect(() => {
    const frame = document.createElement('div')
    frame.className = mode === 'dark' ? 'dark' : ''
    frame.style.position = 'fixed'
    frame.style.left = '-9999px'
    frame.style.top = '0'
    frame.style.width = '1px'
    frame.style.height = '1px'
    document.body.appendChild(frame)

    setTokens({
      core: readTokens(frame, CORE_COLOR_TOKENS),
      surface: readTokens(frame, SURFACE_COLOR_TOKENS),
      sidebar: readTokens(frame, SIDEBAR_COLOR_TOKENS),
      charts: readTokens(frame, CHART_COLOR_TOKENS),
      radius: RADIUS_TOKENS.map((token) => ({
        name: token.name,
        value: getCssVarValue(frame, token.cssVar),
      })),
    })

    return () => {
      document.body.removeChild(frame)
    }
  }, [mode])

  return (
    <div className="space-y-8">
      <h2 className="font-medium text-lg">{label}</h2>
      {tokens ? (
        <>
          <section className="space-y-3">
            <h3 className="font-medium text-sm">Core</h3>
            <TokenGrid tokens={tokens.core} />
          </section>
          <section className="space-y-3">
            <h3 className="font-medium text-sm">Surface</h3>
            <TokenGrid tokens={tokens.surface} />
          </section>
          <section className="space-y-3">
            <h3 className="font-medium text-sm">Sidebar</h3>
            <TokenGrid tokens={tokens.sidebar} />
          </section>
          <section className="space-y-3">
            <h3 className="font-medium text-sm">Charts</h3>
            <TokenGrid tokens={tokens.charts} />
          </section>
          <section className="space-y-3">
            <h3 className="font-medium text-sm">Radius</h3>
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
                    <p className="font-mono text-xs">{token.name}</p>
                    <p className="text-muted-foreground text-xs">{token.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <p className="text-muted-foreground text-sm">Loading tokens...</p>
      )}
    </div>
  )
}

export function ThemePage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight">Theme</h1>
        <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
          Design tokens from <code className="font-mono text-xs">@firefly/ui/index.css</code>.
          Values are read at runtime so this page stays in sync with the package. Use the header
          toggle to preview components in light or dark mode.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-medium text-sm">Typography</h2>
        <div className="space-y-4 rounded-lg border border-border p-6">
          <p className="font-semibold text-2xl">Geist Variable</p>
          <p className="text-base">Body text for settings, chat, and documentation.</p>
          <p className="text-muted-foreground text-sm">Muted supporting copy and metadata.</p>
          <p className="font-mono text-sm">
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
