import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  token: string | null
  userId: string | null
}

const initialState: State = {
  token: null,
  userId: null,
}

const layoutSlice = createSlice({
  name: 'layout',
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

export const { setState } = layoutSlice.actions

export default layoutSlice.reducer
