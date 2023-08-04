import React from 'react'
import { createRoot } from 'react-dom/client'

import './theme.css'
import './index.css'

// eslint-disable-next-line import/no-unresolved

import App from './App'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
