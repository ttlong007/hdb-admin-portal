import React, { useState } from 'react'
import { Input, Button, Text } from 'rizzui'
import { Pagination } from 'antd'
import { PiPlusBold, PiMagnifyingGlass, PiLockKey, PiToggleLeft, PiToggleRight } from 'react-icons/pi'
import Card from '@/components/core/components/Card'
import { useUsers } from '../hooks/useUsers'
import { useParams } from 'react-router-dom'
import { User } from '../types'
import UserForm from './UserForm'
import UserTable from './UserTable'
import CustomModal from './CustomModal'

const UserManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const companyId = id ? parseInt(id) : undefined
  const {
    users,
    isLoading,
    pagination,
    createUser,
    updateUser,
    toggleUserStatus,
    resetPassword,
    handleSearch,
    handlePageChange,
  } = useUsers(companyId)

  const [searchInput, setSearchInput] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = useState(false)
  const [userToToggleStatus, setUserToToggleStatus] = useState<User | null>(null)
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null)

  const handleSearchSubmit = () => {
    handleSearch(searchInput)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selectedUser) {
        // Chỉ gửi full_name và role khi update
        await updateUser(selectedUser.id, {
          full_name: data.full_name,
          role: data.role,
        })
      } else {
        await createUser(data)
      }
      handleCloseModal()
    } catch (error) {
      // Error already handled in hook
    }
  }

  const handleToggleStatus = async () => {
    if (userToToggleStatus) {
      try {
        const newStatus = userToToggleStatus.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        await toggleUserStatus(userToToggleStatus.id, newStatus)
        setIsToggleStatusModalOpen(false)
        setUserToToggleStatus(null)
      } catch (error) {
        // Error already handled in hook
      }
    }
  }

  const handleOpenCreate = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleOpenToggleStatusModal = (user: User) => {
    setUserToToggleStatus(user)
    setIsToggleStatusModalOpen(true)
  }

  const handleCloseToggleStatusModal = () => {
    setIsToggleStatusModalOpen(false)
    setUserToToggleStatus(null)
  }

  const handleOpenResetPasswordModal = (user: User) => {
    setUserToResetPassword(user)
    setIsResetPasswordModalOpen(true)
  }

  const handleCloseResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false)
    setUserToResetPassword(null)
  }

  const handleResetPassword = async () => {
    if (userToResetPassword) {
      try {
        await resetPassword(userToResetPassword.id)
        setIsResetPasswordModalOpen(false)
        setUserToResetPassword(null)
      } catch (error) {
        // Error already handled in hook
      }
    }
  }

  return (
    <>
      <Card>
        {/* Header */}
        <div className="border-b border-gray-200 pb-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quản lý người dùng</h2>
              <p className="mt-1 text-sm text-gray-500">
                Tổng số: <span className="font-medium text-gray-900">{pagination.total}</span> người dùng
              </p>
            </div>
            <Button
              onClick={handleOpenCreate}
              className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap transition-colors duration-200 shadow-sm"
            >
              <PiPlusBold className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="Tìm kiếm theo email, username, fullname..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              prefix={<PiMagnifyingGlass className="h-4 w-4 text-gray-500" />}
              className="flex-1"
            />
            <Button
              onClick={handleSearchSubmit}
              variant="outline"
              className="hover:bg-gray-100"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <UserTable
          users={users}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onToggleStatus={handleOpenToggleStatusModal}
          onResetPassword={handleOpenResetPasswordModal}
        />

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={pagination.page}
              total={pagination.total}
              pageSize={pagination.limit}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        size="xl"
      >
        <UserForm
          user={selectedUser}
          companyId={companyId}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </CustomModal>

      {/* Toggle Status Confirmation Modal */}
      <CustomModal
        isOpen={isToggleStatusModalOpen}
        onClose={handleCloseToggleStatusModal}
        title={userToToggleStatus?.status === 'ACTIVE' ? 'Xác nhận vô hiệu hóa' : 'Xác nhận kích hoạt'}
        size="md"
      >
        <div>
          <div className="flex items-start gap-3 mb-4">
            <div
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
                userToToggleStatus?.status === 'ACTIVE'
                  ? 'bg-red-100'
                  : 'bg-green-100'
              }`}
            >
              {userToToggleStatus?.status === 'ACTIVE' ? (
                <PiToggleRight className="h-5 w-5 text-red-600" />
              ) : (
                <PiToggleLeft className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {userToToggleStatus?.status === 'ACTIVE'
                  ? 'Xác nhận vô hiệu hóa'
                  : 'Xác nhận kích hoạt'}
              </h3>
              <Text className="text-gray-600">
                Bạn có chắc chắn muốn{' '}
                {userToToggleStatus?.status === 'ACTIVE'
                  ? 'vô hiệu hóa'
                  : 'kích hoạt'}{' '}
                người dùng{' '}
                <span className="font-semibold">{userToToggleStatus?.full_name}</span>?
              </Text>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handleCloseToggleStatusModal}>
              Hủy
            </Button>
            <Button
              onClick={handleToggleStatus}
              className={
                userToToggleStatus?.status === 'ACTIVE'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }
            >
              {userToToggleStatus?.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
            </Button>
          </div>
        </div>
      </CustomModal>

      {/* Reset Password Confirmation Modal */}
      <CustomModal
        isOpen={isResetPasswordModalOpen}
        onClose={handleCloseResetPasswordModal}
        title="Xác nhận đặt lại mật khẩu"
        size="md"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100">
            <PiLockKey className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-600">
              Bạn có chắc chắn muốn đặt lại mật khẩu cho người dùng{' '}
              <span className="font-semibold">{userToResetPassword?.full_name}</span>?
              <br />
              Mật khẩu mới sẽ được gửi qua email.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleCloseResetPasswordModal}>
            Hủy
          </Button>
          <Button onClick={handleResetPassword} className="bg-yellow-600 hover:bg-yellow-700">
            Đặt lại mật khẩu
          </Button>
        </div>
      </CustomModal>
    </>
  )
}

export default UserManagement
