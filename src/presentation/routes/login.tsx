import React, { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../application/identity/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoggingIn } = useAuth()
  const [email, setEmail] = useState('contato@email.com')
  const [password, setPassword] = useState('Password@123')
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

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-surface-card border border-surface-border p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        <div className="text-center flex flex-col gap-1">
          <span className="text-xs font-mono text-brand font-bold uppercase tracking-widest">
            Bem-vindo à Kurio
          </span>
          <h1 className="text-2xl font-black text-text-primary">
            Entrar na sua conta
          </h1>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Entre para gerenciar sua carteira, coleção e perfil de criador.
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 border-b border-surface-border text-center font-mono text-xs">
          <span className="py-2.5 font-bold text-brand border-b-2 border-brand">
            Entrar
          </span>
          <Link
            to="/register"
            className="py-2.5 text-text-secondary hover:text-text-primary"
          >
            Criar conta
          </Link>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-status-error text-status-error text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="contato@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1">
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="text-[11px] font-mono text-text-muted hover:text-brand cursor-pointer self-end mt-1">
              Esqueceu a senha?
            </span>
          </div>

          <Button
            type="submit"
            variant="brand"
            size="md"
            isLoading={isLoggingIn}
            className="w-full font-mono font-bold uppercase tracking-wider mt-2"
          >
            Entrar
          </Button>

          {/* Test credentials banner */}
          <div className="p-3 bg-surface-elevated border border-surface-border text-[11px] font-mono text-text-secondary flex flex-col gap-1">
            <span className="font-bold text-brand">Credenciais de Teste:</span>
            <span>E-mail: <strong>contato@email.com</strong></span>
            <span>Senha: <strong>Password@123</strong></span>
          </div>

          {/* Social login divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-surface-border"></div>
            <span className="flex-shrink mx-3 text-[10px] font-mono text-text-muted uppercase">
              Ou continue com
            </span>
            <div className="flex-grow border-t border-surface-border"></div>
          </div>

          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" size="sm" className="w-full text-xs font-mono">
              Continuar com Google
            </Button>
            <Button type="button" variant="outline" size="sm" className="w-full text-xs font-mono">
              Continuar com Facebook
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
