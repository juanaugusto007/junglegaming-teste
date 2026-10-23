import React, { useState, useEffect } from 'react'
import { X, Eye, EyeOff, AlertCircle, CheckCircle2, Zap } from 'lucide-react'
import { useAuth } from '../../../application/identity/useAuth'

interface AuthModalProps {
  isOpen: boolean
  initialTab?: 'login' | 'register'
  onClose: () => void
  onSuccess?: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab)
  const { login, isLoggingIn, register, isRegistering } = useAuth()

  // Form states
  const [email, setEmail] = useState('contato@email.com')
  const [password, setPassword] = useState('Password@123')
  const [showPassword, setShowPassword] = useState(false)

  const [username, setUsername] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    setActiveTab(initialTab)
    setErrorMsg(null)
    setSuccessMsg(null)
  }, [initialTab, isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    try {
      await login({ email, password })
      setSuccessMsg('Login realizado com sucesso!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 600)
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'E-mail ou senha inválidos.')
    }
  }

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setErrorMsg(null)
    try {
      await login({ email: demoEmail, password: 'Password@123' })
      setSuccessMsg('Conectado como usuário demo!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 500)
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Falha no login demo.')
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (registerPassword !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.')
      return
    }

    try {
      await register({
        username,
        email: registerEmail,
        password: registerPassword,
      })
      setSuccessMsg('Conta criada com sucesso!')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 600)
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Erro ao cadastrar usuário.')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 flex min-h-screen items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card (Responsive & Never Clipped) */}
      <div
        className="relative w-full max-w-[440px] my-auto bg-[#16120F] border border-[#2B231C] p-6 sm:p-8 shadow-2xl rounded-xl flex flex-col gap-4 text-text-primary animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar modal de autenticação"
          className="absolute top-4 right-4 text-text-muted hover:text-white p-1.5 transition-colors cursor-pointer rounded-md hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tabs: Entrar | Criar conta */}
        <div className="flex items-center justify-center gap-3 text-lg font-mono font-bold tracking-wide pt-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login')
              setErrorMsg(null)
            }}
            className={`transition-colors pb-0.5 ${
              activeTab === 'login'
                ? 'text-brand border-b-2 border-brand'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Entrar
          </button>
          <span className="text-text-muted font-light">|</span>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register')
              setErrorMsg(null)
            }}
            className={`transition-colors pb-0.5 ${
              activeTab === 'register'
                ? 'text-brand border-b-2 border-brand'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-center text-xs font-mono text-text-secondary leading-relaxed px-2">
          {activeTab === 'login'
            ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
            : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
        </p>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-status-error text-status-error text-xs font-mono flex items-center gap-2 rounded-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/50 border border-status-success text-status-success text-xs font-mono flex items-center gap-2 rounded-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Demo Shortcut for quick evaluation */}
        {activeTab === 'login' && (
          <div className="flex items-center justify-between gap-2 p-2 bg-[#1C1612] border border-[#2B231C] text-[11px] font-mono text-text-secondary">
            <span className="text-brand font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-brand" /> Demo:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('contato@email.com')}
                className="px-2 py-1 bg-surface-elevated hover:bg-brand hover:text-background text-text-primary border border-surface-border transition-colors font-bold text-[10px]"
              >
                Alex Vance
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('elena@kurio.art')}
                className="px-2 py-1 bg-surface-elevated hover:bg-brand hover:text-background text-text-primary border border-surface-border transition-colors font-bold text-[10px]"
              >
                Elena Rostova
              </button>
            </div>
          </div>
        )}

        {/* Form: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <input
                type="email"
                required
                placeholder="contato@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#120E0B] border border-[#2B231C] px-3.5 py-2.5 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#120E0B] border border-[#2B231C] px-3.5 py-2.5 pr-10 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary"
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => setErrorMsg('Instruções de redefinição de senha enviadas para o e-mail.')}
                  className="text-[11px] font-mono text-brand hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-brand hover:bg-brand-hover text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider py-3 mt-1 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}

        {/* Form: CRIAR CONTA */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              required
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#120E0B] border border-[#2B231C] px-3.5 py-2.5 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand rounded-xs"
            />

            <input
              type="email"
              required
              placeholder="Digite seu e-mail"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              className="w-full bg-[#120E0B] border border-[#2B231C] px-3.5 py-2.5 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand rounded-xs"
            />

            <div className="relative">
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                required
                placeholder="Senha"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full bg-[#120E0B] border border-[#2B231C] px-3.5 py-2.5 pr-10 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand rounded-xs"
              />
              <button
                type="button"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary"
                aria-label={showRegisterPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <input
              type="password"
              required
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#120E0B] border border-[#2B231C] px-3.5 py-2.5 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand rounded-xs"
            />

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full bg-brand hover:bg-brand-hover text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider py-3 mt-1 rounded-md transition-colors disabled:opacity-50"
            >
              {isRegistering ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        )}

        {/* Divider: Ou continue com */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#2B231C]"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono text-text-muted uppercase tracking-wider">
            Ou continue com
          </span>
          <div className="flex-grow border-t border-[#2B231C]"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('contato@email.com')}
            className="w-full flex items-center justify-center gap-3 py-2.5 bg-[#120E0B] hover:bg-[#1E1712] border border-[#2B231C] text-xs font-mono text-text-primary transition-colors"
          >
            {/* Google Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('elena@kurio.art')}
            className="w-full flex items-center justify-center gap-3 py-2.5 bg-[#120E0B] hover:bg-[#1E1712] border border-[#2B231C] text-xs font-mono text-text-primary transition-colors"
          >
            {/* Facebook Icon */}
            <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Continuar com Facebook</span>
          </button>
        </div>
      </div>
    </div>
  )
}
