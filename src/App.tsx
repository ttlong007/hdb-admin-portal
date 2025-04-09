import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import RootRoutes from './Routes'
import { store, persistor } from './store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <RootRoutes />
        </BrowserRouter>{' '}
        <ToastContainer />
      </PersistGate>
    </Provider>
  )
}

export default App
