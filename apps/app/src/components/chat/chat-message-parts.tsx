import { MessageResponse } from '@firefly/ui'
import type { UIMessage } from 'ai'
import { isToolUIPart } from 'ai'
import type { ReactNode } from 'react'

import { WebSearchToolPartView } from '@/components/chat/web-search-tool-part'

interface ChatMessagePartsProps {
  message: UIMessage
}

export function ChatMessageParts({ message }: ChatMessagePartsProps) {
  const parts: ReactNode[] = []

  for (const [index, part] of message.parts.entries()) {
    const key = `${message.id}-${index}`

    if (part.type === 'text') {
      if (message.role === 'assistant') {
        parts.push(<MessageResponse key={key}>{part.text}</MessageResponse>)
      } else {
        parts.push(
          <p className="whitespace-pre-wrap" key={key}>
            {part.text}
          </p>,
        )
      }
      continue
    }

    if (part.type === 'tool-webSearch') {
      parts.push(<WebSearchToolPartView key={key} part={part} />)
      continue
    }

    if (isToolUIPart(part)) {
      parts.push(
        <pre className="overflow-x-auto rounded-md border bg-muted/30 p-3 text-xs" key={key}>
          {JSON.stringify(part, null, 2)}
        </pre>,
      )
    }
  }

  return <>{parts}</>
}
