import { useState } from 'react'

import { ProviderConfigPage } from '@/components/providers/provider-config-page'
import { SceneConfigPage } from '@/components/scenes/scene-config-page'
import { SettingsShell, type SettingsPageId } from '@/components/settings/settings-shell'
import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { useProviderConfigContext } from '@/hooks/provider-config-context'

import './App.css'

function App() {
  const { connectedCount } = useProviderConfigContext()
  const { enabledModelRefs } = useModelSettingsContext()
  const [activePage, setActivePage] = useState<SettingsPageId>('providers')

  return (
    <SettingsShell
      activePage={activePage}
      connectedProviders={connectedCount}
      enabledModels={enabledModelRefs.length}
      onNavigate={setActivePage}
    >
      {activePage === 'providers' ? <ProviderConfigPage /> : <SceneConfigPage />}
    </SettingsShell>
  )
}

export default App
