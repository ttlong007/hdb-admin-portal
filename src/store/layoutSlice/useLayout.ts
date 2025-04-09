/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '..'
import { setState } from '.'

export const useAuthState = () => {
  const authState = useSelector((state: RootState) => state.auth)

  return authState
}

export const useAuth = () => {
  const authState = useAuthState()
  const dispatch = useDispatch()

  const isAuthenticated = !!authState.token

  const setAuthState = (newState: any) => {
    dispatch(setState(newState))
  }

  const logout = () => {
    setAuthState({
      token: null,
      userId: null,
    })
  }

  return {
    ...authState,
    isAuthenticated,
    setAuthState,
    logout,
  }
}
