import React, { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Trash2, AlertCircle, Check, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../../application/cart/useCart'
import { useNftsQuery } from '../../application/nft/useNfts'
import { NftCard } from '../components/catalog/NftCard'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Badge'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const navigate = useNavigate()
  const { data: recommendedNfts } = useNftsQuery({ limit: 5 })
  const {
    quote,
    isLoading,
    realtimeNotice,
    clearNotice,
    updateQuantity,
    removeItem,
    applyCoupon,
    isApplyingCoupon,
    removeCoupon,
  } = useCart()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    setCouponError(null)
    try {
      await applyCoupon(couponInput)
      setCouponInput('')
    } catch (err: any) {
      setCouponError(err?.response?.data?.message || 'Cupom inválido ou expirado.')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const items = quote?.items || []

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
        <span className="text-brand font-semibold">Carrinho</span>
      </nav>

      {/* Realtime Alert Banner */}
      {realtimeNotice && (
        <div className="p-4 bg-amber-950/40 border border-brand text-brand text-xs font-mono flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{realtimeNotice}</span>
          </div>
          <button
            onClick={clearNotice}
            className="text-text-primary hover:text-brand font-bold"
          >
            Dispensar
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="py-20 text-center bg-surface-card border border-surface-border flex flex-col items-center gap-4 my-8">
          <ShoppingBag className="w-16 h-16 text-text-muted" />
          <h2 className="text-2xl font-black text-text-primary">Seu carrinho está vazio</h2>
          <p className="text-xs font-mono text-text-secondary max-w-md">
            Você ainda não adicionou nenhum colecionável. Explore nosso catálogo e descubra
            peças raras de criadores selecionados.
          </p>
          <Link to="/">
            <Button variant="brand" size="md" className="mt-4 font-mono">
              Explorar NFTs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Table / List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="border border-surface-border bg-surface-card overflow-hidden">
              {/* Header row (Desktop) */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-surface-border font-mono text-xs text-text-muted uppercase tracking-wider">
                <span className="col-span-6">NFTs</span>
                <span className="col-span-2 text-right">Preço</span>
                <span className="col-span-2 text-center">Edições</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-surface-border">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:px-6 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                  >
                    {/* Item Info */}
                    <div className="sm:col-span-6 flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-surface-elevated border border-surface-border overflow-hidden rounded-xs">
                        <img
                          src={item.mediaUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <Link
                          to="/nft/$id"
                          params={{ id: item.nftId }}
                          className="font-semibold text-text-primary text-sm sm:text-base hover:text-brand transition-colors truncate"
                        >
                          {item.name}
                        </Link>
                        <span className="text-xs font-mono text-text-muted">
                          ID do token: {item.tokenId}
                        </span>
                        <span className="text-[11px] font-mono text-brand">
                          {item.editionType}
                        </span>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 text-left sm:text-right font-mono text-sm text-text-secondary">
                      <span className="sm:hidden text-text-muted text-xs mr-2">Preço:</span>
                      {item.unitPriceEth} ETH
                    </div>

                    {/* Quantity Stepper */}
                    <div className="sm:col-span-2 flex items-center justify-start sm:justify-center">
                      <div className="flex items-center border border-surface-border bg-surface-elevated font-mono text-xs">
                        <button
                          type="button"
                          aria-label={`Diminuir quantidade de ${item.name}`}
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity - 1 })}
                          className="w-7 h-8 flex items-center justify-center hover:bg-surface-hover text-text-secondary hover:text-text-primary"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Aumentar quantidade de ${item.name}`}
                          disabled={item.quantity >= item.maxAvailable}
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                          className="w-7 h-8 flex items-center justify-center hover:bg-surface-hover text-text-secondary hover:text-text-primary disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 font-mono text-sm">
                      <span className="text-brand font-bold">{item.subtotalEth} ETH</span>
                      <button
                        onClick={() => removeItem({ itemId: item.id })}
                        aria-label={`Remover ${item.name} do carrinho`}
                        className="p-1 text-text-muted hover:text-status-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary Card (Exact Figma Page 2) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-card border border-surface-border p-6 flex flex-col gap-5">
              <h3 className="font-mono text-sm font-bold text-text-primary uppercase tracking-wider">
                Resumo da carteira
              </h3>

              {/* Promo Code Input */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-text-secondary">Código promocional</span>
                {quote?.appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-brand/10 border border-brand text-xs font-mono">
                    <div className="flex items-center gap-2 text-brand font-bold">
                      <Check className="w-4 h-4" />
                      <span>{quote.appliedCoupon.code} ({quote.appliedCoupon.discountPercent}% OFF)</span>
                    </div>
                    <button
                      onClick={() => removeCoupon()}
                      className="text-text-muted hover:text-status-error"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite o código promocional..."
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-surface-elevated border border-surface-border px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand uppercase"
                    />
                    <Button
                      type="submit"
                      variant="brand"
                      size="sm"
                      isLoading={isApplyingCoupon}
                      className="font-mono text-xs px-4"
                    >
                      Aplicar
                    </Button>
                  </form>
                )}
                {couponError && (
                  <span className="text-xs text-status-error font-mono">{couponError}</span>
                )}
                <span className="text-[11px] text-text-muted font-mono">
                  Dica de teste: use <strong className="text-brand">KURIO10</strong> ou <strong className="text-brand">JUNGLE20</strong>
                </span>
              </div>

              {/* Price Calculation Rows */}
              <div className="border-t border-surface-border pt-4 flex flex-col gap-3 font-mono text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="text-text-primary font-bold">{quote?.subtotalEth} ETH</span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span>Desconto do lançamento</span>
                  <span className="text-brand">(-) {quote?.discountEth} ETH</span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <div className="flex flex-col">
                    <span>Taxa de rede</span>
                    <span className="text-[10px] text-text-muted">Taxa estimada</span>
                  </div>
                  <span className="text-text-primary">{quote?.networkFeeEth} ETH</span>
                </div>

                <div className="border-t border-surface-border pt-4 flex justify-between items-center text-sm font-bold">
                  <span className="text-text-primary">Total</span>
                  <span className="text-xl text-brand font-black">{quote?.totalEth} ETH</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={() => navigate({ to: '/checkout' })}
                variant="brand"
                size="lg"
                className="w-full font-mono text-xs font-bold uppercase tracking-wider mt-2 gap-2"
              >
                <span>Conectar e finalizar</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Link
                to="/"
                className="text-center font-mono text-xs text-text-muted hover:text-brand transition-colors pt-1"
              >
                Continuar explorando
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Colecionadores também viram (Exact Figma Page 2) */}
      <div className="flex flex-col gap-6 mt-12 border-t border-surface-border pt-10">
        <h3 className="font-mono text-base font-bold text-brand uppercase tracking-wider">
          Colecionadores também viram
        </h3>
        {recommendedNfts && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {recommendedNfts.items.slice(0, 5).map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <span className="w-2 h-2 rounded-full bg-brand" />
          <span className="w-2 h-2 rounded-full bg-[#3A3026]" />
          <span className="w-2 h-2 rounded-full bg-[#3A3026]" />
        </div>
      </div>
    </div>
  )
}
