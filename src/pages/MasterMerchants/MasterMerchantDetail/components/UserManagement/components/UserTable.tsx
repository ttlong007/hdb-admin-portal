import React from 'react'
import { ActionIcon } from 'rizzui'
import { PiPencilSimple, PiLockKey, PiToggleLeft, PiToggleRight } from 'react-icons/pi'
import { User } from '../types'

interface UserTableProps {
  users: User[]
  isLoading?: boolean
  onEdit: (user: User) => void
  onToggleStatus: (user: User) => void
  onResetPassword: (user: User) => void
}

const UserTable: React.FC<UserTableProps> = ({ users, isLoading, onEdit, onToggleStatus, onResetPassword }) => {
  const getRoleName = (role: string) => {
    const roleMap: Record<string, string> = {
      AG_CREATION: 'Người tạo',
      AG_APPROVAL: 'Người duyệt',
      AG_ADMIN: 'Quản trị viên',
    }
    return roleMap[role] || role
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              STT
            </th>
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Tên đăng nhập
            </th>
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Họ và tên
            </th>
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </th>
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Số điện thoại
            </th>
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Vai trò
            </th>
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                  <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                </div>
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Không tìm thấy người dùng nào</p>
                  <p className="text-sm text-gray-500">Thử tìm kiếm với từ khóa khác hoặc thêm người dùng mới</p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6 text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-medium text-gray-900">{user.username}</span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">
                  {user.full_name}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {user.phone_number}
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{getRoleName(user.role)}</span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.status === 'ACTIVE' ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center gap-2">
                    <ActionIcon
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(user)}
                      aria-label="Chỉnh sửa"
                      title="Chỉnh sửa"
                      className="hover:bg-red-50 hover:border-red-500 transition-colors"
                    >
                      <PiPencilSimple className="h-4 w-4 text-gray-600" />
                    </ActionIcon>

                    <ActionIcon
                      size="sm"
                      variant="outline"
                      onClick={() => onResetPassword(user)}
                      aria-label="Đặt lại mật khẩu"
                      title="Đặt lại mật khẩu"
                      className="hover:bg-yellow-50 hover:border-yellow-500 transition-colors"
                    >
                      <PiLockKey className="h-4 w-4 text-gray-600" />
                    </ActionIcon>

                    <ActionIcon
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleStatus(user)}
                      aria-label={user.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      title={user.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      className={
                        user.status === 'ACTIVE'
                          ? 'hover:bg-red-50 hover:border-red-500 transition-colors'
                          : 'hover:bg-green-50 hover:border-green-500 transition-colors'
                      }
                    >
                      {user.status === 'ACTIVE' ? (
                        <PiToggleRight className="h-4 w-4 text-gray-600" />
                      ) : (
                        <PiToggleLeft className="h-4 w-4 text-gray-600" />
                      )}
                    </ActionIcon>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
