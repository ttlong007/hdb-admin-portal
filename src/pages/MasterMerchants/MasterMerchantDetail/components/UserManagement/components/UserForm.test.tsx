import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserForm from './UserForm'
import { User } from '../../types'

describe('UserForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()
  const companyId = 1

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render all form fields when creating new user', () => {
      render(
        <UserForm
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByPlaceholderText(/Nhập tên đăng nhập/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Nhập họ và tên/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/example@email.com/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/0123456789/i)).toBeInTheDocument()
      expect(screen.getByText(/Chọn vai trò/i)).toBeInTheDocument()
    })

    it('should only render name and role fields when editing user', () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone_number: '0123456789',
        company_id: 1,
        role: 'AG_CREATION',
        status: 'ACTIVE',
      }

      render(
        <UserForm
          user={user}
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      // Should only have name and role
      expect(screen.getByPlaceholderText(/Nhập họ và tên/i)).toBeInTheDocument()
      expect(screen.getByText(/Chọn vai trò/i)).toBeInTheDocument()

      // Should NOT have username, email, phone
      expect(screen.queryByPlaceholderText(/Nhập tên đăng nhập/i)).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText(/example@email.com/i)).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText(/0123456789/i)).not.toBeInTheDocument()
    })

    it('should show "Thêm mới" button when creating new user', () => {
      render(
        <UserForm
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByRole('button', { name: /Thêm mới/i })).toBeInTheDocument()
    })

    it('should show "Cập nhật" button when editing user', () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone_number: '0123456789',
        company_id: 1,
        role: 'AG_CREATION',
        status: 'ACTIVE',
      }

      render(
        <UserForm
          user={user}
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      expect(screen.getByRole('button', { name: /Cập nhật/i })).toBeInTheDocument()
    })

    it('should not show username field when editing', () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone_number: '0123456789',
        company_id: 1,
        role: 'AG_CREATION',
        status: 'ACTIVE',
      }

      render(
        <UserForm
          user={user}
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      // Username field should not be rendered when editing
      expect(screen.queryByPlaceholderText(/Nhập tên đăng nhập/i)).not.toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    it('should update input values on change', async () => {
      const user = userEvent.setup()
      render(
        <UserForm
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const usernameInput = screen.getByPlaceholderText(/Nhập tên đăng nhập/i)
      await user.type(usernameInput, 'newuser')

      expect(usernameInput).toHaveValue('newuser')
    })

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <UserForm
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const cancelButton = screen.getByRole('button', { name: /Hủy/i })
      await user.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('form validation', () => {
    it('should show validation errors when submitting empty form', async () => {
      const user = userEvent.setup()
      render(
        <UserForm
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const submitButton = screen.getByRole('button', { name: /Thêm mới/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Vui lòng nhập tên đăng nhập/i)).toBeInTheDocument()
        expect(screen.getByText(/Vui lòng nhập họ tên/i)).toBeInTheDocument()
        expect(screen.getByText(/Vui lòng nhập email/i)).toBeInTheDocument()
        expect(screen.getByText(/Vui lòng nhập số điện thoại/i)).toBeInTheDocument()
        expect(screen.getByText(/Vui lòng chọn vai trò/i)).toBeInTheDocument()
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it.skip('should show email validation error for invalid email', async () => {
      const user = userEvent.setup()
      render(
        <UserForm
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      // Fill all fields except email with invalid format
      await user.type(screen.getByPlaceholderText(/Nhập tên đăng nhập/i), 'testuser')
      await user.type(screen.getByPlaceholderText(/Nhập họ và tên/i), 'Test User')
      await user.type(screen.getByPlaceholderText(/example@email.com/i), 'invalid-email')
      await user.type(screen.getByPlaceholderText(/0123456789/i), '0987654321')

      const roleSelect = screen.getByRole('combobox')
      fireEvent.change(roleSelect, { target: { value: 'AG_CREATION' } })

      const submitButton = screen.getByRole('button', { name: /Thêm mới/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Email không hợp lệ/i)).toBeInTheDocument()
      })
    })

    it('should show phone validation error for invalid phone', async () => {
      const user = userEvent.setup()
      render(
        <UserForm
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const phoneInput = screen.getByPlaceholderText(/0123456789/i)
      await user.type(phoneInput, '123')

      const submitButton = screen.getByRole('button', { name: /Thêm mới/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Số điện thoại không hợp lệ/i)).toBeInTheDocument()
      })
    })

    it('should submit form when all fields are valid', async () => {
      const user = userEvent.setup()
      render(
        <UserForm
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      // Fill in all fields
      await user.type(screen.getByPlaceholderText(/Nhập tên đăng nhập/i), 'testuser')
      await user.type(screen.getByPlaceholderText(/Nhập họ và tên/i), 'Test User')
      await user.type(screen.getByPlaceholderText(/example@email.com/i), 'test@example.com')
      await user.type(screen.getByPlaceholderText(/0123456789/i), '0123456789')

      const roleSelect = screen.getByRole('combobox')
      await user.selectOptions(roleSelect, 'AG_CREATION')

      const submitButton = screen.getByRole('button', { name: /Thêm mới/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          username: 'testuser',
          full_name: 'Test User',
          email: 'test@example.com',
          phone_number: '0123456789',
          company_id: companyId,
          role: 'AG_CREATION',
        })
      })
    })
  })

  describe('role selection', () => {
    it('should have all role options available', () => {
      render(
        <UserForm
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const roleSelect = screen.getByRole('combobox')
      const options = roleSelect.querySelectorAll('option')

      expect(options).toHaveLength(4) // placeholder + 3 roles
      expect(options[0]).toHaveTextContent('Chọn vai trò')
      expect(options[1]).toHaveTextContent('Người tạo')
      expect(options[2]).toHaveTextContent('Người duyệt')
      expect(options[3]).toHaveTextContent('Quản trị viên')
    })

    it('should show error state on role select when validation fails', async () => {
      const user = userEvent.setup()
      render(
        <UserForm
          companyId={companyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      const submitButton = screen.getByRole('button', { name: /Thêm mới/i })
      await user.click(submitButton)

      await waitFor(() => {
        const roleSelect = screen.getByRole('combobox')
        expect(roleSelect).toHaveClass('border-red-500')
      })
    })
  })
})
