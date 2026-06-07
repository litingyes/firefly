import type { ProviderConfig, ProviderConfigMap } from './types.js'

export function createDefaultProviderConfig(): ProviderConfig {
  return {
    enabled: false,
    values: {},
    status: 'idle',
  }
}

export function createDefaultProviderConfigMap(): ProviderConfigMap {
  const ids = [
    'ai-gateway',
    'openai',
    'anthropic',
    'google',
    'deepseek',
    'ollama',
    'openrouter',
    'openai-compatible',
  ] as const

  return Object.fromEntries(
    ids.map((id) => [id, createDefaultProviderConfig()]),
  ) as ProviderConfigMap
}
