import React, { useState, useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../application/identity/useAuth'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import { Eye, EyeOff, Check, AlertCircle, Image as ImageIcon } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const {
    user,
    updateProfile,
    isUpdatingProfile,
    changePassword,
    isChangingPassword,
  } = useAuth()

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile Form States
  const [displayName, setDisplayName] = useState(user?.displayName || 'Alex Vance')
  const [email, setEmail] = useState(user?.email || 'contato@email.com')
  const [username, setUsername] = useState(user?.username || 'alexvance')
  const [walletNickname, setWalletNickname] = useState(user?.walletNickname || 'Carteira Principal')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '/assets/nfts/hero-ape.png')

  // ENS Split States
  const [ensPrefix, setEnsPrefix] = useState('')
  const [ensSuffix, setEnsSuffix] = useState('.eth')

  // Password States
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Password Visibility Toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Notifications
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Initialize ENS Name breakdown
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '')
      setEmail(user.email || '')
      setUsername(user.username || '')
      setWalletNickname(user.walletNickname || '')
      setAvatarUrl(user.avatarUrl || '')

      if (user.ensName) {
        if (user.ensName.endsWith('.eth')) {
          setEnsPrefix(user.ensName.replace(/\.eth$/, ''))
          setEnsSuffix('.eth')
        } else if (user.ensName.endsWith('.xyz')) {
          setEnsPrefix(user.ensName.replace(/\.xyz$/, ''))
          setEnsSuffix('.xyz')
        } else if (user.ensName.endsWith('.crypto')) {
          setEnsPrefix(user.ensName.replace(/\.crypto$/, ''))
          setEnsSuffix('.crypto')
        } else {
          setEnsPrefix(user.ensName)
        }
      } else {
        setEnsPrefix('alex.kurio')
        setEnsSuffix('.eth')
      }
    }
  }, [user])

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)

    const fullEnsName = ensPrefix ? `${ensPrefix}${ensSuffix}` : ''

    try {
      // 1. Update Profile Info
      await updateProfile({
        displayName,
        email,
        username,
        walletNickname,
        ensName: fullEnsName,
        avatarUrl,
      })

      // 2. If password fields are filled, update password
      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) {
          setStatusMessage({
            type: 'error',
            text: 'Por favor, informe a sua senha atual para alterar.',
          })
          return
        }
        if (newPassword !== confirmPassword) {
          setStatusMessage({
            type: 'error',
            text: 'A nova senha e a confirmação não coincidem.',
          })
          return
        }
        if (newPassword.length < 6) {
          setStatusMessage({
            type: 'error',
            text: 'A nova senha deve ter no mínimo 6 caracteres.',
          })
          return
        }

        await changePassword({ currentPassword, newPassword, confirmPassword })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }

      setStatusMessage({
        type: 'success',
        text: 'Alterações salvas com sucesso!',
      })
      setTimeout(() => setStatusMessage(null), 4000)
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Erro ao salvar alterações.',
      })
    }
  }

  const isSaving = isUpdatingProfile || isChangingPassword

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Sidebar matching Figma */}
        <div className="lg:col-span-3 lg:max-w-[260px] w-full">
          <ProfileSidebar activeTab="profile" />
        </div>

        {/* Main Content Area */}
        <main className="lg:col-span-9 max-w-4xl w-full">
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-text-primary tracking-wide mb-8">
            Perfil do colecionador
          </h1>

          {/* Feedback Alert */}
          {statusMessage && (
            <div
              className={`mb-6 p-3.5 border font-mono text-xs flex items-center gap-2.5 transition-all ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-status-success text-status-success'
                  : 'bg-red-950/40 border-status-error text-status-error'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col">
            {/* 2-Column Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column: Nome de exibição */}
              <div>
                <label htmlFor="display-name" className="block text-xs font-mono text-text-primary mb-2">
                  Nome de exibição<span className="text-brand ml-0.5">*</span>
                </label>
                <input
                  id="display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="Alex Vance"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              {/* Right Column: Nome de usuário */}
              <div>
                <label htmlFor="username" className="block text-xs font-mono text-text-primary mb-2">
                  Nome de usuário<span className="text-brand ml-0.5">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="alexvance"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              {/* Left Column: E-mail */}
              <div>
                <label htmlFor="email" className="block text-xs font-mono text-text-primary mb-2">
                  E-mail<span className="text-brand ml-0.5">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="contato@email.com"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              {/* Right Column: Nome ENS */}
              <div>
                <label htmlFor="ens-name" className="block text-xs font-mono text-text-primary mb-2">
                  Nome ENS <span className="text-brand">*</span>
                </label>
                <div className="flex h-12 w-full">
                  <div className="relative">
                    <select
                      value={ensSuffix}
                      onChange={(e) => setEnsSuffix(e.target.value)}
                      className="h-full appearance-none bg-[#130C0A] border border-[#3C2117] border-r-0 px-3 pr-7 text-sm font-mono text-text-primary focus:outline-none focus:border-brand rounded-none sm:rounded-l-xs cursor-pointer"
                    >
                      <option value=".eth">.eth</option>
                      <option value=".xyz">.xyz</option>
                      <option value=".crypto">.crypto</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary text-xs">
                      ▼
                    </span>
                  </div>
                  <input
                    id="ens-name"
                    type="text"
                    value={ensPrefix}
                    onChange={(e) => setEnsPrefix(e.target.value)}
                    placeholder="alex.kurio"
                    className="flex-1 h-full bg-[#130C0A] border border-[#3C2117] px-4 text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand rounded-none sm:rounded-r-xs"
                  />
                </div>
              </div>

              {/* Left Column: Apelido da carteira */}
              <div>
                <label htmlFor="wallet-nickname" className="block text-xs font-mono text-text-primary mb-2">
                  Apelido da carteira<span className="text-brand ml-0.5">*</span>
                </label>
                <input
                  id="wallet-nickname"
                  type="text"
                  value={walletNickname}
                  onChange={(e) => setWalletNickname(e.target.value)}
                  required
                  placeholder="Carteira Principal"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              {/* Right Column: Avatar Section */}
              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
                  Avatar
                </label>
                <div className="flex items-center gap-4 h-12">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#181411] border border-[#3C2117] flex items-center justify-center flex-shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-brand hover:bg-brand-hover text-[#0E0C0A] font-mono font-bold text-xs px-5 py-2.5 rounded-none sm:rounded-xs transition-colors shadow-sm"
                  >
                    Alterar
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="text-text-primary hover:text-text-secondary font-mono text-xs px-2 py-2.5 transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>

            {/* Section Alterar senha */}
            <div className="mt-12">
              <h2 className="text-base font-bold font-mono text-text-primary mb-6 tracking-wide">
                Alterar senha
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Left Column: 3 Password Inputs */}
                <div className="flex flex-col gap-6">
                  {/* Senha atual */}
                  <div>
                    <label className="block text-xs font-mono text-text-primary mb-2">
                      Senha atual
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder=""
                        className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 pr-11 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
                        aria-label="Alternar visibilidade da senha atual"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4 text-brand" />
                        ) : (
                          <Eye className="w-4 h-4 text-text-secondary" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nova senha */}
                  <div>
                    <label className="block text-xs font-mono text-text-primary mb-2">
                      Nova senha
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder=""
                        className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 pr-11 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
                        aria-label="Alternar visibilidade da nova senha"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4 text-brand" />
                        ) : (
                          <Eye className="w-4 h-4 text-text-secondary" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar nova senha */}
                  <div>
                    <label className="block text-xs font-mono text-text-primary mb-2">
                      Confirmar nova senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder=""
                        className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 pr-11 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
                        aria-label="Alternar visibilidade de confirmação de senha"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-brand" />
                        ) : (
                          <Eye className="w-4 h-4 text-text-secondary" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column empty to match Figma layout */}
                <div className="hidden md:block" />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="bg-brand hover:bg-brand-hover disabled:opacity-50 text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-none sm:rounded-xs self-start mt-8 transition-all shadow-md active:translate-y-0.5"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}
