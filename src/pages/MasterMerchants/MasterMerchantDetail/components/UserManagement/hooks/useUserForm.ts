import { useState } from 'react'
import { User, UserFormData } from '../types'

export const useUserForm = (user?: User | null, companyId?: number) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: user?.username || '',
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    company_id: user?.company_id || companyId || 0,
    role: user?.role || '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})

  const handleChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập'
    }
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Vui lòng nhập họ tên'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Vui lòng nhập số điện thoại'
    } else if (!/^[0-9]{10,11}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ'
    }
    if (!formData.company_id || formData.company_id === 0) {
      newErrors.company_id = 'Vui lòng chọn công ty'
    }
    if (!formData.role.trim()) {
      newErrors.role = 'Vui lòng chọn vai trò'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return {
    formData,
    errors,
    handleChange,
    validate,
  }
}
