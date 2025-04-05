import axios, { AxiosInstance } from 'axios'
import { getEnv } from './env'

const jwtToken = getEnv('VITE_JWT_TOKEN', undefined)

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getEnv('VITE_API_URL', 'http://localhost:4000'),
  headers: {
    'Content-Type': 'application/json',
    ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
  },
})

export default axiosInstance
