import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea, Kbd } from '@firefly/ui'
import { CornerDownLeftIcon } from 'lucide-react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useCallback, useId, useRef } from 'react'

import { matchChatCompletion } from '@/lib/chat-completions'

interface CompletionInputProps {
  busy?: boolean
  disabled?: boolean
  onSubmit: (value: string) => void
  placeholder?: string
  value: string
  onValueChange: (value: string) => void
}

export function CompletionInput({
  busy = false,
  disabled = false,
  onSubmit,
  placeholder = 'Ask anything…',
  value,
  onValueChange,
}: CompletionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const labelId = useId()
  const isInactive = disabled || busy
  const ghostMatch = busy ? null : matchChatCompletion(value)
  const ghostSuffix = ghostMatch?.completion ?? ''

  const submit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isInactive) {
      return
    }
    onSubmit(trimmed)
    onValueChange('')
  }, [isInactive, onSubmit, onValueChange, value])

  const acceptGhost = useCallback(() => {
    if (!ghostSuffix) {
      return
    }
    onValueChange(`${value}${ghostSuffix}`)
    requestAnimationFrame(() => {
      const node = textareaRef.current
      if (!node) {
        return
      }
      node.focus()
      node.setSelectionRange(node.value.length, node.value.length)
    })
  }, [ghostSuffix, onValueChange, value])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab' && ghostSuffix && !event.shiftKey) {
      event.preventDefault()
      acceptGhost()
      return
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <InputGroup
        className="firefly-completion-input shadow-[0_0_0_1px_var(--firefly-glow-subtle)] transition-shadow has-[:focus-visible]:shadow-[0_0_0_1px_var(--firefly-glow),0_0_24px_-4px_var(--firefly-glow-subtle)]"
        data-disabled={isInactive ? '' : undefined}
      >
        <div className="relative min-h-[7rem] w-full">
          <label className="sr-only" htmlFor={labelId}>
            Message
          </label>

          {ghostSuffix ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden px-3 py-3 font-sans text-sm leading-relaxed whitespace-pre-wrap"
            >
              <span className="invisible">{value}</span>
              <span className="text-muted-foreground/45 motion-safe:animate-pulse">
                {ghostSuffix}
              </span>
            </div>
          ) : null}

          <InputGroupTextarea
            className="relative z-10 min-h-[7rem] resize-none bg-transparent"
            data-testid="chat-input"
            disabled={isInactive}
            id={labelId}
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            ref={textareaRef}
            rows={4}
            value={value}
          />
        </div>

        <InputGroupAddon align="block-end" className="justify-between gap-2 border-t px-3 py-2">
          <p className="text-muted-foreground text-xs">
            {ghostSuffix ? (
              <>
                Press <Kbd>Tab</Kbd> to accept completion
              </>
            ) : (
              <>
                <Kbd>Enter</Kbd> to send · <Kbd>Shift</Kbd>+<Kbd>Enter</Kbd> for newline
              </>
            )}
          </p>
          <InputGroupButton
            aria-label="Send message"
            data-testid="chat-send"
            disabled={isInactive || !value.trim()}
            size="icon-sm"
            type="submit"
            variant="default"
          >
            <CornerDownLeftIcon className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
