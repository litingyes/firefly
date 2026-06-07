import { Toaster } from '@firefly/ui'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

import { ProviderConfigProvider } from '@/hooks/provider-config-context'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProviderConfigProvider>
        {children}
        <Toaster closeButton position="bottom-right" richColors />
      </ProviderConfigProvider>
    </ThemeProvider>
  )
}
