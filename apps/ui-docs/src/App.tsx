import { Navigate, Route, Routes } from 'react-router-dom'

import { DocsShell } from '@/components/docs-shell'
import { ComponentPage } from '@/pages/component-page'
import { OverviewPage } from '@/pages/overview'
import { ThemePage } from '@/pages/theme-page'

export default function App() {
  return (
    <DocsShell>
      <Routes>
        <Route element={<OverviewPage />} path="/" />
        <Route element={<ThemePage />} path="/theme" />
        <Route element={<ComponentPage />} path="/components/:category/:name" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </DocsShell>
  )
}
