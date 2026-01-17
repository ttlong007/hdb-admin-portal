/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '..'
import { setState } from '.'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/config/routes'

export const useAuthState = () => {
  const authState = useSelector((state: RootState) => state.auth)

  return authState
}

export const useAuth = () => {
  const authState = useAuthState()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const role = authState.user?.role
  const isApprover = role === 'HDB_APPROVAL'
  const isCreator = role === 'HDB_CREATION'
  const isViewer = role === 'HDB_VIEW'
  const objectKeyStaff = authState.objectKeyStaff
  const objectKeyMerchant = authState.objectKeyMerchant

  const setAuthState = (newState: any) => {
    dispatch(setState(newState))
  }

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      bjectKeyStaff: null,
      objectKeyMerchant: null,
    })
    navigate(routes.unauthorize, { replace: true })
  }

  return {
    ...authState,
    role,
    setAuthState,
    logout,
    isApprover,
    isCreator,
    isViewer,
    objectKeyStaff,
    objectKeyMerchant,
  }
}
