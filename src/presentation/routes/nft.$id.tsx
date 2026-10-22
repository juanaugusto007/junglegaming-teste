import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Heart, Star, Share2, Check, AlertCircle } from 'lucide-react'
import { useNftDetailQuery, useToggleFavoriteMutation } from '../../application/nft/useNfts'
import { useCart } from '../../application/cart/useCart'
import { Button } from '../components/ui/Button'
import { Badge, Skeleton } from '../components/ui/Badge'
import { EditionType } from '../../domain/nft/types'

export const Route = createFileRoute('/nft/$id')({
  component: NftDetailPage,
})

function NftDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: nft, isLoading, isError } = useNftDetailQuery(id)
  const toggleFavorite = useToggleFavoriteMutation()
  const { addToCart, isAdding } = useCart()

  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [selectedEdition, setSelectedEdition] = useState<EditionType>('1/50')
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 flex gap-4">
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-16 h-16" />
              ))}
            </div>
            <Skeleton className="aspect-square flex-1" />
          </div>
          <div className="lg:col-span-6 flex flex-col gap-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !nft) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
        <AlertCircle className="w-16 h-16 text-status-error" />
        <h1 className="text-3xl font-black text-text-primary">NFT Não Encontrado</h1>
        <p className="text-text-secondary font-mono text-sm">
          O token ou identificador solicitado não existe ou foi removido do catálogo.
        </p>
        <Link to="/">
          <Button variant="brand" size="md">
            Voltar para o Mercado
          </Button>
        </Link>
      </div>
    )
  }

  const handleAddToCart = async () => {
    try {
      await addToCart({ nftId: nft.id, quantity: selectedQuantity })
      setFeedbackSuccess(true)
      setTimeout(() => setFeedbackSuccess(false), 3000)
    } catch {
      // Error handled by query
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    navigate({ to: '/cart' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-text-secondary flex items-center gap-2">
        <Link to="/" className="hover:text-brand transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link to="/" search={{ collection: 'Todos os NFTs', page: 1, limit: 8 }} className="hover:text-brand transition-colors">
          Mercado
        </Link>
        <span>/</span>
        <span className="text-brand font-semibold">{nft.name}</span>
      </nav>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Gallery with Thumbnails */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails list */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto pb-2 sm:pb-0">
            {Array.from({ length: 4 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border-2 border-brand/80 overflow-hidden bg-surface-card hover:opacity-90 transition-opacity"
              >
                <img
                  src={nft.mediaUrl}
                  alt={`${nft.name} miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Large Image Display */}
          <div className="relative aspect-square flex-1 bg-surface-card border border-surface-border rounded-sm overflow-hidden group shadow-2xl">
            <picture>
              {nft.mediaWebpUrl && <source srcSet={nft.mediaWebpUrl} type="image/webp" />}
              <img
                src={nft.mediaUrl}
                alt={nft.name}
                width={600}
                height={600}
                loading="eager"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </picture>
            <div className="absolute top-4 left-4">
              <Badge variant={nft.rarity === 'RARO' ? 'raro' : 'unico'}>{nft.rarity}</Badge>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Edition Selector, Price & Purchase Action */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              {nft.name}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-center gap-6 font-mono text-sm pt-2">
              <span className="text-2xl sm:text-3xl font-black text-brand">
                {nft.price} ETH
              </span>
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <div className="flex text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-brand text-brand" />
                  ))}
                </div>
                <span>{nft.reviewsCount} avaliações de colecionadores</span>
              </div>
            </div>
          </div>

          {/* About NFT Text */}
          <div className="flex flex-col gap-2 border-t border-surface-border pt-4">
            <span className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider">
              Sobre este NFT:
            </span>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              {nft.description}
            </p>
          </div>

          {/* Edition Selector (Exact Figma buttons: 1/1, 1/10, 1/50, ABERTA) */}
          <div className="flex flex-col gap-2 border-t border-surface-border pt-4">
            <span className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider">
              Edição:
            </span>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {(['1/1', '1/10', '1/50', 'ABERTA'] as EditionType[]).map((ed) => (
                <button
                  key={ed}
                  type="button"
                  onClick={() => setSelectedEdition(ed)}
                  className={`px-4 py-2 border font-bold transition-colors ${
                    selectedEdition === ed
                      ? 'bg-brand text-background border-brand'
                      : 'bg-surface-card text-text-secondary border-surface-border hover:border-brand hover:text-text-primary'
                  }`}
                >
                  {ed}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Purchase Actions */}
          <div className="flex flex-col gap-4 border-t border-surface-border pt-4">
            <div className="flex items-center gap-4">
              {/* Stepper +/- */}
              <div className="flex items-center border border-surface-border bg-surface-card font-mono text-sm">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  disabled={selectedQuantity <= 1}
                  onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-elevated disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-text-primary">
                  {selectedQuantity}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  disabled={selectedQuantity >= nft.availableQuantity}
                  onClick={() => setSelectedQuantity((q) => Math.min(nft.availableQuantity, q + 1))}
                  className="w-10 h-11 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-elevated disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Buy / Add to Cart Button */}
              <Button
                onClick={handleBuyNow}
                isLoading={isAdding}
                variant="brand"
                size="md"
                className="flex-1 font-mono uppercase font-bold tracking-wider"
              >
                COMPRAR
              </Button>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite.mutate({ nftId: nft.id })}
                aria-label={nft.isFavorite ? 'Remover dos favoritos' : 'Favoritar este NFT'}
                className="h-11 px-4 flex items-center gap-2 border border-surface-border bg-surface-card hover:border-brand text-text-primary transition-colors font-mono text-xs"
              >
                <Heart
                  className={`w-4 h-4 ${
                    nft.isFavorite ? 'fill-brand text-brand' : 'text-text-secondary'
                  }`}
                />
                <span className="hidden sm:inline">Favoritar</span>
              </button>
            </div>

            {feedbackSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-status-success text-status-success text-xs font-mono flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>NFT adicionado ao carrinho com sucesso!</span>
              </div>
            )}
          </div>

          {/* Metadata Specifications */}
          <div className="border-t border-surface-border pt-4 flex flex-col gap-2 font-mono text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="text-text-muted">ID do token:</span>
              <span className="text-text-primary font-bold">{nft.tokenId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Coleção:</span>
              <span className="text-text-primary">{nft.collection}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Atributos:</span>
              <span className="text-brand">
                {nft.attributes.map((a) => a.value).join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-text-muted">Compartilhar:</span>
              <div className="flex items-center gap-3 text-text-secondary">
                <Share2 className="w-4 h-4 hover:text-brand cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Detalhes do NFT & Avaliações */}
      <div className="border-t border-surface-border pt-8 flex flex-col gap-6">
        <div className="flex items-center gap-8 font-mono text-sm border-b border-surface-border pb-3">
          <button
            onClick={() => setActiveTab('details')}
            className={`font-bold transition-all ${
              activeTab === 'details'
                ? 'text-brand border-b-2 border-brand pb-2'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Detalhes do NFT
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`font-bold transition-all ${
              activeTab === 'reviews'
                ? 'text-brand border-b-2 border-brand pb-2'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Avaliações de colecionadores ({nft.reviewsCount})
          </button>
        </div>

        {activeTab === 'details' ? (
          <div className="space-y-4 text-xs font-mono text-text-secondary leading-relaxed max-w-4xl">
            <p>
              {nft.name} é uma obra digital finalizada à mão da coleção Kurio Editions. Cada
              atributo fica armazenado nos metadados do token e verificado na rede Ethereum. A obra
              explora identidade, movimento e luz em um mundo digital sem fronteiras.
            </p>
            <p>
              A propriedade inclui a arte em alta resolução, lançamentos exclusivos para
              colecionadores e um registro permanente de procedência registrada na rede. Nova Sato
              recebe 5% de direitos autorais nas vendas secundárias.
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-text-muted">
              <div>
                <strong className="text-text-primary">Rede:</strong> Cunhado na {nft.network} com
                procedência imutável e metadados armazenados no IPFS.
              </div>
              <div>
                <strong className="text-text-primary">Contrato:</strong> Direitos autorais do criador:
                5% nas vendas secundárias, pagos automaticamente.
              </div>
              <div>
                <strong className="text-text-primary">Direitos autorais:</strong>{' '}
                {nft.contractAddress} • Contrato inteligente ERC-721 verificado.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 bg-surface-card border border-surface-border flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary">0xA91F...E82C</span>
                <span className="text-text-muted">14 de Outubro, 2026</span>
              </div>
              <div className="flex text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-brand" />
                ))}
              </div>
              <p className="text-text-secondary">
                Arte espetacular. Acabamento perfeito e transferência rápida na rede principal.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
