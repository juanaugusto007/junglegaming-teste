import React from 'react'

export const EditorialSection: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-16 mt-20">
      {/* 2 Promo Cards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1 */}
        <div className="bg-[#171310] border border-surface-border p-6 sm:p-8 flex items-center justify-between gap-6 group hover:border-brand/60 transition-colors">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-text-primary">
              Lançamentos gênesis <br /> de edição limitada
            </h3>
            <p className="text-xs text-text-secondary">
              Colecione edições escassas diretamente dos criadores antes da revelação pública.
            </p>
            <button
              onClick={() => {
                document.getElementById('marketplace-catalog')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="mt-2 text-xs font-mono font-bold text-brand hover:underline flex items-center gap-1.5 self-start"
            >
              <span>Explorar</span>
              <span>→</span>
            </button>
          </div>
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-sm overflow-hidden flex-shrink-0 border border-surface-border">
            <img
              src="/assets/nfts/emerald-ape-042.webp"
              alt="Lançamento Gênesis"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#171310] border border-surface-border p-6 sm:p-8 flex items-center justify-between gap-6 group hover:border-brand/60 transition-colors">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-text-primary">
              Arte digital selecionada <br /> e muito mais
            </h3>
            <p className="text-xs text-text-secondary">
              Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
            </p>
            <button
              onClick={() => {
                document.getElementById('marketplace-catalog')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="mt-2 text-xs font-mono font-bold text-brand hover:underline flex items-center gap-1.5 self-start"
            >
              <span>Explorar</span>
              <span>→</span>
            </button>
          </div>
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-sm overflow-hidden flex-shrink-0 border border-surface-border">
            <img
              src="/assets/nfts/neon-vessel-552.webp"
              alt="Arte Digital Selecionada"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Diário da Cunhagem Blog Grid */}
      <div className="flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-wide">
            Diário da Cunhagem
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Post 1 */}
          <div className="bg-surface-card border border-surface-border p-4 flex flex-col gap-3 group hover:border-brand/60 transition-colors">
            <div className="aspect-square w-full rounded-sm overflow-hidden bg-surface-elevated">
              <img
                src="/assets/nfts/cosmic-bloom-118.webp"
                alt="Artigo 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[10px] font-mono text-text-muted">
              12 de setembro | Leitura de 6 min
            </span>
            <h4 className="font-semibold text-sm text-text-primary group-hover:text-brand transition-colors">
              Como funciona a propriedade de NFTs
            </h4>
            <span className="text-xs font-mono text-brand mt-auto cursor-pointer">
              Ler mais →
            </span>
          </div>

          {/* Post 2 */}
          <div className="bg-surface-card border border-surface-border p-4 flex flex-col gap-3 group hover:border-brand/60 transition-colors">
            <div className="aspect-square w-full rounded-sm overflow-hidden bg-surface-elevated">
              <img
                src="/assets/nfts/emerald-ape-042.webp"
                alt="Artigo 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[10px] font-mono text-text-muted">
              13 de setembro | Leitura de 2 min
            </span>
            <h4 className="font-semibold text-sm text-text-primary group-hover:text-brand transition-colors">
              10 artistas digitais para acompanhar
            </h4>
            <span className="text-xs font-mono text-brand mt-auto cursor-pointer">
              Ler mais →
            </span>
          </div>

          {/* Post 3 */}
          <div className="bg-surface-card border border-surface-border p-4 flex flex-col gap-3 group hover:border-brand/60 transition-colors">
            <div className="aspect-square w-full rounded-sm overflow-hidden bg-surface-elevated">
              <img
                src="/assets/nfts/sage-nomad-009.webp"
                alt="Artigo 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[10px] font-mono text-text-muted">
              15 de setembro | Leitura de 3 min
            </span>
            <h4 className="font-semibold text-sm text-text-primary group-hover:text-brand transition-colors">
              Raridade, atributos e procedência
            </h4>
            <span className="text-xs font-mono text-brand mt-auto cursor-pointer">
              Ler mais →
            </span>
          </div>

          {/* Post 4 */}
          <div className="bg-surface-card border border-surface-border p-4 flex flex-col gap-3 group hover:border-brand/60 transition-colors">
            <div className="aspect-square w-full rounded-sm overflow-hidden bg-surface-elevated">
              <img
                src="/assets/nfts/golden-beat-207.webp"
                alt="Artigo 4"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[10px] font-mono text-text-muted">
              15 de setembro | Leitura de 2 min
            </span>
            <h4 className="font-semibold text-sm text-text-primary group-hover:text-brand transition-colors">
              Como proteger sua carteira
            </h4>
            <span className="text-xs font-mono text-brand mt-auto cursor-pointer">
              Ler mais →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
