import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserTable from './UserTable'
import { User } from '../../types'

describe('UserTable', () => {
  const mockOnEdit = vi.fn()
  const mockOnToggleStatus = vi.fn()
  const mockOnResetPassword = vi.fn()

  const mockUsers: User[] = [
    {
      id: 1,
      username: 'user1',
      full_name: 'User One',
      email: 'user1@example.com',
      phone_number: '0123456789',
      company_id: 1,
      role: 'AG_CREATION',
      status: 'ACTIVE',
    },
    {
      id: 2,
      username: 'user2',
      full_name: 'User Two',
      email: 'user2@example.com',
      phone_number: '0987654321',
      company_id: 1,
      role: 'AG_APPROVAL',
      status: 'INACTIVE',
    },
    {
      id: 3,
      username: 'admin',
      full_name: 'Admin User',
      email: 'admin@example.com',
      phone_number: '0111222333',
      company_id: 1,
      role: 'AG_ADMIN',
      status: 'ACTIVE',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render table headers', () => {
      render(
        <UserTable
          users={mockUsers}
          onEdit={mockOnEdit}
          onToggleStatus={mockOnToggleStatus}
          onResetPassword={mockOnResetPassword}
        />
      )

      expect(screen.getByText('STT')).toBeInTheDocument()
      expect(screen.getByText('Tên đăng nhập')).toBeInTheDocument()
      expect(screen.getByText('Họ và tên')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Số điện thoại')).toBeInTheDocument()
      expect(screen.getByText('Vai trò')).toBeInTheDocument()
      expect(screen.getByText('Trạng thái')).toBeInTheDocument()
      expect(screen.getByText('Thao tác')).toBeInTheDocument()
    })

    it('should render all users', () => {
      render(
        <UserTable
          users={mockUsers}
          onEdit={mockOnEdit}
          onToggleStatus={mockOnToggleStatus}
          onResetPassword={mockOnResetPassword}
        />
      )

      expect(screen.getByText('user1')).toBeInTheDocument()
      expect(screen.getByText('User One')).toBeInTheDocument()
      expect(screen.getByText('user2')).toBeInTheDocument()
      expect(screen.getByText('User Two')).toBeInTheDocument()
      expect(screen.getByText('admin')).toBeInTheDocument()
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })

    it('should show empty message when no users', () => {
      render(
        <UserTable
          users={[]}
          onEdit={mockOnEdit}
          onToggleStatus={mockOnToggleStatus}
          onResetPassword={mockOnResetPassword}
        />
      )

      expect(screen.getByText('Không tìm thấy người dùng nào')).toBeInTheDocument()
    })

    it('should display correct status badges', () => {
      render(
        <UserTable
          users={mockUsers}
          onEdit={mockOnEdit}
          onToggleStatus={mockOnToggleStatus}
          onResetPassword={mockOnResetPassword}
        />
      )

      const activeBadges = screen.getAllByText('Đang hoạt động')
      const inactiveBadges = screen.getAllByText('Vô hiệu hóa')

      expect(activeBadges).toHaveLength(2) // 2 active users
      expect(inactiveBadges).toHaveLength(1) // 1 inactive user
    })

    it('should display correct role labels', () => {
      render(
        <UserTable
          users={mockUsers}
          onEdit={mockOnEdit}
          onToggleStatus={mockOnToggleStatus}
          onResetPassword={mockOnResetPassword}
        />
      )

      expect(screen.getByText('Người tạo')).toBeInTheDocument()
      expect(screen.getByText('Người duyệt')).toBeInTheDocument()
      expect(screen.getByText('Quản trị viên')).toBeInTheDocument()
    })
  })

  describe('action buttons', () => {
    it('should call onEdit when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <UserTable
          users={mockUsers}
          onEdit={mockOnEdit}
          onToggleStatus={mockOnToggleStatus}
          onResetPassword={mockOnResetPassword}
        />
      )

      // Get all edit buttons (should be 3, one for each user)
      const editButtons = screen.getAllByLabelText(/Chỉnh sửa/i)
      await user.click(editButtons[0])

      expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0])
    })

    it('should call onResetPassword when reset password button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <UserTable
          users={mockUsers}
          onEdit={mockOnEdit}
          onToggleStatus={mockOnToggleStatus}
          onResetPassword={mockOnResetPassword}
        />
      )

      const resetButtons = screen.getAllByLabelText(/Đặt lại mật khẩu/i)
      await user.click(resetButtons[0])

      expect(mockOnResetPassword).toHaveBeenCalledWith(mockUsers[0])
    })

    it('should call onToggleStatus when toggle status button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <UserTable
          users={mockUsers}
          onEdit={mockOnEdit}
          onToggleStatus={mockOnToggleStatus}
          onResetPassword={mockOnResetPassword}
        />
      )

      const toggleButtons = screen.getAllByLabelText(/Vô hiệu hóa|Kích hoạt/i)
      await user.click(toggleButtons[0])

      expect(mockOnToggleStatus).toHaveBeenCalledWith(mockUsers[0])
    })
  })

  describe('row numbering', () => {
    it('should display correct row numbers (STT)', () => {
      render(
        <UserTable
          users={mockUsers}
          onEdit={mockOnEdit}
          onToggleStatus={mockOnToggleStatus}
          onResetPassword={mockOnResetPassword}
        />
      )

      const rows = screen.getAllByRole('row')
      // First row is header, so data rows start from index 1
      expect(rows[1]).toHaveTextContent('1')
      expect(rows[2]).toHaveTextContent('2')
      expect(rows[3]).toHaveTextContent('3')
    })
  })
})
