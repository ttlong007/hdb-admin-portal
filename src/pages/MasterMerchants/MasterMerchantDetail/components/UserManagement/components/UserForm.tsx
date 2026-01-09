import React from 'react'
import { Input, Button } from 'rizzui'
import { User, UserFormData } from '../types'
import { useUserForm } from '../hooks/useUserForm'

interface UserFormProps {
  user?: User | null
  companyId?: number
  onSubmit: (data: UserFormData) => void
  onCancel: () => void
}

const UserForm: React.FC<UserFormProps> = ({ user, companyId, onSubmit, onCancel }) => {
  const { formData, errors, handleChange, validate } = useUserForm(user, companyId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Username - Only show when creating */}
      {!user && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Tên đăng nhập <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Nhập tên đăng nhập"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            error={errors.username}
          />
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Nhập họ và tên"
          value={formData.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          error={errors.full_name}
        />
      </div>

      {/* Email - Only show when creating */}
      {!user && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />
        </div>
      )}

      {/* Phone - Only show when creating */}
      {!user && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="0123456789"
            value={formData.phone_number}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            error={errors.phone_number}
          />
        </div>
      )}

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Vai trò <span className="text-red-500">*</span>
        </label>
        <select
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
            errors.role ? 'border-red-500' : 'border-gray-300'
          }`}
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
        >
          <option value="" disabled>Chọn vai trò</option>
          <option value="AG_CREATION">Người tạo</option>
          <option value="AG_APPROVAL">Người duyệt</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-500">{errors.role}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200">
          {user ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </form>
  )
}

export default UserForm
