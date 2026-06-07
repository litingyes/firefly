import { ModelSelectorLogo } from '@firefly/ui/components/ai-elements/model-selector'
import { Badge } from '@firefly/ui/components/ui/badge'
import { Button } from '@firefly/ui/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@firefly/ui/components/ui/collapsible'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@firefly/ui/components/ui/field'
import { Input } from '@firefly/ui/components/ui/input'
import { Separator } from '@firefly/ui/components/ui/separator'
import { Spinner } from '@firefly/ui/components/ui/spinner'
import { Switch } from '@firefly/ui/components/ui/switch'
import { ChevronDownIcon, ExternalLinkIcon, PlugIcon, UnplugIcon } from 'lucide-react'
import { useState } from 'react'

import { ApiKeyInput } from '@/components/providers/api-key-input'
import { ProviderModelsSection } from '@/components/providers/provider-models-section'
import type { ProviderConfig } from '@/lib/providers'
import { isProviderConfigured, type ProviderDefinition } from '@/lib/providers'

interface ProviderRowProps {
  definition: ProviderDefinition
  config: ProviderConfig
  onEnabledChange: (enabled: boolean) => void
  onFieldChange: (key: string, value: string) => void
  onTestConnection: () => Promise<boolean>
}

function statusBadge(config: ProviderConfig, configured: boolean) {
  if (config.status === 'testing') {
    return (
      <Badge className="gap-1 font-normal" variant="secondary">
        <Spinner className="size-3" />
        Testing
      </Badge>
    )
  }

  if (config.status === 'error') {
    return (
      <Badge className="font-normal" variant="destructive">
        Error
      </Badge>
    )
  }

  if (config.enabled && configured && config.status === 'connected') {
    return (
      <Badge
        className="gap-1 border-emerald-500/20 bg-emerald-500/10 font-normal text-emerald-700 dark:text-emerald-400"
        variant="outline"
      >
        <PlugIcon className="size-3" />
        Connected
      </Badge>
    )
  }

  if (config.enabled && configured) {
    return (
      <Badge className="gap-1 font-normal" variant="secondary">
        <PlugIcon className="size-3" />
        Ready
      </Badge>
    )
  }

  if (config.enabled) {
    return (
      <Badge className="gap-1 font-normal" variant="outline">
        <UnplugIcon className="size-3" />
        Incomplete
      </Badge>
    )
  }

  return (
    <Badge className="font-normal text-muted-foreground" variant="outline">
      Off
    </Badge>
  )
}

export function ProviderRow({
  definition,
  config,
  onEnabledChange,
  onFieldChange,
  onTestConnection,
}: ProviderRowProps) {
  const [open, setOpen] = useState(config.enabled)
  const configured = isProviderConfigured(definition, config)
  const isTesting = config.status === 'testing'

  return (
    <Collapsible
      className="border-b border-border last:border-b-0"
      onOpenChange={setOpen}
      open={open}
    >
      <div className="flex items-start gap-3 px-1 py-4 sm:items-center sm:px-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
          <ModelSelectorLogo className="size-5 dark:invert-0" provider={definition.logo} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-medium text-sm">{definition.name}</h3>
            {statusBadge(config, configured)}
          </div>
          <p className="mt-0.5 text-muted-foreground text-sm leading-snug">
            {definition.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Switch
            aria-label={`Enable ${definition.name}`}
            checked={config.enabled}
            onCheckedChange={(enabled) => {
              onEnabledChange(enabled)
              if (enabled) {
                setOpen(true)
              }
            }}
          />
          <CollapsibleTrigger
            render={
              <Button
                aria-expanded={open}
                aria-label={`Configure ${definition.name}`}
                className="size-8"
                size="icon"
                variant="ghost"
              />
            }
          >
            <ChevronDownIcon
              className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="overflow-hidden data-[ending-style]:animate-out data-[starting-style]:animate-in data-[ending-style]:fade-out-0 data-[starting-style]:fade-in-0">
        <div className="mb-4 rounded-lg border bg-muted/30 px-4 py-4 sm:mx-2">
          <FieldGroup>
            {definition.fields.map((field) => {
              const fieldId = `${definition.id}-${field.key}`
              const value = config.values[field.key] ?? ''

              return (
                <Field key={field.key}>
                  <FieldLabel htmlFor={fieldId}>
                    {field.label}
                    {field.required ? <span className="text-destructive">*</span> : null}
                  </FieldLabel>
                  <FieldContent>
                    {field.type === 'password' ? (
                      <ApiKeyInput
                        disabled={!config.enabled || isTesting}
                        id={fieldId}
                        onChange={(next) => onFieldChange(field.key, next)}
                        placeholder={field.placeholder}
                        value={value}
                      />
                    ) : (
                      <Input
                        className={field.type === 'url' ? 'font-mono text-sm' : undefined}
                        disabled={!config.enabled || isTesting}
                        id={fieldId}
                        inputMode={field.type === 'url' ? 'url' : undefined}
                        onChange={(event) => onFieldChange(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        spellCheck={field.type !== 'url'}
                        type={field.type === 'url' && field.required ? 'url' : 'text'}
                        value={value}
                      />
                    )}
                    {field.description ? (
                      <FieldDescription>{field.description}</FieldDescription>
                    ) : null}
                  </FieldContent>
                </Field>
              )
            })}

            {config.statusMessage ? <FieldError>{config.statusMessage}</FieldError> : null}

            <ProviderModelsSection config={config} providerId={definition.id} />

            <Separator />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <a
                className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
                href={definition.docsUrl}
                rel="noreferrer"
                target="_blank"
              >
                API documentation
                <ExternalLinkIcon className="size-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <Button
                  disabled={!config.enabled || isTesting}
                  onClick={() => onTestConnection()}
                  type="button"
                  variant="outline"
                >
                  {isTesting ? (
                    <>
                      <Spinner className="size-3.5" />
                      Testing connection
                    </>
                  ) : (
                    'Test connection'
                  )}
                </Button>
              </div>
            </div>

            {config.lastVerifiedAt ? (
              <p className="text-muted-foreground text-xs">
                Last verified{' '}
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(config.lastVerifiedAt))}
              </p>
            ) : null}
          </FieldGroup>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
