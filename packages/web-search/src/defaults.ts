import type { WebSearchConfigMap, WebSearchProviderConfig } from './types.js'

export function createDefaultWebSearchProviderConfig(): WebSearchProviderConfig {
  return {
    enabled: false,
    values: {
      country: 'US',
      searchLang: 'en',
      resultCount: '10',
      safesearch: 'moderate',
    },
    status: 'idle',
  }
}

export function createDefaultWebSearchConfigMap(): WebSearchConfigMap {
  const ids = ['brave', 'exa', 'tavily'] as const

  return Object.fromEntries(
    ids.map((id) => [id, createDefaultWebSearchProviderConfig()]),
  ) as WebSearchConfigMap
}
