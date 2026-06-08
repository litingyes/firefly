import type { ModelRef } from '@firefly/ai/model-types'
import { modelRefKey } from '@firefly/ai/model-types'
import { Conversation, ConversationContent } from '@firefly/ui/components/ai-elements/conversation'
import { Message, MessageContent } from '@firefly/ui/components/ai-elements/message'
import {
  PromptInputProvider,
  usePromptInputController,
} from '@firefly/ui/components/ai-elements/prompt-input'
import { Suggestion, Suggestions } from '@firefly/ui/components/ai-elements/suggestion'
import { Button } from '@firefly/ui/components/ui/button'
import { PlugZapIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { ChatMessageParts } from '@/components/chat/chat-message-parts'
import { ChatCapabilityDialog } from '@/components/workspace/chat-capability-dialog'
import { ChatComposer, type ChatComposerSubmitPayload } from '@/components/workspace/chat-composer'
import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { useProviderConfigContext } from '@/hooks/provider-config-context'
import { useFireflyChat } from '@/hooks/use-firefly-chat'
import { CHAT_STARTER_SUGGESTIONS, listChatCompletionSuggestions } from '@/lib/chat-completions'

interface ChatWorkspaceProps {
  onOpenSettings: () => void
}

function ChatAlerts({
  error,
  hasChatModel,
  onOpenSettings,
  clearError,
  regenerate,
}: {
  clearError: () => void
  error: Error | undefined
  hasChatModel: boolean
  onOpenSettings: () => void
  regenerate: () => void
}) {
  return (
    <>
      {!hasChatModel ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/25 bg-amber-500/8 px-3 py-2 text-sm">
          <span className="text-foreground/90">No chat model assigned yet.</span>
          <Button onClick={onOpenSettings} size="sm" type="button" variant="outline">
            Assign in settings
          </Button>
        </div>
      ) : null}

      {error ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-destructive/30 bg-destructive/8 px-3 py-2 text-sm">
          <span className="min-w-0 text-foreground/90">{error.message}</span>
          <div className="flex gap-2">
            <Button onClick={() => clearError()} size="sm" type="button" variant="ghost">
              Dismiss
            </Button>
            <Button
              onClick={() => {
                clearError()
                regenerate()
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}

function ChatWorkspaceContent({ onOpenSettings }: ChatWorkspaceProps) {
  const { connectedCount, isLoading: isProviderLoading } = useProviderConfigContext()
  const { enabledModelRefs, isLoading: isModelLoading, scenes } = useModelSettingsContext()
  const activeModelRef = useRef<ModelRef | undefined>(undefined)
  const { messages, sendMessage, status, stop, error, regenerate, clearError } = useFireflyChat({
    activeModelRef,
  })
  const { textInput } = usePromptInputController()
  const [activeChatModel, setActiveChatModel] = useState<ModelRef | null>(null)
  const [capabilityOpen, setCapabilityOpen] = useState(false)

  const chatModels = scenes.chat
  const hasProviders = connectedCount > 0
  const hasChatModel = chatModels.length > 0
  const isHydrated = !isProviderLoading && !isModelLoading
  const isReady = isHydrated && hasProviders && hasChatModel && enabledModelRefs.length > 0
  const isBusy = status === 'submitted' || status === 'streaming'
  const hasMessages = messages.length > 0
  const input = textInput.value

  useEffect(() => {
    if (chatModels.length === 0) {
      activeModelRef.current = undefined
      setActiveChatModel(null)
      return
    }

    const current = activeModelRef.current
    if (current && chatModels.some((entry) => modelRefKey(entry) === modelRefKey(current))) {
      return
    }

    const next = chatModels[0]
    activeModelRef.current = next
    setActiveChatModel(next)
  }, [chatModels])

  const suggestions = useMemo(() => {
    if (!hasMessages && !input.trim()) {
      return [...CHAT_STARTER_SUGGESTIONS]
    }
    if (input.trim()) {
      return listChatCompletionSuggestions(input).map((entry) => entry.completion)
    }
    return []
  }, [hasMessages, input])

  const handleSubmit = ({ files, text }: ChatComposerSubmitPayload) => {
    const trimmed = text.trim()
    if (isBusy || (!trimmed && files.length === 0)) {
      return
    }

    void sendMessage({
      text: trimmed,
      ...(files.length > 0 ? { files } : {}),
    })
  }

  const handleSuggestionClick = (value: string) => {
    if (!hasMessages && isReady) {
      void sendMessage({ text: value })
      textInput.clear()
      return
    }

    textInput.setInput(value)
    document.querySelector<HTMLTextAreaElement>('[data-testid="chat-input"]')?.focus()
  }

  const handleModelChange = (ref: ModelRef) => {
    activeModelRef.current = ref
    setActiveChatModel(ref)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.querySelector<HTMLTextAreaElement>('[data-testid="chat-input"]')?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const composer = (
    <div className="space-y-3">
      <ChatAlerts
        clearError={clearError}
        error={error}
        hasChatModel={hasChatModel}
        onOpenSettings={onOpenSettings}
        regenerate={() => {
          void regenerate()
        }}
      />

      {!hasMessages && suggestions.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <Suggestion
              className="max-w-full whitespace-normal text-left"
              key={suggestion}
              onClick={handleSuggestionClick}
              suggestion={suggestion}
            />
          ))}
        </div>
      ) : null}

      <ChatComposer
        activeModelRef={activeChatModel}
        busy={isBusy}
        chatModels={chatModels}
        disabled={!isReady}
        onModelChange={handleModelChange}
        onOpenCapabilities={() => setCapabilityOpen(true)}
        onStop={() => stop()}
        onSubmit={handleSubmit}
        placeholder={
          isReady ? 'Ask anything…' : isHydrated ? 'Assign a chat model in settings…' : 'Loading…'
        }
        status={status}
      />

      <ChatCapabilityDialog onOpenChange={setCapabilityOpen} open={capabilityOpen} />

      {hasMessages && suggestions.length > 0 ? (
        <Suggestions>
          {suggestions.map((suggestion) => (
            <Suggestion key={suggestion} onClick={handleSuggestionClick} suggestion={suggestion} />
          ))}
        </Suggestions>
      ) : null}
    </div>
  )

  if (hasMessages) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <Conversation aria-live="polite" className="min-h-0 flex-1">
          <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6 sm:px-6">
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  <ChatMessageParts message={message} />
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
        </Conversation>

        <div className="shrink-0 border-t px-4 py-4 sm:px-6">
          <div className="mx-auto w-full max-w-3xl">{composer}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="font-medium text-base">Ask a question or pick a prompt</h2>
        </div>
        {composer}
      </div>
    </div>
  )
}

export function ChatWorkspace({ onOpenSettings }: ChatWorkspaceProps) {
  const { connectedCount } = useProviderConfigContext()
  const hasProviders = connectedCount > 0

  if (!hasProviders) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-md space-y-3 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <PlugZapIcon className="size-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-medium text-base">Connect a provider to start</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Firefly stores credentials on your machine. Use Settings in the toolbar to add your
              first provider.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PromptInputProvider>
      <ChatWorkspaceContent onOpenSettings={onOpenSettings} />
    </PromptInputProvider>
  )
}
