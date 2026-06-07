export type WebSearchProviderId = 'brave' | 'exa' | 'tavily'

export type ConnectionStatus = 'idle' | 'testing' | 'connected' | 'error'

export interface WebSearchProviderConfig {
  enabled: boolean
  values: Record<string, string>
  status: ConnectionStatus
  statusMessage?: string
  lastVerifiedAt?: string
}

export type WebSearchConfigMap = Record<WebSearchProviderId, WebSearchProviderConfig>

export interface ConnectionTestResult {
  ok: boolean
  message?: string
}

export interface WebSearchOutputResult {
  title: string
  url: string
  content: string
}

export interface WebSearchOutput {
  query: string
  results: WebSearchOutputResult[]
}

/** Internal provider payload before normalization. */
export interface ProviderSearchPayload {
  query: string
  results: WebSearchOutputResult[]
}

export type SafeSearchLevel = 'off' | 'moderate' | 'strict'

export interface WebSearchOptions {
  count?: number
  country?: string
  searchLang?: string
  safesearch?: SafeSearchLevel
  freshness?: string
  offset?: number
}
