import React from 'react'
import { Button } from '../ui/Button'

export const HeroBanner: React.FC = () => {
  const scrollToCatalog = () => {
    const el = document.getElementById('marketplace-catalog')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full py-12 md:py-20 border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="font-mono text-xs uppercase tracking-widest text-brand font-semibold">
              Bem-vindo à Kurio
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.08]">
              SEJA DONO DO FUTURO <br />
              <span className="text-brand">DA ARTE DIGITAL</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl font-normal">
              Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione
              arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Button
                onClick={scrollToCatalog}
                size="lg"
                variant="brand"
                className="font-mono tracking-wider uppercase text-sm px-8"
              >
                EXPLORAR
              </Button>
            </div>

            {/* Slider Dots Indicator */}
            <div className="flex items-center gap-2 pt-4">
              <span className="w-2.5 h-2.5 rounded-full bg-brand" />
              <span className="w-2 h-2 rounded-full bg-surface-border" />
              <span className="w-2 h-2 rounded-full bg-surface-border" />
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-surface-border group">
              <picture>
                <source srcSet="/assets/nfts/hero-ape.webp" type="image/webp" />
                <img
                  src="/assets/nfts/hero-ape.png"
                  alt="Emerald Ape #042 em destaque na Kurio"
                  width={420}
                  height={525}
                  loading="eager"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
