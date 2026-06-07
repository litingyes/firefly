export type {
  ConnectionStatus,
  ConnectionTestResult,
  ProviderConfig,
  ProviderConfigMap,
  ProviderId,
} from './types.js'

export type { ModelInfo, ModelRef } from './model-types.js'
export { modelRefKey, parseModelRefKey } from './model-types.js'

export { testProviderConnection } from './connection-test.js'
export { listProviderModels } from './list-models.js'
export { createProviderClient, getLanguageModel, resolveProviderBaseUrl } from './runtime.js'

export function createDefaultProviderConfig(): import('./types.js').ProviderConfig {
  return {
    enabled: false,
    values: {},
    status: 'idle',
  }
}

export function createDefaultProviderConfigMap(): import('./types.js').ProviderConfigMap {
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
  ) as import('./types.js').ProviderConfigMap
}
