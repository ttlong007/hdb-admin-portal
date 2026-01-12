import { useState, useEffect, useCallback } from 'react'
import { User, UserFormData, UserListParams } from '../types'
import { toast } from 'react-toastify'
import { userService } from '../services/userService'

export const useUsers = (companyId?: number) => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    total: 0,
    total_pages: 0,
  })
  const [searchTerm, setSearchTerm] = useState('')

  const fetchUsers = useCallback(async (page = 1, search = '', limit = 30) => {
    if (!companyId) return

    setIsLoading(true)
    try {
      const params: UserListParams = {
        company_id: companyId,
        page,
        limit,
      }

      if (search) {
        params.search = search
      }

      const response = await userService.getUsers(params)
      setUsers(response.data)
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        total_pages: response.total_pages,
      })
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng')
    } finally {
      setIsLoading(false)
    }
  }, [companyId])

  useEffect(() => {
    if (companyId) {
      fetchUsers(1, searchTerm, 30)
    }
  }, [companyId, fetchUsers])

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search)
    fetchUsers(1, search, pagination.limit)
  }, [fetchUsers, pagination.limit])

  const handlePageChange = useCallback((page: number) => {
    fetchUsers(page, searchTerm, pagination.limit)
  }, [fetchUsers, searchTerm, pagination.limit])

  const createUser = async (data: UserFormData) => {
    try {
      await userService.createUser(data)
      toast.success('Thêm người dùng thành công!')
      // Refetch current page
      await fetchUsers(pagination.page, searchTerm, pagination.limit)
    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.reason_message || 'Có lỗi xảy ra khi thêm người dùng'
      toast.error(errorMessage)
      throw error
    }
  }

  const updateUser = async (userId: number, data: Partial<UserFormData>) => {
    try {
      await userService.updateUser(userId, data)
      toast.success('Cập nhật người dùng thành công!')
      // Refetch current page
      await fetchUsers(pagination.page, searchTerm, pagination.limit)
    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.reason_message || 'Có lỗi xảy ra khi cập nhật'
      toast.error(errorMessage)
      throw error
    }
  }

  const toggleUserStatus = async (userId: number, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      await userService.toggleUserStatus(userId, status)
      const action = status === 'INACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'
      toast.success(`${action} người dùng thành công!`)
      // Refetch current page
      await fetchUsers(pagination.page, searchTerm, pagination.limit)
    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.reason_message || 'Có lỗi xảy ra khi cập nhật trạng thái'
      toast.error(errorMessage)
      throw error
    }
  }

  const resetPassword = async (userId: number) => {
    try {
      await userService.resetPassword(userId)
      toast.success('Đặt lại mật khẩu thành công!')
    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.reason_message || 'Có lỗi xảy ra khi đặt lại mật khẩu'
      toast.error(errorMessage)
      throw error
    }
  }

  return {
    users,
    isLoading,
    pagination,
    searchTerm,
    createUser,
    updateUser,
    toggleUserStatus,
    resetPassword,
    handleSearch,
    handlePageChange,
    refetch: () => fetchUsers(pagination.page, searchTerm, pagination.limit),
  }
}
