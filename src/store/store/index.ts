import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  storeCreateData: any | null
}

const initialState: State = {
  storeCreateData: null,
}

const storeSlice = createSlice({
  name: 'store',
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

export const { setState, resetState } = storeSlice.actions

export default storeSlice.reducer
