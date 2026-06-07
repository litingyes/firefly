import type { ModelRef, ProviderId } from '@firefly/ai'
import { modelRefKey } from '@firefly/ai'

import { createDefaultModelSceneConfig, type ModelSceneConfig } from '@/lib/scenes'

export type ProviderModelAllowlist = Partial<Record<ProviderId, string[]>>

export interface ModelSettings {
  allowlist: ProviderModelAllowlist
  scenes: ModelSceneConfig
}

export function createDefaultModelSettings(): ModelSettings {
  return {
    allowlist: {},
    scenes: createDefaultModelSceneConfig(),
  }
}

export function isModelEnabled(allowlist: ProviderModelAllowlist, ref: ModelRef): boolean {
  const enabled = allowlist[ref.providerId]
  if (!enabled) {
    return false
  }
  return enabled.includes(ref.modelId)
}

export function getEnabledModelRefs(allowlist: ProviderModelAllowlist): ModelRef[] {
  const refs: ModelRef[] = []

  for (const [providerId, modelIds] of Object.entries(allowlist)) {
    for (const modelId of modelIds ?? []) {
      refs.push({ providerId: providerId as ProviderId, modelId })
    }
  }

  return refs.sort((left, right) => modelRefKey(left).localeCompare(modelRefKey(right)))
}

export function pruneSceneConfig(
  scenes: ModelSceneConfig,
  allowlist: ProviderModelAllowlist,
): ModelSceneConfig {
  const next = createDefaultModelSceneConfig()

  for (const scene of Object.keys(next) as Array<keyof ModelSceneConfig>) {
    next[scene] = scenes[scene].filter((ref) => isModelEnabled(allowlist, ref))
  }

  return next
}

export function pruneAllowlist(
  allowlist: ProviderModelAllowlist,
  availableByProvider: Partial<Record<ProviderId, string[]>>,
): ProviderModelAllowlist {
  const next: ProviderModelAllowlist = {}

  for (const [providerId, modelIds] of Object.entries(allowlist)) {
    const available = new Set(availableByProvider[providerId as ProviderId] ?? [])
    const filtered = (modelIds ?? []).filter((modelId) => available.has(modelId))
    if (filtered.length > 0) {
      next[providerId as ProviderId] = filtered
    }
  }

  return next
}
