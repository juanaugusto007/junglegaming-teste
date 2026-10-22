import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../infrastructure/http/client'
import { Session, LoginCredentials, RegisterCredentials, UpdateProfileData, ChangePasswordData } from '../../domain/identity/types'

export const AUTH_QUERY_KEYS = {
  session: ['auth', 'session'] as const,
}

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: session, isLoading, refetch } = useQuery<Session | null>({
    queryKey: AUTH_QUERY_KEYS.session,
    queryFn: async () => {
      try {
        const res = await apiClient.get<Session>('/auth/session')
        return res.data
      } catch {
        return null
      }
    },
    staleTime: 60000,
    retry: false,
  })

  // Listen to 401 expiration event
  useEffect(() => {
    const handleExpired = () => {
      localStorage.removeItem('kurio_auth_token')
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, null)
    }
    window.addEventListener('kurio:auth-expired', handleExpired)
    return () => window.removeEventListener('kurio:auth-expired', handleExpired)
  }, [queryClient])

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiClient.post<Session>('/auth/login', credentials)
      return res.data
    },
    onSuccess: (newSession) => {
      localStorage.setItem('kurio_auth_token', newSession.token)
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, newSession)
      queryClient.invalidateQueries()
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const res = await apiClient.post<Session>('/auth/register', credentials)
      return res.data
    },
    onSuccess: (newSession) => {
      localStorage.setItem('kurio_auth_token', newSession.token)
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, newSession)
      queryClient.invalidateQueries()
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout')
    },
    onSuccess: () => {
      localStorage.removeItem('kurio_auth_token')
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, null)
      queryClient.clear()
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const res = await apiClient.put('/profile', data)
      return res.data
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<Session | null>(AUTH_QUERY_KEYS.session, (old) => {
        if (!old) return null
        return { ...old, user: { ...old.user, ...updatedUser } }
      })
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const res = await apiClient.post<{ message: string }>('/profile/password', data)
      return res.data
    },
  })

  return {
    user: session?.user || null,
    isAuthenticated: Boolean(session?.user),
    isLoading,
    refetchSession: refetch,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  }
}
