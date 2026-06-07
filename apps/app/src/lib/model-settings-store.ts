import { Store } from '@tauri-apps/plugin-store'

import { createDefaultModelSettings, type ModelSettings } from '@/lib/model-settings'
import { isTauri } from '@/lib/tauri-env'

const STORE_FILE = 'firefly-settings.json'
const STORE_KEY = 'model-settings'
const LEGACY_LOCAL_STORAGE_KEY = 'firefly.model-settings.v1'

let storePromise: Promise<Store> | null = null

function getStore(): Promise<Store> {
  if (!storePromise) {
    storePromise = Store.load(STORE_FILE)
  }
  return storePromise
}

function mergeStoredSettings(parsed: Partial<ModelSettings>): ModelSettings {
  const defaults = createDefaultModelSettings()

  return {
    allowlist: { ...defaults.allowlist, ...parsed.allowlist },
    scenes: {
      ...defaults.scenes,
      ...parsed.scenes,
      chat: parsed.scenes?.chat ?? defaults.scenes.chat,
      intent: parsed.scenes?.intent ?? defaults.scenes.intent,
      'context-compression':
        parsed.scenes?.['context-compression'] ?? defaults.scenes['context-compression'],
    },
  }
}

function loadFromLocalStorage(): ModelSettings | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return mergeStoredSettings(JSON.parse(raw) as Partial<ModelSettings>)
  } catch {
    return null
  }
}

function saveToLocalStorage(settings: ModelSettings) {
  window.localStorage.setItem(LEGACY_LOCAL_STORAGE_KEY, JSON.stringify(settings))
}

export async function loadModelSettings(): Promise<ModelSettings> {
  if (!isTauri()) {
    return loadFromLocalStorage() ?? createDefaultModelSettings()
  }

  const store = await getStore()
  const stored = await store.get<ModelSettings>(STORE_KEY)

  if (stored) {
    return mergeStoredSettings(stored)
  }

  const legacy = loadFromLocalStorage()
  if (legacy) {
    await store.set(STORE_KEY, legacy)
    await store.save()
    window.localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY)
    return legacy
  }

  return createDefaultModelSettings()
}

export async function saveModelSettings(settings: ModelSettings): Promise<void> {
  if (!isTauri()) {
    saveToLocalStorage(settings)
    return
  }

  const store = await getStore()
  await store.set(STORE_KEY, settings)
  await store.save()
}
