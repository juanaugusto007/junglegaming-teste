import React, { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../application/identity/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Check, AlertCircle, LogOut } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateProfile, isUpdatingProfile, changePassword, isChangingPassword, logout } = useAuth()

  const [displayName, setDisplayName] = useState(user?.displayName || 'Alex Vance')
  const [email, setEmail] = useState(user?.email || 'contato@email.com')
  const [username, setUsername] = useState(user?.username || 'alexvance')
  const [walletNickname, setWalletNickname] = useState(user?.walletNickname || 'Carteira Principal')
  const [ensName, setEnsName] = useState(user?.ensName || 'alex.kurio.eth')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({ displayName, email, username, walletNickname, ensName })
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch {
      // Error
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.')
      return
    }

    try {
      await changePassword({ currentPassword, newPassword, confirmPassword })
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || 'Erro ao alterar senha.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 flex flex-col gap-8">
      <div className="border-b border-surface-border pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary">
            Perfil do colecionador
          </h1>
          <p className="text-xs font-mono text-text-secondary mt-1">
            Gerencie suas informações públicas, segurança e preferências.
          </p>
        </div>
        <Button
          onClick={() => {
            logout()
            navigate({ to: '/' })
          }}
          variant="outline"
          size="sm"
          className="gap-2 text-status-error border-status-error/40 hover:bg-red-950/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da conta</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Sidebar Tabs (Exact Figma Page 7) */}
        <aside className="lg:col-span-3 flex flex-col gap-1 font-mono text-xs">
          <span className="px-3 py-2.5 font-bold text-brand bg-surface-elevated border-l-2 border-brand cursor-pointer">
            Dados do perfil
          </span>
          <Link
            to="/wallets"
            className="px-3 py-2.5 text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50 transition-colors"
          >
            Carteiras
          </Link>
          <span className="px-3 py-2.5 text-text-muted cursor-pointer hover:text-text-secondary">
            Atividade
          </span>
          <span className="px-3 py-2.5 text-text-muted cursor-pointer hover:text-text-secondary">
            Lista de interesse
          </span>
          <span className="px-3 py-2.5 text-text-muted cursor-pointer hover:text-text-secondary">
            Ofertas
          </span>
          <span className="px-3 py-2.5 text-text-muted cursor-pointer hover:text-text-secondary">
            Arquivos baixados
          </span>
          <span className="px-3 py-2.5 text-text-muted cursor-pointer hover:text-text-secondary">
            Suporte
          </span>
        </aside>

        {/* Profile Content */}
        <div className="lg:col-span-9 flex flex-col gap-10">
          {/* Avatar and Info Form */}
          <form
            onSubmit={handleUpdateProfile}
            className="bg-surface-card border border-surface-border p-6 sm:p-8 flex flex-col gap-6"
          >
            <h2 className="font-mono text-sm font-bold text-text-primary uppercase tracking-wider border-b border-surface-border pb-3">
              Dados do perfil
            </h2>

            {profileSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-status-success text-status-success text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Dados do perfil atualizados com sucesso!</span>
              </div>
            )}

            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <img
                src={user?.avatarUrl || '/assets/nfts/hero-ape.webp'}
                alt={user?.displayName || 'Avatar'}
                className="w-20 h-20 rounded-full object-cover border-2 border-brand"
              />
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-text-primary font-bold">Avatar</span>
                <div className="flex items-center gap-2">
                  <Button type="button" size="sm" variant="brand" className="font-mono text-xs">
                    Alterar
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="font-mono text-xs">
                    Remover
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome de exibição*"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <Input
                label="E-mail*"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Apelido da carteira*"
                value={walletNickname}
                onChange={(e) => setWalletNickname(e.target.value)}
                required
              />
              <Input
                label="Nome de usuário*"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <Input
              label="Nome ENS (.eth)"
              value={ensName}
              onChange={(e) => setEnsName(e.target.value)}
            />

            <Button
              type="submit"
              variant="brand"
              size="md"
              isLoading={isUpdatingProfile}
              className="font-mono text-xs font-bold uppercase tracking-wider self-start px-8"
            >
              Salvar Alterações
            </Button>
          </form>

          {/* Change Password Form */}
          <form
            onSubmit={handleChangePassword}
            className="bg-surface-card border border-surface-border p-6 sm:p-8 flex flex-col gap-6"
          >
            <h2 className="font-mono text-sm font-bold text-text-primary uppercase tracking-wider border-b border-surface-border pb-3">
              Alterar senha
            </h2>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-status-success text-status-success text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Senha atualizada com sucesso!</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-950/40 border border-status-error text-status-error text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{passwordError}</span>
              </div>
            )}

            <Input
              label="Senha atual"
              type="password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nova senha"
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirmar nova senha"
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="brand"
              size="md"
              isLoading={isChangingPassword}
              className="font-mono text-xs font-bold uppercase tracking-wider self-start px-8"
            >
              Salvar Nova Senha
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
