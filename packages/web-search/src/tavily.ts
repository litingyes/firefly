import type {
  ConnectionTestResult,
  ProviderSearchPayload,
  WebSearchOptions,
  WebSearchProviderConfig,
} from './types.js'

type FetchFn = typeof globalThis.fetch

export const TAVILY_DEFAULT_BASE_URL = 'https://api.tavily.com'

interface TavilySearchResult {
  title?: string
  url?: string
  content?: string
  score?: number
}

interface TavilySearchResponse {
  query?: string
  results?: TavilySearchResult[]
  detail?: {
    error?: string
  }
}

function getValue(config: WebSearchProviderConfig, key: string): string | undefined {
  const value = config.values[key]?.trim()
  return value || undefined
}

function statusMessage(status: number, fallback: string): string {
  if (status === 401 || status === 403) {
    return 'Authentication failed. Check your API key.'
  }
  if (status === 404) {
    return 'Endpoint not found. Check the base URL.'
  }
  if (status === 429 || status === 432 || status === 433) {
    return 'Rate or plan limit reached. Try again later.'
  }
  if (status >= 500) {
    return 'Tavily returned a server error. Try again later.'
  }
  return fallback
}

export function resolveTavilyBaseUrl(config: WebSearchProviderConfig): string {
  const custom = getValue(config, 'baseUrl')
  if (!custom) {
    return TAVILY_DEFAULT_BASE_URL
  }

  return custom.replace(/\/$/, '')
}

function resolveMaxResults(config: WebSearchProviderConfig, options?: WebSearchOptions): number {
  const fromOptions = options?.count
  if (fromOptions != null) {
    return Math.min(20, Math.max(1, fromOptions))
  }

  const fromConfig = Number.parseInt(getValue(config, 'maxResults') ?? '5', 10)
  if (Number.isFinite(fromConfig)) {
    return Math.min(20, Math.max(1, fromConfig))
  }

  return 5
}

function resolveSearchDepth(config: WebSearchProviderConfig): string {
  const value = getValue(config, 'searchDepth')
  if (value === 'advanced' || value === 'basic' || value === 'fast' || value === 'ultra-fast') {
    return value
  }
  return 'basic'
}

function mapTavilyResults(
  results: TavilySearchResult[] | undefined,
): ProviderSearchPayload['results'] {
  if (!results?.length) {
    return []
  }

  return results
    .filter(
      (
        result,
      ): result is Required<Pick<TavilySearchResult, 'title' | 'url'>> & TavilySearchResult =>
        Boolean(result.title?.trim() && result.url?.trim()),
    )
    .map((result) => ({
      title: result.title.trim(),
      url: result.url.trim(),
      content: result.content?.trim() ?? '',
    }))
}

export async function tavilyWebSearch(
  config: WebSearchProviderConfig,
  query: string,
  fetch: FetchFn,
  options?: WebSearchOptions,
): Promise<ProviderSearchPayload> {
  const apiKey = getValue(config, 'apiKey')
  if (!apiKey) {
    throw new Error('API key is required for Tavily.')
  }

  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    throw new Error('Search query cannot be empty.')
  }

  const base = resolveTavilyBaseUrl(config)

  const response = await fetch(`${base}/search`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: trimmedQuery,
      max_results: resolveMaxResults(config, options),
      search_depth: resolveSearchDepth(config),
    }),
  })

  let payload: TavilySearchResponse | null = null

  try {
    payload = (await response.json()) as TavilySearchResponse
  } catch {
    payload = null
  }

  if (!response.ok) {
    const apiMessage = payload?.detail?.error?.trim()
    throw new Error(apiMessage || statusMessage(response.status, 'Could not reach Tavily.'))
  }

  return {
    query: payload?.query?.trim() || trimmedQuery,
    results: mapTavilyResults(payload?.results),
  }
}

export async function testTavilyConnection(
  config: WebSearchProviderConfig,
  fetch: FetchFn,
): Promise<ConnectionTestResult> {
  const apiKey = getValue(config, 'apiKey')
  if (!apiKey) {
    return { ok: false, message: 'API key is required for Tavily.' }
  }

  try {
    const result = await tavilyWebSearch(config, 'firefly', fetch, { count: 1 })
    if (result.results.length > 0 || result.query) {
      return { ok: true }
    }
    return { ok: false, message: 'Tavily responded but returned no results.' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not reach Tavily.'
    return { ok: false, message }
  }
}
