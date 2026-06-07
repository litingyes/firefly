import {
  Badge,
  Button,
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
  Suggestion,
  Suggestions,
} from '@firefly/ui'
import { GlobeIcon, PlugZapIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { ChatMessageParts } from '@/components/chat/chat-message-parts'
import { CompletionInput } from '@/components/workspace/completion-input'
import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { useProviderConfigContext } from '@/hooks/provider-config-context'
import { useFireflyChat } from '@/hooks/use-firefly-chat'
import { useWebSearchConfigContext } from '@/hooks/web-search-config-context'
import { CHAT_STARTER_SUGGESTIONS, listChatCompletionSuggestions } from '@/lib/chat-completions'
import { getWebSearchProviderDefinition } from '@/lib/web-search'

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

export function ChatWorkspace({ onOpenSettings }: ChatWorkspaceProps) {
  const { connectedCount, isLoading: isProviderLoading } = useProviderConfigContext()
  const {
    enabledModelRefs,
    getModelLabel,
    isLoading: isModelLoading,
    scenes,
    chatWebSearch,
  } = useModelSettingsContext()
  const { configMap: webSearchConfigMap } = useWebSearchConfigContext()
  const { messages, sendMessage, status, stop, error, regenerate, clearError } = useFireflyChat()
  const [input, setInput] = useState('')

  const chatModels = scenes.chat
  const hasProviders = connectedCount > 0
  const hasChatModel = chatModels.length > 0
  const isHydrated = !isProviderLoading && !isModelLoading
  const isReady = isHydrated && hasProviders && hasChatModel && enabledModelRefs.length > 0
  const activeModelLabel = chatModels[0] ? getModelLabel(chatModels[0]) : null
  const activeWebSearchProvider =
    chatWebSearch.enabled &&
    chatWebSearch.providerId &&
    webSearchConfigMap[chatWebSearch.providerId]?.status === 'connected'
      ? getWebSearchProviderDefinition(chatWebSearch.providerId)
      : null
  const isBusy = status === 'submitted' || status === 'streaming'
  const hasMessages = messages.length > 0

  const suggestions = useMemo(() => {
    if (!hasMessages && !input.trim()) {
      return [...CHAT_STARTER_SUGGESTIONS]
    }
    if (input.trim()) {
      return listChatCompletionSuggestions(input).map((entry) => entry.completion)
    }
    return []
  }, [hasMessages, input])

  const handleSubmit = (text: string) => {
    void sendMessage({ text })
    setInput('')
  }

  const handleSuggestionClick = (value: string) => {
    if (!hasMessages && isReady) {
      handleSubmit(value)
      return
    }

    setInput(value)
    document.querySelector<HTMLTextAreaElement>('[data-testid="chat-input"]')?.focus()
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

      <CompletionInput
        busy={isBusy}
        disabled={!isReady}
        onStop={() => stop()}
        onSubmit={handleSubmit}
        onValueChange={setInput}
        placeholder={
          isReady ? 'Ask anything…' : isHydrated ? 'Assign a chat model in settings…' : 'Loading…'
        }
        value={input}
      />

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
          <div className="mx-auto w-full max-w-3xl">
            {activeModelLabel || activeWebSearchProvider ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {activeModelLabel ? (
                  <Badge className="font-normal" variant="secondary">
                    Chat · {activeModelLabel}
                  </Badge>
                ) : null}
                {activeWebSearchProvider ? (
                  <Badge className="gap-1 font-normal" variant="outline">
                    <GlobeIcon className="size-3" />
                    Web search · {activeWebSearchProvider.name}
                  </Badge>
                ) : null}
              </div>
            ) : null}
            {composer}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="font-medium text-base">Ask a question or pick a prompt</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {activeModelLabel ? (
              <Badge className="font-normal" variant="secondary">
                Chat · {activeModelLabel}
              </Badge>
            ) : null}
            {activeWebSearchProvider ? (
              <Badge className="gap-1 font-normal" variant="outline">
                <GlobeIcon className="size-3" />
                Web search · {activeWebSearchProvider.name}
              </Badge>
            ) : null}
          </div>
        </div>
        {composer}
      </div>
    </div>
  )
}
