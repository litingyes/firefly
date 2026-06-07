import { isTauri } from '@/lib/platform/env'

export const STORE_FILE = 'firefly-settings.json'

const LEGACY_PROVIDER_CONFIG_KEYS = [
  'firefly.provider-config.v2',
  'firefly.provider-config.v1',
] as const

const LEGACY_MODEL_SETTINGS_KEY = 'firefly.model-settings.v1'

type StoreRecord = Record<string, unknown>

type TauriStore = {
  get: <T>(key: string) => Promise<T | undefined>
  set: (key: string, value: unknown) => Promise<void>
  save: () => Promise<void>
}

let tauriStorePromise: Promise<TauriStore> | null = null

async function getTauriStore(): Promise<TauriStore> {
  if (!tauriStorePromise) {
    tauriStorePromise = import('@tauri-apps/plugin-store').then(({ Store }) =>
      Store.load(STORE_FILE),
    )
  }
  return tauriStorePromise
}

function readBrowserStoreRecord(): StoreRecord {
  if (typeof window === 'undefined') {
    return {}
  }

  const raw = window.localStorage.getItem(STORE_FILE)
  if (!raw) {
    return {}
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as StoreRecord)
      : {}
  } catch {
    return {}
  }
}

function writeBrowserStoreRecord(record: StoreRecord): void {
  window.localStorage.setItem(STORE_FILE, JSON.stringify(record))
}

function readLegacyProviderConfig(): unknown | null {
  if (typeof window === 'undefined') {
    return null
  }

  for (const key of LEGACY_PROVIDER_CONFIG_KEYS) {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      continue
    }

    try {
      return JSON.parse(raw) as unknown
    } catch {
      continue
    }
  }

  return null
}

function readLegacyModelSettings(): unknown | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(LEGACY_MODEL_SETTINGS_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

function clearLegacyLocalStorage(): void {
  if (typeof window === 'undefined') {
    return
  }

  for (const key of LEGACY_PROVIDER_CONFIG_KEYS) {
    window.localStorage.removeItem(key)
  }
  window.localStorage.removeItem(LEGACY_MODEL_SETTINGS_KEY)
}

function migrateBrowserStoreRecord(): StoreRecord {
  const record = readBrowserStoreRecord()
  let changed = false

  if (record['provider-config'] == null) {
    const legacy = readLegacyProviderConfig()
    if (legacy != null) {
      record['provider-config'] = legacy
      changed = true
    }
  }

  if (record['model-settings'] == null) {
    const legacy = readLegacyModelSettings()
    if (legacy != null) {
      record['model-settings'] = legacy
      changed = true
    }
  }

  if (changed) {
    writeBrowserStoreRecord(record)
    clearLegacyLocalStorage()
  }

  return record
}

function readLocalStorageValue(key: string): unknown | null {
  const record = migrateBrowserStoreRecord()
  const value = record[key]
  return value ?? null
}

async function migrateLocalStorageToTauri(key: string, value: unknown): Promise<void> {
  const store = await getTauriStore()
  await store.set(key, value)
  await store.save()

  if (typeof window === 'undefined') {
    return
  }

  const record = readBrowserStoreRecord()
  if (key in record) {
    delete record[key]
    if (Object.keys(record).length === 0) {
      window.localStorage.removeItem(STORE_FILE)
    } else {
      writeBrowserStoreRecord(record)
    }
  }

  clearLegacyLocalStorage()
}

export async function getStoreValue<T>(key: string): Promise<T | null> {
  if (isTauri()) {
    const store = await getTauriStore()
    const stored = await store.get<T>(key)
    if (stored != null) {
      return stored
    }

    const localValue = readLocalStorageValue(key)
    if (localValue != null) {
      await migrateLocalStorageToTauri(key, localValue)
      return localValue as T
    }

    return null
  }

  const record = migrateBrowserStoreRecord()
  const value = record[key]
  return value != null ? (value as T) : null
}

export async function setStoreValue<T>(key: string, value: T): Promise<void> {
  if (isTauri()) {
    const store = await getTauriStore()
    await store.set(key, value)
    await store.save()
    return
  }

  const record = migrateBrowserStoreRecord()
  record[key] = value
  writeBrowserStoreRecord(record)
}
