import type { ModelRef } from '@firefly/ai/model-types'
import { modelRefKey } from '@firefly/ai/model-types'
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from '@firefly/ui/components/ai-elements/attachments'
import { ModelSelectorLogo } from '@firefly/ui/components/ai-elements/model-selector'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  usePromptInputController,
} from '@firefly/ui/components/ai-elements/prompt-input'
import type { ChatStatus, FileUIPart } from 'ai'
import { SlidersHorizontalIcon } from 'lucide-react'
import type { KeyboardEvent } from 'react'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { matchChatCompletion } from '@/lib/chat-completions'
import { getProviderDefinition } from '@/lib/providers'

const TEXTAREA_MIN_HEIGHT_PX = 56
const TEXTAREA_MAX_HEIGHT_PX = 192

export interface ChatComposerSubmitPayload {
  files: FileUIPart[]
  text: string
}

interface ChatComposerProps {
  activeModelRef: ModelRef | null
  busy?: boolean
  chatModels: ModelRef[]
  disabled?: boolean
  onModelChange: (ref: ModelRef) => void
  onOpenCapabilities: () => void
  onStop?: () => void
  onSubmit: (payload: ChatComposerSubmitPayload) => void
  placeholder?: string
  status?: ChatStatus
}

function syncTextareaHeight(node: HTMLTextAreaElement) {
  node.style.height = 'auto'
  const next = Math.min(Math.max(node.scrollHeight, TEXTAREA_MIN_HEIGHT_PX), TEXTAREA_MAX_HEIGHT_PX)
  node.style.height = `${next}px`
}

function ChatComposerAttachments() {
  const { files, remove } = usePromptInputAttachments()

  if (files.length === 0) {
    return null
  }

  return (
    <PromptInputHeader className="px-3 pt-2.5">
      <Attachments variant="inline">
        {files.map((file) => (
          <Attachment data={file} key={file.id} onRemove={() => remove(file.id)}>
            <AttachmentPreview />
            <AttachmentInfo />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>
    </PromptInputHeader>
  )
}

function ChatComposerTextarea({
  busy = false,
  disabled = false,
  placeholder,
}: {
  busy?: boolean
  disabled?: boolean
  placeholder?: string
}) {
  const { textInput } = usePromptInputController()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const labelId = useId()
  const value = textInput.value
  const isInactive = disabled || busy
  const ghostMatch = busy ? null : matchChatCompletion(value)
  const ghostSuffix = ghostMatch?.completion ?? ''

  const acceptGhost = useCallback(() => {
    if (!ghostSuffix) {
      return
    }
    textInput.setInput(`${value}${ghostSuffix}`)
    requestAnimationFrame(() => {
      const node = textareaRef.current
      if (!node) {
        return
      }
      node.focus()
      node.setSelectionRange(node.value.length, node.value.length)
      syncTextareaHeight(node)
    })
  }, [ghostSuffix, textInput, value])

  useLayoutEffect(() => {
    const node = textareaRef.current
    if (!node) {
      return
    }
    syncTextareaHeight(node)
  }, [value, placeholder])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab' && ghostSuffix && !event.shiftKey) {
      event.preventDefault()
      acceptGhost()
    }
  }

  return (
    <div className="relative min-w-0 w-full overflow-hidden px-3 pt-2.5">
      <label className="sr-only" htmlFor={labelId}>
        Message
      </label>

      {ghostSuffix ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden px-3 py-2.5 font-sans text-sm leading-relaxed wrap-break-word whitespace-pre-wrap"
        >
          <span className="invisible">{value}</span>
          <span className="text-muted-foreground/45 motion-safe:animate-pulse">{ghostSuffix}</span>
        </div>
      ) : null}

      <PromptInputTextarea
        className="field-sizing-fixed relative z-10 max-h-48 min-h-14 w-full min-w-0 resize-none overflow-x-hidden overflow-y-auto wrap-break-word border-0 bg-transparent px-0 py-2.5 shadow-none focus-visible:ring-0"
        data-testid="chat-input"
        disabled={isInactive}
        id={labelId}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={textareaRef}
        rows={1}
      />
    </div>
  )
}

interface ChatComposerFooterProps {
  activeModelRef: ModelRef | null
  busy?: boolean
  chatModels: ModelRef[]
  disabled?: boolean
  onModelChange: (ref: ModelRef) => void
  onOpenCapabilities: () => void
  onStop?: () => void
  pendingSubmit: boolean
  status?: ChatStatus
}

function ChatComposerFooter({
  activeModelRef,
  busy = false,
  chatModels,
  disabled = false,
  onModelChange,
  onOpenCapabilities,
  onStop,
  pendingSubmit,
  status,
}: ChatComposerFooterProps) {
  const { getModelLabel } = useModelSettingsContext()
  const { textInput } = usePromptInputController()
  const { files } = usePromptInputAttachments()
  const isGenerating = busy || pendingSubmit
  const isInactive = disabled || isGenerating
  const canSubmit = !disabled && (textInput.value.trim().length > 0 || files.length > 0)
  const activeModelKey = activeModelRef ? modelRefKey(activeModelRef) : ''

  return (
    <PromptInputFooter className="gap-1 px-2 py-1.5">
      <PromptInputTools>
        <PromptInputActionMenu>
          <PromptInputActionMenuTrigger
            aria-label="Add attachment or capability"
            disabled={isInactive}
          />
          <PromptInputActionMenuContent className="w-auto min-w-44">
            <PromptInputActionAddAttachments
              className="whitespace-nowrap"
              label="Upload attachment"
            />
            <PromptInputActionMenuItem
              className="whitespace-nowrap"
              onClick={() => {
                onOpenCapabilities()
              }}
            >
              <SlidersHorizontalIcon className="mr-2 size-4" />
              Capabilities…
            </PromptInputActionMenuItem>
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>
      </PromptInputTools>

      <div className="flex shrink-0 items-center gap-1">
        {chatModels.length > 0 ? (
          <PromptInputSelect
            disabled={isInactive}
            onValueChange={(value) => {
              const ref = chatModels.find((entry) => modelRefKey(entry) === value)
              if (ref) {
                onModelChange(ref)
              }
            }}
            value={activeModelKey}
          >
            <PromptInputSelectTrigger className="max-w-[11rem]">
              <span className="truncate">
                {activeModelRef ? getModelLabel(activeModelRef) : 'Model'}
              </span>
            </PromptInputSelectTrigger>
            <PromptInputSelectContent>
              {chatModels.map((ref) => {
                const definition = getProviderDefinition(ref.providerId)
                return (
                  <PromptInputSelectItem key={modelRefKey(ref)} value={modelRefKey(ref)}>
                    <span className="flex items-center gap-2">
                      <ModelSelectorLogo className="size-3.5" provider={definition.logo} />
                      <span className="truncate">{getModelLabel(ref)}</span>
                    </span>
                  </PromptInputSelectItem>
                )
              })}
            </PromptInputSelectContent>
          </PromptInputSelect>
        ) : null}

        <PromptInputSubmit
          data-testid="chat-send"
          disabled={!isGenerating && !canSubmit}
          onStop={onStop}
          status={status}
        />
      </div>
    </PromptInputFooter>
  )
}

export function ChatComposer({
  activeModelRef,
  busy = false,
  chatModels,
  disabled = false,
  onModelChange,
  onOpenCapabilities,
  onStop,
  onSubmit,
  placeholder = 'Ask anything…',
  status,
}: ChatComposerProps) {
  const [pendingSubmit, setPendingSubmit] = useState(false)
  const isGenerating = busy || pendingSubmit
  const isInactive = disabled || isGenerating

  useEffect(() => {
    if (status === 'ready' || status === 'error') {
      setPendingSubmit(false)
    }
  }, [status])

  const handleStop = useCallback(() => {
    setPendingSubmit(false)
    onStop?.()
  }, [onStop])

  return (
    <PromptInput
      className="firefly-completion-input w-full min-w-0 [&_[data-slot=input-group]]:h-auto [&_[data-slot=input-group]]:flex-col [&_[data-slot=input-group]]:items-stretch [&_[data-slot=input-group]]:overflow-hidden [&_[data-slot=input-group]]:ring-1 [&_[data-slot=input-group]]:ring-border [&_[data-slot=input-group]]:transition-shadow [&_[data-slot=input-group]]:has-focus-visible:ring-2 [&_[data-slot=input-group]]:has-focus-visible:ring-ring"
      data-disabled={isInactive ? '' : undefined}
      multiple
      onSubmit={({ files, text }) => {
        setPendingSubmit(true)
        onSubmit({ files, text })
      }}
    >
      <ChatComposerAttachments />
      <PromptInputBody>
        <ChatComposerTextarea busy={isGenerating} disabled={disabled} placeholder={placeholder} />
      </PromptInputBody>
      <ChatComposerFooter
        activeModelRef={activeModelRef}
        busy={busy}
        chatModels={chatModels}
        disabled={disabled}
        onModelChange={onModelChange}
        onOpenCapabilities={onOpenCapabilities}
        onStop={handleStop}
        pendingSubmit={pendingSubmit}
        status={status}
      />
    </PromptInput>
  )
}
