import type {
  ConnectionTestResult,
  ProviderSearchPayload,
  WebSearchOptions,
  WebSearchProviderConfig,
} from './types.js'

type FetchFn = typeof globalThis.fetch

export const EXA_DEFAULT_BASE_URL = 'https://api.exa.ai'

interface ExaSearchResult {
  title?: string
  url?: string
  highlights?: string[]
  text?: string
  publishedDate?: string
}

interface ExaSearchResponse {
  results?: ExaSearchResult[]
  error?: string
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
  if (status === 422) {
    return 'The request was invalid. Check your search settings.'
  }
  if (status === 429) {
    return 'Rate limit reached. Try again later.'
  }
  if (status >= 500) {
    return 'Exa returned a server error. Try again later.'
  }
  return fallback
}

export function resolveExaBaseUrl(config: WebSearchProviderConfig): string {
  const custom = getValue(config, 'baseUrl')
  if (!custom) {
    return EXA_DEFAULT_BASE_URL
  }

  return custom.replace(/\/$/, '')
}

function resolveNumResults(config: WebSearchProviderConfig, options?: WebSearchOptions): number {
  const fromOptions = options?.count
  if (fromOptions != null) {
    return Math.min(100, Math.max(1, fromOptions))
  }

  const fromConfig = Number.parseInt(getValue(config, 'numResults') ?? '10', 10)
  if (Number.isFinite(fromConfig)) {
    return Math.min(100, Math.max(1, fromConfig))
  }

  return 10
}

function mapExaResults(results: ExaSearchResult[] | undefined): ProviderSearchPayload['results'] {
  if (!results?.length) {
    return []
  }

  return results
    .filter(
      (result): result is Required<Pick<ExaSearchResult, 'title' | 'url'>> & ExaSearchResult =>
        Boolean(result.title?.trim() && result.url?.trim()),
    )
    .map((result) => ({
      title: result.title.trim(),
      url: result.url.trim(),
      content: result.highlights?.[0]?.trim() ?? result.text?.trim() ?? '',
    }))
}

export async function exaWebSearch(
  config: WebSearchProviderConfig,
  query: string,
  fetch: FetchFn,
  options?: WebSearchOptions,
): Promise<ProviderSearchPayload> {
  const apiKey = getValue(config, 'apiKey')
  if (!apiKey) {
    throw new Error('API key is required for Exa.')
  }

  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    throw new Error('Search query cannot be empty.')
  }

  const searchType = getValue(config, 'searchType') ?? 'auto'
  const base = resolveExaBaseUrl(config)

  const response = await fetch(`${base}/search`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      query: trimmedQuery,
      numResults: resolveNumResults(config, options),
      type: searchType,
      contents: { highlights: true },
    }),
  })

  let payload: ExaSearchResponse | null = null

  try {
    payload = (await response.json()) as ExaSearchResponse
  } catch {
    payload = null
  }

  if (!response.ok) {
    const apiMessage = payload?.error?.trim()
    throw new Error(apiMessage || statusMessage(response.status, 'Could not reach Exa.'))
  }

  return {
    query: trimmedQuery,
    results: mapExaResults(payload?.results),
  }
}

export async function testExaConnection(
  config: WebSearchProviderConfig,
  fetch: FetchFn,
): Promise<ConnectionTestResult> {
  const apiKey = getValue(config, 'apiKey')
  if (!apiKey) {
    return { ok: false, message: 'API key is required for Exa.' }
  }

  try {
    const result = await exaWebSearch(config, 'firefly', fetch, { count: 1 })
    if (result.results.length > 0 || result.query) {
      return { ok: true }
    }
    return { ok: false, message: 'Exa responded but returned no results.' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not reach Exa.'
    return { ok: false, message }
  }
}
