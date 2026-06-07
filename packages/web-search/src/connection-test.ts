import { testBraveConnection } from './brave.js'
import { testExaConnection } from './exa.js'
import { testTavilyConnection } from './tavily.js'
import type { ConnectionTestResult, WebSearchProviderConfig, WebSearchProviderId } from './types.js'

type FetchFn = typeof globalThis.fetch

export async function testWebSearchConnection(
  id: WebSearchProviderId,
  config: WebSearchProviderConfig,
  fetch: FetchFn,
): Promise<ConnectionTestResult> {
  switch (id) {
    case 'brave':
      return testBraveConnection(config, fetch)
    case 'exa':
      return testExaConnection(config, fetch)
    case 'tavily':
      return testTavilyConnection(config, fetch)
  }
}
