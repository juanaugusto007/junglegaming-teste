import React, { useState, useId } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ShieldCheck, Check, AlertTriangle, ArrowLeft } from 'lucide-react'
import { useCart } from '../../application/cart/useCart'
import { useAuth } from '../../application/identity/useAuth'
import { useWallets } from '../../application/wallet/useWallets'
import { useCreateOrder } from '../../application/order/useOrder'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { quote } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { wallets } = useWallets()
  const createOrder = useCreateOrder()

  // Generate stable idempotency key for this checkout session
  const [idempotencyKey] = useState(() => generateUuid())

  // Form states
  const [displayName, setDisplayName] = useState(user?.displayName || 'Alex Vance')
  const [username, setUsername] = useState(user?.username || 'alexvance')
  const [email, setEmail] = useState(user?.email || 'contato@email.com')
  const [profileName, setProfileName] = useState(user?.displayName || 'Alex Vance')
  const [network, setNetwork] = useState<'Ethereum' | 'Polygon'>('Ethereum')
  const [walletType, setWalletType] = useState<'MetaMask' | 'WalletConnect' | 'Coinbase Wallet'>('MetaMask')
  const [walletAddress, setWalletAddress] = useState(wallets[0]?.address || '0xA91FE82C3D921898710B')
  const [ensName, setEnsName] = useState(user?.ensName || 'alex.kurio.eth')
  const [secondaryWallet, setSecondaryWallet] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [collectorNote, setCollectorNote] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const items = quote?.items || []

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!displayName || !email || !walletAddress) {
      setFormError('Por favor preencha todos os campos obrigatórios (*).')
      return
    }

    try {
      const order = await createOrder.mutateAsync({
        idempotencyKey,
        payload: {
          quoteVersion: quote?.quoteVersion || Date.now(),
          collectorName: displayName,
          collectorEmail: email,
          walletAddress,
          network,
          walletType,
          ensName,
          referralCode,
          note: collectorNote,
        },
      })

      // Navigate to order confirmation snapshot
      navigate({
        to: '/order/$id',
        params: { id: order.id },
      })
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          'Falha ao confirmar compra. Verifique sua conexão e tente novamente.'
      )
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-black text-text-primary">Carrinho vazio</h2>
        <p className="text-xs font-mono text-text-secondary">
          Adicione itens ao carrinho antes de prosseguir para o pagamento.
        </p>
        <Link to="/">
          <Button variant="brand" size="sm" className="font-mono mt-3">
            Explorar Mercado
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-text-secondary flex items-center gap-2">
        <Link to="/" className="hover:text-brand transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link to="/" search={{ collection: 'Todos os NFTs' }} className="hover:text-brand transition-colors">
          Mercado
        </Link>
        <span>/</span>
        <span className="text-brand font-semibold">Pagamento</span>
      </nav>

      {formError && (
        <div className="p-4 bg-red-950/40 border border-status-error text-status-error text-xs font-mono flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleConfirmPurchase} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Perfil do colecionador & Carteira (Figma Page 3 & 4) */}
        <div className="lg:col-span-7 flex flex-col gap-6 bg-surface-card border border-surface-border p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <h2 className="text-xl font-bold text-text-primary tracking-wide">
              Perfil do colecionador
            </h2>
            <span className="text-xs font-mono text-text-muted">* Campos obrigatórios</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome de exibição*"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <Input
              label="Nome de usuário*"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-wide text-text-secondary">
                Rede*
              </label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as any)}
                className="h-11 w-full bg-surface-card border border-surface-border px-3 text-sm text-text-primary focus:outline-none focus:border-brand font-mono"
              >
                <option value="Ethereum">Rede principal Ethereum</option>
                <option value="Polygon">Rede Polygon</option>
              </select>
            </div>

            <Input
              label="Nome do perfil*"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Endereço da carteira*"
              placeholder="Endereço 0x da carteira"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              required
            />
            <Input
              label="ENS ou carteira secundária (opcional)"
              placeholder="ex: nova.kurio.eth"
              value={secondaryWallet}
              onChange={(e) => setSecondaryWallet(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-wide text-text-secondary">
                Tipo de carteira*
              </label>
              <select
                value={walletType}
                onChange={(e) => setWalletType(e.target.value as any)}
                className="h-11 w-full bg-surface-card border border-surface-border px-3 text-sm text-text-primary focus:outline-none focus:border-brand font-mono"
              >
                <option value="MetaMask">MetaMask</option>
                <option value="WalletConnect">WalletConnect</option>
                <option value="Coinbase Wallet">Coinbase Wallet</option>
              </select>
            </div>

            <Input
              label="Código de indicação"
              placeholder="código opcional"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="E-mail*"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Nome ENS*"
              value={ensName}
              onChange={(e) => setEnsName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-wide text-text-secondary">
              Observação do colecionador (opcional)
            </label>
            <textarea
              rows={3}
              value={collectorNote}
              onChange={(e) => setCollectorNote(e.target.value)}
              placeholder="Detalhes ou instruções para a transação..."
              className="w-full bg-surface-card border border-surface-border p-3 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        {/* Right Summary: Seus NFTs & Seleção de Carteira (Figma Page 3 & 12) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-card border border-surface-border p-6 flex flex-col gap-5">
            <h3 className="font-mono text-sm font-bold text-text-primary uppercase tracking-wider border-b border-surface-border pb-3">
              Seus NFTs ({items.length})
            </h3>

            {/* Compact items list */}
            <div className="divide-y divide-surface-border/50 max-h-60 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.id} className="py-2.5 flex items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={i.mediaUrl}
                      alt={i.name}
                      className="w-10 h-10 object-cover rounded-xs border border-surface-border flex-shrink-0"
                    />
                    <div className="flex flex-col truncate">
                      <span className="font-semibold text-text-primary truncate">
                        {i.name} (x {i.quantity})
                      </span>
                      <span className="text-[10px] text-text-muted">
                        ID do token: {i.tokenId}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-brand flex-shrink-0">{i.subtotalEth} ETH</span>
                </div>
              ))}
            </div>

            {/* Wallet Selection Card */}
            <div className="border-t border-surface-border pt-4 flex flex-col gap-3 font-mono text-xs">
              <span className="font-bold text-text-primary uppercase tracking-wider">
                Carteira conectada
              </span>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 p-3 border border-brand bg-brand/5 cursor-pointer rounded-xs">
                  <input
                    type="radio"
                    name="wallet_choice"
                    defaultChecked
                    className="accent-brand"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-text-primary">{walletAddress}</span>
                    <span className="text-[10px] text-text-secondary">
                      {network === 'Ethereum' ? 'Rede principal Ethereum' : 'Rede Polygon'} • {walletType}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="border-t border-surface-border pt-4 flex flex-col gap-2.5 font-mono text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-text-primary font-bold">{quote?.subtotalEth} ETH</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Desconto do lançamento</span>
                <span className="text-brand">(-) {quote?.discountEth} ETH</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Taxa de rede estimada</span>
                <span className="text-text-primary">{quote?.networkFeeEth} ETH</span>
              </div>
              <div className="border-t border-surface-border pt-3 flex justify-between items-center text-sm font-bold">
                <span className="text-text-primary">Total:</span>
                <span className="text-xl text-brand font-black">{quote?.totalEth} ETH</span>
              </div>
            </div>

            {/* Confirm Purchase Button with Idempotency Protection */}
            <Button
              type="submit"
              variant="brand"
              size="lg"
              isLoading={createOrder.isPending}
              className="w-full font-mono font-bold tracking-wider uppercase text-sm mt-2"
            >
              Confirmar compra
            </Button>

            <Link
              to="/cart"
              className="flex items-center justify-center gap-1.5 font-mono text-xs text-text-muted hover:text-brand transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao carrinho</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
