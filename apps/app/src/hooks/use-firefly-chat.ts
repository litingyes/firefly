import { useChat } from '@ai-sdk/react'
import { createFireflyChatTransport } from '@firefly/ai/create-firefly-chat-transport'
import { useEffect, useMemo, useRef } from 'react'
import { toast } from 'sonner'

import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { useProviderConfigContext } from '@/hooks/provider-config-context'
import { useWebSearchConfigContext } from '@/hooks/web-search-config-context'
import { getAppFetch } from '@/lib/tauri-fetch'

const FIREFLY_SYSTEM_PROMPT = 'You are Firefly, a concise and capable assistant.'

export function useFireflyChat() {
  const { configMap } = useProviderConfigContext()
  const { chatWebSearch, scenes } = useModelSettingsContext()
  const { configMap: webSearchConfigMap } = useWebSearchConfigContext()

  const configMapRef = useRef(configMap)
  const scenesRef = useRef(scenes)
  const chatWebSearchRef = useRef(chatWebSearch)
  const webSearchConfigMapRef = useRef(webSearchConfigMap)
  configMapRef.current = configMap
  scenesRef.current = scenes
  chatWebSearchRef.current = chatWebSearch
  webSearchConfigMapRef.current = webSearchConfigMap

  const transport = useMemo(
    () =>
      createFireflyChatTransport({
        getModelRef: () => scenesRef.current.chat[0],
        getProviderConfig: (id) => configMapRef.current[id],
        getWebSearch: () => {
          const setting = chatWebSearchRef.current
          if (!setting.enabled || !setting.providerId) {
            return null
          }

          const providerConfig = webSearchConfigMapRef.current[setting.providerId]
          if (!providerConfig?.enabled || providerConfig.status !== 'connected') {
            return null
          }

          return {
            providerId: setting.providerId,
            configMap: webSearchConfigMapRef.current,
          }
        },
        fetch: getAppFetch(),
        system: FIREFLY_SYSTEM_PROMPT,
      }),
    [],
  )

  const chat = useChat({ transport })

  useEffect(() => {
    if (!chat.error) {
      return
    }

    toast.error('Could not complete the chat request', {
      description: chat.error.message,
    })
  }, [chat.error])

  return chat
}
