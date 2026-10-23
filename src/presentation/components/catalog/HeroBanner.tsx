import React from 'react'
import { ArrowRight } from 'lucide-react'

export const HeroBanner: React.FC = () => {
  const scrollToCatalog = () => {
    const el = document.getElementById('marketplace-catalog')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full py-4 lg:py-20 border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MOBILE HERO CARD (Exact Figma Page 9) */}
        <div className="lg:hidden relative w-full bg-[#24160E] border border-[#3C2117] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
          {/* Background: overlapping glowing orange spheres/balls (Exact Figma Page 9) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl" aria-hidden="true">
            {/* Primary glowing orange sphere */}
            <div
              className="absolute -top-12 left-8 w-72 h-72 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(195, 115, 52, 0.55) 0%, rgba(130, 68, 26, 0.35) 55%, transparent 75%)',
              }}
            />
            {/* Intersecting secondary circle with subtle boundary */}
            <div
              className="absolute -top-8 -left-14 w-64 h-64 rounded-full border border-brand/25"
              style={{
                background:
                  'radial-gradient(circle at 65% 45%, rgba(168, 92, 40, 0.45) 0%, rgba(80, 40, 16, 0.2) 65%, transparent 85%)',
              }}
            />
            {/* Third bottom-left glow sphere */}
            <div
              className="absolute -bottom-20 left-12 w-80 h-80 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(216, 141, 65, 0.35) 0%, rgba(94, 52, 24, 0.15) 60%, transparent 80%)',
              }}
            />
          </div>

          {/* Card Content Grid: Text on Left, NFT on Right */}
          <div className="relative z-10 grid grid-cols-12 gap-4 items-center">
            {/* Left Info Column */}
            <div className="col-span-7 flex flex-col gap-2 sm:gap-3">
              <span className="font-mono text-[11px] sm:text-xs text-[#D2A074] font-medium tracking-wide">
                Bem-vindo à Kurio
              </span>

              <h1 className="font-mono font-bold text-white text-base sm:text-2xl leading-tight uppercase tracking-tight">
                SEJA DONO DA <br />
                CULTURA DIGITAL
              </h1>

              <p className="font-mono text-[10px] sm:text-xs text-[#A69E94] leading-relaxed max-w-[190px] sm:max-w-xs">
                Descubra NFTs selecionados de criadores do mundo todo.
              </p>

              <button
                type="button"
                onClick={scrollToCatalog}
                className="font-mono font-bold text-xs sm:text-sm text-brand hover:text-brand-light flex items-center gap-1.5 transition-colors pt-1 cursor-pointer self-start"
              >
                <span>EXPLORAR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right NFT Showcase Column */}
            <div className="col-span-5 flex justify-end">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-visible shadow-xl bg-[#E6DFD5] border border-[#3C2117]">
                <img
                  src="/assets/nfts/hero-ape.png"
                  alt="Emerald Ape #042"
                  className="w-full h-full object-cover rounded-2xl"
                />
                {/* Secondary badge avatar overlapping bottom-left */}
                <div className="absolute -bottom-2 -left-3 w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 border-[#24160E] overflow-hidden bg-[#E6DFD5] shadow-2xl">
                  <img
                    src="/assets/nfts/sage-nomad-009.png"
                    alt="Sage Nomad #009"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Slider Pagination Dots (Figma Page 9: 3 dots centered at bottom) */}
          <div className="relative z-10 flex items-center justify-center gap-2 mt-5">
            <span className="w-2 h-2 rounded-full bg-brand cursor-pointer" />
            <span className="w-2 h-2 rounded-full bg-[#5A3E26] hover:bg-brand/50 transition-colors cursor-pointer" />
            <span className="w-2 h-2 rounded-full bg-[#5A3E26] hover:bg-brand/50 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* DESKTOP HERO BANNER (Figma Page 0) */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="col-span-7 flex flex-col gap-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D2A074] font-medium">
              Bem-vindo à Kurio
            </span>

            <h1 className="text-4xl lg:text-6xl font-bold font-mono tracking-tight text-[#FFFFFF] leading-[1.1] uppercase">
              SEJA DONO DO FUTURO <br />
              DA ARTE DIGITAL
            </h1>

            <p className="text-base text-[#D2A074] leading-relaxed max-w-xl font-mono">
              Descubra NFTs selecionados de criadores emergentes e consagrados.
              Colecione arte digital rara, apoie artistas e tenha uma parte da
              cultura da internet.
            </p>

            <div className="pt-2 flex items-start">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="font-mono font-bold tracking-wider uppercase text-sm px-8 py-3.5 rounded-md bg-brand hover:bg-brand-hover text-[#0E0C0A] shadow-md hover:brightness-105 transition-all cursor-pointer"
              >
                EXPLORAR
              </button>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="col-span-5 flex flex-col items-end gap-6 w-full">
            <div className="relative w-full max-w-[440px] aspect-square rounded-3xl overflow-visible shadow-2xl border border-surface-border group bg-[#E6DFD5]">
              <img
                src="/assets/nfts/hero-ape.png"
                alt="Emerald Ape #042 em destaque na Kurio"
                width={440}
                height={440}
                loading="eager"
                className="w-full h-full object-cover object-center rounded-3xl group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Slider Dots Indicator */}
            <div className="flex items-center gap-2 self-start -ml-28 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand cursor-pointer" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3A3026] hover:bg-brand/50 transition-colors cursor-pointer" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3A3026] hover:bg-brand/50 transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
