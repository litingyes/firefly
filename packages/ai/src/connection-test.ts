import { resolveProviderBaseUrl } from './runtime.js'
import type { ConnectionTestResult, ProviderConfig, ProviderId } from './types.js'

type FetchFn = typeof globalThis.fetch

function getValue(config: ProviderConfig, key: string): string | undefined {
  const value = config.values[key]?.trim()
  return value || undefined
}

function statusMessage(status: number, fallback: string): string {
  if (status === 401 || status === 403) {
    return 'Authentication failed. Check your API key.'
  }
  if (status === 404) {
    return 'Endpoint not found. Check the base URL.'
  }
  if (status >= 500) {
    return 'The provider returned a server error. Try again later.'
  }
  return fallback
}

async function probe(
  fetch: FetchFn,
  url: string,
  init: RequestInit,
  fallbackError: string,
): Promise<ConnectionTestResult> {
  try {
    const response = await fetch(url, init)

    if (response.ok) {
      return { ok: true }
    }

    return {
      ok: false,
      message: statusMessage(response.status, fallbackError),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : fallbackError
    return { ok: false, message }
  }
}

export async function testProviderConnection(
  id: ProviderId,
  config: ProviderConfig,
  fetch: FetchFn,
): Promise<ConnectionTestResult> {
  const apiKey = getValue(config, 'apiKey')

  switch (id) {
    case 'ai-gateway': {
      if (!apiKey) {
        return { ok: false, message: 'API key is required for Vercel AI Gateway.' }
      }
      const base = resolveProviderBaseUrl(id, config)
      return probe(
        fetch,
        `${base}/models`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${apiKey}` },
        },
        'Could not reach Vercel AI Gateway.',
      )
    }

    case 'openai':
    case 'deepseek':
    case 'openrouter':
    case 'openai-compatible': {
      if (id !== 'openai-compatible' && !apiKey) {
        return { ok: false, message: 'API key is required.' }
      }

      const base = resolveProviderBaseUrl(id, config)
      const headers: Record<string, string> = {}
      if (apiKey) {
        headers.Authorization = `Bearer ${apiKey}`
      }

      return probe(
        fetch,
        `${base}/models`,
        { method: 'GET', headers },
        'Could not reach the provider endpoint.',
      )
    }

    case 'anthropic': {
      if (!apiKey) {
        return { ok: false, message: 'API key is required for Anthropic.' }
      }
      const base = resolveProviderBaseUrl(id, config)
      return probe(
        fetch,
        `${base}/models`,
        {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
        },
        'Could not reach Anthropic.',
      )
    }

    case 'google': {
      if (!apiKey) {
        return { ok: false, message: 'API key is required for Google Generative AI.' }
      }
      const base = resolveProviderBaseUrl(id, config)
      return probe(
        fetch,
        `${base}/models?key=${encodeURIComponent(apiKey)}`,
        { method: 'GET' },
        'Could not reach Google Generative AI.',
      )
    }

    case 'ollama': {
      const base = resolveProviderBaseUrl(id, config)
      return probe(
        fetch,
        `${base}/api/tags`,
        { method: 'GET' },
        'Could not reach Ollama. Make sure the server is running.',
      )
    }
  }
}
