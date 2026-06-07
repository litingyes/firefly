import { braveWebSearch } from './brave.js'
import { exaWebSearch } from './exa.js'
import { toWebSearchOutput } from './normalize.js'
import { tavilyWebSearch } from './tavily.js'
import type {
  WebSearchConfigMap,
  WebSearchOptions,
  WebSearchOutput,
  WebSearchProviderConfig,
  WebSearchProviderId,
} from './types.js'

type FetchFn = typeof globalThis.fetch

export function isWebSearchProviderConfigured(
  id: WebSearchProviderId,
  config: WebSearchProviderConfig,
): boolean {
  switch (id) {
    case 'brave':
    case 'exa':
    case 'tavily':
      return Boolean(config.values.apiKey?.trim())
  }
}

export function resolveActiveWebSearchProvider(
  configMap: WebSearchConfigMap,
  preferredId?: WebSearchProviderId,
): WebSearchProviderId | null {
  if (preferredId) {
    const preferred = configMap[preferredId]
    if (
      preferred?.enabled &&
      preferred.status === 'connected' &&
      isWebSearchProviderConfigured(preferredId, preferred)
    ) {
      return preferredId
    }
    return null
  }

  for (const id of Object.keys(configMap) as WebSearchProviderId[]) {
    const config = configMap[id]
    if (
      config.enabled &&
      config.status === 'connected' &&
      isWebSearchProviderConfigured(id, config)
    ) {
      return id
    }
  }

  return null
}

export async function webSearch(
  configMap: WebSearchConfigMap,
  query: string,
  fetch: FetchFn,
  options?: WebSearchOptions & { providerId?: WebSearchProviderId },
): Promise<WebSearchOutput> {
  const providerId = resolveActiveWebSearchProvider(configMap, options?.providerId)
  if (!providerId) {
    throw new Error('No connected web search provider is enabled.')
  }

  const config = configMap[providerId]

  let payload
  switch (providerId) {
    case 'brave':
      payload = await braveWebSearch(config, query, fetch, options)
      break
    case 'exa':
      payload = await exaWebSearch(config, query, fetch, options)
      break
    case 'tavily':
      payload = await tavilyWebSearch(config, query, fetch, options)
      break
  }

  return toWebSearchOutput(payload)
}
