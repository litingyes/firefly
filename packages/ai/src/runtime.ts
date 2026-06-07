import { createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createGateway, type LanguageModel } from 'ai'
import { createOllama } from 'ai-sdk-ollama'

import type { ProviderConfig, ProviderId } from './types.js'

type FetchFn = typeof globalThis.fetch

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

function getValue(config: ProviderConfig, key: string): string | undefined {
  const value = config.values[key]?.trim()
  return value || undefined
}

export function createProviderClient(id: ProviderId, config: ProviderConfig, fetch: FetchFn) {
  switch (id) {
    case 'ai-gateway':
      return createGateway({
        apiKey: getValue(config, 'apiKey'),
        baseURL: getValue(config, 'baseUrl'),
        fetch,
      })

    case 'openai':
      return createOpenAI({
        apiKey: getValue(config, 'apiKey'),
        organization: getValue(config, 'organization'),
        baseURL: getValue(config, 'baseUrl'),
        fetch,
      })

    case 'anthropic':
      return createAnthropic({
        apiKey: getValue(config, 'apiKey'),
        baseURL: getValue(config, 'baseUrl'),
        fetch,
      })

    case 'google':
      return createGoogleGenerativeAI({
        apiKey: getValue(config, 'apiKey'),
        fetch,
      })

    case 'deepseek':
      return createDeepSeek({
        apiKey: getValue(config, 'apiKey'),
        baseURL: getValue(config, 'baseUrl'),
        fetch,
      })

    case 'ollama':
      return createOllama({
        baseURL: getValue(config, 'baseUrl') ?? 'http://127.0.0.1:11434',
        fetch,
      })

    case 'openrouter':
      return createOpenRouter({
        apiKey: getValue(config, 'apiKey'),
        fetch,
      })

    case 'openai-compatible':
      return createOpenAI({
        apiKey: getValue(config, 'apiKey') ?? '',
        baseURL: getValue(config, 'baseUrl'),
        fetch,
      })
  }
}

export function getLanguageModel(
  id: ProviderId,
  modelId: string,
  config: ProviderConfig,
  fetch: FetchFn,
): LanguageModel {
  const client = createProviderClient(id, config, fetch)

  if (id === 'openrouter') {
    return client.chat(modelId)
  }

  return client(modelId)
}

function normalizeOpenAiCompatibleBase(baseUrl: string): string {
  const trimmed = trimTrailingSlash(baseUrl)
  return trimmed.endsWith('/v1') ? trimmed : `${trimmed}/v1`
}

export function resolveProviderBaseUrl(id: ProviderId, config: ProviderConfig): string {
  const baseUrl = getValue(config, 'baseUrl')

  switch (id) {
    case 'ai-gateway':
      return trimTrailingSlash(baseUrl ?? 'https://ai-gateway.vercel.sh/v3/ai')
    case 'openai':
      return normalizeOpenAiCompatibleBase(baseUrl ?? 'https://api.openai.com/v1')
    case 'anthropic':
      return trimTrailingSlash(baseUrl ?? 'https://api.anthropic.com/v1')
    case 'deepseek': {
      const raw = trimTrailingSlash(baseUrl ?? 'https://api.deepseek.com')
      return raw.endsWith('/v1') ? raw : `${raw}/v1`
    }
    case 'openrouter':
      return normalizeOpenAiCompatibleBase(baseUrl ?? 'https://openrouter.ai/api/v1')
    case 'ollama':
      return trimTrailingSlash(baseUrl ?? 'http://127.0.0.1:11434')
    case 'openai-compatible':
      if (!baseUrl) {
        throw new Error('Base URL is required for OpenAI-compatible providers.')
      }
      return normalizeOpenAiCompatibleBase(baseUrl)
    case 'google':
      return 'https://generativelanguage.googleapis.com/v1beta'
  }
}
