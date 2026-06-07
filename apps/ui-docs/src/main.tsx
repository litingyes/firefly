import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { DocsProviders } from '@/components/docs-providers'

import App from './App'

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <DocsProviders>
        <App />
      </DocsProviders>
    </BrowserRouter>
  </React.StrictMode>,
)
