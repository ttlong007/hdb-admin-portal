/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import GlobalDrawer from '../core/shared/drawer-views/container'
import GlobalModal from '../core/shared/modal-views/container'
import HydrogenLayout from './hydrogen/layout'
import Atom from '../core/components/AtomLoading'
import { useAuth } from '@/store/authSlice/useAuth'
import { getEnv } from '@/config/env'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/config/axios'
import { routes } from '@/config/routes'
import { toast } from 'react-toastify'

const Layout = () => {
  const { isAuthenticated, setAuthState } = useAuth() // Assuming you have a setter to update auth state
  const queryParams = new URLSearchParams(window.location.search)
  const token = queryParams.get('token')
  const navigate = useNavigate()

  const loginByTokenMutation = useMutation({
    mutationFn: async (data: { token: string; party_code: string }) => {
      const response = await axiosInstance.post(
        '/v1/admin/auth/login-by-token',
        data
      )
      if (response.data.status_code === 'ACCEPT') {
        localStorage.setItem('accessToken', response.data.data.access_token)
        localStorage.setItem('refreshToken', response.data.data.refresh_token)
        navigate(routes.masterMerchant, { replace: true })
      } else {
        toast.error(response.data.reason_message)
        throw new Error('Login failed')
      }
    },
  })

  React.useEffect(() => {
    if (token ) {
      loginByTokenMutation.mutate({ token, party_code: 'HDA' })
    }
  }, [token])

  const handleLogin = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setAuthState({
      objectKeyStaff: null,
      objectKeyMerchant: null,
    })
    const ROOT_CALLBACK_URL = getEnv(
      'VITE_ROOT_CALLBACK_URL',
      'https://ungdung.hdbank.com.vn/Login'
    )
    window.location.replace(
      ROOT_CALLBACK_URL || 'https://ungdung.hdbank.com.vn/Login'
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="mt-10 flex flex-col items-center">
          <Atom size={200} color="#FC0101" animationDuration="700" />
          {!token ? (
            <button
              className="bg-[#e59a1b] hover:bg-[#cb7614] text-[#713716] hover:text-[#faf1cb] mt-5 px-4 py-2 rounded-md text-lg font-semibold cursor-pointer"
              onClick={handleLogin}
            >
              Đăng nhập
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <HydrogenLayout>
      <Outlet />
      <GlobalDrawer />
      <GlobalModal />
    </HydrogenLayout>
  )
}

export default Layout
