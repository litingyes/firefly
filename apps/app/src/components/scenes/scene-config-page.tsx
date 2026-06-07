import type { ModelRef } from '@firefly/ai/model-types'
import { modelRefKey } from '@firefly/ai/model-types'
import { ModelSelectorLogo } from '@firefly/ui/components/ai-elements/model-selector'
import { Badge } from '@firefly/ui/components/ui/badge'
import { Button } from '@firefly/ui/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@firefly/ui/components/ui/empty'
import { Separator } from '@firefly/ui/components/ui/separator'
import { Skeleton } from '@firefly/ui/components/ui/skeleton'
import { Spinner } from '@firefly/ui/components/ui/spinner'
import { ArrowDownIcon, ArrowUpIcon, LayersIcon, Trash2Icon, WaypointsIcon } from 'lucide-react'

import { ChatWebSearchSection } from '@/components/scenes/chat-web-search-section'
import { ModelRefPicker } from '@/components/scenes/model-ref-picker'
import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { getProviderDefinition } from '@/lib/providers'
import { MODEL_SCENE_DEFINITIONS, type ModelSceneId } from '@/lib/scenes'

function SceneModelRow({
  ref: modelRef,
  index,
  total,
  onMoveDown,
  onMoveUp,
  onRemove,
  showReorder = true,
}: {
  ref: ModelRef
  index: number
  total: number
  onMoveDown: () => void
  onMoveUp: () => void
  onRemove: () => void
  showReorder?: boolean
}) {
  const { getModelLabel } = useModelSettingsContext()
  const definition = getProviderDefinition(modelRef.providerId)

  return (
    <li className="flex items-center gap-2 rounded-md border bg-card px-2 py-2">
      <ModelSelectorLogo className="size-4 shrink-0" provider={definition.logo} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm">{getModelLabel(modelRef)}</p>
        <p className="truncate font-mono text-muted-foreground text-xs">{modelRef.modelId}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {showReorder ? (
          <>
            <Button
              aria-label="Move model up"
              disabled={index === 0}
              onClick={onMoveUp}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ArrowUpIcon className="size-3.5" />
            </Button>
            <Button
              aria-label="Move model down"
              disabled={index === total - 1}
              onClick={onMoveDown}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ArrowDownIcon className="size-3.5" />
            </Button>
          </>
        ) : null}
        <Button
          aria-label="Remove model"
          onClick={onRemove}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Trash2Icon className="size-3.5" />
        </Button>
      </div>
    </li>
  )
}

function SceneSection({ sceneId }: { sceneId: ModelSceneId }) {
  const scene = MODEL_SCENE_DEFINITIONS.find((entry) => entry.id === sceneId)!
  const { addSceneModel, moveSceneModel, removeSceneModel, scenes, setSceneModels } =
    useModelSettingsContext()
  const assigned = scenes[sceneId]

  if (scene.mode === 'single') {
    const current = assigned[0] ?? null

    return (
      <section className="space-y-3 rounded-xl border bg-card p-4">
        <div className="space-y-1">
          <h2 className="font-medium text-base">{scene.name}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{scene.description}</p>
        </div>

        {current ? (
          <ul className="space-y-2">
            <SceneModelRow
              index={0}
              onMoveDown={() => undefined}
              onMoveUp={() => undefined}
              onRemove={() => setSceneModels(sceneId, [])}
              ref={current}
              showReorder={false}
              total={1}
            />
          </ul>
        ) : (
          <ModelRefPicker
            onSelect={(ref) => setSceneModels(sceneId, [ref])}
            placeholder="Choose a model"
          />
        )}
      </section>
    )
  }

  return (
    <section className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <h2 className="font-medium text-base">{scene.name}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{scene.description}</p>
        </div>
        <Badge className="font-normal" variant="secondary">
          {assigned.length} model{assigned.length === 1 ? '' : 's'}
        </Badge>
      </div>

      {assigned.length > 0 ? (
        <ul className="space-y-2">
          {assigned.map((ref, index) => (
            <SceneModelRow
              key={modelRefKey(ref)}
              index={index}
              onMoveDown={() => moveSceneModel(sceneId, index, index + 1)}
              onMoveUp={() => moveSceneModel(sceneId, index, index - 1)}
              onRemove={() => removeSceneModel(sceneId, ref)}
              ref={ref}
              total={assigned.length}
            />
          ))}
        </ul>
      ) : (
        <Empty className="border border-dashed py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayersIcon />
            </EmptyMedia>
            <EmptyTitle>No chat models yet</EmptyTitle>
            <EmptyDescription>
              Add one or more models users can switch between during a conversation.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <ModelRefPicker exclude={assigned} onSelect={(ref) => addSceneModel(sceneId, ref)} />

      {sceneId === 'chat' ? <ChatWebSearchSection /> : null}
    </section>
  )
}

export function SceneConfigPage() {
  const { enabledModelRefs, isLoading, isSaving } = useModelSettingsContext()

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center gap-2">
          <Spinner className="size-4" />
          <p className="text-muted-foreground text-sm">Loading scene settings…</p>
        </div>
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-semibold text-xl tracking-tight">Scenes</h1>
          {isSaving ? (
            <Badge className="gap-1 font-normal" variant="outline">
              <Spinner className="size-3" />
              Saving
            </Badge>
          ) : null}
        </div>
        <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
          Assign enabled models to product scenes. Chat supports multiple switchable models; intent
          recognition and context compression use a single smaller model each.
        </p>
      </header>

      {enabledModelRefs.length === 0 ? (
        <Empty className="border border-dashed bg-muted/20">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <WaypointsIcon />
            </EmptyMedia>
            <EmptyTitle>Enable models on Providers first</EmptyTitle>
            <EmptyDescription>
              Connect a provider, load its model list, and enable the models you want before
              assigning them here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {MODEL_SCENE_DEFINITIONS.map((scene, index) => (
            <div key={scene.id}>
              <SceneSection sceneId={scene.id} />
              {index < MODEL_SCENE_DEFINITIONS.length - 1 ? (
                <Separator className="mt-4 opacity-0" />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
