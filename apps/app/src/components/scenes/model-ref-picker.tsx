import type { ModelRef } from '@firefly/ai'
import { modelRefKey } from '@firefly/ai'
import {
  ModelSelectorLogo,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@firefly/ui'
import { useState } from 'react'

import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { getProviderDefinition } from '@/lib/providers'

interface ModelRefPickerProps {
  disabled?: boolean
  exclude?: ModelRef[]
  onSelect: (ref: ModelRef) => void
  placeholder?: string
}

export function ModelRefPicker({
  disabled,
  exclude = [],
  onSelect,
  placeholder = 'Add a model',
}: ModelRefPickerProps) {
  const { enabledModelRefs, getModelLabel } = useModelSettingsContext()
  const [selectKey, setSelectKey] = useState(0)
  const excluded = new Set(exclude.map(modelRefKey))
  const options = enabledModelRefs.filter((ref) => !excluded.has(modelRefKey(ref)))

  if (options.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Enable models on the Providers page before assigning them to a scene.
      </p>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        key={selectKey}
        disabled={disabled}
        onValueChange={(value) => {
          const ref = options.find((entry) => modelRefKey(entry) === value)
          if (ref) {
            onSelect(ref)
            setSelectKey((current) => current + 1)
          }
        }}
      >
        <SelectTrigger className="w-full min-w-[14rem] sm:w-72">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((ref) => {
            const definition = getProviderDefinition(ref.providerId)
            return (
              <SelectItem key={modelRefKey(ref)} value={modelRefKey(ref)}>
                <span className="flex items-center gap-2">
                  <ModelSelectorLogo className="size-3.5" provider={definition.logo} />
                  <span className="truncate">{getModelLabel(ref)}</span>
                </span>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
