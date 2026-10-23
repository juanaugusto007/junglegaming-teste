import { createFileRoute, Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import { useOrderDetail } from '../../application/order/useOrder'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Badge'

export const Route = createFileRoute('/order/$id')({
  component: OrderConfirmationPage,
})

function OrderConfirmationPage() {
  const { id } = Route.useParams()
  const { data: order, isLoading, isError } = useOrderDetail(id)

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Skeleton className="h-16 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-black text-text-primary">Pedido não localizado</h2>
        <p className="text-xs font-mono text-text-secondary">
          Não encontramos o recibo do pedido com o identificador fornecido.
        </p>
        <Link to="/">
          <Button variant="brand" size="sm" className="font-mono mt-2">
            Voltar ao Início
          </Button>
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col gap-6">
      {/* Receipt Modal Card (Exact Figma Page 4) */}
      <div className="relative bg-[#16120F] border border-[#2B231C] p-6 sm:p-8 rounded-sm flex flex-col gap-6 shadow-2xl">
        {/* Envelope Thank You Icon */}
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative flex items-center justify-center">
            <svg
              className="w-20 h-20 text-brand"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="8" y="14" width="48" height="36" rx="2" stroke="currentColor" />
              <path d="M8 18L32 36L56 18" stroke="currentColor" />
              <circle cx="32" cy="30" r="11" fill="#16120F" stroke="#D88D41" strokeWidth="1.5" />
              <text
                x="32"
                y="28"
                textAnchor="middle"
                fill="#D88D41"
                fontSize="6"
                fontFamily="monospace"
                fontWeight="bold"
              >
                THANK
              </text>
              <text
                x="32"
                y="34"
                textAnchor="middle"
                fill="#D88D41"
                fontSize="6"
                fontFamily="monospace"
                fontWeight="bold"
              >
                YOU
              </text>
            </svg>
          </div>

          <h1 className="text-base sm:text-lg font-mono font-bold text-text-primary tracking-wide">
            Seus NFTs agora estão na sua carteira
          </h1>
        </div>

        {/* Top Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#2B231C] font-mono text-[11px] text-text-secondary">
          <div className="flex flex-col">
            <span className="text-text-muted">ID da transação</span>
            <span className="text-text-primary font-bold truncate">
              {order.transactionHash.slice(0, 6)}...{order.transactionHash.slice(-4)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Data</span>
            <span className="text-text-primary font-bold">{formattedDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Total</span>
            <span className="text-brand font-bold">{order.totalEth} ETH</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Carteira</span>
            <span className="text-text-primary font-bold">MetaMask</span>
          </div>
        </div>

        {/* Transaction Details Table */}
        <div className="flex flex-col gap-3 font-mono text-xs">
          <div className="flex items-center justify-between text-text-muted border-b border-[#2B231C] pb-2 font-bold uppercase tracking-wider text-[11px]">
            <span>NFTs</span>
            <span>Edições</span>
            <span>Subtotal</span>
          </div>

          <div className="divide-y divide-[#2B231C]/60">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.mediaUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-xs object-cover border border-[#2B231C]"
                  />
                  <div>
                    <h2 className="font-bold text-text-primary text-xs">{item.name}</h2>
                    <p className="text-[10px] text-text-muted">ID do token: {item.tokenId}</p>
                  </div>
                </div>
                <span className="text-text-muted text-xs">(x {item.quantity})</span>
                <span className="font-bold text-brand text-xs">{item.subtotalEth} ETH</span>
              </div>
            ))}
          </div>

          {/* Network Fee & Total */}
          <div className="border-t border-[#2B231C] pt-3 flex flex-col gap-2">
            <div className="flex justify-between text-text-secondary text-xs">
              <span>Taxa de rede</span>
              <span className="text-text-primary font-bold">{order.networkFeeEth} ETH</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold border-t border-[#2B231C] pt-2">
              <span className="text-text-primary">Total</span>
              <span className="text-brand font-black text-base">{order.totalEth} ETH</span>
            </div>
          </div>
        </div>

        {/* Confirmation Notice */}
        <p className="text-center text-[11px] font-mono text-text-secondary leading-relaxed px-4">
          Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.
        </p>

        {/* Etherscan Button (Figma Page 4) */}
        <a
          href={order.blockExplorerUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full"
        >
          <button
            type="button"
            className="w-full bg-brand hover:bg-brand-hover text-[#0E0C0A] font-mono font-bold text-xs uppercase tracking-wider py-3 transition-colors rounded-xs flex items-center justify-center gap-2"
          >
            <span>Ver no Etherscan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </a>

        {/* Back Link */}
        <Link
          to="/"
          className="text-center font-mono text-xs text-text-muted hover:text-brand transition-colors"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}
