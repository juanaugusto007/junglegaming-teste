import { EditionType } from '../nft/types'

export interface CartItem {
  id: string
  nftId: string
  tokenId: string
  name: string
  collection: string
  mediaUrl: string
  editionType: EditionType
  unitPriceEth: string // decimal string
  quantity: number
  maxAvailable: number
  subtotalEth: string // decimal string
  version: number
}

export interface Coupon {
  code: string
  discountPercent: number
  label: string
  expiresAt: string
}

export interface CartQuote {
  items: CartItem[]
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  appliedCoupon: Coupon | null
  quoteVersion: number
  hasPriceChanges: boolean
  hasAvailabilityIssues: boolean
  warningMessage?: string
}
