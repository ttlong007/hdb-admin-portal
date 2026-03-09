import React from 'react'
import { Input, Button } from 'rizzui'
import Select from 'react-select'
import { User, UserFormData } from '../types'
import { useUserForm } from '../hooks/useUserForm'
import { useStores } from '@/hooks/useStores'

interface UserFormProps {
  user?: User | null
  companyId?: number
  onSubmit: (data: UserFormData) => void
  onCancel: () => void
}

const UserForm: React.FC<UserFormProps> = ({ user, companyId, onSubmit, onCancel }) => {
  const { formData, errors, handleChange, validate } = useUserForm(user, companyId)
  const { data: stores = [], isLoading: isLoadingStores } = useStores(companyId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // Strip store_id if not selected
      const submitData = { ...formData }
      if (!submitData.store_id) {
        delete submitData.store_id
      }
      onSubmit(submitData)
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

      {/* Chi nhánh */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Chi nhánh
        </label>
        <Select
          options={stores}
          value={stores.find((s) => s.value === formData.store_id) || null}
          onChange={(option) => handleChange('store_id', option ? option.value : 0)}
          isLoading={isLoadingStores}
          placeholder={isLoadingStores ? 'Đang tải...' : 'Chọn chi nhánh'}
          isClearable
          isSearchable
          noOptionsMessage={() => 'Không tìm thấy chi nhánh'}
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: state.isFocused ? '#ef4444' : '#d1d5db',
              boxShadow: state.isFocused ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
              '&:hover': { borderColor: '#ef4444' },
              borderRadius: '0.375rem',
              minHeight: '38px',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? '#ef4444' : state.isFocused ? '#fee2e2' : 'white',
              color: state.isSelected ? 'white' : '#111827',
            }),
          }}
        />
      </div>

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
          <option value="AG_VIEW">Người xem</option>
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
