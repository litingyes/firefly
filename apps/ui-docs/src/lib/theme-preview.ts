import {
  CHART_COLOR_TOKENS,
  CORE_COLOR_TOKENS,
  getContrastRatio,
  getCssVarValue,
  getTokenContrastPair,
  RADIUS_TOKENS,
  SIDEBAR_COLOR_TOKENS,
  SURFACE_COLOR_TOKENS,
  type ColorToken,
} from '@/lib/theme-tokens'

export type ResolvedToken = {
  name: string
  value: string
  swatchBackground: string
  swatchForeground: string | null
  contrastRatio: number | null
}

export type ResolvedThemeTokens = {
  core: ResolvedToken[]
  surface: ResolvedToken[]
  sidebar: ResolvedToken[]
  charts: ResolvedToken[]
  radius: { name: string; value: string }[]
}

function readTokens(root: Element, tokens: ColorToken[]): ResolvedToken[] {
  return tokens.map((token) => {
    const value = getCssVarValue(root, token.cssVar)
    const pair = getTokenContrastPair(token.name)

    if (!pair) {
      return {
        name: token.name,
        value,
        swatchBackground: value,
        swatchForeground: null,
        contrastRatio: null,
      }
    }

    const foreground = getCssVarValue(root, pair.foregroundVar)
    const background = getCssVarValue(root, pair.backgroundVar)
    const contrastRatio = foreground && background ? getContrastRatio(foreground, background) : null

    return {
      name: token.name,
      value,
      swatchBackground: background || value,
      swatchForeground: foreground || null,
      contrastRatio,
    }
  })
}

export function readThemeTokens(root: Element): ResolvedThemeTokens {
  return {
    core: readTokens(root, CORE_COLOR_TOKENS),
    surface: readTokens(root, SURFACE_COLOR_TOKENS),
    sidebar: readTokens(root, SIDEBAR_COLOR_TOKENS),
    charts: readTokens(root, CHART_COLOR_TOKENS),
    radius: RADIUS_TOKENS.map((token) => ({
      name: token.name,
      value: getCssVarValue(root, token.cssVar),
    })),
  }
}

function buildPreviewHeadMarkup(): string {
  return Array.from(document.head.children)
    .filter((element) => element.tagName === 'STYLE' || element.tagName === 'LINK')
    .map((element) => {
      if (element.tagName === 'LINK') {
        const href = (element as HTMLLinkElement).href
        return `<link rel="stylesheet" href="${href}">`
      }
      return element.outerHTML
    })
    .join('')
}

export function mountThemePreview(
  mode: 'light' | 'dark',
  onReady: (tokens: ResolvedThemeTokens) => void,
): () => void {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.tabIndex = -1
  iframe.style.cssText =
    'position:fixed;width:0;height:0;border:0;visibility:hidden;pointer-events:none'

  const cleanup = () => {
    iframe.remove()
  }

  iframe.onload = () => {
    const doc = iframe.contentDocument
    if (!doc) {
      cleanup()
      return
    }

    doc.documentElement.className = mode === 'dark' ? 'dark' : ''
    doc.documentElement.lang = 'en'

    requestAnimationFrame(() => {
      onReady(readThemeTokens(doc.documentElement))
      cleanup()
    })
  }

  iframe.srcdoc = `<!DOCTYPE html><html><head>${buildPreviewHeadMarkup()}</head><body></body></html>`
  document.body.appendChild(iframe)

  return cleanup
}
