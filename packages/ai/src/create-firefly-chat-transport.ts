import type { WebSearchConfigMap, WebSearchProviderId } from '@firefly/web-search'
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type ChatTransport,
  type UIMessage,
} from 'ai'

import type { ModelRef } from './model-types.js'
import { getLanguageModel } from './runtime.js'
import type { ProviderConfig, ProviderId } from './types.js'
import { createWebSearchTool } from './web-search-tool.js'

type FetchFn = typeof globalThis.fetch

export interface WebSearchRuntimeConfig {
  providerId: WebSearchProviderId
  configMap: WebSearchConfigMap
}

export interface CreateFireflyChatTransportOptions {
  getModelRef: () => ModelRef | undefined
  getProviderConfig: (id: ProviderId) => ProviderConfig | undefined
  getWebSearch?: () => WebSearchRuntimeConfig | null
  fetch: FetchFn
  system?: string
}

const WEB_SEARCH_SYSTEM_APPENDIX =
  'You can search the web with the webSearch tool when you need current information. Cite source URLs from search results when they inform your answer.'

export function createFireflyChatTransport(
  options: CreateFireflyChatTransportOptions,
): ChatTransport<UIMessage> {
  return {
    sendMessages: async ({ messages, abortSignal }) => {
      const ref = options.getModelRef()
      if (!ref) {
        throw new Error('No chat model configured. Assign one in Settings → Scenes.')
      }

      const config = options.getProviderConfig(ref.providerId)
      if (!config?.enabled) {
        throw new Error(`${ref.providerId} is disabled. Enable it in Settings → Providers.`)
      }

      if (config.status !== 'connected') {
        throw new Error(
          `${ref.providerId} is not connected. Test the connection in Settings → Providers.`,
        )
      }

      const webSearchRuntime = options.getWebSearch?.() ?? null
      const tools = webSearchRuntime
        ? {
            webSearch: createWebSearchTool({
              configMap: webSearchRuntime.configMap,
              fetch: options.fetch,
              providerId: webSearchRuntime.providerId,
            }),
          }
        : undefined

      const system = webSearchRuntime
        ? [options.system, WEB_SEARCH_SYSTEM_APPENDIX].filter(Boolean).join('\n\n')
        : options.system

      const result = streamText({
        model: getLanguageModel(ref.providerId, ref.modelId, config, options.fetch),
        system,
        messages: await convertToModelMessages(messages),
        tools,
        stopWhen: tools ? stepCountIs(5) : undefined,
        abortSignal,
      })

      return result.toUIMessageStream()
    },

    reconnectToStream: async () => null,
  }
}
