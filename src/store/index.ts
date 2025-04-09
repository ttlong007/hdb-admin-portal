import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Choose your storage engine

import authReducer from './authSlice'

const persistConfig = {
  key: 'root',
  storage,
  // Specify the reducers you want to persist
  whitelist: ['auth'], // In this example, we persist the 'user' reducer
}

const rootReducer = combineReducers({
  auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>

const persistor = persistStore(store)

export { store, persistor }
