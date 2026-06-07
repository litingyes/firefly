import { Toaster } from '@firefly/ui/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

interface DocsProvidersProps {
  children: ReactNode
}

export function DocsProviders({ children }: DocsProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster closeButton position="bottom-right" richColors />
    </ThemeProvider>
  )
}
