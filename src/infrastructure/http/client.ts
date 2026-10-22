import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach session token if present
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('kurio_auth_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: standard error envelope extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    if (error.response?.status === 401) {
      // Dispatch auth expiration event for application layer
      window.dispatchEvent(new CustomEvent('kurio:auth-expired'))
    }
    return Promise.reject(error)
  }
)
