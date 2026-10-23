import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { HeroBanner } from '../components/catalog/HeroBanner'
import { CatalogFilters } from '../components/catalog/CatalogFilters'
import { NftCard } from '../components/catalog/NftCard'
import { EditorialSection } from '../components/catalog/EditorialSection'
import { Skeleton } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useNftsQuery } from '../../application/nft/useNfts'
import { NftFilterParams } from '../../domain/nft/types'
import { ChevronLeft, ChevronRight, RefreshCw, SlidersHorizontal, Search, X } from 'lucide-react'

export interface CatalogSearch {
  search?: string
  collection?: string
  priceMin?: string
  priceMax?: string
  network?: string
  sortBy?: 'recent' | 'price_asc' | 'price_desc' | 'popular'
  page?: number
  limit?: number
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown> = {}): CatalogSearch => ({
    search: typeof search.search === 'string' && search.search ? search.search : undefined,
    collection: typeof search.collection === 'string' && search.collection ? search.collection : undefined,
    priceMin: typeof search.priceMin === 'string' && search.priceMin ? search.priceMin : undefined,
    priceMax: typeof search.priceMax === 'string' && search.priceMax ? search.priceMax : undefined,
    network: typeof search.network === 'string' && search.network ? search.network : undefined,
    sortBy: (['recent', 'price_asc', 'price_desc', 'popular'] as const).includes(search.sortBy as any)
      ? (search.sortBy as 'recent' | 'price_asc' | 'price_desc' | 'popular')
      : undefined,
    page: Number(search.page) > 0 ? Number(search.page) : undefined,
    limit: Number(search.limit) > 0 ? Number(search.limit) : undefined,
  }),
  component: HomePage,
})

function HomePage() {
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const effectiveParams: NftFilterParams = {
    ...searchParams,
    page: searchParams.page ?? 1,
    limit: searchParams.limit ?? 8,
  }

  const { data, isLoading, isError, refetch } = useNftsQuery(effectiveParams)

  const handleFilterUpdate = (newFilters: {
    collection?: string
    sortBy?: 'recent' | 'price_asc' | 'price_desc' | 'popular' | string
    search?: string
    network?: string
    priceMin?: string
    priceMax?: string
    page?: number
    limit?: number
  }) => {
    navigate({
      search: ((prev: any) => {
        const next: CatalogSearch = {
          ...prev,
          ...newFilters,
          sortBy: (['recent', 'price_asc', 'price_desc', 'popular'] as const).includes(newFilters.sortBy as any)
            ? (newFilters.sortBy as 'recent' | 'price_asc' | 'price_desc' | 'popular')
            : prev?.sortBy,
        }
        if (!next.search) delete next.search
        if (!next.priceMin) delete next.priceMin
        if (!next.priceMax) delete next.priceMax
        if (!next.network) delete next.network
        if (!next.collection || next.collection === 'Todos os NFTs') delete next.collection
        return next
      }) as any,
      resetScroll: false,
      replace: true,
    })
  }

  const activeTab = searchParams.collection || 'Todos os NFTs'
  const hasActiveFilters = Boolean(
    searchParams.search ||
    searchParams.priceMin ||
    searchParams.priceMax ||
    searchParams.network ||
    (searchParams.collection && searchParams.collection !== 'Todos os NFTs')
  )

  return (
    <div className="w-full flex flex-col">
      {/* Mobile Search & Filter Action Bar at top (Exact Figma Page 9) */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pt-5 w-full">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Explorar coleções"
              value={searchParams.search || ''}
              onChange={(e) => handleFilterUpdate({ search: e.target.value || undefined, page: 1 })}
              className="w-full bg-[#14100D] border border-[#2B231C] px-4 py-3 pl-11 text-xs font-mono text-white placeholder:text-[#6E6357] focus:outline-none focus:border-brand rounded-2xl"
            />
            <Search className="w-4 h-4 text-[#6E6357] absolute left-4 top-3.5" />
            {searchParams.search && (
              <button
                type="button"
                onClick={() => handleFilterUpdate({ search: undefined, page: 1 })}
                className="absolute right-3.5 top-3 text-[#6E6357] hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="w-12 h-12 rounded-2xl bg-brand hover:bg-brand-hover text-[#0E0C0A] flex items-center justify-center font-bold flex-shrink-0 transition-colors relative shadow-sm cursor-pointer"
            aria-label="Abrir filtros"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black font-mono text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#0E0C0A]" />
            )}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <HeroBanner />

      {/* Main Catalog Section */}
      <section id="marketplace-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-14 w-full">

        {/* Mobile Filter Slide-over Modal */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#14100D] border-t border-[#2B231C] rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#2B231C] pb-4">
                <span className="font-mono font-bold text-sm text-white uppercase tracking-wider">Filtros</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#2B231C] text-white flex items-center justify-center hover:bg-brand hover:text-black transition-colors"
                  aria-label="Fechar filtros"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CatalogFilters
                currentCollection={searchParams.collection}
                currentSort={searchParams.sortBy}
                currentSearch={searchParams.search}
                currentNetwork={searchParams.network}
                priceMin={searchParams.priceMin}
                priceMax={searchParams.priceMax}
                onFilterChange={(filters) => {
                  handleFilterUpdate(filters)
                  if (filters.collection || filters.network) {
                    setMobileFiltersOpen(false)
                  }
                }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Sidebar Filters (Desktop Only) */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <CatalogFilters
              currentCollection={searchParams.collection}
              currentSort={searchParams.sortBy}
              currentSearch={searchParams.search}
              currentNetwork={searchParams.network}
              priceMin={searchParams.priceMin}
              priceMax={searchParams.priceMax}
              onFilterChange={handleFilterUpdate}
            />
          </div>

          {/* Right Main Grid Area */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Top Bar: Tabs & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
              {/* Category Quick Tabs (Scrollable on mobile) */}
              <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono overflow-x-auto no-scrollbar whitespace-nowrap pb-1">
                <button
                  type="button"
                  onClick={() => handleFilterUpdate({ collection: 'Todos os NFTs', page: 1 })}
                  className={`pb-2 transition-all cursor-pointer ${activeTab === 'Todos os NFTs'
                      ? 'text-brand font-bold border-b-2 border-brand'
                      : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  Todos os NFTs
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterUpdate({ collection: 'Novos lançamentos', sortBy: 'recent', page: 1 })}
                  className={`pb-2 transition-all cursor-pointer ${activeTab === 'Novos lançamentos'
                      ? 'text-brand font-bold border-b-2 border-brand'
                      : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  Novos lançamentos
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterUpdate({ collection: 'Em alta', sortBy: 'popular', page: 1 })}
                  className={`pb-2 transition-all cursor-pointer ${activeTab === 'Em alta'
                      ? 'text-brand font-bold border-b-2 border-brand'
                      : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  Em alta
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 font-mono text-xs text-text-secondary self-end sm:self-auto">
                <label htmlFor="catalog-sort" className="hidden sm:inline">
                  Ordenar por:
                </label>
                <select
                  id="catalog-sort"
                  value={searchParams.sortBy || 'recent'}
                  onChange={(e) => handleFilterUpdate({ sortBy: e.target.value as any, page: 1 })}
                  className="bg-surface-card border border-surface-border text-text-primary px-3 py-1.5 focus:outline-none focus:border-brand text-xs font-mono cursor-pointer rounded-xs"
                >
                  <option value="recent">Listados recentemente</option>
                  <option value="price_asc">Menor preço (ETH)</option>
                  <option value="price_desc">Maior preço (ETH)</option>
                  <option value="popular">Mais populares</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {isError && (
              <div className="p-8 text-center bg-surface-card border border-status-error/40 flex flex-col items-center gap-4 my-8">
                <p className="text-status-error font-mono text-sm">
                  Ocorreu um erro ao carregar os NFTs da simulação.
                </p>
                <Button onClick={() => refetch()} variant="brand" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Tentar novamente</span>
                </Button>
              </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-3 p-4 bg-surface-card border border-surface-border rounded-sm"
                  >
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-5 w-3/4 mt-2" />
                    <div className="flex justify-between items-center mt-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && data?.items?.length === 0 && (
              <div className="p-12 text-center bg-surface-card border border-surface-border flex flex-col items-center gap-3 my-8">
                <p className="text-text-primary font-semibold">Nenhum NFT encontrado</p>
                <p className="text-xs font-mono text-text-muted max-w-sm">
                  Não encontramos nenhum item correspondente aos filtros aplicados. Tente
                  redefinir a busca ou a faixa de preço.
                </p>
                <Button
                  onClick={() =>
                    navigate({
                      search: () => ({ page: 1, limit: 8 }),
                      resetScroll: false,
                      replace: true,
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Limpar filtros
                </Button>
              </div>
            )}

            {/* NFT Grid */}
            {!isLoading && !isError && Boolean(data?.items && data.items.length > 0) && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {data?.items?.map((nft) => (
                  <NftCard key={nft.id} nft={nft} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 font-mono text-xs pt-8 border-t border-surface-border">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={data.page <= 1}
                  onClick={() => handleFilterUpdate({ page: data.page - 1 })}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: data.totalPages }).map((_, idx) => {
                  const p = idx + 1
                  const isCurrent = p === data.page
                  return (
                    <button
                      key={p}
                      onClick={() => handleFilterUpdate({ page: p })}
                      className={`w-9 h-9 flex items-center justify-center border font-bold transition-colors ${isCurrent
                          ? 'bg-brand text-background border-brand'
                          : 'bg-surface-card text-text-secondary border-surface-border hover:border-brand hover:text-text-primary'
                        }`}
                    >
                      {p}
                    </button>
                  )
                })}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={data.page >= data.totalPages}
                  onClick={() => handleFilterUpdate({ page: data.page + 1 })}
                  aria-label="Próxima página"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Editorial Features & Stories (Full width across page) */}
      <EditorialSection />
    </div>
  )
}
