/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '..'
import {
  setMasterMerchantFilter,
  setMerchantFilter,
  setStaffFilter,
  setTransactionFilter,
  resetMasterMerchantFilter,
  resetMerchantFilter,
  resetStaffFilter,
  resetTransactionFilter,
  resetAllFilters
} from '.'
import { setState } from '../authSlice'

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
  }
}

export const useFilter = () => {
  const filterState = useSelector((state: RootState) => state.filter)
  const dispatch = useDispatch()

  // Master Merchant filters
  const setMasterMerchantFilters = (filters: Partial<typeof filterState.masterMerchant>) => {
    dispatch(setMasterMerchantFilter(filters))
  }
  const resetMasterMerchantFilters = () => {
    dispatch(resetMasterMerchantFilter())
  }

  // Merchant filters
  const setMerchantFilters = (filters: Partial<typeof filterState.merchant>) => {
    dispatch(setMerchantFilter(filters))
  }
  const resetMerchantFilters = () => {
    dispatch(resetMerchantFilter())
  }

  // Staff filters
  const setStaffFilters = (filters: Partial<typeof filterState.staff>) => {
    dispatch(setStaffFilter(filters))
  }
  const resetStaffFilters = () => {
    dispatch(resetStaffFilter())
  }

  // Transaction filters
  const setTransactionFilters = (filters: Partial<typeof filterState.transaction>) => {
    dispatch(setTransactionFilter(filters))
  }
  const resetTransactionFilters = () => {
    dispatch(resetTransactionFilter())
  }

  // Reset all filters
  const resetAll = () => {
    dispatch(resetAllFilters())
  }

  return {
    // State
    masterMerchantFilters: filterState.masterMerchant,
    merchantFilters: filterState.merchant,
    staffFilters: filterState.staff,
    transactionFilters: filterState.transaction,

    // Master Merchant actions
    setMasterMerchantFilters,
    resetMasterMerchantFilters,

    // Merchant actions
    setMerchantFilters,
    resetMerchantFilters,

    // Staff actions
    setStaffFilters,
    resetStaffFilters,

    // Transaction actions
    setTransactionFilters,
    resetTransactionFilters,

    // Global actions
    resetAll
  }
}
