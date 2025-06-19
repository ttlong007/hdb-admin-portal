import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  user: any
  systemConfig: any
  objectKeyMerchant: string | null
  objectKeyStaff: string | null
  isAuthenticated: boolean
}

const initialState: State = {
  user: null,
  systemConfig: null,
  objectKeyMerchant: null,
  objectKeyStaff: null,
  isAuthenticated: false,
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
