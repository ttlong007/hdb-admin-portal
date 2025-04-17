/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '..'
import { setState } from '.'

export const useStoreState = () => {
  const storeState = useSelector((state: RootState) => state.store)

  return storeState
}

export const useStore = () => {
  const storeState = useStoreState()
  const dispatch = useDispatch()

  const setStoreState = (newState: any) => {
    dispatch(setState(newState))
  }

  return {
    ...storeState,
    setStoreState,
  }
}
