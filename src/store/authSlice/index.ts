import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  token: string | null
  userId: string | null
}

const initialState: State = {
  token: null,
  userId: null,
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
