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

  const isAuthenticated = !!authState.accessToken
  const role = authState.user?.role
  const isApprover = role === 'HDB_APPROVAL'
  const isCreator = role === 'HDB_CREATION'
  const objectKeyStaff = authState.objectKeyStaff
  const objectKeyMerchant = authState.objectKeyMerchant

  const setAuthState = (newState: any) => {
    dispatch(setState(newState))
  }

  const logout = () => {
    setAuthState({
      accessToken: null,
      refreshToken: null,
    })
  }

  return {
    ...authState,
    isAuthenticated,
    role,
    setAuthState,
    logout,
    isApprover,
    isCreator,
    objectKeyStaff,
    objectKeyMerchant,
  }
}
