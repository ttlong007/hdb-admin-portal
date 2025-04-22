import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'
import { getEnv } from './env'
import { store } from '@/store' // Ensure this import points to your Redux store

const accessToken = store.getState().auth?.accessToken

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getEnv('VITE_API_URL', 'http://localhost:4000'),
  headers: {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  },
})

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // If error response is 401 and we haven't retried this request
    if (
      error.response?.status === 401 &&
      !(error.config as any).__isRetryRequest
    ) {
      (error.config as any).__isRetryRequest = true

      // Get refresh_token from Redux store state (adjust according to your store shape)
      const { refreshToken } = store.getState().auth || {}
      if (refreshToken) {
        try {
          const refreshResponse = await axiosInstance.post(
            '/v1/admin/auth/refresh-token',
            {
              refresh_token: refreshToken,
            }
          )
          if (refreshResponse.data.status_code === 'ACCEPT') {
            const newAccessToken = refreshResponse.data.data.access_token
            // Optionally, update your Redux store with the new access token here.
            // Update default axios headers
            axiosInstance.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${newAccessToken}`
            // Update original request header before retrying
            if (error.config) {
              error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
            }
            // Retry the original request with the new token
            return axiosInstance.request(error.config as AxiosRequestConfig)
          }
        } catch (refreshError) {
          console.error('Refresh token error:', refreshError)
          // Optionally handle logout here
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
