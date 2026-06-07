import { Toaster } from '@firefly/ui/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

import { ModelSettingsProvider } from '@/hooks/model-settings-context'
import { ProviderConfigProvider } from '@/hooks/provider-config-context'
import { WebSearchConfigProvider } from '@/hooks/web-search-config-context'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProviderConfigProvider>
        <WebSearchConfigProvider>
          <ModelSettingsProvider>
            {children}
            <Toaster closeButton position="bottom-right" richColors />
          </ModelSettingsProvider>
        </WebSearchConfigProvider>
      </ProviderConfigProvider>
    </ThemeProvider>
  )
}
