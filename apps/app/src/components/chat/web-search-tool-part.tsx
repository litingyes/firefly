import { Badge, CollapsibleTrigger, Spinner, Tool, ToolContent } from '@firefly/ui'
import type { WebSearchOutput } from '@firefly/web-search'
import type { ToolUIPart } from 'ai'
import { ChevronDownIcon, SearchIcon } from 'lucide-react'

interface WebSearchToolPartProps {
  part: ToolUIPart
}

function getQuery(part: ToolUIPart): string | null {
  if (part.state === 'input-streaming' || part.state === 'input-available') {
    const input = part.input as { query?: string } | undefined
    return input?.query?.trim() || null
  }

  if (part.state === 'output-available') {
    const output = part.output as WebSearchOutput | undefined
    return output?.query?.trim() || null
  }

  return null
}

function getOutput(part: ToolUIPart): WebSearchOutput | null {
  if (part.state !== 'output-available') {
    return null
  }

  return (part.output as WebSearchOutput | undefined) ?? null
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function statusBadge(part: ToolUIPart, output: WebSearchOutput | null) {
  if (part.state === 'output-error') {
    return (
      <Badge className="font-normal" variant="destructive">
        Failed
      </Badge>
    )
  }

  if (part.state === 'input-streaming' || part.state === 'input-available') {
    return (
      <Badge className="gap-1 font-normal" variant="secondary">
        <Spinner className="size-3" />
        Searching
      </Badge>
    )
  }

  if (part.state === 'output-available' && output) {
    const count = output.results.length
    return (
      <Badge className="gap-1 font-normal" variant="secondary">
        <SearchIcon className="size-3" />
        {count === 1 ? '1 source' : `${count} sources`}
      </Badge>
    )
  }

  return (
    <Badge className="font-normal" variant="secondary">
      Web search
    </Badge>
  )
}

export function WebSearchToolPartView({ part }: WebSearchToolPartProps) {
  const query = getQuery(part)
  const output = getOutput(part)
  const isRunning = part.state === 'input-streaming' || part.state === 'input-available'

  return (
    <Tool className="mb-0 w-full" defaultOpen={isRunning}>
      <CollapsibleTrigger className="flex w-full items-start justify-between gap-3 p-3 text-left">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-sm">Web search</span>
            {statusBadge(part, output)}
          </div>
          {query ? (
            <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">{query}</p>
          ) : (
            <p className="text-muted-foreground text-sm">Waiting for query…</p>
          )}
        </div>
        <ChevronDownIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>

      <ToolContent className="space-y-3 border-t pt-3">
        {part.state === 'output-error' ? (
          <p className="text-destructive text-sm">{part.errorText ?? 'Web search failed.'}</p>
        ) : null}

        {isRunning ? <p className="text-muted-foreground text-sm">Fetching live results…</p> : null}

        {output?.results.length ? (
          <ul className="divide-y divide-border">
            {output.results.map((result) => (
              <li className="py-2.5 first:pt-0 last:pb-0" key={result.url}>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <a
                      className="font-medium text-sm hover:underline"
                      href={result.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {result.title}
                    </a>
                    <span className="text-muted-foreground text-xs">{getHostname(result.url)}</span>
                  </div>
                  <p className="line-clamp-3 text-muted-foreground text-xs leading-relaxed">
                    {result.content.trim() || 'No preview available.'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {part.state === 'output-available' && output && output.results.length === 0 ? (
          <p className="text-muted-foreground text-sm">No sources found for this query.</p>
        ) : null}
      </ToolContent>
    </Tool>
  )
}
