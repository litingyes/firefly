import type { ModelInfo, ModelRef, ProviderId } from '@firefly/ai'
import { listProviderModels, modelRefKey } from '@firefly/ai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
  createDefaultModelSettings,
  getEnabledModelRefs,
  isModelEnabled,
  pruneAllowlist,
  pruneSceneConfig,
  type ChatWebSearchSetting,
  type ModelSettings,
  type ProviderModelAllowlist,
} from '@/lib/model-settings'
import { loadModelSettings, saveModelSettings } from '@/lib/model-settings-store'
import { getProviderDefinition } from '@/lib/providers'
import type { ModelSceneConfig, ModelSceneId } from '@/lib/scenes'
import { getAppFetch } from '@/lib/tauri-fetch'

import { useProviderConfigContext } from './provider-config-context'

const SAVE_DEBOUNCE_MS = 300

type CatalogState = {
  models: ModelInfo[]
  fetchedAt: string
  error?: string
}

type CatalogMap = Partial<Record<ProviderId, CatalogState>>

export function useModelSettings() {
  const { configMap } = useProviderConfigContext()
  const [settings, setSettings] = useState<ModelSettings>(createDefaultModelSettings)
  const [catalogMap, setCatalogMap] = useState<CatalogMap>({})
  const [loadingProviders, setLoadingProviders] = useState<Partial<Record<ProviderId, boolean>>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimerRef = useRef<number | null>(null)
  const hydratedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    void loadModelSettings().then((loaded) => {
      if (cancelled) {
        return
      }
      setSettings(loaded)
      hydratedRef.current = true
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hydratedRef.current) {
      return
    }

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = window.setTimeout(() => {
      setIsSaving(true)
      void saveModelSettings(settings)
        .catch(() => {
          toast.error('Could not save model settings', {
            description: 'Your changes are kept in memory but were not written to disk.',
          })
        })
        .finally(() => {
          setIsSaving(false)
        })
    }, SAVE_DEBOUNCE_MS)

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current)
      }
    }
  }, [settings])

  const enabledModelRefs = useMemo(
    () => getEnabledModelRefs(settings.allowlist),
    [settings.allowlist],
  )

  const refreshProviderModels = useCallback(
    async (providerId: ProviderId): Promise<ModelInfo[]> => {
      const config = configMap[providerId]
      if (!config.enabled || config.status !== 'connected') {
        throw new Error('Connect this provider before loading models.')
      }

      setLoadingProviders((current) => ({ ...current, [providerId]: true }))

      try {
        const fetch = getAppFetch()
        const models = await listProviderModels(providerId, config, fetch)
        const fetchedAt = new Date().toISOString()

        setCatalogMap((current) => ({
          ...current,
          [providerId]: { models, fetchedAt },
        }))

        setSettings((current) => {
          const availableIds = models.map((model) => model.id)
          const prunedAllowlist = pruneAllowlist(current.allowlist, {
            [providerId]: availableIds,
          })
          const prunedScenes = pruneSceneConfig(current.scenes, prunedAllowlist)

          return {
            ...current,
            allowlist: prunedAllowlist,
            scenes: prunedScenes,
          }
        })

        return models
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not load models.'
        setCatalogMap((current) => ({
          ...current,
          [providerId]: {
            models: current[providerId]?.models ?? [],
            fetchedAt: current[providerId]?.fetchedAt ?? new Date().toISOString(),
            error: message,
          },
        }))
        throw error
      } finally {
        setLoadingProviders((current) => ({ ...current, [providerId]: false }))
      }
    },
    [configMap],
  )

  const setProviderModelEnabled = useCallback(
    (providerId: ProviderId, modelId: string, enabled: boolean) => {
      setSettings((current) => {
        const currentIds = new Set(current.allowlist[providerId] ?? [])
        if (enabled) {
          currentIds.add(modelId)
        } else {
          currentIds.delete(modelId)
        }

        const nextAllowlist: ProviderModelAllowlist = {
          ...current.allowlist,
          [providerId]: [...currentIds].sort(),
        }

        if (nextAllowlist[providerId]?.length === 0) {
          delete nextAllowlist[providerId]
        }

        return {
          ...current,
          allowlist: nextAllowlist,
          scenes: pruneSceneConfig(current.scenes, nextAllowlist),
        }
      })
    },
    [],
  )

  const setProviderModelsEnabled = useCallback((providerId: ProviderId, modelIds: string[]) => {
    setSettings((current) => {
      const nextAllowlist: ProviderModelAllowlist = {
        ...current.allowlist,
        [providerId]: [...new Set(modelIds)].sort(),
      }

      if (nextAllowlist[providerId]?.length === 0) {
        delete nextAllowlist[providerId]
      }

      return {
        ...current,
        allowlist: nextAllowlist,
        scenes: pruneSceneConfig(current.scenes, nextAllowlist),
      }
    })
  }, [])

  const setChatWebSearch = useCallback((patch: Partial<ChatWebSearchSetting>) => {
    setSettings((current) => ({
      ...current,
      chatWebSearch: {
        ...current.chatWebSearch,
        ...patch,
      },
    }))
  }, [])

  const setSceneModels = useCallback((sceneId: ModelSceneId, refs: ModelRef[]) => {
    setSettings((current) => ({
      ...current,
      scenes: {
        ...current.scenes,
        [sceneId]: refs.filter((ref) => isModelEnabled(current.allowlist, ref)),
      },
    }))
  }, [])

  const addSceneModel = useCallback((sceneId: ModelSceneId, ref: ModelRef) => {
    setSettings((current) => {
      if (!isModelEnabled(current.allowlist, ref)) {
        return current
      }

      const existing = current.scenes[sceneId]
      const key = modelRefKey(ref)
      if (existing.some((entry) => modelRefKey(entry) === key)) {
        return current
      }

      return {
        ...current,
        scenes: {
          ...current.scenes,
          [sceneId]: [...existing, ref],
        },
      }
    })
  }, [])

  const removeSceneModel = useCallback((sceneId: ModelSceneId, ref: ModelRef) => {
    const key = modelRefKey(ref)
    setSettings((current) => ({
      ...current,
      scenes: {
        ...current.scenes,
        [sceneId]: current.scenes[sceneId].filter((entry) => modelRefKey(entry) !== key),
      },
    }))
  }, [])

  const moveSceneModel = useCallback(
    (sceneId: ModelSceneId, fromIndex: number, toIndex: number) => {
      setSettings((current) => {
        const items = [...current.scenes[sceneId]]
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) {
          return current
        }

        const [item] = items.splice(fromIndex, 1)
        items.splice(toIndex, 0, item)

        return {
          ...current,
          scenes: {
            ...current.scenes,
            [sceneId]: items,
          },
        }
      })
    },
    [],
  )

  const getModelLabel = useCallback(
    (ref: ModelRef) => {
      const catalog = catalogMap[ref.providerId]?.models ?? []
      const match = catalog.find((model) => model.id === ref.modelId)
      const providerName = getProviderDefinition(ref.providerId).name
      return `${providerName} · ${match?.name ?? ref.modelId}`
    },
    [catalogMap],
  )

  return {
    catalogMap,
    enabledModelRefs,
    getModelLabel,
    isLoading,
    isProviderModelsLoading: (providerId: ProviderId) => Boolean(loadingProviders[providerId]),
    isSaving,
    refreshProviderModels,
    removeSceneModel,
    addSceneModel,
    moveSceneModel,
    scenes: settings.scenes as ModelSceneConfig,
    setProviderModelEnabled,
    setProviderModelsEnabled,
    setSceneModels,
    setChatWebSearch,
    settings,
    chatWebSearch: settings.chatWebSearch,
  }
}
