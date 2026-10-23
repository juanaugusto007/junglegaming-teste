import React, { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Heart, ShoppingBag, User, Compass } from 'lucide-react'
import { useAuth } from '../../../application/identity/useAuth'
import { useCart } from '../../../application/cart/useCart'
import { AuthModal } from '../common/AuthModal'

export const BottomNav: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { quote } = useCart()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const cartItemCount = quote?.items.reduce((acc, item) => acc + item.quantity, 0) || 0

  if (currentPath.startsWith('/nft/')) {
    return null
  }

  return (
    <>
      <nav
        aria-label="Navegação mobile inferior"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#14100D]/95 backdrop-blur-lg border-t border-[#2B231C] px-6 py-3 flex items-center justify-between"
      >
        {/* Home */}
        <Link
          to="/"
          aria-label="Início"
          className={`flex flex-col items-center gap-1 transition-colors ${currentPath === '/' ? 'text-brand' : 'text-text-secondary hover:text-text-primary'
            }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-mono">Início</span>
        </Link>

        {/* Favorites */}
        <Link
          to="/"
          search={{ sortBy: 'popular' }}
          aria-label="Favoritos"
          className="flex flex-col items-center gap-1 text-text-secondary hover:text-brand transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-mono">Favoritos</span>
        </Link>

        {/* Center Floating Action Button (Exact Figma Page 9) */}
        <div className="-mt-6">
          <Link
            to="/"
            search={{ collection: 'Todos os NFTs' }}
            aria-label="Explorar Coleções"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center text-[#0E0C0A] shadow-lg shadow-brand/20 ring-4 ring-[#14100D] active:scale-95 transition-transform"
          >
            <Compass className="w-6 h-6 animate-pulse" />
          </Link>
        </div>

        {/* Cart */}
        <Link
          to="/cart"
          aria-label={`Carrinho com ${cartItemCount} itens`}
          className={`relative flex flex-col items-center gap-1 transition-colors ${currentPath === '/cart' ? 'text-brand' : 'text-text-secondary hover:text-text-primary'
            }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-brand text-[#0E0C0A] text-[9px] font-mono font-bold flex items-center justify-center ring-1 ring-[#14100D]">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono">Carrinho</span>
        </Link>

        {/* Profile / Auth */}
        {isAuthenticated ? (
          <Link
            to="/profile"
            aria-label="Perfil do Colecionador"
            className={`flex flex-col items-center gap-1 transition-colors ${currentPath === '/profile' || currentPath === '/wallets'
                ? 'text-brand'
                : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-mono">Conta</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            aria-label="Entrar na conta"
            className="flex flex-col items-center gap-1 text-brand hover:text-brand-light transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold">Entrar</span>
          </button>
        )}
      </nav>

      {/* Auth Modal for mobile */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  )
}
