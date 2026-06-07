import { getStoreValue, setStoreValue } from '@/lib/platform/kv-store'
import {
  createDefaultWebSearchConfigMap,
  type WebSearchConfigMap,
  WEB_SEARCH_PROVIDER_DEFINITIONS,
} from '@/lib/web-search'

const STORE_KEY = 'web-search-config'

function mergeStoredConfig(parsed: Partial<WebSearchConfigMap>): WebSearchConfigMap {
  const defaults = createDefaultWebSearchConfigMap()

  for (const { id } of WEB_SEARCH_PROVIDER_DEFINITIONS) {
    if (parsed[id]) {
      defaults[id] = {
        ...defaults[id],
        ...parsed[id],
        values: { ...defaults[id].values, ...parsed[id]?.values },
      }
    }
  }

  return defaults
}

export async function loadWebSearchConfig(): Promise<WebSearchConfigMap> {
  const stored = await getStoreValue<WebSearchConfigMap>(STORE_KEY)
  if (stored) {
    return mergeStoredConfig(stored)
  }

  return createDefaultWebSearchConfigMap()
}

export async function saveWebSearchConfig(config: WebSearchConfigMap): Promise<void> {
  await setStoreValue(STORE_KEY, config)
}
