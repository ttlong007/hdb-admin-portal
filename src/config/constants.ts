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
  { value: 'draft', label: 'Nháp' },
  { value: 'waiting_approve', label: 'Đang đợi duyệt' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'inactive', label: 'Ngưng hoạt động' },
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
  draft: '', // Defaults to Antd's standard tag styling when no color is provided.
  waiting_approve: 'orange',
  active: 'green',
  rejected: 'red',
  inactive: 'volcano',
}