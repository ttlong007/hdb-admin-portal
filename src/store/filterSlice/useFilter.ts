/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '..'
import {
  setMasterMerchantFilter,
  setMerchantFilter,
  setStaffFilter,
  setTransactionFilter,
  setTransactionNonFinancialFilter,
  setReconcileHistoryFilter,
  setTransactionCollaboratorFilter,
  resetMasterMerchantFilter,
  resetMerchantFilter,
  resetStaffFilter,
  resetTransactionFilter,
  resetTransactionNonFinancialFilter,
  resetReconcileHistoryFilter,
  resetTransactionCollaboratorFilter,
  resetAllFilters
} from '.'

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

  // Transaction filters (financial)
  const setTransactionFilters = (filters: Partial<typeof filterState.transaction>) => {
    dispatch(setTransactionFilter(filters))
  }
  const resetTransactionFilters = () => {
    dispatch(resetTransactionFilter())
  }

  // Transaction filters (non-financial)
  const setNonFinancialTransactionFilters = (
    filters: Partial<typeof filterState.transactionNonFinancial>
  ) => {
    dispatch(setTransactionNonFinancialFilter(filters))
  }
  const resetNonFinancialTransactionFilters = () => {
    dispatch(resetTransactionNonFinancialFilter())
  }

  // Reconcile history filters
  const setReconcileHistoryFilters = (
    filters: Partial<typeof filterState.reconcileHistory>
  ) => {
    dispatch(setReconcileHistoryFilter(filters))
  }
  const resetReconcileHistoryFilters = () => {
    dispatch(resetReconcileHistoryFilter())
  }

  // Transaction filters (collaborator / CTV)
  const setCollaboratorTransactionFilters = (
    filters: Partial<typeof filterState.transactionCollaborator>
  ) => {
    dispatch(setTransactionCollaboratorFilter(filters))
  }
  const resetCollaboratorTransactionFilters = () => {
    dispatch(resetTransactionCollaboratorFilter())
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
    nonFinancialTransactionFilters: filterState.transactionNonFinancial,
    reconcileHistoryFilters: filterState.reconcileHistory,
    collaboratorTransactionFilters: filterState.transactionCollaborator,

    // Master Merchant actions
    setMasterMerchantFilters,
    resetMasterMerchantFilters,

    // Merchant actions
    setMerchantFilters,
    resetMerchantFilters,

    // Staff actions
    setStaffFilters,
    resetStaffFilters,

    // Transaction actions (financial)
    setTransactionFilters,
    resetTransactionFilters,

    // Transaction actions (non-financial)
    setNonFinancialTransactionFilters,
    resetNonFinancialTransactionFilters,

    // Reconcile history actions
    setReconcileHistoryFilters,
    resetReconcileHistoryFilters,

    // Transaction actions (collaborator)
    setCollaboratorTransactionFilters,
    resetCollaboratorTransactionFilters,

    // Global actions
    resetAll
  }
}
