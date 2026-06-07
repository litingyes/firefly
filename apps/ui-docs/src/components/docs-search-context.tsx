import { createContext, useContext, type ReactNode } from 'react'

const DocsSearchContext = createContext<(() => void) | null>(null)

export function DocsSearchProvider({
  openSearch,
  children,
}: {
  openSearch: () => void
  children: ReactNode
}) {
  return <DocsSearchContext.Provider value={openSearch}>{children}</DocsSearchContext.Provider>
}

export function useOpenDocsSearch(): () => void {
  const openSearch = useContext(DocsSearchContext)
  return openSearch ?? (() => {})
}
