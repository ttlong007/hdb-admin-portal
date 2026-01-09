import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUserForm } from './useUserForm'
import { User } from '../../types'

describe('useUserForm', () => {
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    full_name: 'Test User',
    email: 'test@example.com',
    phone_number: '0123456789',
    company_id: 1,
    role: 'AG_CREATION',
    status: 'ACTIVE',
  }

  describe('initialization', () => {
    it('should initialize with empty values when no user provided', () => {
      const { result } = renderHook(() => useUserForm(null, 1))

      expect(result.current.formData).toEqual({
        username: '',
        full_name: '',
        email: '',
        phone_number: '',
        company_id: 1,
        role: '',
      })
      expect(result.current.errors).toEqual({})
    })

    it('should initialize with user data when user is provided', () => {
      const { result } = renderHook(() => useUserForm(mockUser))

      expect(result.current.formData).toEqual({
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone_number: '0123456789',
        company_id: 1,
        role: 'AG_CREATION',
      })
    })
  })

  describe('handleChange', () => {
    it('should update form field value', () => {
      const { result } = renderHook(() => useUserForm(null, 1))

      act(() => {
        result.current.handleChange('username', 'newuser')
      })

      expect(result.current.formData.username).toBe('newuser')
    })

    it('should clear error when field is changed', () => {
      const { result } = renderHook(() => useUserForm(null, 1))

      // First trigger validation to set errors
      act(() => {
        result.current.validate()
      })

      expect(result.current.errors.username).toBeDefined()

      // Then change the field
      act(() => {
        result.current.handleChange('username', 'newuser')
      })

      expect(result.current.errors.username).toBe('')
    })
  })

  describe('validation', () => {
    it('should return false and set errors when required fields are empty', () => {
      const { result } = renderHook(() => useUserForm(null, 1))

      let isValid: boolean
      act(() => {
        isValid = result.current.validate()
      })

      expect(isValid!).toBe(false)
      expect(result.current.errors.username).toBe('Vui lòng nhập tên đăng nhập')
      expect(result.current.errors.full_name).toBe('Vui lòng nhập họ tên')
      expect(result.current.errors.email).toBe('Vui lòng nhập email')
      expect(result.current.errors.phone_number).toBe('Vui lòng nhập số điện thoại')
      expect(result.current.errors.role).toBe('Vui lòng chọn vai trò')
    })

    it('should validate email format', () => {
      const { result } = renderHook(() => useUserForm(null, 1))

      act(() => {
        result.current.handleChange('username', 'testuser')
        result.current.handleChange('full_name', 'Test User')
        result.current.handleChange('email', 'invalid-email')
        result.current.handleChange('phone_number', '0123456789')
        result.current.handleChange('role', 'AG_CREATION')
      })

      act(() => {
        result.current.validate()
      })

      expect(result.current.errors.email).toBe('Email không hợp lệ')
    })

    it('should validate phone number format', () => {
      const { result } = renderHook(() => useUserForm(null, 1))

      act(() => {
        result.current.handleChange('username', 'testuser')
        result.current.handleChange('full_name', 'Test User')
        result.current.handleChange('email', 'test@example.com')
        result.current.handleChange('phone_number', '123')
        result.current.handleChange('role', 'AG_CREATION')
      })

      act(() => {
        result.current.validate()
      })

      expect(result.current.errors.phone_number).toBe('Số điện thoại không hợp lệ')
    })

    it('should return true when all fields are valid', () => {
      const { result } = renderHook(() => useUserForm(null, 1))

      act(() => {
        result.current.handleChange('username', 'testuser')
        result.current.handleChange('full_name', 'Test User')
        result.current.handleChange('email', 'test@example.com')
        result.current.handleChange('phone_number', '0123456789')
        result.current.handleChange('role', 'AG_CREATION')
      })

      let isValid: boolean
      act(() => {
        isValid = result.current.validate()
      })

      expect(isValid!).toBe(true)
      expect(result.current.errors).toEqual({})
    })

    it('should accept 10 or 11 digit phone numbers', () => {
      const { result } = renderHook(() => useUserForm(null, 1))

      // Test 10 digits
      act(() => {
        result.current.handleChange('phone_number', '0123456789')
        result.current.handleChange('username', 'test')
        result.current.handleChange('full_name', 'Test')
        result.current.handleChange('email', 'test@example.com')
        result.current.handleChange('role', 'AG_CREATION')
      })

      let isValid: boolean
      act(() => {
        isValid = result.current.validate()
      })

      expect(isValid!).toBe(true)
      expect(result.current.errors.phone_number).toBeUndefined()

      // Test 11 digits
      act(() => {
        result.current.handleChange('phone_number', '01234567890')
      })

      act(() => {
        isValid = result.current.validate()
      })

      expect(isValid!).toBe(true)
      expect(result.current.errors.phone_number).toBeUndefined()
    })
  })
})
