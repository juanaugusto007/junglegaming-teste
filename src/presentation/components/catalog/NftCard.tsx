import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Heart, ShoppingBag, Search } from 'lucide-react'
import { Nft } from '../../../domain/nft/types'
import { useToggleFavoriteMutation } from '../../../application/nft/useNfts'
import { useCart } from '../../../application/cart/useCart'

interface NftCardProps {
  nft: Nft
}

export const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const toggleFavorite = useToggleFavoriteMutation()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite.mutate({ nftId: nft.id })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ nftId: nft.id, quantity: 1 })
  }

  return (
    <div className="group relative flex flex-col gap-3 transition-all duration-300">
      {/* Media Container with Image & Hover Actions (Exact Figma Page 0: rounded-2xl) */}
      <Link
        to="/nft/$id"
        params={{ id: nft.id }}
        className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#E6DFD5] block shadow-sm hover:shadow-xl transition-shadow"
      >
        <img
          src={nft.mediaUrl}
          alt={nft.name}
          loading="lazy"
          width={320}
          height={320}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Rarity Badge (Exact Figma Page 0: Orange pill/tag) */}
        {nft.rarity && (
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-brand text-[#0E0C0A] rounded-xs shadow-md">
              {nft.rarity}
            </span>
          </div>
        )}

        {/* Top Right Heart Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={nft.isFavorite ? `Remover ${nft.name} dos favoritos` : `Adicionar ${nft.name} aos favoritos`}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-background/60 backdrop-blur-md hover:bg-background/90 text-text-primary transition-colors z-10"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform duration-200 active:scale-125 ${nft.isFavorite ? 'fill-brand text-brand' : 'text-text-secondary hover:text-text-primary'
              }`}
          />
        </button>

        {/* Floating Quick Action Bar on Hover (Exact Figma Page 5 & 6) */}
        <div className="absolute inset-x-4 bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="flex items-center gap-1 bg-[#14100D]/90 backdrop-blur-md border border-[#3A3026] p-1.5 rounded-xs shadow-xl">
            <button
              onClick={handleAddToCart}
              aria-label={`Adicionar ${nft.name} ao carrinho`}
              title="Adicionar ao carrinho"
              className="p-1.5 text-text-secondary hover:text-brand hover:bg-[#251D16] transition-colors rounded-xs"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <span className="w-px h-3.5 bg-[#3A3026]" />
            <button
              onClick={handleFavoriteClick}
              aria-label="Favoritar"
              title="Favoritar"
              className="p-1.5 text-text-secondary hover:text-brand hover:bg-[#251D16] transition-colors rounded-xs"
            >
              <Heart className={`w-4 h-4 ${nft.isFavorite ? 'fill-brand text-brand' : ''}`} />
            </button>
            <span className="w-px h-3.5 bg-[#3A3026]" />
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate({ to: '/nft/$id', params: { id: nft.id } })
              }}
              aria-label="Ver detalhes"
              title="Ver detalhes"
              className="p-1.5 text-text-secondary hover:text-brand hover:bg-[#251D16] transition-colors rounded-xs"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>

      {/* Details Container */}
      <div className="flex flex-col gap-1 font-mono px-0.5">
        <Link
          to="/nft/$id"
          params={{ id: nft.id }}
          className="hover:text-brand transition-colors"
        >
          <h3 className="font-mono font-bold text-text-primary text-sm truncate tracking-tight">
            {nft.name}
          </h3>
        </Link>

        {/* Price & Strikethrough row */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-brand font-bold">
            {nft.price} ETH
          </span>
          {nft.originalPrice && (
            <span className="text-text-muted line-through text-xs">
              {nft.originalPrice} ETH
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
