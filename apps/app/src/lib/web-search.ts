import type {
  ConnectionStatus,
  WebSearchProviderConfig,
  WebSearchProviderId,
  WebSearchConfigMap,
} from '@firefly/web-search'
import {
  createDefaultWebSearchProviderConfig,
  createDefaultWebSearchConfigMap,
} from '@firefly/web-search'

export type { ConnectionStatus, WebSearchProviderConfig, WebSearchConfigMap, WebSearchProviderId }
export { createDefaultWebSearchProviderConfig, createDefaultWebSearchConfigMap }

export const FIREFLY_ISSUES_URL = 'https://github.com/litingyes/firefly/issues/new'

export type WebSearchFieldType = 'password' | 'text' | 'url' | 'select'

export interface WebSearchField {
  key: string
  label: string
  type: WebSearchFieldType
  placeholder?: string
  required?: boolean
  description?: string
  options?: Array<{ value: string; label: string }>
}

export interface WebSearchProviderDefinition {
  id: WebSearchProviderId
  name: string
  description: string
  logo: 'brave' | 'exa' | 'tavily'
  docsUrl: string
  fields: WebSearchField[]
}

export const WEB_SEARCH_PROVIDER_DEFINITIONS: WebSearchProviderDefinition[] = [
  {
    id: 'brave',
    name: 'Brave Search',
    description: 'Independent web index with privacy-focused search results.',
    logo: 'brave',
    docsUrl: 'https://api-dashboard.search.brave.com/api-reference/web/search/get',
    fields: [
      {
        key: 'apiKey',
        label: 'Subscription token',
        type: 'password',
        placeholder: 'BSA...',
        required: true,
        description:
          'From the Brave Search API dashboard. Sent as the X-Subscription-Token header.',
      },
      {
        key: 'baseUrl',
        label: 'Base URL',
        type: 'url',
        placeholder: 'https://api.search.brave.com/res/v1',
        description: 'Leave blank to use the default Brave Search API endpoint.',
      },
      {
        key: 'country',
        label: 'Country',
        type: 'text',
        placeholder: 'US',
        description: 'Two-letter country code for result locale. Default is US.',
      },
      {
        key: 'searchLang',
        label: 'Search language',
        type: 'text',
        placeholder: 'en',
        description: 'Language code for search results. Default is en.',
      },
      {
        key: 'resultCount',
        label: 'Default result count',
        type: 'text',
        placeholder: '10',
        description: 'Number of results per search, from 1 to 20.',
      },
      {
        key: 'safesearch',
        label: 'Safe search',
        type: 'select',
        description: 'How strictly adult content is filtered in results.',
        options: [
          { value: 'off', label: 'Off' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'strict', label: 'Strict' },
        ],
      },
    ],
  },
  {
    id: 'exa',
    name: 'Exa',
    description: 'Neural search with highlights and page content extraction.',
    logo: 'exa',
    docsUrl: 'https://exa.ai/docs/reference/search',
    fields: [
      {
        key: 'apiKey',
        label: 'API key',
        type: 'password',
        placeholder: 'exa-...',
        required: true,
        description: 'From the Exa dashboard. Sent as the x-api-key header.',
      },
      {
        key: 'baseUrl',
        label: 'Base URL',
        type: 'url',
        placeholder: 'https://api.exa.ai',
        description: 'Leave blank to use the default Exa API endpoint.',
      },
      {
        key: 'numResults',
        label: 'Default result count',
        type: 'text',
        placeholder: '10',
        description: 'Number of results per search, from 1 to 100.',
      },
      {
        key: 'searchType',
        label: 'Search type',
        type: 'select',
        description: 'Latency vs depth tradeoff. Auto picks the best mode per query.',
        options: [
          { value: 'auto', label: 'Auto' },
          { value: 'instant', label: 'Instant' },
          { value: 'fast', label: 'Fast' },
          { value: 'deep', label: 'Deep' },
        ],
      },
    ],
  },
  {
    id: 'tavily',
    name: 'Tavily',
    description: 'Search API tuned for LLM agents with ranked snippets per source.',
    logo: 'tavily',
    docsUrl: 'https://docs.tavily.com/documentation/api-reference/endpoint/search',
    fields: [
      {
        key: 'apiKey',
        label: 'API key',
        type: 'password',
        placeholder: 'tvly-...',
        required: true,
        description: 'From the Tavily dashboard. Sent as a Bearer token.',
      },
      {
        key: 'baseUrl',
        label: 'Base URL',
        type: 'url',
        placeholder: 'https://api.tavily.com',
        description: 'Leave blank to use the default Tavily API endpoint.',
      },
      {
        key: 'maxResults',
        label: 'Default result count',
        type: 'text',
        placeholder: '5',
        description: 'Number of results per search, from 1 to 20.',
      },
      {
        key: 'searchDepth',
        label: 'Search depth',
        type: 'select',
        description: 'Balances latency and relevance for result snippets.',
        options: [
          { value: 'basic', label: 'Basic' },
          { value: 'fast', label: 'Fast' },
          { value: 'advanced', label: 'Advanced' },
          { value: 'ultra-fast', label: 'Ultra fast' },
        ],
      },
    ],
  },
]

export function getWebSearchProviderDefinition(
  id: WebSearchProviderId,
): WebSearchProviderDefinition {
  const definition = WEB_SEARCH_PROVIDER_DEFINITIONS.find((provider) => provider.id === id)
  if (!definition) {
    throw new Error(`Unknown web search provider: ${id}`)
  }
  return definition
}

export function isWebSearchProviderConfigured(
  definition: WebSearchProviderDefinition,
  config: WebSearchProviderConfig,
): boolean {
  return definition.fields
    .filter((field) => field.required)
    .every((field) => config.values[field.key]?.trim())
}

export function validateWebSearchProviderConfig(
  definition: WebSearchProviderDefinition,
  config: WebSearchProviderConfig,
): string | null {
  if (!config.enabled) {
    return null
  }

  for (const field of definition.fields) {
    if (field.required && !config.values[field.key]?.trim()) {
      return `${field.label} is required for ${definition.name}.`
    }
  }

  if (definition.id === 'brave') {
    const resultCount = config.values.resultCount?.trim()
    if (resultCount) {
      const parsed = Number.parseInt(resultCount, 10)
      if (!Number.isFinite(parsed) || parsed < 1 || parsed > 20) {
        return 'Default result count must be a number between 1 and 20.'
      }
    }
  }

  if (definition.id === 'exa') {
    const numResults = config.values.numResults?.trim()
    if (numResults) {
      const parsed = Number.parseInt(numResults, 10)
      if (!Number.isFinite(parsed) || parsed < 1 || parsed > 100) {
        return 'Default result count must be a number between 1 and 100.'
      }
    }
  }

  if (definition.id === 'tavily') {
    const maxResults = config.values.maxResults?.trim()
    if (maxResults) {
      const parsed = Number.parseInt(maxResults, 10)
      if (!Number.isFinite(parsed) || parsed < 1 || parsed > 20) {
        return 'Default result count must be a number between 1 and 20.'
      }
    }
  }

  return null
}
