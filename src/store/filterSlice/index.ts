import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FilterState {
  masterMerchant: {
    status?: string
    page?: number
    limit?: number
    cif?: string
    name?: string
    business_license?: string
  }
  merchant: {
    status?: string
    page?: number
    limit?: number
    cif?: string
    company_id?: number
    code?: string
    name?: string
  }
  staff: {
    status?: string
    page?: number
    limit?: number
    cif?: string
    company_id?: number
    store_id?: number
    code?: string
    name?: string
    role?: string
  }
  transaction: {
    status?: string
    page?: number
    limit?: number
    duration?: [string, string]
    company_id?: number
    store_id?: number
    staff_id?: number
    code?: string
    transaction_type?: string
    store_code?: string
    created_by_staff_code?: string
    sortField?: string | null
    sortOrder?: 'ascend' | 'descend' | null
  }
}

const initialState: FilterState = {
  masterMerchant: {
    status: '',
    page: 1,
    limit: 10,
    cif: '',
    name: '',
    business_license: '',
  },
  merchant: {
    status: '',
    page: 1,
    limit: 10,
    cif: '',
    company_id: undefined,
    code: '',
    name: '',
  },
  staff: {
    status: '',
    page: 1,
    limit: 10,
    cif: '',
    company_id: undefined,
    store_id: undefined,
    code: '',
    name: '',
    role: '',
  },
  transaction: {
    status: '',
    page: 1,
    limit: 10,
    duration: undefined,
    company_id: undefined,
    store_id: undefined,
    staff_id: undefined,
    code: '',
    transaction_type: '',
    store_code: '',
    created_by_staff_code: '',
    sortField: null,
    sortOrder: null,
  },
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setMasterMerchantFilter: (
      state,
      action: PayloadAction<Partial<FilterState['masterMerchant']>>
    ) => {
      state.masterMerchant = {
        ...state.masterMerchant,
        ...action.payload,
      }
    },
    setMerchantFilter: (
      state,
      action: PayloadAction<Partial<FilterState['merchant']>>
    ) => {
      state.merchant = {
        ...state.merchant,
        ...action.payload,
      }
    },
    setStaffFilter: (
      state,
      action: PayloadAction<Partial<FilterState['staff']>>
    ) => {
      state.staff = {
        ...state.staff,
        ...action.payload,
      }
    },
    setTransactionFilter: (
      state,
      action: PayloadAction<Partial<FilterState['transaction']>>
    ) => {
      state.transaction = {
        ...state.transaction,
        ...action.payload,
      }
    },
    resetMasterMerchantFilter: (state) => {
      state.masterMerchant = initialState.masterMerchant
    },
    resetMerchantFilter: (state) => {
      state.merchant = initialState.merchant
    },
    resetStaffFilter: (state) => {
      state.staff = initialState.staff
    },
    resetTransactionFilter: (state) => {
      state.transaction = initialState.transaction
    },
    resetAllFilters: () => {
      return initialState
    },
  },
})

export const {
  setMasterMerchantFilter,
  setMerchantFilter,
  setStaffFilter,
  setTransactionFilter,
  resetMasterMerchantFilter,
  resetMerchantFilter,
  resetStaffFilter,
  resetTransactionFilter,
  resetAllFilters,
} = filterSlice.actions

export default filterSlice.reducer
