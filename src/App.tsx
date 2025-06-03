import { useNavigate } from 'react-router-dom'

import { useEffect } from 'react'
import axiosInstance, { setNavigate } from '@/config/axios'

import RootRoutes from './Routes'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { routes } from './config/routes'
import { useAuth } from './store/authSlice/useAuth'

function App() {
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(window.location.search)
  const token = queryParams.get('token')
  const { setAuthState } = useAuth()

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
        navigate(routes.masterMerchant, { replace: true })
      } else {
        toast.error(response.data.reason_message)
        throw new Error('Login failed')
      }
    },
  })

  useEffect(() => {
    if (token) {
      loginByTokenMutation.mutate({ token, party_code: 'HDA' })
    }
  }, [token])

  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  return <RootRoutes />
}

export default App
