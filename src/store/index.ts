import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from './authSlice'
import layoutReducer from './layoutSlice'
import filterReducer from './filterSlice'
const PERSISTED_KEYS: string[] = ['auth', 'filter']

const persistConfig = {
  key: 'root',
  storage,
  whitelist: PERSISTED_KEYS,
}

const combinedReducer = combineReducers({
  auth: authReducer,
  layout: layoutReducer,
  filter: filterReducer,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'clearStore') {
    state = undefined
  }
  return combinedReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>

const persistor = persistStore(store)

export { store, persistor }
