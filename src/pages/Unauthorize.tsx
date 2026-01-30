import React from 'react'

import Atom from '@/components/core/components/AtomLoading'
import { useAuth } from '@/store/authSlice/useAuth'
import { getEnv } from '@/config/env'

const Unauthorize: React.FC = () => {
  const { setAuthState } = useAuth()

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

  return (
    <div className="h-[100vh] flex flex-col items-center justify-center">
      <div className="mt-10 flex flex-col items-center">
        <Atom size={200} color="#FC0101" animationDuration="700" />
        <p className="text-gray-600 mt-4 text-lg">Bạn không có quyền truy cập</p>

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

export default Unauthorize
