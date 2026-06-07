import { useState } from 'react'

import { ProviderConfigPage } from '@/components/providers/provider-config-page'
import { SceneConfigPage } from '@/components/scenes/scene-config-page'
import { SettingsShell, type SettingsPageId } from '@/components/settings/settings-shell'
import { ChatWorkspace } from '@/components/workspace/chat-workspace'
import { WorkspaceShell } from '@/components/workspace/workspace-shell'
import { useModelSettingsContext } from '@/hooks/model-settings-context'
import { useProviderConfigContext } from '@/hooks/provider-config-context'

import './App.css'

type AppView = 'workspace' | 'settings'

function App() {
  const { connectedCount } = useProviderConfigContext()
  const { enabledModelRefs } = useModelSettingsContext()
  const [view, setView] = useState<AppView>('workspace')
  const [settingsPage, setSettingsPage] = useState<SettingsPageId>('providers')

  if (view === 'workspace') {
    return (
      <WorkspaceShell
        connectedProviders={connectedCount}
        enabledModels={enabledModelRefs.length}
        onOpenSettings={() => setView('settings')}
      >
        <ChatWorkspace onOpenSettings={() => setView('settings')} />
      </WorkspaceShell>
    )
  }

  return (
    <SettingsShell
      activePage={settingsPage}
      connectedProviders={connectedCount}
      enabledModels={enabledModelRefs.length}
      onBackToWorkspace={() => setView('workspace')}
      onNavigate={setSettingsPage}
    >
      {settingsPage === 'providers' ? <ProviderConfigPage /> : <SceneConfigPage />}
    </SettingsShell>
  )
}

export default App
