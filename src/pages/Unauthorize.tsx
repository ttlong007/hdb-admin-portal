import React from 'react'

import Atom from '@/components/core/components/AtomLoading'
import { getEnv } from '@/config/env'
import { useAuth } from '@/store/authSlice/useAuth'
import { routes } from '@/config/routes'
import { useNavigate } from 'react-router-dom'

const Unauthorize: React.FC = () => {
  const { setAuthState } = useAuth()
  const navigate = useNavigate()
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
    <div className="h-[90%] flex flex-col items-center justify-center">
      <div className="mt-10 flex flex-col items-center">
        <Atom size={200} color="#FC0101" animationDuration="700" />
      </div>
    </div>
  )
}

export default Unauthorize
