import { vi } from 'vitest'
import { User } from '@/pages/MasterMerchants/MasterMerchantDetail/components/UserManagement/types'

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'testuser1',
    full_name: 'Test User One',
    email: 'test1@example.com',
    phone_number: '0123456789',
    company_id: 1,
    role: 'AG_CREATION',
    status: 'ACTIVE',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'testuser2',
    full_name: 'Test User Two',
    email: 'test2@example.com',
    phone_number: '0987654321',
    company_id: 1,
    role: 'AG_APPROVAL',
    status: 'INACTIVE',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    username: 'adminuser',
    full_name: 'Admin User',
    email: 'admin@example.com',
    phone_number: '0111222333',
    company_id: 1,
    role: 'AG_ADMIN',
    status: 'ACTIVE',
    created_at: '2024-01-03T00:00:00Z',
  },
]

export const mockUserService = {
  getUsers: vi.fn().mockResolvedValue(mockUsers),
  getUserById: vi.fn().mockResolvedValue(mockUsers[0]),
  createUser: vi.fn().mockResolvedValue({ id: 4, ...mockUsers[0] }),
  updateUser: vi.fn().mockResolvedValue(mockUsers[0]),
  toggleUserStatus: vi.fn().mockResolvedValue({ ...mockUsers[0], status: 'INACTIVE' }),
  resetPassword: vi.fn().mockResolvedValue({ success: true }),
  searchUsers: vi.fn().mockResolvedValue(mockUsers),
}
