import { Store } from '@tauri-apps/plugin-store'

import {
  createDefaultProviderConfigMap,
  type ProviderConfig,
  type ProviderConfigMap,
  PROVIDER_DEFINITIONS,
} from '@/lib/providers'
import { isTauri } from '@/lib/tauri-env'

const STORE_FILE = 'firefly-settings.json'
const STORE_KEY = 'provider-config'
const LEGACY_LOCAL_STORAGE_KEYS = [
  'firefly.provider-config.v2',
  'firefly.provider-config.v1',
] as const

let storePromise: Promise<Store> | null = null

function getStore(): Promise<Store> {
  if (!storePromise) {
    storePromise = Store.load(STORE_FILE)
  }
  return storePromise
}

function mergeStoredConfig(
  parsed: Partial<ProviderConfigMap> & { custom?: ProviderConfig },
): ProviderConfigMap {
  const defaults = createDefaultProviderConfigMap()

  for (const { id } of PROVIDER_DEFINITIONS) {
    if (parsed[id]) {
      defaults[id] = {
        ...defaults[id],
        ...parsed[id],
        values: { ...defaults[id].values, ...parsed[id]?.values },
      }
    }
  }

  if (parsed.custom && !parsed['openai-compatible']) {
    defaults['openai-compatible'] = {
      ...defaults['openai-compatible'],
      ...parsed.custom,
      values: { ...defaults['openai-compatible'].values, ...parsed.custom.values },
    }
  }

  return defaults
}

function loadFromLocalStorage(): ProviderConfigMap | null {
  if (typeof window === 'undefined') {
    return null
  }

  for (const key of LEGACY_LOCAL_STORAGE_KEYS) {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      continue
    }

    try {
      const parsed = JSON.parse(raw) as Partial<ProviderConfigMap> & { custom?: ProviderConfig }
      return mergeStoredConfig(parsed)
    } catch {
      continue
    }
  }

  return null
}

function saveToLocalStorage(config: ProviderConfigMap) {
  window.localStorage.setItem(LEGACY_LOCAL_STORAGE_KEYS[0], JSON.stringify(config))
}

export async function loadProviderConfig(): Promise<ProviderConfigMap> {
  if (!isTauri()) {
    return loadFromLocalStorage() ?? createDefaultProviderConfigMap()
  }

  const store = await getStore()
  const stored = await store.get<ProviderConfigMap>(STORE_KEY)

  if (stored) {
    return mergeStoredConfig(stored)
  }

  const legacy = loadFromLocalStorage()
  if (legacy) {
    await store.set(STORE_KEY, legacy)
    await store.save()
    for (const key of LEGACY_LOCAL_STORAGE_KEYS) {
      window.localStorage.removeItem(key)
    }
    return legacy
  }

  return createDefaultProviderConfigMap()
}

export async function saveProviderConfig(config: ProviderConfigMap): Promise<void> {
  if (!isTauri()) {
    saveToLocalStorage(config)
    return
  }

  const store = await getStore()
  await store.set(STORE_KEY, config)
  await store.save()
}
