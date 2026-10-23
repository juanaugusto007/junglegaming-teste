import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  User,
  MapPin,
  ShoppingCart,
  Heart,
  TrendingUp,
  Download,
  AlertTriangle,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../../application/identity/useAuth'

export type ProfileTab =
  | 'profile'
  | 'wallets'
  | 'activity'
  | 'watchlist'
  | 'offers'
  | 'downloads'
  | 'support'

interface ProfileSidebarProps {
  activeTab: ProfileTab
  onSelectTab?: (tab: ProfileTab) => void
}

interface MenuItem {
  id: ProfileTab
  label: string
  icon: React.ElementType
  to?: string
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'profile', label: 'Dados do perfil', icon: User, to: '/profile' },
  { id: 'wallets', label: 'Carteiras', icon: MapPin, to: '/wallets' },
  { id: 'activity', label: 'Atividade', icon: ShoppingCart },
  { id: 'watchlist', label: 'Lista de interesse', icon: Heart },
  { id: 'offers', label: 'Ofertas', icon: TrendingUp },
  { id: 'downloads', label: 'Arquivos baixados', icon: Download },
  { id: 'support', label: 'Suporte', icon: AlertTriangle },
]

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  return (
    <aside className="w-full lg:w-64 bg-[#231611] border border-[#38231B] p-6 rounded-none font-mono shadow-xl">
      <h2 className="text-sm font-bold text-text-primary mb-6 tracking-wide px-1">
        Meu perfil
      </h2>

      <nav className="flex flex-col space-y-1 text-xs">
        {MENU_ITEMS.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          const content = (
            <div
              className={`flex items-center gap-3.5 py-3 px-3 w-full transition-colors ${
                isActive
                  ? 'text-brand font-bold -ml-6 pl-6 border-l-4 border-brand bg-[#2D1B15]/60'
                  : 'text-text-secondary hover:text-text-primary hover:bg-[#2D1B15]/40'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-brand' : 'text-text-muted group-hover:text-text-primary'
                }`}
              />
              <span className="tracking-wide">{item.label}</span>
            </div>
          )

          if (item.to) {
            return (
              <Link
                key={item.id}
                to={item.to}
                className="group block w-full focus:outline-none"
              >
                {content}
              </Link>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab?.(item.id)}
              className="group block w-full text-left focus:outline-none"
            >
              {content}
            </button>
          )
        })}

        {/* Divider & Logout */}
        <div className="border-t border-[#4A2D22] my-2 pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3.5 py-2.5 px-3 text-brand hover:text-brand-light hover:bg-[#2D1B15]/40 font-bold text-left transition-colors w-full focus:outline-none"
          >
            <LogOut className="w-4 h-4 text-brand flex-shrink-0" />
            <span className="tracking-wide">Sair</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}
