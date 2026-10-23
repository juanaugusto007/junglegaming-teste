import React, { useState, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useWallets } from '../../application/wallet/useWallets'
import { useAuth } from '../../application/identity/useAuth'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import { Check, AlertCircle, ChevronDown } from 'lucide-react'

export const Route = createFileRoute('/wallets')({
  component: WalletsPage,
})

function WalletsPage() {
  const { user } = useAuth()
  const { wallets, addWallet, isAdding } = useWallets()

  const formRef = useRef<HTMLFormElement>(null)

  // Primary Wallet Form Fields (Figma Page 8)
  const [displayName, setDisplayName] = useState(user?.displayName || 'Alex Vance')
  const [walletNickname, setWalletNickname] = useState(user?.walletNickname || 'Carteira Principal')
  const [network, setNetwork] = useState('Ethereum')
  const [profileName, setProfileName] = useState(user?.username || 'alexvance')
  const [walletAddress, setWalletAddress] = useState('')
  const [secondaryWallet, setSecondaryWallet] = useState('')
  const [walletType, setWalletType] = useState('MetaMask')
  const [referralCode, setReferralCode] = useState('')
  const [email, setEmail] = useState(user?.email || 'contato@email.com')
  const [ensPrefix, setEnsPrefix] = useState('alex.kurio')
  const [ensSuffix, setEnsSuffix] = useState('.eth')

  const [sameAsPrimary, setSameAsPrimary] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSaveWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)

    if (!walletNickname || !walletAddress) {
      setErrorMessage('Por favor, preencha o apelido e o endereço da carteira.')
      return
    }

    try {
      await addWallet({
        nickname: walletNickname,
        network: network as 'Ethereum' | 'Polygon',
        address: walletAddress,
        provider: walletType as 'MetaMask' | 'WalletConnect' | 'Coinbase Wallet',
      })

      setSuccessMessage('Carteira salva com sucesso!')
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Erro ao salvar carteira.')
    }
  }

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Sidebar matching Figma */}
        <div className="lg:col-span-3 lg:max-w-[260px] w-full">
          <ProfileSidebar activeTab="wallets" />
        </div>

        {/* Main Content Area */}
        <main className="lg:col-span-9 max-w-4xl w-full">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-text-primary tracking-wide">
                Carteira principal
              </h1>
              <p className="text-xs font-mono text-text-secondary mt-1">
                Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
              </p>
            </div>
            <button
              type="button"
              onClick={handleScrollToForm}
              className="text-xs font-mono font-bold text-brand hover:text-brand-light transition-colors self-start sm:self-auto"
            >
              Adicionar
            </button>
          </div>

          {/* Feedback Alerts */}
          {successMessage && (
            <div className="mb-6 p-3.5 bg-emerald-950/40 border border-status-success font-mono text-xs text-status-success flex items-center gap-2.5">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-950/40 border border-status-error font-mono text-xs text-status-error flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Primary Form */}
          <form ref={formRef} onSubmit={handleSaveWallet} className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Row 1: Nome de exibição | Apelido da carteira */}
              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
                  Nome de exibição<span className="text-brand ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="Alex Vance"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
                  Apelido da carteira<span className="text-brand ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={walletNickname}
                  onChange={(e) => setWalletNickname(e.target.value)}
                  required
                  placeholder="Carteira Principal"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              {/* Row 2: Rede | Nome do perfil */}
              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
                  Rede <span className="text-brand">*</span>
                </label>
                <div className="relative">
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-full h-12 appearance-none bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 pr-10 text-sm font-mono text-text-primary cursor-pointer rounded-none sm:rounded-xs"
                  >
                    <option value="Ethereum">Ethereum Mainnet</option>
                    <option value="Polygon">Polygon POS</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
                  Nome do perfil<span className="text-brand ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  placeholder="alexvance"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              {/* Row 3: Endereço da carteira | ENS ou carteira secundária */}
              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
                  Endereço da carteira<span className="text-brand ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                  placeholder="Endereço 0x da carteira"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
                  ENS ou carteira secundária (opcional)
                </label>
                <input
                  type="text"
                  value={secondaryWallet}
                  onChange={(e) => setSecondaryWallet(e.target.value)}
                  placeholder="ex: secundario.eth"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              {/* Row 4: Tipo de carteira | Código de indicação */}
              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
                  Tipo de carteira<span className="text-brand ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    value={walletType}
                    onChange={(e) => setWalletType(e.target.value)}
                    className="w-full h-12 appearance-none bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 pr-10 text-sm font-mono text-text-primary cursor-pointer rounded-none sm:rounded-xs"
                  >
                    <option value="MetaMask">MetaMask</option>
                    <option value="WalletConnect">WalletConnect</option>
                    <option value="Coinbase Wallet">Coinbase Wallet</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
                  Código de indicação<span className="text-brand ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="KURIO-2026"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              {/* Row 5: E-mail | Nome ENS */}
              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
                  E-mail<span className="text-brand ml-0.5">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="contato@email.com"
                  className="w-full h-12 bg-[#130C0A] border border-[#3C2117] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand px-4 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors rounded-none sm:rounded-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-primary mb-2">
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
                    type="text"
                    value={ensPrefix}
                    onChange={(e) => setEnsPrefix(e.target.value)}
                    placeholder="alex.kurio"
                    className="flex-1 h-full bg-[#130C0A] border border-[#3C2117] px-4 text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand rounded-none sm:rounded-r-xs"
                  />
                </div>
              </div>
            </div>

            {/* Salvar Carteira Button */}
            <button
              type="submit"
              disabled={isAdding}
              className="bg-brand hover:bg-brand-hover disabled:opacity-50 text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-none sm:rounded-xs self-start mt-8 transition-all shadow-md active:translate-y-0.5"
            >
              {isAdding ? 'Salvando...' : 'Salvar carteira'}
            </button>
          </form>

          {/* Carteira secundária Section */}
          <div className="mt-14 pt-8 border-t border-[#261F1A]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold font-mono text-text-primary tracking-wide">
                  Carteira secundária
                </h2>
                <p className="text-xs font-mono text-text-secondary mt-1">
                  Você ainda não adicionou uma carteira secundária.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-text-secondary hover:text-text-primary">
                  <input
                    type="checkbox"
                    checked={sameAsPrimary}
                    onChange={(e) => setSameAsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded-full border border-surface-border text-brand focus:ring-brand accent-brand cursor-pointer"
                  />
                  <span>Igual à carteira principal</span>
                </label>
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="text-xs font-mono font-bold text-brand hover:text-brand-light transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Registered Wallets Grid (Existing) */}
          {wallets && wallets.length > 0 && (
            <div className="mt-12">
              <h3 className="font-mono text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">
                Carteiras Conectadas ({wallets.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wallets.map((w) => (
                  <div
                    key={w.id}
                    className={`p-4 bg-[#130C0A] border font-mono text-xs ${
                      w.isPrimary ? 'border-brand' : 'border-[#261F1A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-text-primary">{w.nickname}</span>
                      {w.isPrimary && (
                        <span className="text-[10px] bg-brand text-[#0E0C0A] px-1.5 py-0.5 font-bold uppercase">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-brand truncate text-xs mb-2">{w.address}</p>
                    <div className="flex items-center justify-between text-text-muted text-[11px] pt-2 border-t border-[#261F1A]">
                      <span>{w.network} • {w.provider}</span>
                      <span className="text-text-primary font-bold">{w.balanceEth} ETH</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
