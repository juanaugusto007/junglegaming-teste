import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

interface CatalogFiltersProps {
  currentCollection?: string
  currentSort?: 'recent' | 'price_asc' | 'price_desc' | 'popular' | string
  currentSearch?: string
  currentNetwork?: string
  priceMin?: string
  priceMax?: string
  onFilterChange: (filters: {
    collection?: string
    sortBy?: 'recent' | 'price_asc' | 'price_desc' | 'popular' | string
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
  currentSearch = '',
  currentNetwork = '',
  priceMin = '',
  priceMax = '',
  onFilterChange,
}) => {
  const [minPriceInput, setMinPriceInput] = useState(priceMin)
  const [maxPriceInput, setMaxPriceInput] = useState(priceMax)
  const [searchInput, setSearchInput] = useState(currentSearch)

  const SLIDER_MAX = 15

  // Slider numerical values
  const [sliderMin, setSliderMin] = useState<number>(() => {
    const parsed = parseFloat(priceMin)
    return isNaN(parsed) ? 0 : Math.max(0, Math.min(parsed, SLIDER_MAX))
  })
  const [sliderMax, setSliderMax] = useState<number>(() => {
    const parsed = parseFloat(priceMax)
    return isNaN(parsed) ? SLIDER_MAX : Math.max(0, Math.min(parsed, SLIDER_MAX))
  })

  // Synchronize internal state with props if URL params change externally
  useEffect(() => {
    setSearchInput(currentSearch || '')
  }, [currentSearch])

  useEffect(() => {
    setMinPriceInput(priceMin || '')
    const parsed = parseFloat(priceMin)
    setSliderMin(isNaN(parsed) ? 0 : Math.max(0, Math.min(parsed, SLIDER_MAX)))
  }, [priceMin])

  useEffect(() => {
    setMaxPriceInput(priceMax || '')
    const parsed = parseFloat(priceMax)
    setSliderMax(isNaN(parsed) ? SLIDER_MAX : Math.max(0, Math.min(parsed, SLIDER_MAX)))
  }, [priceMax])

  // Debounced live search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (currentSearch || '')) {
        onFilterChange({ search: searchInput.trim() || undefined, page: 1 })
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [searchInput, currentSearch, onFilterChange])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ search: searchInput.trim() || undefined, page: 1 })
  }

  const handlePriceFilter = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({
      priceMin: minPriceInput ? minPriceInput.trim() : undefined,
      priceMax: maxPriceInput ? maxPriceInput.trim() : undefined,
      page: 1,
    })
  }

  const handleSliderMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), sliderMax - 0.1)
    setSliderMin(val)
    setMinPriceInput(val > 0 ? val.toFixed(2) : '')
  }

  const handleSliderMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), sliderMin + 0.1)
    setSliderMax(val)
    setMaxPriceInput(val < SLIDER_MAX ? val.toFixed(2) : '')
  }

  const handleSliderCommit = () => {
    onFilterChange({
      priceMin: sliderMin > 0 ? sliderMin.toFixed(2) : undefined,
      priceMax: sliderMax < SLIDER_MAX ? sliderMax.toFixed(2) : undefined,
      page: 1,
    })
  }

  const handleClearPrice = () => {
    setMinPriceInput('')
    setMaxPriceInput('')
    setSliderMin(0)
    setSliderMax(SLIDER_MAX)
    onFilterChange({ priceMin: undefined, priceMax: undefined, page: 1 })
  }

  const hasActivePrice = Boolean(priceMin || priceMax)

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
      {/* Search Input for Mobile/Sidebar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          id="catalog-search-input"
          type="text"
          placeholder="Buscar NFTs, criadores, valor..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-[#14100D] border border-surface-border px-4 py-2.5 pl-10 pr-8 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand rounded-xs shadow-sm"
        />
        <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('')
              onFilterChange({ search: undefined, page: 1 })
            }}
            className="absolute right-2.5 top-2.5 text-text-muted hover:text-text-primary text-xs font-mono p-0.5"
            aria-label="Limpar pesquisa"
          >
            ✕
          </button>
        )}
      </form>

      {/* Collections Category List (Subtle warm orange card background matching user request) */}
      <div className="bg-gradient-to-b from-[#20150D] to-[#140E09] border border-[#3E291A] p-4 rounded-xl shadow-md flex flex-col gap-3">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
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
                className={`flex items-center justify-between py-1.5 px-2.5 rounded-xs transition-colors text-left ${isActive
                  ? 'bg-[#2A1C12] text-brand font-bold border-l-2 border-brand'
                  : 'text-text-secondary hover:text-text-primary hover:bg-[#22160E]/60'
                  }`}
              >
                <span>{col.name}</span>
                <span className="text-[#8C7A6B] font-normal">({col.count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Price Range Filter (Draggable Dual-Thumb Slider with matching warm card background) */}
      <div className="bg-gradient-to-b from-[#20150D] to-[#140E09] border border-[#3E291A] p-4 rounded-xl shadow-md flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Faixa de preço
          </h3>
          {hasActivePrice && (
            <button
              type="button"
              onClick={handleClearPrice}
              className="text-[11px] font-mono text-brand hover:underline"
            >
              Limpar
            </button>
          )}
        </div>

        <form onSubmit={handlePriceFilter} className="flex flex-col gap-4">
          {/* Draggable Dual Thumb Range Visual Track & Sliders */}
          <div className="relative py-2.5 px-1 select-none">
            {/* Background track */}
            <div className="h-1.5 w-full bg-[#2B2017] rounded-full relative">
              {/* Highlight active range */}
              <div
                className="absolute h-full bg-brand rounded-full transition-all duration-75"
                style={{
                  left: `${(sliderMin / SLIDER_MAX) * 100}%`,
                  right: `${100 - (sliderMax / SLIDER_MAX) * 100}%`,
                }}
              />
            </div>

            {/* Overlapping Range Inputs for Real Dragging */}
            <input
              type="range"
              min="0"
              max={SLIDER_MAX}
              step="0.05"
              value={sliderMin}
              onChange={handleSliderMinChange}
              onMouseUp={handleSliderCommit}
              onTouchEnd={handleSliderCommit}
              className="dual-range-input z-20"
              aria-label="Preço mínimo"
            />
            <input
              type="range"
              min="0"
              max={SLIDER_MAX}
              step="0.05"
              value={sliderMax}
              onChange={handleSliderMaxChange}
              onMouseUp={handleSliderCommit}
              onTouchEnd={handleSliderCommit}
              className="dual-range-input z-20"
              aria-label="Preço máximo"
            />
          </div>

          <div className="font-mono text-xs text-text-primary flex items-center justify-between">
            <span className="text-[#8C7A6B]">Preço:</span>
            <span className="text-[#D88D41] font-bold">
              {sliderMin.toFixed(2)} - {sliderMax.toFixed(2)} ETH
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-mono text-[#8C7A6B] block mb-1">Mínimo</span>
              <input
                type="number"
                step="0.01"
                min="0"
                max={SLIDER_MAX}
                placeholder="0.00"
                value={minPriceInput}
                onChange={(e) => {
                  setMinPriceInput(e.target.value)
                  const parsed = parseFloat(e.target.value)
                  if (!isNaN(parsed)) setSliderMin(Math.max(0, Math.min(parsed, sliderMax)))
                }}
                className="w-full bg-[#14100D] border border-surface-border px-2.5 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand rounded-xs"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#8C7A6B] block mb-1">Máximo</span>
              <input
                type="number"
                step="0.01"
                min="0"
                max={SLIDER_MAX}
                placeholder={SLIDER_MAX.toFixed(2)}
                value={maxPriceInput}
                onChange={(e) => {
                  setMaxPriceInput(e.target.value)
                  const parsed = parseFloat(e.target.value)
                  if (!isNaN(parsed)) setSliderMax(Math.min(SLIDER_MAX, Math.max(parsed, sliderMin)))
                }}
                className="w-full bg-[#14100D] border border-surface-border px-2.5 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand rounded-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="self-start px-5 py-2 bg-brand hover:bg-brand-hover text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-xs shadow-sm cursor-pointer"
          >
            Aplicar
          </button>
        </form>
      </div>

      {/* Network Filter */}
      <div className="flex flex-col gap-3 border-t border-surface-border/60 pt-4">
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
                className={`flex items-center justify-between py-1.5 px-2 rounded-xs transition-colors text-left ${isActive
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

      {/* Featured Sidebar Promo (Subtle warm orange bg matching user request) */}
      <div className="bg-gradient-to-b from-[#24170E] to-[#150F0A] border border-[#482E1B] p-4 flex flex-col gap-3 rounded-2xl shadow-lg ring-1 ring-[#D88D41]/20">
        <div className="flex flex-col font-mono">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">
            NFT em Destaque
          </span>
          <span className="text-[10px] text-[#A0988E] font-mono tracking-widest uppercase">
            OFERTA LIMITADA
          </span>
        </div>
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#E6DFD5] shadow-inner">
          <img
            src="/assets/nfts/sage-nomad-009.png"
            alt="NFT em Destaque - Sage Nomad #009"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </aside>
  )
}
