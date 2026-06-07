import { Toaster } from '@firefly/ui'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

import { ModelSettingsProvider } from '@/hooks/model-settings-context'
import { ProviderConfigProvider } from '@/hooks/provider-config-context'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProviderConfigProvider>
        <ModelSettingsProvider>
          {children}
          <Toaster closeButton position="bottom-right" richColors />
        </ModelSettingsProvider>
      </ProviderConfigProvider>
    </ThemeProvider>
  )
}
