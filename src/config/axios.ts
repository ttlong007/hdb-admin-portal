import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'
import { getEnv } from './env'
import { store } from '@/store'
import { setState } from '../store/authSlice'
import { routes } from './routes'

interface ErrorResponse {
  status_code: string
  reason_code: string
  reason_message: string
}

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

// --- Token refresh queue state ---
let isRefreshing = false
let failedQueue: {
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
    }
  })
  failedQueue = []
}

const logoutAndRedirect = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  store.dispatch(setState({ user: null, isAuthenticated: false }))
  if (navigate) {
    navigate(routes.unauthorize)
  }
}

// Request interceptor for Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor with refresh logic + queue
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { __isRetryRequest?: boolean }

    // Handle network errors (CORS, Network failure, etc.)
    if (!error.response) {
      // No response means network error, CORS, or server down
      // Only logout if user was supposed to be authenticated
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        console.error('Network error or CORS issue detected:', error.message)
        // Don't logout immediately for network errors as they might be temporary
        // Just reject the error and let the component handle it
      }
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      // Check if no access token is available - then logout immediately
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        logoutAndRedirect()
        return Promise.reject(error)
      }

      // If we have access token and get 401, try to refresh
      if (!originalRequest.__isRetryRequest) {
        if (isRefreshing) {
          try {
            const token = await new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`
            }
            originalRequest.__isRetryRequest = true
            return axiosInstance(originalRequest)
          } catch (err) {
            return Promise.reject(err)
          }
        }

        isRefreshing = true

        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          logoutAndRedirect()
          processQueue(error, null)
          isRefreshing = false
          return Promise.reject(error)
        }

        try {
          const refreshResponse = await axios.post(
            `${getEnv('VITE_API_URL', 'http://localhost:4000')}/v1/admin/auth/refresh-token`,
            {
              refresh_token: refreshToken,
              user_id: store.getState().auth?.user?.id,
            }
          )

          if (refreshResponse.data.status_code === 'ACCEPT') {
            const newAccessToken = refreshResponse.data.data.access_token
            localStorage.setItem('accessToken', newAccessToken)
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
            processQueue(null, newAccessToken)

            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            }
            originalRequest.__isRetryRequest = true
            return axiosInstance(originalRequest)
          } else {
            logoutAndRedirect()
            processQueue(refreshResponse.data.reason_message, null)
            return Promise.reject(refreshResponse.data.reason_message)
          }
        } catch (refreshError: any) {
          // Handle refresh token expired (403 with unauthorized)
          if (
            refreshError.response?.status === 403 &&
            refreshError.response?.data?.status_code === 'REJECT' &&
            refreshError.response?.data?.reason_code === 'unauthorized'
          ) {
            logoutAndRedirect()
            processQueue(refreshError, null)
            return Promise.reject(refreshError)
          }

          // Handle other refresh errors
          logoutAndRedirect()
          processQueue(refreshError, null)
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance