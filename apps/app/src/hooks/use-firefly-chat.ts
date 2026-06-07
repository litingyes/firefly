import { useChat } from '@ai-sdk/react'
import { createFireflyChatTransport } from '@firefly/ai'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'

import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { useProviderConfigContext } from '@/hooks/provider-config-context'
import { getAppFetch } from '@/lib/tauri-fetch'

const FIREFLY_SYSTEM_PROMPT = 'You are Firefly, a concise and capable assistant.'

export function useFireflyChat() {
  const { configMap } = useProviderConfigContext()
  const { scenes } = useModelSettingsContext()

  const transport = useMemo(
    () =>
      createFireflyChatTransport({
        getModelRef: () => scenes.chat[0],
        getProviderConfig: (id) => configMap[id],
        fetch: getAppFetch(),
        system: FIREFLY_SYSTEM_PROMPT,
      }),
    [configMap, scenes.chat],
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
