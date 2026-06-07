import {
  createDefaultChatWebSearchSetting,
  createDefaultModelSettings,
  type ChatWebSearchSetting,
  type ModelSettings,
} from '@/lib/model-settings'
import { getStoreValue, setStoreValue } from '@/lib/platform/kv-store'

const STORE_KEY = 'model-settings'

interface LegacyModelSettings extends Partial<ModelSettings> {
  webSearch?: {
    chat?: ChatWebSearchSetting
  }
}

function mergeChatWebSearch(parsed: LegacyModelSettings): ChatWebSearchSetting {
  if (parsed.chatWebSearch) {
    return {
      ...createDefaultChatWebSearchSetting(),
      ...parsed.chatWebSearch,
    }
  }

  if (parsed.webSearch?.chat) {
    return {
      ...createDefaultChatWebSearchSetting(),
      ...parsed.webSearch.chat,
    }
  }

  return createDefaultChatWebSearchSetting()
}

function mergeStoredSettings(parsed: LegacyModelSettings): ModelSettings {
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
    chatWebSearch: mergeChatWebSearch(parsed),
  }
}

export async function loadModelSettings(): Promise<ModelSettings> {
  const stored = await getStoreValue<LegacyModelSettings>(STORE_KEY)
  if (stored) {
    return mergeStoredSettings(stored)
  }

  return createDefaultModelSettings()
}

export async function saveModelSettings(settings: ModelSettings): Promise<void> {
  await setStoreValue(STORE_KEY, settings)
}
