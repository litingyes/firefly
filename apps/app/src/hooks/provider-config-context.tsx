import { createContext, useContext, type ReactNode } from 'react'

import { useProviderConfig } from '@/hooks/use-provider-config'

type ProviderConfigContextValue = ReturnType<typeof useProviderConfig>

const ProviderConfigContext = createContext<ProviderConfigContextValue | null>(null)

export function ProviderConfigProvider({ children }: { children: ReactNode }) {
  const value = useProviderConfig()
  return <ProviderConfigContext.Provider value={value}>{children}</ProviderConfigContext.Provider>
}

export function useProviderConfigContext() {
  const context = useContext(ProviderConfigContext)
  if (!context) {
    throw new Error('useProviderConfigContext must be used within ProviderConfigProvider')
  }
  return context
}
