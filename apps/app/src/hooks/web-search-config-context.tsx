import { createContext, useContext, type ReactNode } from 'react'

import { useWebSearchConfig } from '@/hooks/use-web-search-config'

type WebSearchConfigContextValue = ReturnType<typeof useWebSearchConfig>

const WebSearchConfigContext = createContext<WebSearchConfigContextValue | null>(null)

export function WebSearchConfigProvider({ children }: { children: ReactNode }) {
  const value = useWebSearchConfig()
  return <WebSearchConfigContext.Provider value={value}>{children}</WebSearchConfigContext.Provider>
}

export function useWebSearchConfigContext() {
  const context = useContext(WebSearchConfigContext)
  if (!context) {
    throw new Error('useWebSearchConfigContext must be used within WebSearchConfigProvider')
  }
  return context
}
