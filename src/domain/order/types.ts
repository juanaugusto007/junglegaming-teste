import { CartItem, Coupon } from '../cart/types'

export type OrderStatus = 'pending' | 'confirmed' | 'rejected' | 'failed'

export interface OrderItemSnapshot {
  nftId: string
  tokenId: string
  name: string
  mediaUrl: string
  editionType: string
  unitPriceEth: string
  quantity: number
  subtotalEth: string
}

export interface OrderSnapshot {
  id: string
  orderNumber: string
  idempotencyKey: string
  status: OrderStatus
  collectorName: string
  collectorEmail: string
  walletAddress: string
  network: 'Ethereum' | 'Polygon'
  items: OrderItemSnapshot[]
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  appliedCoupon?: Coupon | null
  transactionHash: string
  blockExplorerUrl: string
  createdAt: string
  confirmedAt?: string
  errorMessage?: string
}

export interface CreateOrderPayload {
  idempotencyKey: string
  quoteVersion: number
  collectorName: string
  collectorEmail: string
  walletAddress: string
  network: 'Ethereum' | 'Polygon'
  walletType: 'MetaMask' | 'WalletConnect' | 'Coinbase Wallet'
  referralCode?: string
  ensName?: string
  note?: string
}
