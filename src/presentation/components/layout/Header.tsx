import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Search, ShoppingBag, LogIn, User, LogOut, Menu, X, Wallet } from 'lucide-react'
import { useAuth } from '../../../application/identity/useAuth'
import { useCart } from '../../../application/cart/useCart'
import { Button } from '../ui/Button'

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { quote } = useCart()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const cartItemCount = quote?.items.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-widest text-text-primary group-hover:text-brand transition-colors">
              KURIO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              to="/"
              className="text-text-secondary hover:text-text-primary transition-colors [&.active]:text-brand [&.active]:border-b-2 [&.active]:border-brand pb-1"
            >
              Início
            </Link>
            <Link
              to="/"
              search={{ collection: 'Todos os NFTs' }}
              className="text-brand font-semibold hover:text-brand-light transition-colors pb-1 border-b-2 border-brand"
            >
              Mercado
            </Link>
            <span className="text-text-muted hover:text-text-secondary cursor-pointer transition-colors">
              Criadores
            </span>
            <span className="text-text-muted hover:text-text-secondary cursor-pointer transition-colors">
              Aprenda
            </span>
          </nav>
        </div>

        {/* Right Actions: Search, Cart, Auth */}
        <div className="flex items-center gap-4">
          {/* Search Trigger */}
          <button
            aria-label="Buscar no catálogo"
            onClick={() => {
              const input = document.getElementById('catalog-search-input')
              input?.focus()
            }}
            className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface-elevated transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart with Item Counter */}
          <Link
            to="/cart"
            aria-label={`Carrinho com ${cartItemCount} itens`}
            className="relative p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface-elevated transition-colors flex items-center"
          >
            <ShoppingBag className="w-5 h-5 text-text-primary" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-mono font-bold text-background bg-brand rounded-full ring-2 ring-background">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Auth State Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-sm border border-surface-border hover:border-brand transition-colors bg-surface-card"
                aria-expanded={userDropdownOpen}
                aria-label="Menu do colecionador"
              >
                <img
                  src={user.avatarUrl || '/assets/nfts/hero-ape.webp'}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-surface-border"
                />
                <span className="hidden sm:inline text-xs font-mono font-medium text-text-primary pr-2 max-w-[100px] truncate">
                  {user.displayName}
                </span>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-surface-card border border-surface-border shadow-2xl py-1.5 z-50 text-sm"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-surface-border">
                    <p className="font-semibold text-text-primary truncate">{user.displayName}</p>
                    <p className="text-xs text-text-muted font-mono truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                  >
                    <User className="w-4 h-4 text-brand" />
                    <span>Meu perfil</span>
                  </Link>
                  <Link
                    to="/wallets"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                  >
                    <Wallet className="w-4 h-4 text-brand" />
                    <span>Carteiras</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false)
                      logout()
                      navigate({ to: '/' })
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-status-error hover:bg-surface-elevated text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="brand" className="gap-2 font-mono">
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-surface-card px-4 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 font-mono text-sm">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-text-primary hover:text-brand py-1"
            >
              Início
            </Link>
            <Link
              to="/"
              search={{ collection: 'Todos os NFTs' }}
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand font-semibold py-1"
            >
              Mercado
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-text-primary hover:text-brand py-1 flex items-center justify-between"
            >
              <span>Carrinho</span>
              <span className="px-2 py-0.5 text-xs bg-brand text-background rounded-full font-bold">
                {cartItemCount}
              </span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary py-1"
                >
                  Meu perfil
                </Link>
                <Link
                  to="/wallets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary py-1"
                >
                  Carteiras conectadas
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="text-status-error text-left py-1"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mt-2" size="sm">
                  Entrar / Cadastrar
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
