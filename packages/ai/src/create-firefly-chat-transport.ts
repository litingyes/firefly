import { convertToModelMessages, streamText, type ChatTransport, type UIMessage } from 'ai'

import type { ModelRef } from './model-types.js'
import { getLanguageModel } from './runtime.js'
import type { ProviderConfig, ProviderId } from './types.js'

type FetchFn = typeof globalThis.fetch

export interface CreateFireflyChatTransportOptions {
  getModelRef: () => ModelRef | undefined
  getProviderConfig: (id: ProviderId) => ProviderConfig | undefined
  fetch: FetchFn
  system?: string
}

export function createFireflyChatTransport(
  options: CreateFireflyChatTransportOptions,
): ChatTransport<UIMessage> {
  return {
    sendMessages: async ({ messages, abortSignal }) => {
      const ref = options.getModelRef()
      const config = ref ? options.getProviderConfig(ref.providerId) : undefined

      if (!ref || !config?.enabled) {
        throw new Error('No chat model configured.')
      }

      const result = streamText({
        model: getLanguageModel(ref.providerId, ref.modelId, config, options.fetch),
        system: options.system,
        messages: await convertToModelMessages(messages),
        abortSignal,
      })

      return result.toUIMessageStream()
    },

    reconnectToStream: async () => null,
  }
}
