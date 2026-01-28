import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import 'react-toastify/dist/ReactToastify.css'

import { store, persistor } from './store'
import App from './App.tsx'
import { Providers } from '@core/providers'
import './index.css'
import { ConfirmProvider } from './providers/ConfirmProvider.tsx'
import { toast } from 'react-toastify'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on CORS or network errors
        if (!error.response) {
          console.error('Network/CORS error detected:', error.message)
          return false
        }
        // Don't retry on 401 (will be handled by axios interceptor)
        if (error.response?.status === 401) {
          return false
        }
        // Retry other errors up to 1 time
        return failureCount < 1
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers defaultTheme="light">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <ConfirmProvider>
                <App />
              </ConfirmProvider>
              <ToastContainer />
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </Providers>
  </StrictMode>
)
