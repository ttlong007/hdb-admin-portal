import axiosInstance from '@/config/axios'
import { User, UserFormData, UserListParams, UserListResponse } from '../types'

export const userService = {
  // Get all agent managers with pagination and search
  async getUsers(params: UserListParams): Promise<UserListResponse> {
    try {
      const response = await axiosInstance.post('/v1/admin/agent-manager/list', params)

      if (response.data.status_code === 'ACCEPT') {
        const pageData = response.data.page_data || {}
        return {
          data: response.data.data || [],
          total: pageData.total || 0,
          page: pageData.page || params.page || 1,
          limit: pageData.limit || params.limit || 30,
          total_pages: Math.ceil((pageData.total || 0) / (pageData.limit || 30)),
        }
      }

      throw new Error(response.data.reason_message || 'Failed to fetch users')
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    try {
      const response = await axiosInstance.get(`/v1/admin/agent-manager/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  // Create new agent manager
  async createUser(data: UserFormData): Promise<User> {
    try {
      const response = await axiosInstance.post('/v1/admin/agent-manager/create', data)
      return response.data.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  // Update agent manager
  async updateUser(id: number, data: Partial<UserFormData>): Promise<User> {
    try {
      const response = await axiosInstance.patch(`/v1/admin/agent-manager/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  // Toggle user status (activate/deactivate)
  async toggleUserStatus(id: number, status: 'ACTIVE' | 'INACTIVE'): Promise<void> {
    try {
      await axiosInstance.patch(`/v1/admin/agent-manager/${id}`, { status })
    } catch (error) {
      console.error('Error updating user status:', error)
      throw error
    }
  },

  // Reset password
  async resetPassword(id: number): Promise<void> {
    try {
      await axiosInstance.post('/v1/admin/agent-manager/reset-password', { id })
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  },
}
