export const CART_KEY = 'isomorphic-cart'
export const POS_CART_KEY = 'isomorphic-pos-cart'
export const DUMMY_ID = 'FC6723757651DB74'
export const CHECKOUT = 'isomorphic-checkout'
export const CURRENCY_CODE = 'USD'
export const LOCALE = 'en'
export const CURRENCY_OPTIONS = {
  formation: 'en-US',
  fractions: 2,
}

export const ROW_PER_PAGE_OPTIONS = [
  {
    value: 5,
    name: '5',
  },
  {
    value: 10,
    name: '10',
  },
  {
    value: 15,
    name: '15',
  },
  {
    value: 20,
    name: '20',
  },
]

export const ROLES = {
  Administrator: 'Administrator',
  Manager: 'Manager',
  Sales: 'Sales',
  Support: 'Support',
  Developer: 'Developer',
  HRD: 'HR Department',
  RestrictedUser: 'Restricted User',
  Customer: 'Customer',
} as const

export const MERCHANT_STATUS = [
  { value: 'WAITING_APPROVE', label: 'Đang đợi duyệt' },
  { value: 'WAITING_APPROVAL_FOR_EDIT', label: 'Chờ duyệt chỉnh sửa' },
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'REJECTED', label: 'Từ chối' },
  { value: 'INACTIVE', label: 'Ngưng hoạt động' },
]

export const MASTER_MERCHANT_STATUS = [
  { value: 'WAITING_APPROVE', label: 'Đang đợi duyệt' },
  { value: 'WAITING_APPROVAL_FOR_EDIT', label: 'Chờ duyệt chỉnh sửa' },
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'REJECTED', label: 'Từ chối' },
  { value: 'INACTIVE', label: 'Ngưng hoạt động' },
]

export const MERCHANT_STATUS_MAP = MERCHANT_STATUS.reduce(
  (acc, { value, label }) => {
    acc[value] = label
    return acc
  },
  {} as Record<string, string>
)

// Define color mapping for merchant statuses.
// Adjust the color values based on your design requirements.
export const MERCHANT_STATUS_COLOR_MAP: Record<string, string> = {
  WAITING_APPROVE: 'orange',
  WAITING_APPROVAL_FOR_EDIT: 'orange',
  ACTIVE: 'green',
  REJECTED: 'red',
  INACTIVE: 'volcano',
}

export const MASTER_MERCHANT_STATUS_COLOR_MAP: Record<string, string> = {
  WAITING_APPROVE: 'orange',
  WAITING_APPROVAL_FOR_EDIT: 'orange',
  ACTIVE: 'green',
  REJECTED: 'red',
  INACTIVE: 'volcano',
}

export const TRANSACTION_STATUS = [
  { label: 'Thành công', value: 'SUCCESSFUL' },
  { label: 'Thất bại', value: 'FAILED' },
  { label: 'Đang đợi duyệt', value: 'WAITING_APPROVE' },
]
export const TRANSACTION_STATUS_COLOR_MAP: Record<string, string> = {
  SUCCESSFUL: 'green',
  FAILED: 'red',
  WAITING_APPROVE: 'orange',
}

export const TRANSACTION_TYPE = [
  { label: 'Nạp tiền', value: 'DEPOSIT' },
  { label: 'Rút tiền', value: 'WITHDRAW' },
  { label: 'Chuyển tiền', value: 'TRANSFER' },
  { label: 'Thanh toán', value: 'PAYMENT' },
]

export const STAFF_ROLES = [
  { label: 'Quản lý', value: 'STORE_MANAGER' },
  { label: 'Nhân viên', value: 'STORE_EMPLOYEE' },
]

export const STAFF_STATUS = [
  { value: 'WAITING_APPROVE', label: 'Đang đợi duyệt' },
  { value: 'WAITING_APPROVAL_FOR_EDIT', label: 'Chờ duyệt chỉnh sửa' },
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'REJECTED', label: 'Từ chối' },
  { value: 'INACTIVE', label: 'Ngưng hoạt động' },
]

export const STAFF_STATUS_MAP: Record<string, string> = {
  DRAFT: 'Nháp',
  WAITING_APPROVE: 'Đang đợi duyệt',
  WAITING_APPROVAL_FOR_EDIT: 'Chờ duyệt chỉnh sửa',
  ACTIVE: 'Hoạt động',
  REJECTED: 'Từ chối',
  INACTIVE: 'Ngưng hoạt động',
}

export const STAFF_STATUS_COLOR_MAP: Record<string, string> = {
  DRAFT: 'blue',
  WAITING_APPROVE: 'orange',
  WAITING_APPROVAL_FOR_EDIT: 'orange',
  ACTIVE: 'green',
  REJECTED: 'red',
  INACTIVE: 'volcano',
}

export const SYSTEM_ROLES = {
  HDB_CREATION: 'chỉnh sửa',
  HDB_APPROVAL: 'duyệt',
}
