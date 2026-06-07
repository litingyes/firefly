import { getStoreValue, setStoreValue } from '@/lib/platform/kv-store'
import {
  createDefaultProviderConfigMap,
  type ProviderConfig,
  type ProviderConfigMap,
  PROVIDER_DEFINITIONS,
} from '@/lib/providers'

const STORE_KEY = 'provider-config'

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

export async function loadProviderConfig(): Promise<ProviderConfigMap> {
  const stored = await getStoreValue<ProviderConfigMap>(STORE_KEY)
  if (stored) {
    return mergeStoredConfig(stored)
  }

  return createDefaultProviderConfigMap()
}

export async function saveProviderConfig(config: ProviderConfigMap): Promise<void> {
  await setStoreValue(STORE_KEY, config)
}
