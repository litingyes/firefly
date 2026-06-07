import { useChat } from '@ai-sdk/react'
import { createFireflyChatTransport } from '@firefly/ai'
import { useEffect, useMemo, useRef } from 'react'
import { toast } from 'sonner'

import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { useProviderConfigContext } from '@/hooks/provider-config-context'
import { getAppFetch } from '@/lib/tauri-fetch'

const FIREFLY_SYSTEM_PROMPT = 'You are Firefly, a concise and capable assistant.'

export function useFireflyChat() {
  const { configMap } = useProviderConfigContext()
  const { scenes } = useModelSettingsContext()

  const configMapRef = useRef(configMap)
  const scenesRef = useRef(scenes)
  configMapRef.current = configMap
  scenesRef.current = scenes

  const transport = useMemo(
    () =>
      createFireflyChatTransport({
        getModelRef: () => scenesRef.current.chat[0],
        getProviderConfig: (id) => configMapRef.current[id],
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
