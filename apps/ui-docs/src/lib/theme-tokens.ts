export type ColorToken = {
  name: string
  cssVar: string
}

export const CORE_COLOR_TOKENS: ColorToken[] = [
  { name: 'background', cssVar: '--background' },
  { name: 'foreground', cssVar: '--foreground' },
  { name: 'primary', cssVar: '--primary' },
  { name: 'primary-foreground', cssVar: '--primary-foreground' },
  { name: 'secondary', cssVar: '--secondary' },
  { name: 'secondary-foreground', cssVar: '--secondary-foreground' },
  { name: 'muted', cssVar: '--muted' },
  { name: 'muted-foreground', cssVar: '--muted-foreground' },
  { name: 'accent', cssVar: '--accent' },
  { name: 'accent-foreground', cssVar: '--accent-foreground' },
  { name: 'destructive', cssVar: '--destructive' },
  { name: 'destructive-foreground', cssVar: '--destructive-foreground' },
  { name: 'border', cssVar: '--border' },
  { name: 'input', cssVar: '--input' },
  { name: 'ring', cssVar: '--ring' },
]

export const SURFACE_COLOR_TOKENS: ColorToken[] = [
  { name: 'card', cssVar: '--card' },
  { name: 'card-foreground', cssVar: '--card-foreground' },
  { name: 'popover', cssVar: '--popover' },
  { name: 'popover-foreground', cssVar: '--popover-foreground' },
]

export const SIDEBAR_COLOR_TOKENS: ColorToken[] = [
  { name: 'sidebar', cssVar: '--sidebar' },
  { name: 'sidebar-foreground', cssVar: '--sidebar-foreground' },
  { name: 'sidebar-primary', cssVar: '--sidebar-primary' },
  { name: 'sidebar-primary-foreground', cssVar: '--sidebar-primary-foreground' },
  { name: 'sidebar-accent', cssVar: '--sidebar-accent' },
  { name: 'sidebar-accent-foreground', cssVar: '--sidebar-accent-foreground' },
  { name: 'sidebar-border', cssVar: '--sidebar-border' },
  { name: 'sidebar-ring', cssVar: '--sidebar-ring' },
]

export const CHART_COLOR_TOKENS: ColorToken[] = [
  { name: 'chart-1', cssVar: '--chart-1' },
  { name: 'chart-2', cssVar: '--chart-2' },
  { name: 'chart-3', cssVar: '--chart-3' },
  { name: 'chart-4', cssVar: '--chart-4' },
  { name: 'chart-5', cssVar: '--chart-5' },
]

export const RADIUS_TOKENS = [
  { name: 'radius-sm', cssVar: '--radius-sm' },
  { name: 'radius-md', cssVar: '--radius-md' },
  { name: 'radius-lg', cssVar: '--radius-lg' },
  { name: 'radius-xl', cssVar: '--radius-xl' },
] as const

const SURFACE_FOREGROUND: Record<string, string> = {
  background: '--foreground',
  primary: '--primary-foreground',
  secondary: '--secondary-foreground',
  muted: '--muted-foreground',
  accent: '--accent-foreground',
  destructive: '--destructive-foreground',
  card: '--card-foreground',
  popover: '--popover-foreground',
  sidebar: '--sidebar-foreground',
  'sidebar-primary': '--sidebar-primary-foreground',
  'sidebar-accent': '--sidebar-accent-foreground',
}

const SKIP_CONTRAST = new Set(['border', 'input', 'ring', 'sidebar-border', 'sidebar-ring'])

export type TokenContrastPair = {
  foregroundVar: string
  backgroundVar: string
}

function tokenCssVar(tokenName: string): string {
  return `--${tokenName}`
}

export function getTokenContrastPair(tokenName: string): TokenContrastPair | null {
  if (SKIP_CONTRAST.has(tokenName)) return null

  if (tokenName === 'foreground') {
    return { foregroundVar: '--foreground', backgroundVar: '--background' }
  }

  if (tokenName.endsWith('-foreground')) {
    const surfaceName = tokenName.slice(0, -'-foreground'.length)
    return {
      foregroundVar: tokenCssVar(tokenName),
      backgroundVar: tokenCssVar(surfaceName),
    }
  }

  const foregroundVar = SURFACE_FOREGROUND[tokenName]
  if (foregroundVar) {
    return { foregroundVar, backgroundVar: tokenCssVar(tokenName) }
  }

  if (tokenName.startsWith('chart-')) {
    return { foregroundVar: '--foreground', backgroundVar: tokenCssVar(tokenName) }
  }

  return null
}

/** @deprecated Use getTokenContrastPair for contrast checks. */
export function getPairedForegroundVar(tokenName: string): string | null {
  return getTokenContrastPair(tokenName)?.foregroundVar ?? null
}

function parseOklch(
  l: number,
  c: number,
  h: number,
  alpha = 1,
): { r: number; g: number; b: number } {
  const hueRad = (h * Math.PI) / 180
  const a = c * Math.cos(hueRad)
  const b = c * Math.sin(hueRad)

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b

  const l3 = l_ ** 3
  const m3 = m_ ** 3
  const s3 = s_ ** 3

  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  let bVal = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3

  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  r = clamp(r)
  g = clamp(g)
  bVal = clamp(bVal)

  if (alpha < 1) {
    return { r: r * alpha, g: g * alpha, b: bVal * alpha }
  }

  return { r, g, b: bVal }
}

function relativeLuminance(r: number, g: number, b: number): number {
  const transform = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)

  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b)
}

function parseColorToRgb(color: string): { r: number; g: number; b: number } | null {
  const trimmed = color.trim()

  const oklchMatch = trimmed.match(
    /^oklch\(\s*([\d.]+(?:%)?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i,
  )
  if (oklchMatch) {
    let l = Number.parseFloat(oklchMatch[1])
    if (oklchMatch[1].endsWith('%')) l /= 100
    const c = Number.parseFloat(oklchMatch[2])
    const h = Number.parseFloat(oklchMatch[3])
    let alpha = 1
    if (oklchMatch[4]) {
      alpha = Number.parseFloat(oklchMatch[4])
      if (oklchMatch[4].endsWith('%')) alpha /= 100
    }
    return parseOklch(l, c, h, alpha)
  }

  return null
}

export function getCssVarValue(element: Element, cssVar: string): string {
  return getComputedStyle(element).getPropertyValue(cssVar).trim()
}

export function getContrastRatio(foreground: string, background: string): number | null {
  const fg = parseColorToRgb(foreground)
  const bg = parseColorToRgb(background)
  if (!fg || !bg) return null

  const l1 = relativeLuminance(fg.r, fg.g, fg.b)
  const l2 = relativeLuminance(bg.r, bg.g, bg.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}
