import { webSearch } from '@firefly/web-search/search'
import type {
  WebSearchConfigMap,
  WebSearchOutput,
  WebSearchProviderId,
} from '@firefly/web-search/types'
import { jsonSchema, tool } from 'ai'

type FetchFn = typeof globalThis.fetch

export interface CreateWebSearchToolOptions {
  configMap: WebSearchConfigMap
  fetch: FetchFn
  providerId: WebSearchProviderId
}

export function createWebSearchTool(options: CreateWebSearchToolOptions) {
  return tool({
    description:
      'Search the web for current information. Use when the user asks about recent events, live data, or facts you are unsure about.',
    inputSchema: jsonSchema<{ query: string }>({
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'A specific search query. Keep it concise and focused.',
        },
      },
      required: ['query'],
      additionalProperties: false,
    }),
    execute: async ({ query }): Promise<WebSearchOutput> =>
      webSearch(options.configMap, query, options.fetch, {
        providerId: options.providerId,
      }),
  })
}
