import type { ProviderId } from './types.js'

export interface ModelInfo {
  id: string
  name: string
  provider?: string
  description?: string
  contextWindow?: number
  tags?: string[]
}

export interface ModelRef {
  providerId: ProviderId
  modelId: string
}

export function modelRefKey(ref: ModelRef): string {
  return `${ref.providerId}:${ref.modelId}`
}

export function parseModelRefKey(key: string): ModelRef | null {
  const separator = key.indexOf(':')
  if (separator <= 0) {
    return null
  }

  return {
    providerId: key.slice(0, separator) as ProviderId,
    modelId: key.slice(separator + 1),
  }
}
