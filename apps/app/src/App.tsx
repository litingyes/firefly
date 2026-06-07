import { ProviderConfigPage } from '@/components/providers/provider-config-page'
import { SettingsShell } from '@/components/settings/settings-shell'
import { useProviderConfigContext } from '@/hooks/provider-config-context'

import './App.css'

function App() {
  const { connectedCount } = useProviderConfigContext()

  return (
    <SettingsShell connectedProviders={connectedCount}>
      <ProviderConfigPage />
    </SettingsShell>
  )
}

export default App
