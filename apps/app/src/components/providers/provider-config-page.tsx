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
import { PlugZapIcon, SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { ProviderMoreVendorsNote } from '@/components/providers/provider-more-vendors-note'
import { ProviderRow } from '@/components/providers/provider-row'
import { useProviderConfigContext } from '@/hooks/provider-config-context'
import { PROVIDER_DEFINITIONS } from '@/lib/providers'

export function ProviderConfigPage() {
  const {
    configMap,
    connectedCount,
    isLoading,
    readyCount,
    setEnabled,
    setFieldValue,
    testConnection,
  } = useProviderConfigContext()
  const [query, setQuery] = useState('')

  const filteredProviders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return PROVIDER_DEFINITIONS
    }

    return PROVIDER_DEFINITIONS.filter(
      (provider) =>
        provider.name.toLowerCase().includes(normalized) ||
        provider.description.toLowerCase().includes(normalized),
    )
  }, [query])

  async function handleTest(id: (typeof PROVIDER_DEFINITIONS)[number]['id']) {
    const definition = PROVIDER_DEFINITIONS.find((provider) => provider.id === id)!
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
          <p className="text-muted-foreground text-sm">Loading provider settings…</p>
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-semibold text-xl tracking-tight">Providers</h1>
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
          Connect the AI SDK providers you use in chat. Firefly stores credentials locally on this
          device and never sends them to our servers.
        </p>
        <ProviderMoreVendorsNote />
      </header>

      <div className="relative">
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Search providers"
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
            <EmptyDescription>
              Try a vendor name like OpenAI, Anthropic, or Ollama.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <section aria-label="Provider list" className="rounded-xl border bg-card">
          {filteredProviders.map((provider) => (
            <ProviderRow
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
            <EmptyTitle>Connect your first provider</EmptyTitle>
            <EmptyDescription>
              Enable a vendor, paste an API key, then run a connection test. Load models and enable
              the ones you want before assigning them on the Scenes page.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
    </div>
  )
}
