import { Button, InputGroup, InputGroupAddon, InputGroupTextarea, Kbd } from '@firefly/ui'
import { CornerDownLeftIcon, SquareIcon } from 'lucide-react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useCallback, useId, useLayoutEffect, useRef } from 'react'

import { matchChatCompletion } from '@/lib/chat-completions'

const TEXTAREA_MIN_HEIGHT_PX = 56
const TEXTAREA_MAX_HEIGHT_PX = 192

interface CompletionInputProps {
  busy?: boolean
  disabled?: boolean
  onStop?: () => void
  onSubmit: (value: string) => void
  placeholder?: string
  value: string
  onValueChange: (value: string) => void
}

function syncTextareaHeight(node: HTMLTextAreaElement) {
  node.style.height = 'auto'
  const next = Math.min(Math.max(node.scrollHeight, TEXTAREA_MIN_HEIGHT_PX), TEXTAREA_MAX_HEIGHT_PX)
  node.style.height = `${next}px`
}

export function CompletionInput({
  busy = false,
  disabled = false,
  onStop,
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
      syncTextareaHeight(node)
    })
  }, [ghostSuffix, onValueChange, value])

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
    <form className="w-full min-w-0" onSubmit={handleSubmit}>
      <InputGroup
        className="firefly-completion-input h-auto flex-col items-stretch overflow-hidden ring-1 ring-border transition-shadow has-focus-visible:ring-2 has-focus-visible:ring-ring"
        data-disabled={isInactive ? '' : undefined}
      >
        <div className="relative min-w-0 w-full overflow-hidden">
          <label className="sr-only" htmlFor={labelId}>
            Message
          </label>

          {ghostSuffix ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden px-3 py-2.5 font-sans text-sm leading-relaxed wrap-break-word whitespace-pre-wrap"
            >
              <span className="invisible">{value}</span>
              <span className="text-muted-foreground/45 motion-safe:animate-pulse">
                {ghostSuffix}
              </span>
            </div>
          ) : null}

          <InputGroupTextarea
            className="field-sizing-fixed relative z-10 max-h-48 min-h-14 w-full min-w-0 resize-none overflow-x-hidden overflow-y-auto wrap-break-word px-3 py-2.5"
            data-testid="chat-input"
            disabled={isInactive}
            id={labelId}
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            ref={textareaRef}
            rows={1}
            value={value}
          />
        </div>

        <InputGroupAddon
          align="block-end"
          className="gap-2 px-3 pt-1 pb-2.5 flex-col items-stretch sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="min-w-0 text-muted-foreground text-xs leading-snug">
            {ghostSuffix ? (
              <>
                Press <Kbd>Tab</Kbd> to accept completion
              </>
            ) : (
              <>
                <Kbd>Enter</Kbd> to send · <Kbd>Shift</Kbd>+<Kbd>Enter</Kbd> newline
                <span className="hidden sm:inline">
                  {' '}
                  · <Kbd>⌘K</Kbd> focus
                </span>
              </>
            )}
          </p>
          <div className="flex shrink-0 items-center justify-end gap-2">
            {busy && onStop ? (
              <Button onClick={onStop} size="sm" type="button" variant="outline">
                <SquareIcon className="size-3.5" />
                Stop
              </Button>
            ) : null}
            <Button
              aria-label="Send message"
              className="gap-1.5"
              data-testid="chat-send"
              disabled={isInactive || !value.trim()}
              size="sm"
              type="submit"
            >
              Send
              <CornerDownLeftIcon className="size-3.5" />
            </Button>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
