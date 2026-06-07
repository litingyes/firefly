import { createContext, useContext, type ReactNode } from 'react'

import { useModelSettings } from '@/hooks/use-model-settings'

type ModelSettingsContextValue = ReturnType<typeof useModelSettings>

const ModelSettingsContext = createContext<ModelSettingsContextValue | null>(null)

export function ModelSettingsProvider({ children }: { children: ReactNode }) {
  const value = useModelSettings()
  return <ModelSettingsContext.Provider value={value}>{children}</ModelSettingsContext.Provider>
}

export function useModelSettingsContext() {
  const context = useContext(ModelSettingsContext)
  if (!context) {
    throw new Error('useModelSettingsContext must be used within ModelSettingsProvider')
  }
  return context
}
