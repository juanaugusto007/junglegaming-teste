import React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle2, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react'
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col gap-8">
      {/* Success Hero Header */}
      <div className="bg-surface-card border border-brand/50 p-6 sm:p-8 rounded-sm text-center flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-brand/10 border-2 border-brand flex items-center justify-center text-brand">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-brand font-bold">
            Transação Confirmada
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary">
            Pedido {order.orderNumber}
          </h1>
          <p className="text-xs font-mono text-text-secondary max-w-md mt-1">
            Sua compra foi validada e liquidada na {order.network}. Os NFTs foram vinculados ao
            seu perfil de colecionador.
          </p>
        </div>

        {/* Transaction Explorer Link */}
        <div className="w-full bg-surface-elevated p-3 border border-surface-border rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            <span className="text-text-muted">Hash TX:</span>
            <span className="text-brand font-bold truncate max-w-[240px] sm:max-w-sm">
              {order.transactionHash}
            </span>
          </div>
          <a
            href={order.blockExplorerUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-text-primary hover:text-brand transition-colors text-[11px] underline flex-shrink-0"
          >
            <span>Explorador de blocos</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Snapshot Receipt Details */}
      <div className="bg-surface-card border border-surface-border p-6 sm:p-8 flex flex-col gap-6">
        <h2 className="font-mono text-sm font-bold text-text-primary uppercase tracking-wider border-b border-surface-border pb-3">
          Recibo Snapshot do Pedido
        </h2>

        {/* Collector Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <span className="text-text-muted">Colecionador:</span>
            <p className="font-semibold text-text-primary mt-0.5">{order.collectorName}</p>
          </div>
          <div>
            <span className="text-text-muted">E-mail:</span>
            <p className="font-semibold text-text-primary mt-0.5">{order.collectorEmail}</p>
          </div>
          <div>
            <span className="text-text-muted">Carteira:</span>
            <p className="font-semibold text-text-primary mt-0.5 truncate">{order.walletAddress}</p>
          </div>
          <div>
            <span className="text-text-muted">Data/Hora:</span>
            <p className="font-semibold text-text-primary mt-0.5">
              {new Date(order.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="border-t border-surface-border pt-4 flex flex-col gap-3 font-mono text-xs">
          <span className="text-text-muted uppercase tracking-wider text-[11px] font-bold">
            Itens adquiridos ({order.items.length})
          </span>
          <div className="divide-y divide-surface-border/50">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.mediaUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-xs object-cover border border-surface-border"
                  />
                  <div>
                    <h3 className="font-bold text-text-primary">{item.name}</h3>
                    <p className="text-[11px] text-text-muted">
                      {item.editionType} • Qtd: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-brand">{item.subtotalEth} ETH</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="border-t border-surface-border pt-4 flex flex-col gap-2 font-mono text-xs">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span>{order.subtotalEth} ETH</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Desconto</span>
            <span className="text-brand">(-) {order.discountEth} ETH</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Taxa de rede</span>
            <span>{order.networkFeeEth} ETH</span>
          </div>
          <div className="border-t border-surface-border pt-3 flex justify-between items-center text-sm font-bold">
            <span className="text-text-primary">Total Pago</span>
            <span className="text-xl text-brand font-black">{order.totalEth} ETH</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-surface-border">
          <Link to="/" className="w-full sm:w-auto flex-1">
            <Button variant="brand" size="md" className="w-full font-mono text-xs gap-2">
              <span>Explorar Mais Coleções</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/profile" className="w-full sm:w-auto flex-1">
            <Button variant="outline" size="md" className="w-full font-mono text-xs">
              Ver Meu Perfil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
