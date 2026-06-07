import type { ProviderId } from '@firefly/ai/types'
import { Badge } from '@firefly/ui/components/ui/badge'
import { Button } from '@firefly/ui/components/ui/button'
import { Checkbox } from '@firefly/ui/components/ui/checkbox'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@firefly/ui/components/ui/empty'
import { Input } from '@firefly/ui/components/ui/input'
import { Spinner } from '@firefly/ui/components/ui/spinner'
import { BoxesIcon, RefreshCwIcon, SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useModelSettingsContext } from '@/hooks/model-settings-context'
import type { ProviderConfig } from '@/lib/providers'

interface ProviderModelsSectionProps {
  providerId: ProviderId
  config: ProviderConfig
}

function formatContextWindow(value?: number): string | null {
  if (!value) {
    return null
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M ctx`
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K ctx`
  }
  return `${value} ctx`
}

export function ProviderModelsSection({ providerId, config }: ProviderModelsSectionProps) {
  const {
    catalogMap,
    isProviderModelsLoading,
    refreshProviderModels,
    setProviderModelEnabled,
    setProviderModelsEnabled,
    settings,
  } = useModelSettingsContext()
  const [query, setQuery] = useState('')

  const catalog = catalogMap[providerId]
  const isLoading = isProviderModelsLoading(providerId)
  const enabledIds = new Set(settings.allowlist[providerId] ?? [])
  const canManage = config.enabled && config.status === 'connected'

  const filteredModels = useMemo(() => {
    const models = catalog?.models ?? []
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return models
    }

    return models.filter(
      (model) =>
        model.id.toLowerCase().includes(normalized) ||
        model.name.toLowerCase().includes(normalized) ||
        model.description?.toLowerCase().includes(normalized),
    )
  }, [catalog?.models, query])

  async function handleRefresh() {
    try {
      const models = await refreshProviderModels(providerId)
      toast.success(`Loaded ${models.length} models`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load models.'
      toast.error('Model load failed', { description: message })
    }
  }

  function handleSelectVisible() {
    const ids = filteredModels.map((model) => model.id)
    const merged = new Set([...(settings.allowlist[providerId] ?? []), ...ids])
    setProviderModelsEnabled(providerId, [...merged])
  }

  function handleClearVisible() {
    const visible = new Set(filteredModels.map((model) => model.id))
    const next = (settings.allowlist[providerId] ?? []).filter((id) => !visible.has(id))
    setProviderModelsEnabled(providerId, next)
  }

  if (!canManage) {
    return (
      <div className="rounded-md border border-dashed bg-background/60 px-3 py-3">
        <p className="text-muted-foreground text-sm">
          Test the connection first, then choose which models Firefly can use from this provider.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-md border bg-background/60 px-3 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-medium text-sm">Available models</h4>
            {enabledIds.size > 0 ? (
              <Badge className="font-normal" variant="secondary">
                {enabledIds.size} enabled
              </Badge>
            ) : null}
          </div>
          <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
            Choose which models from this provider appear in scene configuration and chat.
          </p>
        </div>

        <Button
          disabled={isLoading}
          onClick={() => void handleRefresh()}
          size="sm"
          variant="outline"
        >
          {isLoading ? <Spinner className="size-3.5" /> : <RefreshCwIcon className="size-3.5" />}
          {catalog ? 'Refresh models' : 'Load models'}
        </Button>
      </div>

      {catalog?.error ? <p className="text-destructive text-sm">{catalog.error}</p> : null}

      {catalog && catalog.models.length > 0 ? (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <SearchIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="Filter models"
                className="h-8 pl-8 text-sm"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter models"
                value={query}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSelectVisible} size="sm" type="button" variant="ghost">
                Enable visible
              </Button>
              <Button onClick={handleClearVisible} size="sm" type="button" variant="ghost">
                Disable visible
              </Button>
            </div>
          </div>

          <ul
            aria-label="Provider models"
            className="max-h-72 space-y-1 overflow-y-auto rounded-md border bg-card p-1"
          >
            {filteredModels.length === 0 ? (
              <li className="px-3 py-6 text-center text-muted-foreground text-sm">
                No models match your filter.
              </li>
            ) : (
              filteredModels.map((model) => {
                const contextLabel = formatContextWindow(model.contextWindow)
                const checked = enabledIds.has(model.id)
                const fieldId = `${providerId}-${model.id}`

                return (
                  <li key={model.id}>
                    <label
                      className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
                      htmlFor={fieldId}
                    >
                      <Checkbox
                        checked={checked}
                        className="mt-0.5"
                        id={fieldId}
                        onCheckedChange={(next) =>
                          setProviderModelEnabled(providerId, model.id, next === true)
                        }
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="font-medium text-sm">{model.name}</span>
                          {contextLabel ? (
                            <span className="text-muted-foreground text-xs">{contextLabel}</span>
                          ) : null}
                        </span>
                        {model.description ? (
                          <span className="mt-0.5 line-clamp-2 block text-muted-foreground text-xs leading-relaxed">
                            {model.description}
                          </span>
                        ) : (
                          <span className="mt-0.5 block font-mono text-muted-foreground text-xs">
                            {model.id}
                          </span>
                        )}
                      </span>
                    </label>
                  </li>
                )
              })
            )}
          </ul>

          {catalog.fetchedAt ? (
            <p className="text-muted-foreground text-xs">
              Last loaded{' '}
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(catalog.fetchedAt))}
            </p>
          ) : null}
        </>
      ) : !isLoading ? (
        <Empty className="border border-dashed py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BoxesIcon />
            </EmptyMedia>
            <EmptyTitle>No models loaded yet</EmptyTitle>
            <EmptyDescription>
              Load models from this provider, then enable the ones Firefly should expose to scenes
              and chat.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-6 text-muted-foreground text-sm">
          <Spinner className="size-4" />
          Loading models…
        </div>
      )}
    </div>
  )
}
