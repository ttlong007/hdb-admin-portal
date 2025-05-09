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
    const accessToken = store.getState().auth?.accessToken
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
    // Handle 403 unauthorized access
    // if (
    //   error.response?.status === 403 &&
    //   error.response?.data?.status_code === 'REJECT' &&
    //   error.response?.data?.reason_code === 'unauthorized'
    // ) {
    //   store.dispatch(
    //     setState({ accessToken: null, refreshToken: null, user: null })
    //   )
    //   navigate?.('/unauthorize')
    //   return Promise.reject(error)
    // }

    if (
      error.response?.status === 401 &&
      !(error.config as any).__isRetryRequest
    ) {
      ;(error.config as any).__isRetryRequest = true

      const { refreshToken } = store.getState().auth || {}
      console.log('refreshToken', refreshToken)
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
            // Update store
            store.dispatch(
              setState({
                accessToken: newAccessToken,
              })
            )
            // Update original request header before retrying
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
            // Clear auth state and redirect to unauthorized page
            store.dispatch(
              setState({ accessToken: null, refreshToken: null, user: null })
            )
            navigate?.('/unauthorize')
            return Promise.reject(refreshResponse.data.reason_message)
          }
        } catch (refreshError) {
          // Clear auth state and redirect to unauthorized page
          store.dispatch(
            setState({ accessToken: null, refreshToken: null, user: null })
          )
          navigate?.('/unauthorize')
          console.error('Refresh token error:', refreshError)
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token available, clear auth and redirect
        store.dispatch(
          setState({ accessToken: null, refreshToken: null, user: null })
        )
        navigate?.('/unauthorize')
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
