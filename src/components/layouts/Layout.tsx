/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import GlobalDrawer from '../core/shared/drawer-views/container'
import GlobalModal from '../core/shared/modal-views/container'
import HydrogenLayout from './hydrogen/layout'
import Atom from '../core/components/AtomLoading'
import { useAuth } from '@/store/authSlice/useAuth'
import { getEnv } from '@/config/env'

const Layout = () => {
  const { isAuthenticated, setAuthState } = useAuth() // Assuming you have a setter to update auth state

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
          {!localStorage.getItem('accessToken') ? (
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
