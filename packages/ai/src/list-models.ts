import type { ModelInfo } from './model-types.js'
import { createProviderClient, resolveProviderBaseUrl } from './runtime.js'
import type { ProviderConfig, ProviderId } from './types.js'

type FetchFn = typeof globalThis.fetch

function getValue(config: ProviderConfig, key: string): string | undefined {
  const value = config.values[key]?.trim()
  return value || undefined
}

function listError(status: number, fallback: string): Error {
  if (status === 401 || status === 403) {
    return new Error('Authentication failed. Check your API key.')
  }
  if (status === 404) {
    return new Error('Model listing endpoint not found. Check the base URL.')
  }
  if (status >= 500) {
    return new Error('The provider returned a server error. Try again later.')
  }
  return new Error(fallback)
}

async function fetchJson<T>(fetch: FetchFn, url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init)

  if (!response.ok) {
    throw listError(response.status, 'Could not load models from the provider.')
  }

  return (await response.json()) as T
}

function normalizeOpenAiModelList(data: { data?: Array<{ id: string }> }): ModelInfo[] {
  return (data.data ?? []).map((entry) => ({
    id: entry.id,
    name: entry.id,
  }))
}

function normalizeGatewayPublicModelList(data: {
  data?: Array<{
    id: string
    name?: string
    description?: string
    context_window?: number
    tags?: string[]
    owned_by?: string
    type?: string
  }>
}): ModelInfo[] {
  return (data.data ?? [])
    .filter((entry) => !entry.type || entry.type === 'language')
    .map((entry) => ({
      id: entry.id,
      name: entry.name ?? entry.id,
      description: entry.description,
      contextWindow: entry.context_window,
      tags: entry.tags,
      provider: entry.owned_by,
    }))
}

function normalizeGoogleModelList(data: {
  models?: Array<{
    name: string
    displayName?: string
    description?: string
    inputTokenLimit?: number
    supportedGenerationMethods?: string[]
  }>
}): ModelInfo[] {
  return (data.models ?? [])
    .filter((entry) => entry.supportedGenerationMethods?.includes('generateContent'))
    .map((entry) => {
      const id = entry.name.replace(/^models\//, '')
      return {
        id,
        name: entry.displayName ?? id,
        description: entry.description,
        contextWindow: entry.inputTokenLimit,
        provider: 'google',
      }
    })
}

function normalizeOllamaModelList(data: {
  models?: Array<{ name: string; details?: { parameter_size?: string } }>
}): ModelInfo[] {
  return (data.models ?? []).map((entry) => ({
    id: entry.name,
    name: entry.details?.parameter_size
      ? `${entry.name} (${entry.details.parameter_size})`
      : entry.name,
    provider: 'ollama',
  }))
}

async function listGatewayModels(config: ProviderConfig, fetch: FetchFn): Promise<ModelInfo[]> {
  const client = createProviderClient('ai-gateway', config, fetch)

  if ('getAvailableModels' in client && typeof client.getAvailableModels === 'function') {
    const { models } = await client.getAvailableModels()
    return models
      .filter((model) => !model.modelType || model.modelType === 'language')
      .map((model) => ({
        id: model.id,
        name: model.name,
        description: model.description ?? undefined,
        provider: model.specification.provider,
        tags: undefined,
      }))
  }

  const apiKey = getValue(config, 'apiKey')
  if (!apiKey) {
    throw new Error('API key is required for Vercel AI Gateway.')
  }

  const base = resolveProviderBaseUrl('ai-gateway', config)
  const data = await fetchJson<Parameters<typeof normalizeGatewayPublicModelList>[0]>(
    fetch,
    `${base}/models`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}` },
    },
  )

  return normalizeGatewayPublicModelList(data)
}

async function listOpenAiCompatibleModels(
  id: ProviderId,
  config: ProviderConfig,
  fetch: FetchFn,
): Promise<ModelInfo[]> {
  const apiKey = getValue(config, 'apiKey')
  if (id !== 'openai-compatible' && !apiKey) {
    throw new Error('API key is required.')
  }

  const base = resolveProviderBaseUrl(id, config)
  const headers: Record<string, string> = {}
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  const data = await fetchJson<{ data?: Array<{ id: string }> }>(fetch, `${base}/models`, {
    method: 'GET',
    headers,
  })

  return normalizeOpenAiModelList(data)
}

export async function listProviderModels(
  id: ProviderId,
  config: ProviderConfig,
  fetch: FetchFn,
): Promise<ModelInfo[]> {
  const apiKey = getValue(config, 'apiKey')

  switch (id) {
    case 'ai-gateway':
      return listGatewayModels(config, fetch)

    case 'openai':
    case 'deepseek':
    case 'openrouter':
    case 'openai-compatible':
      return listOpenAiCompatibleModels(id, config, fetch)

    case 'anthropic': {
      if (!apiKey) {
        throw new Error('API key is required for Anthropic.')
      }
      const base = resolveProviderBaseUrl(id, config)
      const data = await fetchJson<{ data?: Array<{ id: string; display_name?: string }> }>(
        fetch,
        `${base}/models`,
        {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
        },
      )

      return (data.data ?? []).map((entry) => ({
        id: entry.id,
        name: entry.display_name ?? entry.id,
        provider: 'anthropic',
      }))
    }

    case 'google': {
      if (!apiKey) {
        throw new Error('API key is required for Google Generative AI.')
      }
      const base = resolveProviderBaseUrl(id, config)
      const data = await fetchJson<Parameters<typeof normalizeGoogleModelList>[0]>(
        fetch,
        `${base}/models?key=${encodeURIComponent(apiKey)}`,
        { method: 'GET' },
      )
      return normalizeGoogleModelList(data)
    }

    case 'ollama': {
      const base = resolveProviderBaseUrl(id, config)
      const data = await fetchJson<Parameters<typeof normalizeOllamaModelList>[0]>(
        fetch,
        `${base}/api/tags`,
        { method: 'GET' },
      )
      return normalizeOllamaModelList(data)
    }
  }
}
