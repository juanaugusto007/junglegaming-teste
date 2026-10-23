import React from 'react'

export const EditorialSection: React.FC = () => {
  const scrollToCatalog = () => {
    document.getElementById('marketplace-catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="w-full flex flex-col gap-24 mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 2 Promo Cards Banner (Exact Figma Page 0: Centered, larger, image on LEFT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Card 1 */}
        <div className="bg-[#14100D] border border-[#2B231C] p-6 sm:p-8 md:p-10 rounded-3xl flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8 group hover:border-brand/60 transition-all shadow-xl">
          <div className="w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-2xl overflow-hidden flex-shrink-0 bg-[#E6DFD5] border border-surface-border shadow-md">
            <img
              src="/assets/nfts/emerald-ape-042.png"
              alt="Lançamentos gênesis de edição limitada"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col justify-between flex-1 gap-4 text-left py-1">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-white leading-tight">
                Lançamentos gênesis <br className="hidden sm:inline" /> de edição limitada
              </h3>
              <p className="text-xs sm:text-sm text-[#D2A074] font-mono leading-relaxed">
                Colecione edições escassas diretamente dos criadores antes da revelação pública.
              </p>
            </div>
            <button
              onClick={scrollToCatalog}
              className="mt-2 bg-brand hover:bg-brand-hover text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md flex items-center gap-2 self-start transition-colors shadow-sm"
            >
              <span>Explorar</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#14100D] border border-[#2B231C] p-6 sm:p-8 md:p-10 rounded-3xl flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8 group hover:border-brand/60 transition-all shadow-xl">
          <div className="w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-2xl overflow-hidden flex-shrink-0 bg-[#E6DFD5] border border-surface-border shadow-md">
            <img
              src="/assets/nfts/ivory-baron-088.png"
              alt="Arte digital selecionada e muito mais"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col justify-between flex-1 gap-4 text-left py-1">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-white leading-tight">
                Arte digital selecionada <br className="hidden sm:inline" /> e muito mais
              </h3>
              <p className="text-xs sm:text-sm text-[#D2A074] font-mono leading-relaxed">
                Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
              </p>
            </div>
            <button
              onClick={scrollToCatalog}
              className="mt-2 bg-brand hover:bg-brand-hover text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md flex items-center gap-2 self-start transition-colors shadow-sm"
            >
              <span>Explorar</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Diário da Cunhagem Blog Grid (Exact Figma Page 0: Larger, centered, rounded-2xl with background cards) */}
      <div className="flex flex-col gap-10 w-full">
        <div className="text-center flex flex-col items-center gap-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-white tracking-wide">
            Diário da Cunhagem
          </h2>
          <p className="text-xs sm:text-sm text-[#D2A074] font-mono max-w-2xl leading-relaxed">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Post 1 */}
          <div className="bg-[#14100D] border border-[#2B231C] p-4 rounded-2xl flex flex-col gap-3 group hover:border-brand/60 transition-all shadow-md">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#E6DFD5] shadow-sm">
              <img
                src="/assets/nfts/neon-vessel-552.png"
                alt="Como funciona a propriedade de NFTs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-[11px] font-mono text-[#A0988E]">
              12 de setembro | Leitura de 6 min
            </span>
            <h4 className="font-mono font-bold text-sm text-white group-hover:text-brand transition-colors line-clamp-2">
              Como funciona a propriedade de NFTs
            </h4>
            <p className="text-xs font-mono text-[#D2A074] leading-relaxed line-clamp-2">
              Aprenda a colecionar, negociar e verificar ativos digitais.
            </p>
            <span className="text-xs font-mono font-bold text-brand hover:underline mt-auto cursor-pointer pt-1 flex items-center gap-1">
              Ler mais <span>→</span>
            </span>
          </div>

          {/* Post 2 */}
          <div className="bg-[#14100D] border border-[#2B231C] p-4 rounded-2xl flex flex-col gap-3 group hover:border-brand/60 transition-all shadow-md">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#E6DFD5] shadow-sm">
              <img
                src="/assets/nfts/emerald-ape-042.png"
                alt="10 artistas digitais para acompanhar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-[11px] font-mono text-[#A0988E]">
              13 de setembro | Leitura de 2 min
            </span>
            <h4 className="font-mono font-bold text-sm text-white group-hover:text-brand transition-colors line-clamp-2">
              10 artistas digitais para acompanhar
            </h4>
            <p className="text-xs font-mono text-[#D2A074] leading-relaxed line-clamp-2">
              Conheça criadores que moldam a cultura digital.
            </p>
            <span className="text-xs font-mono font-bold text-brand hover:underline mt-auto cursor-pointer pt-1 flex items-center gap-1">
              Ler mais <span>→</span>
            </span>
          </div>

          {/* Post 3 */}
          <div className="bg-[#14100D] border border-[#2B231C] p-4 rounded-2xl flex flex-col gap-3 group hover:border-brand/60 transition-all shadow-md">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#E6DFD5] shadow-sm">
              <img
                src="/assets/nfts/sage-nomad-009.png"
                alt="Raridade, atributos e procedência"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-[11px] font-mono text-[#A0988E]">
              15 de setembro | Leitura de 3 min
            </span>
            <h4 className="font-mono font-bold text-sm text-white group-hover:text-brand transition-colors line-clamp-2">
              Raridade, atributos e procedência
            </h4>
            <p className="text-xs font-mono text-[#D2A074] leading-relaxed line-clamp-2">
              Entenda raridade, procedência, direitos autorais e utilidade.
            </p>
            <span className="text-xs font-mono font-bold text-brand hover:underline mt-auto cursor-pointer pt-1 flex items-center gap-1">
              Ler mais <span>→</span>
            </span>
          </div>

          {/* Post 4 */}
          <div className="bg-[#14100D] border border-[#2B231C] p-4 rounded-2xl flex flex-col gap-3 group hover:border-brand/60 transition-all shadow-md">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#E6DFD5] shadow-sm">
              <img
                src="/assets/nfts/golden-beat-207.png"
                alt="Como proteger sua carteira"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-[11px] font-mono text-[#A0988E]">
              15 de setembro | Leitura de 2 min
            </span>
            <h4 className="font-mono font-bold text-sm text-white group-hover:text-brand transition-colors line-clamp-2">
              Como proteger sua carteira
            </h4>
            <p className="text-xs font-mono text-[#D2A074] leading-relaxed line-clamp-2">
              Proteja sua carteira, seus ativos e sua identidade.
            </p>
            <span className="text-xs font-mono font-bold text-brand hover:underline mt-auto cursor-pointer pt-1 flex items-center gap-1">
              Ler mais <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
