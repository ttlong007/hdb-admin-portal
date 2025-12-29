import { useNavigate } from 'react-router-dom'

import { useEffect, useRef, useState } from 'react'
import axiosInstance, { setNavigate } from '@/config/axios'

import RootRoutes from './Routes'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { routes } from './config/routes'
import { useAuth } from './store/authSlice/useAuth'
import { Spin } from 'antd'

function App() {
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(window.location.search)
  const token = queryParams.get('token')
  const { setAuthState } = useAuth()
  const loginAttempted = useRef(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const loginByTokenMutation = useMutation({
    mutationFn: async (data: { token: string; party_code: string }) => {
      const response = await axiosInstance.post(
        '/v1/admin/auth/login-by-token',
        data
      )
      if (response.data.status_code === 'ACCEPT') {
        setAuthState({
          isAuthenticated: true,
        })
        localStorage.setItem('accessToken', response.data.data.access_token)
        localStorage.setItem('refreshToken', response.data.data.refresh_token)

        // Remove token from URL before navigating
        const url = new URL(window.location.href)
        url.searchParams.delete('token')
        window.history.replaceState({}, '', url.pathname + url.search)

        // Set logging in to false before navigating
        setIsLoggingIn(false)
        navigate(routes.masterMerchant, { replace: true })
      } else {
        toast.error(response.data.reason_message)
        setIsLoggingIn(false)
        navigate(routes.unauthorize, { replace: true })
        throw new Error('Login failed')
      }
    },
  })

  useEffect(() => {
    if (token && !loginAttempted.current) {
      loginAttempted.current = true
      setIsLoggingIn(true)
      loginByTokenMutation.mutate({ token, party_code: 'HDA' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  return isLoggingIn ? (
    <div className="flex items-center justify-center min-h-screen">
      <Spin size="large" />
    </div>
  ) : (
    <RootRoutes />
  )
}

export default App
