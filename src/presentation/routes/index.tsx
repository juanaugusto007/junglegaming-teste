import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { HeroBanner } from '../components/catalog/HeroBanner'
import { CatalogFilters } from '../components/catalog/CatalogFilters'
import { NftCard } from '../components/catalog/NftCard'
import { EditorialSection } from '../components/catalog/EditorialSection'
import { Skeleton } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useNftsQuery } from '../../application/nft/useNfts'
import { NftFilterParams } from '../../domain/nft/types'
import { ChevronLeft, ChevronRight, SlidersHorizontal, RefreshCw } from 'lucide-react'

// URL search params schema with Zod validation
const catalogSearchSchema = z.object({
  search: z.string().optional(),
  collection: z.string().optional(),
  priceMin: z.string().optional(),
  priceMax: z.string().optional(),
  network: z.string().optional(),
  sortBy: z.enum(['recent', 'price_asc', 'price_desc', 'popular']).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(8),
})

export const Route = createFileRoute('/')({
  validateSearch: (search) => catalogSearchSchema.parse(search),
  component: HomePage,
})

function HomePage() {
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const { data, isLoading, isError, refetch } = useNftsQuery(searchParams as NftFilterParams)

  const handleFilterUpdate = (newFilters: Partial<typeof searchParams>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newFilters,
      }),
    })
  }

  const activeTab = searchParams.collection || 'Todos os NFTs'

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <HeroBanner />

      {/* Main Catalog Section */}
      <section id="marketplace-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Sidebar Filters */}
          <CatalogFilters
            currentCollection={searchParams.collection}
            currentSort={searchParams.sortBy}
            currentSearch={searchParams.search}
            currentNetwork={searchParams.network}
            priceMin={searchParams.priceMin}
            priceMax={searchParams.priceMax}
            onFilterChange={handleFilterUpdate}
          />

          {/* Right Main Grid Area */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Top Bar: Tabs & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
              {/* Category Quick Tabs */}
              <div className="flex items-center gap-6 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handleFilterUpdate({ collection: 'Todos os NFTs', page: 1 })}
                  className={`pb-2 transition-all ${
                    activeTab === 'Todos os NFTs'
                      ? 'text-brand font-bold border-b-2 border-brand'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Todos os NFTs
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterUpdate({ collection: 'Novos lançamentos', sortBy: 'recent', page: 1 })}
                  className={`pb-2 transition-all ${
                    activeTab === 'Novos lançamentos'
                      ? 'text-brand font-bold border-b-2 border-brand'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Novos lançamentos
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterUpdate({ collection: 'Em alta', sortBy: 'popular', page: 1 })}
                  className={`pb-2 transition-all ${
                    activeTab === 'Em alta'
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
                  className="bg-surface-card border border-surface-border text-text-primary px-3 py-1.5 focus:outline-none focus:border-brand text-xs font-mono cursor-pointer"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            {!isLoading && !isError && data?.items.length === 0 && (
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
            {!isLoading && !isError && data && data.items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map((nft) => (
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
                      className={`w-9 h-9 flex items-center justify-center border font-bold transition-colors ${
                        isCurrent
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

            {/* Editorial Features & Stories */}
            <EditorialSection />
          </div>
        </div>
      </section>
    </div>
  )
}
