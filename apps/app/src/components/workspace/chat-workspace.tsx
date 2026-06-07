import {
  Button,
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Message,
  MessageContent,
  MessageResponse,
  Suggestion,
  Suggestions,
} from '@firefly/ui'
import { MessageSquareIcon, PlugZapIcon, SparklesIcon, SquareIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { CompletionInput } from '@/components/workspace/completion-input'
import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { useProviderConfigContext } from '@/hooks/provider-config-context'
import { useFireflyChat } from '@/hooks/use-firefly-chat'
import { CHAT_STARTER_SUGGESTIONS, listChatCompletionSuggestions } from '@/lib/chat-completions'

interface ChatWorkspaceProps {
  onOpenSettings: () => void
}

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text ?? '')
    .join('')
}

export function ChatWorkspace({ onOpenSettings }: ChatWorkspaceProps) {
  const { connectedCount } = useProviderConfigContext()
  const { enabledModelRefs, getModelLabel, scenes } = useModelSettingsContext()
  const { messages, sendMessage, status, stop, error, regenerate, clearError } = useFireflyChat()
  const [input, setInput] = useState('')

  const chatModels = scenes.chat
  const hasProviders = connectedCount > 0
  const hasChatModel = chatModels.length > 0
  const isReady = hasProviders && hasChatModel && enabledModelRefs.length > 0
  const activeModelLabel = chatModels[0] ? getModelLabel(chatModels[0]) : null
  const isBusy = status === 'submitted' || status === 'streaming'

  const suggestions = useMemo(() => {
    if (input.trim()) {
      return listChatCompletionSuggestions(input).map((entry) => entry.completion)
    }
    return [...CHAT_STARTER_SUGGESTIONS]
  }, [input])

  const handleSubmit = (text: string) => {
    void sendMessage({ text })
    setInput('')
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
        <Empty className="max-w-md border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PlugZapIcon />
            </EmptyMedia>
            <EmptyTitle>Connect a provider to start</EmptyTitle>
            <EmptyDescription>
              Firefly keeps credentials on your machine. Add at least one model provider before you
              send a message.
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={onOpenSettings} type="button">
            Open settings
          </Button>
        </Empty>
      </div>
    )
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-full min-h-0 flex-col">
      {hasMessages ? (
        <Conversation aria-live="polite" className="min-h-0 flex-1">
          <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6 sm:px-6">
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.role === 'assistant' ? (
                    <MessageResponse>{getMessageText(message)}</MessageResponse>
                  ) : (
                    <p className="whitespace-pre-wrap">{getMessageText(message)}</p>
                  )}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
        </Conversation>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
          <ConversationEmptyState
            className="max-w-2xl gap-4 pb-8"
            description="Type a thought. Firefly completes the path before you finish the sentence."
            icon={<SparklesIcon className="size-5" />}
            title="Every scene, a glow."
          />
        </div>
      )}

      <div className="shrink-0 border-t bg-background/80 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto w-full max-w-3xl space-y-3">
          {!hasChatModel ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/25 bg-amber-500/8 px-3 py-2 text-sm">
              <span className="text-foreground/90">No chat model assigned yet.</span>
              <Button onClick={onOpenSettings} size="sm" type="button" variant="outline">
                Assign in settings
              </Button>
            </div>
          ) : activeModelLabel ? (
            <p className="text-muted-foreground text-xs">
              Chat model · <span className="text-foreground/80">{activeModelLabel}</span>
            </p>
          ) : null}

          {error ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-destructive/30 bg-destructive/8 px-3 py-2 text-sm">
              <span className="text-foreground/90">The last request failed.</span>
              <div className="flex gap-2">
                <Button onClick={() => clearError()} size="sm" type="button" variant="ghost">
                  Dismiss
                </Button>
                <Button
                  onClick={() => {
                    clearError()
                    void regenerate()
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

          <CompletionInput
            busy={isBusy}
            disabled={!isReady}
            onSubmit={handleSubmit}
            onValueChange={setInput}
            placeholder={isReady ? 'Ask anything…' : 'Assign a chat model in settings…'}
            value={input}
          />

          {isBusy ? (
            <div className="flex justify-end">
              <Button onClick={() => stop()} size="sm" type="button" variant="outline">
                <SquareIcon className="size-3.5" />
                Stop
              </Button>
            </div>
          ) : null}

          <Suggestions>
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={(value) => {
                  setInput(value)
                  document.querySelector<HTMLTextAreaElement>('[data-testid="chat-input"]')?.focus()
                }}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>

          {!hasMessages ? (
            <p className="text-center text-muted-foreground text-xs">
              <MessageSquareIcon aria-hidden className="mr-1 inline size-3.5" />
              General chat only for now. More scenes will route from here later.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
