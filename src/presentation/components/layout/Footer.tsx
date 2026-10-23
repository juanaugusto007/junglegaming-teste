import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer className="w-full mt-24">
      {/* 3 Pillars of Trust & Newsletter Section (Exact Figma layout from print) */}
      <div className="w-full bg-[#24170E] border-t border-b border-[#4A2F1D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Pillar 1: Wallet Security */}
            <div className="flex flex-col gap-4 py-12 lg:pr-8 lg:border-r border-[#4A2F1D]">
              <div className="w-14 h-14 rounded-full bg-[#D88D41] text-[#0E0C0A] flex items-center justify-center font-sans font-extrabold text-xl shadow-md">
                W
              </div>
              <h3 className="font-mono font-bold text-white text-base">
                Segurança da carteira
              </h3>
              <p className="font-mono text-xs text-[#D2A074] leading-relaxed max-w-xs">
                Proteja sua carteira e colecione arte digital verificada com confiança.
              </p>
            </div>

            {/* Pillar 2: Featured Creators */}
            <div className="flex flex-col gap-4 py-12 lg:px-8 lg:border-r border-[#4A2F1D]">
              <div className="w-14 h-14 rounded-full bg-[#D88D41] text-[#0E0C0A] flex items-center justify-center font-sans font-extrabold text-xl shadow-md">
                C
              </div>
              <h3 className="font-mono font-bold text-white text-base">
                Criadores em destaque
              </h3>
              <p className="font-mono text-xs text-[#D2A074] leading-relaxed max-w-xs">
                Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
              </p>
            </div>

            {/* Pillar 3: Drop Alerts */}
            <div className="flex flex-col gap-4 py-12 lg:px-8 lg:border-r border-[#4A2F1D]">
              <div className="w-14 h-14 rounded-full bg-[#D88D41] text-[#0E0C0A] flex items-center justify-center font-sans font-extrabold text-xl shadow-md">
                D
              </div>
              <h3 className="font-mono font-bold text-white text-base">
                Alertas de lançamentos
              </h3>
              <p className="font-mono text-xs text-[#D2A074] leading-relaxed max-w-xs">
                Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
              </p>
            </div>

            {/* Newsletter Box (Exact Figma Page 0 & print) */}
            <div className="flex flex-col gap-4 py-12 lg:pl-8">
              <h3 className="font-mono text-base font-bold text-white">
                Antecipe-se ao próximo lançamento
              </h3>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="digite seu e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#180F09] border border-[#4A2F1D] px-4 py-3 text-xs font-mono text-white placeholder:text-[#8C7A6B] focus:outline-none focus:border-brand rounded-l-md"
                />
                <button
                  type="submit"
                  className="bg-[#D88D41] hover:bg-[#E5974A] text-[#0E0C0A] font-mono font-bold text-xs px-6 py-3 rounded-r-md transition-colors flex-shrink-0 cursor-pointer shadow-sm"
                >
                  Enviar
                </button>
              </form>
              {subscribed && (
                <span className="text-xs text-status-success font-mono">
                  Obrigado! Inscrição confirmada.
                </span>
              )}
              <p className="text-[11px] font-mono text-[#A0988E] leading-relaxed">
                Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Contact Bar (Exact Figma layout: Distinct warm lighter coffee brown bar with 4-col alignment) */}
      <div className="w-full bg-[#382215] border-b border-[#4A2F1D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-4 text-xs font-mono text-[#D2A074]">
          <div className="lg:pr-8">
            <span className="font-mono font-black tracking-widest text-white text-base">KURIO</span>
          </div>
          <div className="lg:px-8">
            <span>Feito para colecionadores, criadores e cultura</span>
          </div>
          <div className="lg:px-8">
            <a href="mailto:contato@email.com" className="hover:text-white transition-colors">
              contato@email.com
            </a>
          </div>
          <div className="lg:pl-8">
            <span className="text-[#D2A074]">+55 11 4002 8922</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Social */}
      <div className="w-full bg-[#231611] border-t border-[#38231B] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            {/* Col 1 */}
            <div className="flex flex-col gap-3 font-mono lg:pr-8">
              <h4 className="text-sm font-bold text-white mb-1">
                Meu perfil
              </h4>
              <Link to="/profile" className="text-[#A0988E] hover:text-brand transition-colors text-xs">
                Meu perfil
              </Link>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Minha coleção
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Atividade
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Estúdio do criador
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Lista de interesse
              </span>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-3 font-mono lg:px-8">
              <h4 className="text-sm font-bold text-white mb-1">
                Central de ajuda
              </h4>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Central de ajuda
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Como comprar NFTs
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Carteira e segurança
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Política do mercado
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Denunciar item
              </span>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-3 font-mono lg:px-8">
              <h4 className="text-sm font-bold text-white mb-1">
                Coleções
              </h4>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Arte digital
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Fotografia
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Música
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Arte 3D
              </span>
              <span className="text-[#A0988E] hover:text-brand transition-colors text-xs cursor-pointer">
                Utilidade
              </span>
            </div>

            {/* Col 4: Social & Compatible Wallets */}
            <div className="flex flex-col gap-5 font-mono lg:pl-8">
              <div>
                <h4 className="text-sm font-bold text-white mb-3">
                  Redes sociais
                </h4>
                <div className="flex items-center gap-2">
                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook da Kurio"
                    className="w-8 h-8 flex items-center justify-center border border-[#4A2D22] bg-[#2D1B15] text-[#A0988E] hover:text-brand hover:border-brand transition-colors rounded-xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram da Kurio"
                    className="w-8 h-8 flex items-center justify-center border border-[#4A2D22] bg-[#2D1B15] text-[#A0988E] hover:text-brand hover:border-brand transition-colors rounded-xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  {/* Twitter / X */}
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X / Twitter da Kurio"
                    className="w-8 h-8 flex items-center justify-center border border-[#4A2D22] bg-[#2D1B15] text-[#A0988E] hover:text-brand hover:border-brand transition-colors font-bold text-xs rounded-xs"
                  >
                    𝕏
                  </a>
                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn da Kurio"
                    className="w-8 h-8 flex items-center justify-center border border-[#4A2D22] bg-[#2D1B15] text-[#A0988E] hover:text-brand hover:border-brand transition-colors rounded-xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube da Kurio"
                    className="w-8 h-8 flex items-center justify-center border border-[#4A2D22] bg-[#2D1B15] text-[#A0988E] hover:text-brand hover:border-brand transition-colors rounded-xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-2">
                  Carteiras compatíveis
                </h4>
                <div className="inline-flex items-center border border-[#4A2D22] bg-[#2D1B15] px-3.5 py-1.5 rounded-xs text-[10px] font-mono font-bold text-brand tracking-wider gap-2">
                  <span>METAMASK</span>
                  <span>•</span>
                  <span>WALLETCONNECT</span>
                  <span>•</span>
                  <span>COINBASE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="w-full py-6 text-center text-xs font-mono text-[#8C7A6B] bg-[#0A0704] border-t border-[#1C120A]">
        © 2026 Kurio. Propriedade digital para todos.
      </div>
    </footer>
  )
}
