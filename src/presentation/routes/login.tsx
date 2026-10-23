import React, { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../application/identity/useAuth'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoggingIn } = useAuth()
  const [email, setEmail] = useState('contato@email.com')
  const [password, setPassword] = useState('Password@123')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    try {
      await login({ email, password })
      navigate({ to: '/' })
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'E-mail ou senha incorretos.')
    }
  }

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setErrorMessage(null)
    try {
      await login({ email: demoEmail, password: 'Password@123' })
      navigate({ to: '/' })
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Falha no login demo.')
    }
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Logo KURIO (Exact Figma Page 13) */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-black font-mono tracking-widest text-white">
              KURIO
            </span>
          </Link>
        </div>

        {/* Heading */}
        <h1 className="text-lg font-bold font-mono text-white text-center">
          Entrar
        </h1>

        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-status-error text-status-error text-xs font-mono flex items-center gap-2 rounded-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* E-mail Input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="contato@email.com"
            className="w-full h-12 bg-[#140F0C] border border-[#38231B] focus:border-brand focus:outline-none px-4 text-xs font-mono text-white placeholder:text-[#6E6357] rounded-md transition-colors"
          />

          {/* Password Input with eye toggle */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="************"
                className="w-full h-12 bg-[#140F0C] border border-[#38231B] focus:border-brand focus:outline-none px-4 pr-11 text-xs font-mono text-white placeholder:text-[#6E6357] rounded-md transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E6357] hover:text-white p-1"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-brand" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setErrorMessage('Instruções de recuperação enviadas para o seu e-mail.')}
              className="text-xs font-mono text-brand hover:underline self-end pt-1"
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Entrar Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-brand hover:bg-brand-hover text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-md mt-2 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isLoggingIn ? 'Entrando...' : 'Entrar'}
          </button>

          {/* 1-Click Demo Login Quick Shortcut */}
          <div className="p-2.5 bg-[#1C1612] border border-[#2B231C] text-[11px] font-mono text-text-secondary flex items-center justify-between gap-2 rounded-xs">
            <span className="text-brand font-bold">Demo 1-Clique:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('contato@email.com')}
                className="px-2 py-1 bg-surface-elevated hover:bg-brand hover:text-black border border-surface-border text-white text-[10px] font-bold transition-colors"
              >
                Alex Vance
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('elena@kurio.art')}
                className="px-2 py-1 bg-surface-elevated hover:bg-brand hover:text-black border border-surface-border text-white text-[10px] font-bold transition-colors"
              >
                Elena Rostova
              </button>
            </div>
          </div>

          {/* Divider: Ou continue com */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#38231B]"></div>
            <span className="flex-shrink mx-3 text-[10px] font-mono text-[#8C7A6B]">
              Ou continue com
            </span>
            <div className="flex-grow border-t border-[#38231B]"></div>
          </div>

          {/* Social Buttons (Figma Page 13) */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('contato@email.com')}
              className="w-full flex items-center justify-center gap-3 py-3 bg-[#18100B] hover:bg-[#231611] border border-[#38231B] text-xs font-mono text-white transition-colors rounded-md"
            >
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
              className="w-full flex items-center justify-center gap-3 py-3 bg-[#18100B] hover:bg-[#231611] border border-[#38231B] text-xs font-mono text-white transition-colors rounded-md"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continuar com Facebook</span>
            </button>
          </div>
        </form>

        {/* Footer Link (Figma Page 13) */}
        <div className="text-center font-mono text-xs text-white pt-2">
          Novo na Kurio?{' '}
          <Link to="/register" className="font-bold underline hover:text-brand transition-colors">
            Crie uma conta
          </Link>
        </div>
      </div>
    </div>
  )
}
