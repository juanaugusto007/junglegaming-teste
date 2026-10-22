export type NetworkType = 'Ethereum' | 'Polygon'
export type WalletProviderType = 'MetaMask' | 'WalletConnect' | 'Coinbase Wallet'

export interface ConnectedWallet {
  id: string
  address: string
  nickname: string
  network: NetworkType
  provider: WalletProviderType
  isPrimary: boolean
  balanceEth: string
  ensName?: string
}

export interface AddWalletPayload {
  address: string
  nickname: string
  network: NetworkType
  provider: WalletProviderType
  isPrimary?: boolean
}
