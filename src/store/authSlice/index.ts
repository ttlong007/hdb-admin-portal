import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  accessToken: string | null
  refreshToken: string | null
}

const initialState: State = {
  accessToken: null,
  refreshToken: null,
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
