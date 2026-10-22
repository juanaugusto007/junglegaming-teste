export type EditionType = '1/1' | '1/10' | '1/50' | 'ABERTA'

export interface NftAttribute {
  traitType: string
  value: string
}

export interface NftCreator {
  id: string
  name: string
  avatarUrl: string
  verified: boolean
  royaltyFeePercent: number
}

export interface Nft {
  id: string
  tokenId: string
  name: string
  collection: string
  description: string
  price: string // Exact decimal string in ETH (e.g. "1.19")
  originalPrice?: string
  mediaUrl: string
  mediaWebpUrl?: string
  rarity: 'COMUM' | 'RARO' | 'LENDÁRIO' | 'ÚNICO'
  rating: number
  reviewsCount: number
  editionType: EditionType
  availableQuantity: number
  totalQuantity: number
  attributes: NftAttribute[]
  creator: NftCreator
  contractAddress: string
  network: 'Ethereum' | 'Polygon'
  isFavorite?: boolean
  updatedAt: string
  version: number
}

export interface NftFilterParams {
  search?: string
  collection?: string
  priceMin?: string
  priceMax?: string
  network?: string
  sortBy?: 'recent' | 'price_asc' | 'price_desc' | 'popular'
  page?: number
  limit?: number
}

export interface NftListResult {
  items: Nft[]
  total: number
  page: number
  limit: number
  totalPages: number
}
