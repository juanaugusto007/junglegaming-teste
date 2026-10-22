import React, { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useWallets } from '../../application/wallet/useWallets'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Plus, Check } from 'lucide-react'

export const Route = createFileRoute('/wallets')({
  component: WalletsPage,
})

function WalletsPage() {
  const { wallets, addWallet, isAdding } = useWallets()

  const [nickname, setNickname] = useState('')
  const [network, setNetwork] = useState<'Ethereum' | 'Polygon'>('Ethereum')
  const [address, setAddress] = useState('')
  const [provider, setProvider] = useState<'MetaMask' | 'WalletConnect' | 'Coinbase Wallet'>('MetaMask')
  const [successMsg, setSuccessMsg] = useState(false)

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname || !address) return

    try {
      await addWallet({
        nickname,
        network,
        address,
        provider,
      })
      setSuccessMsg(true)
      setNickname('')
      setAddress('')
      setTimeout(() => setSuccessMsg(false), 3000)
    } catch {
      // Error
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 flex flex-col gap-8">
      <div className="border-b border-surface-border pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary">
          Carteiras do colecionador
        </h1>
        <p className="text-xs font-mono text-text-secondary mt-1">
          Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Sidebar Tabs */}
        <aside className="lg:col-span-3 flex flex-col gap-1 font-mono text-xs">
          <Link
            to="/profile"
            className="px-3 py-2.5 text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50 transition-colors"
          >
            Dados do perfil
          </Link>
          <span className="px-3 py-2.5 font-bold text-brand bg-surface-elevated border-l-2 border-brand cursor-pointer">
            Carteiras
          </span>
          <span className="px-3 py-2.5 text-text-muted cursor-pointer hover:text-text-secondary">
            Atividade
          </span>
          <span className="px-3 py-2.5 text-text-muted cursor-pointer hover:text-text-secondary">
            Lista de interesse
          </span>
        </aside>

        {/* Wallets Management Content */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          {/* Registered Wallets List */}
          <div className="flex flex-col gap-4">
            <h2 className="font-mono text-sm font-bold text-text-primary uppercase tracking-wider">
              Carteiras Cadastradas ({wallets.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              {wallets.map((w) => (
                <div
                  key={w.id}
                  className={`p-5 bg-surface-card border flex flex-col gap-3 rounded-xs ${
                    w.isPrimary ? 'border-brand' : 'border-surface-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary text-sm">{w.nickname}</span>
                    {w.isPrimary && (
                      <span className="text-[10px] bg-brand text-background px-2 py-0.5 font-bold uppercase tracking-wider">
                        Principal
                      </span>
                    )}
                  </div>

                  <p className="text-brand font-bold text-xs truncate">{w.address}</p>

                  <div className="flex items-center justify-between text-text-muted text-[11px] border-t border-surface-border pt-2">
                    <span>{w.network} • {w.provider}</span>
                    <span className="text-text-primary font-bold">{w.balanceEth} ETH</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Wallet Form (Figma Page 8) */}
          <form
            onSubmit={handleAddWallet}
            className="bg-surface-card border border-surface-border p-6 sm:p-8 flex flex-col gap-6"
          >
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-mono text-sm font-bold text-text-primary uppercase tracking-wider">
                Adicionar nova carteira
              </h3>
              <span className="text-xs font-mono text-text-muted">* Campos obrigatórios</span>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-status-success text-status-success text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Nova carteira conectada e salva com sucesso!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Apelido da carteira*"
                placeholder="ex: Ledger Fria / Carteira Mobile"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />

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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Endereço da carteira*"
                placeholder="Endereço 0x da carteira ou ENS"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono tracking-wide text-text-secondary">
                  Tipo de carteira*
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="h-11 w-full bg-surface-card border border-surface-border px-3 text-sm text-text-primary focus:outline-none focus:border-brand font-mono"
                >
                  <option value="MetaMask">MetaMask</option>
                  <option value="WalletConnect">WalletConnect</option>
                  <option value="Coinbase Wallet">Coinbase Wallet</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              variant="brand"
              size="md"
              isLoading={isAdding}
              className="font-mono text-xs font-bold uppercase tracking-wider self-start px-8 gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Carteira</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
