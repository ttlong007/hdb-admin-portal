import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Providers } from '@core/providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers defaultTheme='light'>
      <App />
    </Providers>
  </StrictMode>
)
