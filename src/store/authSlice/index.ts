import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  accessToken: string | null
  refreshToken: string | null
  user: any
  systemConfig: any
  objectKeyStore: string | null
  objectKeyMerchant: string | null
}

const initialState: State = {
  accessToken: null,
  refreshToken: null,
  user: null,
  systemConfig: null,
  objectKeyStore: null,
  objectKeyMerchant: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<Partial<State>>) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    resetState: () => {
      return {
        ...initialState,
      }
    },
  },
})

export const { setState } = authSlice.actions

export default authSlice.reducer
