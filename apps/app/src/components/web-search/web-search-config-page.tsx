import {
  Badge,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Input,
  Skeleton,
  Spinner,
} from '@firefly/ui'
import { GlobeIcon, PlugZapIcon, SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { WebSearchRow } from '@/components/web-search/web-search-row'
import { useWebSearchConfigContext } from '@/hooks/web-search-config-context'
import { FIREFLY_ISSUES_URL, WEB_SEARCH_PROVIDER_DEFINITIONS } from '@/lib/web-search'

export function WebSearchConfigPage() {
  const {
    configMap,
    connectedCount,
    isLoading,
    readyCount,
    setEnabled,
    setFieldValue,
    testConnection,
  } = useWebSearchConfigContext()
  const [query, setQuery] = useState('')

  const filteredProviders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return WEB_SEARCH_PROVIDER_DEFINITIONS
    }

    return WEB_SEARCH_PROVIDER_DEFINITIONS.filter(
      (provider) =>
        provider.name.toLowerCase().includes(normalized) ||
        provider.description.toLowerCase().includes(normalized),
    )
  }, [query])

  async function handleTest(id: (typeof WEB_SEARCH_PROVIDER_DEFINITIONS)[number]['id']) {
    const definition = WEB_SEARCH_PROVIDER_DEFINITIONS.find((provider) => provider.id === id)!
    const success = await testConnection(id)

    if (success) {
      toast.success(`${definition.name} connection verified`)
    } else {
      const message = configMap[id].statusMessage ?? 'Check your credentials and try again.'
      toast.error(`Could not connect to ${definition.name}`, { description: message })
    }

    return success
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center gap-2">
          <Spinner className="size-4" />
          <p className="text-muted-foreground text-sm">Loading web search settings…</p>
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-semibold text-xl tracking-tight">Web search</h1>
          <Badge className="font-normal" variant="secondary">
            {connectedCount} connected
          </Badge>
          {readyCount > connectedCount ? (
            <Badge className="font-normal" variant="outline">
              {readyCount - connectedCount} awaiting test
            </Badge>
          ) : null}
        </div>
        <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
          Connect search providers for live web results in chat. Credentials stay on this device and
          are never sent to Firefly servers.
        </p>
        <p className="text-muted-foreground text-sm">
          Need another vendor?{' '}
          <a
            className="text-foreground underline-offset-4 hover:underline"
            href={FIREFLY_ISSUES_URL}
            rel="noreferrer"
            target="_blank"
          >
            Request it on GitHub
          </a>
          .
        </p>
      </header>

      <div className="relative">
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Search web search providers"
          className="pl-9"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search providers"
          value={query}
        />
      </div>

      {filteredProviders.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>No providers match your search</EmptyTitle>
            <EmptyDescription>Try a vendor name like Brave, Exa, or Tavily.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <section aria-label="Web search provider list" className="rounded-xl border bg-card">
          {filteredProviders.map((provider) => (
            <WebSearchRow
              key={provider.id}
              config={configMap[provider.id]}
              definition={provider}
              onEnabledChange={(enabled) => setEnabled(provider.id, enabled)}
              onFieldChange={(key, value) => setFieldValue(provider.id, key, value)}
              onTestConnection={() => handleTest(provider.id)}
            />
          ))}
        </section>
      )}

      {connectedCount === 0 && filteredProviders.length > 0 ? (
        <Empty className="border border-dashed bg-muted/20">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PlugZapIcon />
            </EmptyMedia>
            <EmptyTitle>Connect your first search provider</EmptyTitle>
            <EmptyDescription>
              Enable a provider, add your API credentials, then run a connection test before using
              web search in chat.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}

      {connectedCount > 0 ? (
        <div className="flex items-start gap-3 rounded-lg border bg-muted/20 px-4 py-3">
          <GlobeIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            Web search is ready. Chat integrations can call the shared search module with your
            connected provider.
          </p>
        </div>
      ) : null}
    </div>
  )
}
