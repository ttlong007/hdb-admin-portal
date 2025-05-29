import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'
import { getEnv } from './env'
import { store } from '@/store'
import { setState } from '../store/authSlice'

interface ErrorResponse {
  status_code: string
  reason_code: string
  reason_message: string
}

// Create a navigation utility
let navigate: any = null
export const setNavigate = (nav: any) => {
  navigate = nav
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getEnv('VITE_API_URL', 'http://localhost:4000'),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to dynamically inject Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    if (
      error.response?.status === 401 &&
      !(error.config as any).__isRetryRequest
    ) {
      ;(error.config as any).__isRetryRequest = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const refreshResponse = await axiosInstance.post(
            '/v1/admin/auth/refresh-token',
            {
              refresh_token: refreshToken,
              user_id: store.getState().auth?.user?.id,
            }
          )

          if (refreshResponse.data.status_code === 'ACCEPT') {
            const newAccessToken = refreshResponse.data.data.access_token
            localStorage.setItem('accessToken', newAccessToken)
            if (error.config) {
              error.config.headers = error.config.headers || {}
              error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
            }

            // Optionally update global axios default if you want
            axiosInstance.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${newAccessToken}`

            return axiosInstance.request(error.config as AxiosRequestConfig)
          } else {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            store.dispatch(setState({ user: null }))
            return Promise.reject(refreshResponse.data.reason_message)
          }
        } catch (refreshError) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          store.dispatch(setState({ user: null }))
          console.error('Refresh token error:', refreshError)
          return Promise.reject(refreshError)
        }
      } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        store.dispatch(setState({ user: null }))
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
