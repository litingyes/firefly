import type {
  ConnectionTestResult,
  ProviderSearchPayload,
  SafeSearchLevel,
  WebSearchOptions,
  WebSearchProviderConfig,
} from './types.js'

type FetchFn = typeof globalThis.fetch

export const BRAVE_DEFAULT_BASE_URL = 'https://api.search.brave.com/res/v1'

interface BraveWebResult {
  title?: string
  url?: string
  description?: string
}

interface BraveSearchResponse {
  query?: {
    original?: string
    altered?: string
  }
  web?: {
    results?: BraveWebResult[]
  }
  error?: {
    code?: number
    message?: string
  }
}

function getValue(config: WebSearchProviderConfig, key: string): string | undefined {
  const value = config.values[key]?.trim()
  return value || undefined
}

function statusMessage(status: number, fallback: string): string {
  if (status === 401 || status === 403) {
    return 'Authentication failed. Check your subscription token.'
  }
  if (status === 404) {
    return 'Endpoint not found. Check the base URL.'
  }
  if (status === 422) {
    return 'The request was invalid. Check your search settings.'
  }
  if (status === 429) {
    return 'Rate limit reached. Try again later.'
  }
  if (status >= 500) {
    return 'Brave Search returned a server error. Try again later.'
  }
  return fallback
}

export function resolveBraveBaseUrl(config: WebSearchProviderConfig): string {
  const custom = getValue(config, 'baseUrl')
  if (!custom) {
    return BRAVE_DEFAULT_BASE_URL
  }

  return custom.replace(/\/$/, '')
}

function resolveCount(config: WebSearchProviderConfig, options?: WebSearchOptions): number {
  const fromOptions = options?.count
  if (fromOptions != null) {
    return Math.min(20, Math.max(1, fromOptions))
  }

  const fromConfig = Number.parseInt(getValue(config, 'resultCount') ?? '10', 10)
  if (Number.isFinite(fromConfig)) {
    return Math.min(20, Math.max(1, fromConfig))
  }

  return 10
}

function resolveSafeSearch(
  config: WebSearchProviderConfig,
  options?: WebSearchOptions,
): SafeSearchLevel {
  const value =
    options?.safesearch ?? (getValue(config, 'safesearch') as SafeSearchLevel | undefined)
  if (value === 'off' || value === 'moderate' || value === 'strict') {
    return value
  }
  return 'moderate'
}

function mapBraveResults(results: BraveWebResult[] | undefined): ProviderSearchPayload['results'] {
  if (!results?.length) {
    return []
  }

  return results
    .filter((result): result is Required<Pick<BraveWebResult, 'title' | 'url'>> & BraveWebResult =>
      Boolean(result.title?.trim() && result.url?.trim()),
    )
    .map((result) => ({
      title: result.title.trim(),
      url: result.url.trim(),
      content: result.description?.trim() ?? '',
    }))
}

function buildBraveSearchUrl(
  config: WebSearchProviderConfig,
  query: string,
  options?: WebSearchOptions,
): string {
  const base = resolveBraveBaseUrl(config)
  const url = new URL(`${base}/web/search`)
  url.searchParams.set('q', query)
  url.searchParams.set('count', String(resolveCount(config, options)))

  const country = options?.country ?? getValue(config, 'country') ?? 'US'
  url.searchParams.set('country', country)

  const searchLang = options?.searchLang ?? getValue(config, 'searchLang') ?? 'en'
  url.searchParams.set('search_lang', searchLang)

  url.searchParams.set('safesearch', resolveSafeSearch(config, options))

  if (options?.freshness?.trim()) {
    url.searchParams.set('freshness', options.freshness.trim())
  }

  if (options?.offset != null) {
    url.searchParams.set('offset', String(Math.min(9, Math.max(0, options.offset))))
  }

  return url.toString()
}

export async function braveWebSearch(
  config: WebSearchProviderConfig,
  query: string,
  fetch: FetchFn,
  options?: WebSearchOptions,
): Promise<ProviderSearchPayload> {
  const apiKey = getValue(config, 'apiKey')
  if (!apiKey) {
    throw new Error('Subscription token is required for Brave Search.')
  }

  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    throw new Error('Search query cannot be empty.')
  }

  const response = await fetch(buildBraveSearchUrl(config, trimmedQuery, options), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': apiKey,
    },
  })

  let payload: BraveSearchResponse | null = null

  try {
    payload = (await response.json()) as BraveSearchResponse
  } catch {
    payload = null
  }

  if (!response.ok) {
    const apiMessage = payload?.error?.message?.trim()
    throw new Error(apiMessage || statusMessage(response.status, 'Could not reach Brave Search.'))
  }

  const altered = payload?.query?.altered?.trim()
  const original = payload?.query?.original?.trim() || trimmedQuery

  return {
    query: altered || original,
    results: mapBraveResults(payload?.web?.results),
  }
}

export async function testBraveConnection(
  config: WebSearchProviderConfig,
  fetch: FetchFn,
): Promise<ConnectionTestResult> {
  const apiKey = getValue(config, 'apiKey')
  if (!apiKey) {
    return { ok: false, message: 'Subscription token is required for Brave Search.' }
  }

  try {
    const result = await braveWebSearch(config, 'firefly', fetch, { count: 1 })
    if (result.results.length > 0 || result.query) {
      return { ok: true }
    }
    return { ok: false, message: 'Brave Search responded but returned no results.' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not reach Brave Search.'
    return { ok: false, message }
  }
}
