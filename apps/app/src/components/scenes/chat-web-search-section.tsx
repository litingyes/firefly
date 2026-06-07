import { Field, FieldContent, FieldDescription, FieldLabel } from '@firefly/ui/components/ui/field'
import { NativeSelect, NativeSelectOption } from '@firefly/ui/components/ui/native-select'
import { Switch } from '@firefly/ui/components/ui/switch'
import type { WebSearchProviderId } from '@firefly/web-search/types'
import { GlobeIcon } from 'lucide-react'

import { WebSearchProviderLogo } from '@/components/web-search/web-search-provider-logo'
import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { useWebSearchConfigContext } from '@/hooks/web-search-config-context'
import { getWebSearchProviderDefinition } from '@/lib/web-search'

export function ChatWebSearchSection() {
  const { configMap } = useWebSearchConfigContext()
  const { chatWebSearch, setChatWebSearch } = useModelSettingsContext()

  const connectedProviders = (Object.keys(configMap) as WebSearchProviderId[]).filter(
    (id) => configMap[id].enabled && configMap[id].status === 'connected',
  )

  const selectedProviderId =
    chatWebSearch.providerId && connectedProviders.includes(chatWebSearch.providerId)
      ? chatWebSearch.providerId
      : (connectedProviders[0] ?? null)

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GlobeIcon aria-hidden className="size-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">Web search</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Let the chat agent call your connected search provider when it needs live web results.
          </p>
        </div>
        <Switch
          aria-label="Enable web search for chat"
          checked={chatWebSearch.enabled}
          disabled={connectedProviders.length === 0}
          onCheckedChange={(enabled) => {
            setChatWebSearch({
              enabled,
              providerId: enabled ? selectedProviderId : chatWebSearch.providerId,
            })
          }}
        />
      </div>

      {connectedProviders.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Connect a provider under Settings → Web search before enabling chat search.
        </p>
      ) : null}

      {chatWebSearch.enabled && connectedProviders.length > 0 ? (
        <Field>
          <FieldLabel htmlFor="chat-web-search-provider">Search provider</FieldLabel>
          <FieldContent>
            <NativeSelect
              id="chat-web-search-provider"
              onChange={(event) => {
                setChatWebSearch({
                  providerId: event.target.value as WebSearchProviderId,
                })
              }}
              value={selectedProviderId ?? ''}
            >
              {connectedProviders.map((id) => {
                const definition = getWebSearchProviderDefinition(id)
                return (
                  <NativeSelectOption key={id} value={id}>
                    {definition.name}
                  </NativeSelectOption>
                )
              })}
            </NativeSelect>
            {selectedProviderId ? (
              <div className="mt-2 flex items-center gap-2 text-muted-foreground text-xs">
                <div className="size-5 overflow-hidden rounded border">
                  <WebSearchProviderLogo
                    provider={getWebSearchProviderDefinition(selectedProviderId).logo}
                  />
                </div>
                <span>{getWebSearchProviderDefinition(selectedProviderId).description}</span>
              </div>
            ) : null}
            <FieldDescription>
              The agent will use this provider when it decides a web search is needed.
            </FieldDescription>
          </FieldContent>
        </Field>
      ) : null}
    </div>
  )
}
