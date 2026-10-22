import React, { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'

interface CatalogFiltersProps {
  currentCollection?: string
  currentSort?: string
  currentSearch?: string
  currentNetwork?: string
  priceMin?: string
  priceMax?: string
  onFilterChange: (filters: {
    collection?: string
    sortBy?: string
    search?: string
    network?: string
    priceMin?: string
    priceMax?: string
    page?: number
  }) => void
}

const COLLECTIONS_LIST = [
  { name: 'Todos os NFTs', count: 180 },
  { name: 'Arte digital', count: 33 },
  { name: 'Fotografia', count: 12 },
  { name: 'Música', count: 65 },
  { name: 'Arte 3D', count: 39 },
  { name: 'Colecionáveis', count: 23 },
  { name: 'Generativa', count: 17 },
  { name: 'Jogos', count: 19 },
  { name: 'Assinaturas', count: 13 },
  { name: 'Utilidade', count: 18 },
]

const NETWORKS_LIST = [
  { name: 'Ethereum', count: 119 },
  { name: 'Polygon', count: 78 },
  { name: 'Solana', count: 86 },
]

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  currentCollection = 'Todos os NFTs',
  currentSort = 'recent',
  currentSearch = '',
  currentNetwork = '',
  priceMin = '',
  priceMax = '',
  onFilterChange,
}) => {
  const [minPriceInput, setMinPriceInput] = useState(priceMin)
  const [maxPriceInput, setMaxPriceInput] = useState(priceMax)
  const [searchInput, setSearchInput] = useState(currentSearch)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ search: searchInput, page: 1 })
  }

  const handlePriceFilter = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ priceMin: minPriceInput, priceMax: maxPriceInput, page: 1 })
  }

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-8">
      {/* Search Input for Mobile/Sidebar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          id="catalog-search-input"
          type="text"
          placeholder="Buscar NFTs, criadores..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-surface-card border border-surface-border px-4 py-2.5 pl-10 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand"
        />
        <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
      </form>

      {/* Collections Category List */}
      <div className="flex flex-col gap-3">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
          Coleções
        </h3>
        <div className="flex flex-col space-y-1 font-mono text-xs">
          {COLLECTIONS_LIST.map((col) => {
            const isActive =
              currentCollection.toLowerCase() === col.name.toLowerCase() ||
              (!currentCollection && col.name === 'Todos os NFTs')

            return (
              <button
                key={col.name}
                type="button"
                onClick={() => onFilterChange({ collection: col.name, page: 1 })}
                className={`flex items-center justify-between py-1.5 px-2 rounded-xs transition-colors text-left ${
                  isActive
                    ? 'bg-surface-elevated text-brand font-bold border-l-2 border-brand'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50'
                }`}
              >
                <span>{col.name}</span>
                <span className="text-text-muted font-normal">({col.count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="flex flex-col gap-3 border-t border-surface-border pt-6">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
          Faixa de preço (ETH)
        </h3>
        <form onSubmit={handlePriceFilter} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Mín"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-full bg-surface-card border border-surface-border px-3 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand"
            />
            <span className="text-text-muted font-mono">-</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Máx"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-full bg-surface-card border border-surface-border px-3 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand"
            />
          </div>
          <Button type="submit" size="sm" variant="brand" className="w-full font-mono text-xs">
            Aplicar
          </Button>
        </form>
      </div>

      {/* Network Filter */}
      <div className="flex flex-col gap-3 border-t border-surface-border pt-6">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
          Rede
        </h3>
        <div className="flex flex-col space-y-1 font-mono text-xs">
          {NETWORKS_LIST.map((net) => {
            const isActive = currentNetwork.toLowerCase() === net.name.toLowerCase()
            return (
              <button
                key={net.name}
                type="button"
                onClick={() =>
                  onFilterChange({
                    network: isActive ? undefined : net.name,
                    page: 1,
                  })
                }
                className={`flex items-center justify-between py-1.5 px-2 rounded-xs transition-colors text-left ${
                  isActive
                    ? 'bg-surface-elevated text-brand font-bold border-l-2 border-brand'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50'
                }`}
              >
                <span>{net.name}</span>
                <span className="text-text-muted font-normal">({net.count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Featured Sidebar Promo (Exact Figma layout) */}
      <div className="border border-surface-border bg-surface-card p-4 rounded-sm flex flex-col gap-3">
        <div className="flex items-center justify-between font-mono">
          <span className="text-[11px] font-bold text-brand uppercase tracking-wider">
            NFT em Destaque
          </span>
          <span className="text-[10px] text-text-muted font-mono">OFERTA LIMITADA</span>
        </div>
        <div className="relative aspect-square w-full rounded-sm overflow-hidden bg-surface-elevated">
          <img
            src="/assets/nfts/featured-hero-ape.webp"
            alt="Destaque Kurio"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-text-primary truncate">Sage Nomad #009</span>
          <span className="text-xs font-mono text-brand font-bold">1.69 ETH</span>
        </div>
      </div>
    </aside>
  )
}
