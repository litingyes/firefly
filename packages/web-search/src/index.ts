export type {
  ConnectionStatus,
  ConnectionTestResult,
  SafeSearchLevel,
  WebSearchConfigMap,
  WebSearchOptions,
  WebSearchOutput,
  WebSearchOutputResult,
  WebSearchProviderConfig,
  WebSearchProviderId,
} from './types.js'

export {
  BRAVE_DEFAULT_BASE_URL,
  braveWebSearch,
  resolveBraveBaseUrl,
  testBraveConnection,
} from './brave.js'
export { EXA_DEFAULT_BASE_URL, exaWebSearch, resolveExaBaseUrl, testExaConnection } from './exa.js'
export {
  TAVILY_DEFAULT_BASE_URL,
  resolveTavilyBaseUrl,
  tavilyWebSearch,
  testTavilyConnection,
} from './tavily.js'
export { testWebSearchConnection } from './connection-test.js'
export {
  isWebSearchProviderConfigured,
  resolveActiveWebSearchProvider,
  webSearch,
} from './search.js'

export function createDefaultWebSearchProviderConfig(): import('./types.js').WebSearchProviderConfig {
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

export function createDefaultWebSearchConfigMap(): import('./types.js').WebSearchConfigMap {
  const ids = ['brave', 'exa', 'tavily'] as const

  return Object.fromEntries(
    ids.map((id) => [id, createDefaultWebSearchProviderConfig()]),
  ) as import('./types.js').WebSearchConfigMap
}
