import { createDefaultProviderConfigMap } from '@firefly/ai'
import { testProviderConnection } from '@firefly/ai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { loadProviderConfig, saveProviderConfig } from '@/lib/provider-store'
import {
  getProviderDefinition,
  isProviderConfigured,
  type ProviderConfig,
  type ProviderConfigMap,
  type ProviderId,
  validateProviderConfig,
} from '@/lib/providers'
import { getAppFetch } from '@/lib/tauri-fetch'

const SAVE_DEBOUNCE_MS = 300

export function useProviderConfig() {
  const [configMap, setConfigMap] = useState<ProviderConfigMap>(createDefaultProviderConfigMap)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimerRef = useRef<number | null>(null)
  const hydratedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    void loadProviderConfig().then((loaded) => {
      if (cancelled) {
        return
      }
      setConfigMap(loaded)
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
      void saveProviderConfig(configMap)
        .catch(() => {
          toast.error('Could not save provider settings', {
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
  }, [configMap])

  const connectedCount = useMemo(
    () =>
      Object.values(configMap).filter((config) => config.enabled && config.status === 'connected')
        .length,
    [configMap],
  )

  const readyCount = useMemo(
    () =>
      Object.entries(configMap).filter(([id, config]) => {
        const definition = getProviderDefinition(id as ProviderId)
        return config.enabled && isProviderConfigured(definition, config)
      }).length,
    [configMap],
  )

  const updateProvider = useCallback((id: ProviderId, patch: Partial<ProviderConfig>) => {
    setConfigMap((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch,
        values: patch.values ? { ...current[id].values, ...patch.values } : current[id].values,
      },
    }))
  }, [])

  const setFieldValue = useCallback((id: ProviderId, key: string, value: string) => {
    setConfigMap((current) => ({
      ...current,
      [id]: {
        ...current[id],
        status: current[id].status === 'connected' ? 'idle' : current[id].status,
        values: { ...current[id].values, [key]: value },
      },
    }))
  }, [])

  const setEnabled = useCallback((id: ProviderId, enabled: boolean) => {
    setConfigMap((current) => ({
      ...current,
      [id]: {
        ...current[id],
        enabled,
        status: enabled ? current[id].status : 'idle',
        statusMessage: enabled ? current[id].statusMessage : undefined,
      },
    }))
  }, [])

  const testConnection = useCallback(
    async (id: ProviderId): Promise<boolean> => {
      const definition = getProviderDefinition(id)
      const config = configMap[id]
      const validationError = validateProviderConfig(definition, config)

      if (validationError) {
        setConfigMap((current) => ({
          ...current,
          [id]: {
            ...current[id],
            status: 'error',
            statusMessage: validationError,
          },
        }))
        return false
      }

      if (!config.enabled) {
        setConfigMap((current) => ({
          ...current,
          [id]: {
            ...current[id],
            status: 'error',
            statusMessage: 'Enable this provider before testing the connection.',
          },
        }))
        return false
      }

      setConfigMap((current) => ({
        ...current,
        [id]: {
          ...current[id],
          status: 'testing',
          statusMessage: undefined,
        },
      }))

      const fetch = getAppFetch()
      const result = await testProviderConnection(id, config, fetch)

      setConfigMap((current) => ({
        ...current,
        [id]: {
          ...current[id],
          status: result.ok ? 'connected' : 'error',
          statusMessage: result.ok ? undefined : result.message,
          lastVerifiedAt: result.ok ? new Date().toISOString() : current[id].lastVerifiedAt,
        },
      }))

      return result.ok
    },
    [configMap],
  )

  return {
    configMap,
    connectedCount,
    isLoading,
    isSaving,
    readyCount,
    setEnabled,
    setFieldValue,
    testConnection,
    updateProvider,
  }
}
