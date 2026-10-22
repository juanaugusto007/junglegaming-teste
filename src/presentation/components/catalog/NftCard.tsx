import React from 'react'
import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { Nft } from '../../../domain/nft/types'
import { useToggleFavoriteMutation } from '../../../application/nft/useNfts'
import { Badge } from '../ui/Badge'

interface NftCardProps {
  nft: Nft
}

export const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const toggleFavorite = useToggleFavoriteMutation()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite.mutate({ nftId: nft.id })
  }

  return (
    <div className="group relative flex flex-col bg-surface-card border border-surface-border hover:border-brand/70 transition-all duration-300 rounded-sm overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1">
      {/* Media Container */}
      <Link
        to="/nft/$id"
        params={{ id: nft.id }}
        className="relative aspect-square w-full overflow-hidden bg-surface-elevated block"
      >
        <picture>
          {nft.mediaWebpUrl && <source srcSet={nft.mediaWebpUrl} type="image/webp" />}
          <img
            src={nft.mediaUrl}
            alt={nft.name}
            loading="lazy"
            width={320}
            height={320}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </picture>

        {/* Rarity Badge overlay */}
        {nft.rarity && (
          <div className="absolute top-3 left-3">
            <Badge variant={nft.rarity === 'RARO' ? 'raro' : nft.rarity === 'ÚNICO' ? 'unico' : 'lendario'}>
              {nft.rarity}
            </Badge>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={nft.isFavorite ? `Remover ${nft.name} dos favoritos` : `Adicionar ${nft.name} aos favoritos`}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/60 backdrop-blur-md hover:bg-background/90 text-text-primary transition-colors z-10"
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${
              nft.isFavorite ? 'fill-brand text-brand' : 'text-text-secondary hover:text-text-primary'
            }`}
          />
        </button>
      </Link>

      {/* Details Container */}
      <div className="p-4 flex flex-col gap-2">
        <Link
          to="/nft/$id"
          params={{ id: nft.id }}
          className="hover:text-brand transition-colors"
        >
          <h3 className="font-semibold text-text-primary text-base truncate">
            {nft.name}
          </h3>
        </Link>

        {/* Price & Edition row */}
        <div className="flex items-center justify-between font-mono text-sm pt-1">
          <span className="text-brand font-bold">
            {nft.price} ETH
          </span>
          {nft.originalPrice && (
            <span className="text-text-muted line-through text-xs">
              {nft.originalPrice} ETH
            </span>
          )}
          <span className="text-xs text-text-secondary bg-surface-elevated px-2 py-0.5 rounded-xs border border-surface-border">
            {nft.editionType}
          </span>
        </div>
      </div>
    </div>
  )
}
