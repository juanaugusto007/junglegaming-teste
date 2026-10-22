export interface CollectorUser {
  id: string
  username: string
  displayName: string
  email: string
  avatarUrl: string
  ensName?: string
  walletNickname?: string
  bio?: string
  createdAt: string
}

export interface Session {
  user: CollectorUser
  token: string
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  confirmPassword?: string
}

export interface UpdateProfileData {
  displayName: string
  email: string
  username: string
  ensName?: string
  walletNickname?: string
  avatarUrl?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
