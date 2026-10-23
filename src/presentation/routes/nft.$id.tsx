import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Heart, Star, Check, AlertCircle, Search, ChevronLeft, ShoppingBag } from 'lucide-react'
import { useNftDetailQuery, useToggleFavoriteMutation, useNftsQuery } from '../../application/nft/useNfts'
import { useCart } from '../../application/cart/useCart'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Badge'
import { EditionType } from '../../domain/nft/types'

export const Route = createFileRoute('/nft/$id')({
  component: NftDetailPage,
})

function NftDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: nft, isLoading, isError } = useNftDetailQuery(id)
  const { data: relatedData } = useNftsQuery({ limit: 6 })
  const toggleFavorite = useToggleFavoriteMutation()
  const { addToCart, isAdding } = useCart()

  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [selectedEdition, setSelectedEdition] = useState<EditionType>('1/50')
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)
  const [selectedThumb, setSelectedThumb] = useState(0)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 flex gap-4">
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-16 h-16 rounded-xl" />
              ))}
            </div>
            <Skeleton className="aspect-square flex-1 rounded-3xl" />
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
        <h1 className="text-3xl font-black text-text-primary font-mono">NFT Não Encontrado</h1>
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

  // Filter recommendations to exclude current NFT and take up to 5
  const recommendations = relatedData?.items?.filter((item) => item.id !== nft.id).slice(0, 5) || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 flex flex-col gap-10 md:gap-14 pb-28 md:pb-12">
      {/* Mobile Top Header Bar (Exact Figma Page 10) */}
      <div className="md:hidden flex items-center justify-between -mt-2">
        <button
          onClick={() => navigate({ to: '/' })}
          aria-label="Voltar para o Mercado"
          className="w-10 h-10 rounded-full bg-[#18130E] border border-[#2B231C] text-white flex items-center justify-center hover:border-brand transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => toggleFavorite.mutate({ nftId: nft.id })}
          aria-label={nft.isFavorite ? 'Remover dos favoritos' : 'Favoritar este NFT'}
          className="w-10 h-10 rounded-full bg-[#18130E] border border-[#2B231C] flex items-center justify-center hover:border-brand transition-colors cursor-pointer"
        >
          <Heart
            className={`w-5 h-5 ${nft.isFavorite ? 'fill-brand text-brand' : 'text-[#A0988E]'
              }`}
          />
        </button>
      </div>

      {/* Breadcrumb Navigation (Exact Figma: Início / Mercado) */}
      <nav aria-label="Breadcrumb" className="flex font-mono text-xs text-[#A0988E] items-center gap-2">
        <Link to="/" className="hover:text-brand transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link
          to="/"
          search={{ collection: 'Todos os NFTs', page: 1, limit: 8 }}
          className="hover:text-brand transition-colors text-white"
        >
          Mercado
        </Link>
      </nav>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery with Thumbnails & Zoom */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails list */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto pb-2 sm:pb-0">
            {Array.from({ length: 4 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedThumb(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#E6DFD5] transition-all cursor-pointer ${selectedThumb === idx ? 'border-2 border-brand ring-1 ring-brand' : 'border border-[#2B1D13] opacity-70 hover:opacity-100'
                  }`}
              >
                <img
                  src={nft.mediaUrl}
                  alt={`${nft.name} miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Large Image Display with Dark Outer Frame */}
          <div className="relative aspect-square flex-1 bg-[#19120C] p-3 sm:p-4 rounded-3xl border border-[#2B1D13] shadow-2xl flex items-center justify-center">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#E6DFD5]">
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

              {/* Magnifier Zoom Icon (Figma Page 1) */}
              <button
                type="button"
                aria-label="Ampliar visualização do NFT"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Edition Selector, Price & Purchase Action */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
              {nft.name}
            </h1>

            {/* Price & Rating (Exact Figma Page 1) */}
            <div className="flex flex-wrap items-center gap-6 font-mono pt-1">
              <span className="text-2xl sm:text-3xl font-black text-brand">
                {nft.price} ETH
              </span>
              <div className="flex items-center gap-2 text-xs text-[#D2A074]">
                <div className="flex text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-brand text-brand" />
                  ))}
                </div>
                <span>{nft.reviewsCount} avaliações de colecionadores</span>
              </div>
            </div>
          </div>

          {/* Sobre este NFT */}
          <div className="flex flex-col gap-2 pt-1 border-t border-[#2B231C]">
            <span className="font-mono text-xs font-bold text-white">
              Sobre este NFT:
            </span>
            <p className="text-xs sm:text-sm text-[#A0988E] leading-relaxed font-mono">
              {nft.description}
            </p>
          </div>

          {/* Edition Selector (Exact Figma rounded pill buttons: 1/1, 1/10, 1/50, ABERTA) */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="font-mono text-xs font-bold text-white">
              Edição:
            </span>
            <div className="flex flex-wrap gap-2.5 font-mono text-xs">
              {(['1/1', '1/10', '1/50', 'ABERTA'] as EditionType[]).map((ed) => {
                const isSelected = selectedEdition === ed
                return (
                  <button
                    key={ed}
                    type="button"
                    onClick={() => setSelectedEdition(ed)}
                    className={`px-4 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${isSelected
                      ? 'border-[#D88D41] text-[#D88D41] bg-[#22160E] ring-1 ring-[#D88D41]'
                      : 'border-[#3E291A] bg-[#140E09] text-[#A0988E] hover:text-white hover:border-[#5A3822]'
                      }`}
                  >
                    {ed}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantity Stepper & Actions (Exact Figma Page 1: solid orange +/- buttons, COMPRAR, Favoritar) */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-4">
              {/* Stepper with solid orange rounded buttons matching user print */}
              <div className="flex items-center gap-3 font-mono text-sm">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  disabled={selectedQuantity <= 1}
                  onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-11 sm:w-10 sm:h-12 rounded-xl bg-[#D88D41] hover:bg-[#E5974A] text-[#0E0C0A] flex items-center justify-center font-bold text-xl disabled:opacity-40 transition-colors cursor-pointer shadow-sm"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold text-base text-white">
                  {selectedQuantity}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  disabled={selectedQuantity >= nft.availableQuantity}
                  onClick={() => setSelectedQuantity((q) => Math.min(nft.availableQuantity, q + 1))}
                  className="w-9 h-11 sm:w-10 sm:h-12 rounded-xl bg-[#D88D41] hover:bg-[#E5974A] text-[#0E0C0A] flex items-center justify-center font-bold text-xl disabled:opacity-40 transition-colors cursor-pointer shadow-sm"
                >
                  +
                </button>
              </div>

              {/* Buy Button */}
              <button
                onClick={handleBuyNow}
                disabled={isAdding}
                className="px-8 py-3.5 bg-brand hover:bg-brand-hover text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                {isAdding ? 'Processando...' : 'COMPRAR'}
              </button>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite.mutate({ nftId: nft.id })}
                aria-label={nft.isFavorite ? 'Remover dos favoritos' : 'Favoritar este NFT'}
                className="px-5 py-3.5 flex items-center gap-2 border border-[#442B1B] bg-[#160F0A] hover:border-brand text-white transition-colors font-mono text-xs rounded-lg cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${nft.isFavorite ? 'fill-brand text-brand' : 'text-[#A0988E]'
                    }`}
                />
                <span>Favoritar</span>
              </button>
            </div>

            {feedbackSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-status-success text-status-success text-xs font-mono flex items-center gap-2 rounded-md animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>NFT adicionado ao carrinho com sucesso!</span>
              </div>
            )}
          </div>

          {/* Metadata Specifications (Exact Figma: ID, Coleção, Atributos, Compartilhar) */}
          <div className="pt-2 flex flex-col gap-2 font-mono text-xs text-[#A0988E]">
            <div className="flex items-center gap-2">
              <span>ID do token:</span>
              <span className="text-[#A0988E]">{nft.tokenId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Coleção:</span>
              <span className="text-[#A0988E]">{nft.collection}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Atributos:</span>
              <span className="text-[#A0988E]">
                {nft.attributes.map((a) => `${a.traitType ? `${a.traitType}: ` : ''}${a.value}`).join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-white font-bold">Compartilhar este NFT:</span>
              <div className="flex items-center gap-3 text-white">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-brand transition-colors text-xs font-bold">
                  in
                </a>
                <a href="mailto:?subject=Kurio%20NFT" className="hover:text-brand transition-colors text-xs">
                  ✉
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-brand transition-colors text-xs font-bold">
                  𝕏
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Detalhes do NFT & Avaliações */}
      <div className="border-t border-[#2B231C] pt-8 flex flex-col gap-6">
        <div className="flex items-center gap-8 font-mono text-sm border-b border-[#2B231C] pb-3">
          <button
            onClick={() => setActiveTab('details')}
            className={`font-bold transition-all cursor-pointer ${activeTab === 'details'
              ? 'text-brand border-b-2 border-brand pb-2'
              : 'text-[#D2A074] hover:text-white'
              }`}
          >
            Detalhes do NFT
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`font-bold transition-all cursor-pointer ${activeTab === 'reviews'
              ? 'text-brand border-b-2 border-brand pb-2'
              : 'text-[#D2A074] hover:text-white'
              }`}
          >
            Avaliações de colecionadores ({nft.reviewsCount})
          </button>
        </div>

        {activeTab === 'details' ? (
          <div className="space-y-4 text-xs font-mono text-[#D2A074] leading-relaxed max-w-4xl">
            <p>
              {nft.name} é uma obra digital {selectedEdition} finalizada à mão da coleção Kurio Editions. Cada
              atributo fica armazenado nos metadados do token e verificado na rede Ethereum. A obra
              explora identidade, movimento e luz em um mundo digital sem fronteiras.
            </p>
            <p>
              A propriedade inclui a arte em alta resolução, lançamentos exclusivos para
              colecionadores e um registro permanente de procedência registrada na rede. Nova Sato
              recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.
            </p>
            <div className="pt-2 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-white font-bold">Rede:</span>
                <span className="text-[#D2A074]">
                  Cunhado na {nft.network} com procedência imutável e metadados armazenados no IPFS.
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white font-bold">Contrato:</span>
                <span className="text-[#D2A074]">
                  Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white font-bold">Direitos autorais:</span>
                <span className="text-[#D2A074]">
                  {nft.contractAddress || '0x7A42...19E8'} • Contrato inteligente ERC-721 verificado.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 bg-[#14100D] border border-[#2B231C] rounded-md flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">0xA91F...E82C</span>
                <span className="text-[#6E6357]">14 de Outubro, 2026</span>
              </div>
              <div className="flex text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-brand" />
                ))}
              </div>
              <p className="text-[#A0988E]">
                Arte espetacular. Acabamento perfeito e transferência rápida na rede principal.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mais desta coleção (Exact Figma Page 1: 5 cards in a row + 3 pagination dots) */}
      <div className="border-t border-[#2B231C] pt-10 flex flex-col gap-8">
        <h3 className="font-mono text-sm sm:text-base font-bold text-brand uppercase tracking-wider">
          Mais desta coleção
        </h3>

        {/* 5 Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {recommendations.map((item) => (
            <Link
              key={item.id}
              to="/nft/$id"
              params={{ id: item.id }}
              className="flex flex-col gap-2.5 group cursor-pointer"
            >
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#E6DFD5] border border-surface-border shadow-sm group-hover:shadow-xl transition-all">
                <img
                  src={item.mediaUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col font-mono">
                <span className="font-bold text-xs sm:text-sm text-white group-hover:text-brand transition-colors line-clamp-1">
                  {item.name}
                </span>
                <span className="font-bold text-xs sm:text-sm text-brand">
                  {item.price} ETH
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 3 Pagination Dots (Exact Figma Page 1: middle dot highlighted) */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3D2E24]" />
          <div className="w-2.5 h-2.5 rounded-full bg-brand" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#3D2E24]" />
        </div>
      </div>

      {/* Mobile Sticky Purchase Bar (Exact Figma Page 10) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#16120E]/95 backdrop-blur-md border-t border-[#2B231C] px-4 py-3 pb-5 flex flex-col gap-2.5 shadow-2xl">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#A0988E]">Qtd.</span>
            <button
              onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
              disabled={selectedQuantity <= 1}
              className="w-7 h-7 rounded-full bg-[#2B231C] text-white flex items-center justify-center font-bold disabled:opacity-30 cursor-pointer"
            >
              −
            </button>
            <span className="w-4 text-center font-bold text-white">{selectedQuantity}</span>
            <button
              onClick={() => setSelectedQuantity((q) => Math.min(nft.availableQuantity, q + 1))}
              disabled={selectedQuantity >= nft.availableQuantity}
              className="w-7 h-7 rounded-full bg-[#2B231C] text-white flex items-center justify-center font-bold disabled:opacity-30 cursor-pointer"
            >
              +
            </button>
          </div>
          <span className="text-base font-black text-brand">{nft.price} ETH</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBuyNow}
            disabled={isAdding}
            className="flex-1 py-2.5 bg-brand hover:bg-brand-hover text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md cursor-pointer"
          >
            {isAdding ? 'Processando...' : 'Comprar NFT'}
          </button>
          <button
            onClick={handleAddToCart}
            aria-label="Adicionar ao carrinho"
            className="w-10 h-10 rounded-xl bg-[#251D16] border border-[#3A3026] text-brand flex items-center justify-center flex-shrink-0 hover:bg-[#32271E] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
