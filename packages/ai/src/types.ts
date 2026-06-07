export type ProviderId =
  | 'ai-gateway'
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'deepseek'
  | 'ollama'
  | 'openrouter'
  | 'openai-compatible'

export type ConnectionStatus = 'idle' | 'testing' | 'connected' | 'error'

export interface ProviderConfig {
  enabled: boolean
  values: Record<string, string>
  status: ConnectionStatus
  statusMessage?: string
  lastVerifiedAt?: string
}

export type ProviderConfigMap = Record<ProviderId, ProviderConfig>

export interface ConnectionTestResult {
  ok: boolean
  message?: string
}
