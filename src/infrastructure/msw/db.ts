import { INITIAL_NFTS, USERS_FIXTURES, WALLETS_FIXTURES, COUPONS_FIXTURES } from './fixtures'
import { Nft, NftFilterParams, NftListResult } from '../../domain/nft/types'
import { CartItem, CartQuote } from '../../domain/cart/types'
import { OrderSnapshot, CreateOrderPayload } from '../../domain/order/types'
import { CollectorUser, Session } from '../../domain/identity/types'
import { ConnectedWallet, AddWalletPayload } from '../../domain/wallet/types'
import { EthAmount } from '../../domain/shared/EthAmount'

interface NetworkSimulationConfig {
  delayMs: number
  shouldFail: boolean
  failureStatus: number
}

const STORAGE_KEY = 'kurio_mock_db_v2'

interface DatabaseState {
  nfts: Nft[]
  users: (CollectorUser & { password: string })[]
  wallets: ConnectedWallet[]
  favorites: Record<string, string[]> // userId -> nftIds[]
  carts: Record<string, { items: CartItem[]; couponCode: string | null }> // userId/sessionId -> Cart
  orders: Record<string, OrderSnapshot> // orderId -> Order
  idempotencyStore: Record<string, { orderId: string; requestFingerprint: string }> // key -> { orderId, fingerprint }
  activeSession: Session | null
  networkConfig: NetworkSimulationConfig
}

function getDefaultState(): DatabaseState {
  return {
    nfts: JSON.parse(JSON.stringify(INITIAL_NFTS)),
    users: JSON.parse(JSON.stringify(USERS_FIXTURES)),
    wallets: JSON.parse(JSON.stringify(WALLETS_FIXTURES)),
    favorites: {
      'user-1': ['nft-1', 'nft-3'],
      'user-2': ['nft-2'],
    },
    carts: {},
    orders: {},
    idempotencyStore: {},
    activeSession: null,
    networkConfig: {
      delayMs: 150,
      shouldFail: false,
      failureStatus: 500,
    },
  }
}

class MockDatabase {
  private state: DatabaseState

  constructor() {
    this.state = this.loadState()
  }

  private loadState(): DatabaseState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: DatabaseState = JSON.parse(saved)
        parsed.nfts = JSON.parse(JSON.stringify(INITIAL_NFTS))
        return parsed
      }
    } catch {
      // Fallback
    }
    return getDefaultState()
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
    } catch {
      // Fallback
    }
  }

  public reset(): void {
    this.state = getDefaultState()
    this.saveState()
  }

  public getNetworkConfig(): NetworkSimulationConfig {
    return this.state.networkConfig
  }

  public setNetworkConfig(cfg: Partial<NetworkSimulationConfig>): void {
    this.state.networkConfig = { ...this.state.networkConfig, ...cfg }
    this.saveState()
  }

  // --- NFTS ---
  public listNfts(params: NftFilterParams, currentUserId?: string): NftListResult {
    let list = [...this.state.nfts]

    // Mark favorites for current user
    const userFavs = currentUserId ? this.state.favorites[currentUserId] || [] : []
    list = list.map((nft) => ({
      ...nft,
      isFavorite: userFavs.includes(nft.id),
    }))

    if (params.search) {
      const q = params.search.toLowerCase().trim()
      list = list.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.tokenId.toLowerCase().includes(q) ||
          n.collection.toLowerCase().includes(q) ||
          n.creator.name.toLowerCase().includes(q) ||
          n.price.includes(q) ||
          (n.description && n.description.toLowerCase().includes(q))
      )
    }

    if (params.collection && params.collection !== 'Todos os NFTs') {
      list = list.filter((n) => n.collection.toLowerCase() === params.collection?.toLowerCase())
    }

    if (params.priceMin) {
      const min = EthAmount.fromString(params.priceMin)
      list = list.filter((n) => !EthAmount.fromString(n.price).isLessThan(min))
    }

    if (params.priceMax) {
      const max = EthAmount.fromString(params.priceMax)
      list = list.filter((n) => !EthAmount.fromString(n.price).isGreaterThan(max))
    }

    if (params.network) {
      list = list.filter((n) => n.network.toLowerCase() === params.network?.toLowerCase())
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          list.sort((a, b) =>
            EthAmount.fromString(a.price).isLessThan(EthAmount.fromString(b.price)) ? -1 : 1
          )
          break
        case 'price_desc':
          list.sort((a, b) =>
            EthAmount.fromString(a.price).isGreaterThan(EthAmount.fromString(b.price)) ? -1 : 1
          )
          break
        case 'popular':
          list.sort((a, b) => b.reviewsCount - a.reviewsCount)
          break
        case 'recent':
        default:
          list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          break
      }
    }

    const page = Math.max(1, params.page || 1)
    const limit = Math.max(1, params.limit || 8)
    const total = list.length
    const totalPages = Math.ceil(total / limit)
    const items = list.slice((page - 1) * limit, page * limit)

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    }
  }

  public getNftById(id: string, currentUserId?: string): Nft | undefined {
    const nft = this.state.nfts.find((n) => n.id === id || n.tokenId === id)
    if (!nft) return undefined

    const userFavs = currentUserId ? this.state.favorites[currentUserId] || [] : []
    return {
      ...nft,
      isFavorite: userFavs.includes(nft.id),
    }
  }

  public updateNftPrice(id: string, newPriceEth: string, newAvailableQty?: number): Nft | undefined {
    const nft = this.state.nfts.find((n) => n.id === id || n.tokenId === id)
    if (!nft) return undefined

    nft.price = newPriceEth
    if (newAvailableQty !== undefined) {
      nft.availableQuantity = newAvailableQty
    }
    nft.version += 1
    nft.updatedAt = new Date().toISOString()
    this.saveState()
    return nft
  }

  // --- FAVORITES ---
  public toggleFavorite(userId: string, nftId: string): boolean {
    if (!this.state.favorites[userId]) {
      this.state.favorites[userId] = []
    }
    const idx = this.state.favorites[userId].indexOf(nftId)
    let isFav = false
    if (idx >= 0) {
      this.state.favorites[userId].splice(idx, 1)
      isFav = false
    } else {
      this.state.favorites[userId].push(nftId)
      isFav = true
    }
    this.saveState()
    return isFav
  }

  // --- CART & QUOTE ---
  public getCart(sessionId: string): { items: CartItem[]; couponCode: string | null } {
    if (!this.state.carts[sessionId]) {
      // Default initial mock cart with the 3 items from Figma (Page 2 / Page 3)
      this.state.carts[sessionId] = {
        items: [
          {
            id: 'ci-1',
            nftId: 'nft-1',
            tokenId: '#0042',
            name: 'Emerald Ape #042',
            collection: 'Kurio Apes',
            mediaUrl: '/assets/nfts/emerald-ape-042.png',
            editionType: '1/50',
            unitPriceEth: '1.19',
            quantity: 2,
            maxAvailable: 12,
            subtotalEth: '2.38',
            version: 1,
          },
          {
            id: 'ci-2',
            nftId: 'nft-5',
            tokenId: '#0314',
            name: 'Violet Nomad #314',
            collection: 'Kurio Nomads',
            mediaUrl: '/assets/nfts/violet-nomad-314.png',
            editionType: '1/1',
            unitPriceEth: '1.39',
            quantity: 6,
            maxAvailable: 10,
            subtotalEth: '8.34',
            version: 1,
          },
          {
            id: 'ci-3',
            nftId: 'nft-6',
            tokenId: '#0088',
            name: 'Ivory Baron #088',
            collection: 'Kurio Barons',
            mediaUrl: '/assets/nfts/ivory-baron-088.png',
            editionType: '1/10',
            unitPriceEth: '1.79',
            quantity: 9,
            maxAvailable: 10,
            subtotalEth: '16.11',
            version: 1,
          },
        ],
        couponCode: null,
      }
      this.saveState()
    }
    return this.state.carts[sessionId]
  }

  public addToCart(sessionId: string, nft: Nft, quantity: number): CartItem {
    const cart = this.getCart(sessionId)
    const existing = cart.items.find((i) => i.nftId === nft.id)
    const unitPrice = EthAmount.fromString(nft.price)

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, nft.availableQuantity)
      existing.subtotalEth = unitPrice.multiply(existing.quantity).toDecimalString()
      this.saveState()
      return existing
    }

    const newItem: CartItem = {
      id: `ci-${Date.now()}`,
      nftId: nft.id,
      tokenId: nft.tokenId,
      name: nft.name,
      collection: nft.collection,
      mediaUrl: nft.mediaUrl,
      editionType: nft.editionType,
      unitPriceEth: nft.price,
      quantity: Math.min(quantity, nft.availableQuantity),
      maxAvailable: nft.availableQuantity,
      subtotalEth: unitPrice.multiply(quantity).toDecimalString(),
      version: nft.version,
    }
    cart.items.push(newItem)
    this.saveState()
    return newItem
  }

  public updateCartItemQuantity(sessionId: string, itemId: string, quantity: number): CartItem | null {
    const cart = this.getCart(sessionId)
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) return null

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId)
      this.saveState()
      return null
    }

    item.quantity = Math.min(quantity, item.maxAvailable)
    const unitPrice = EthAmount.fromString(item.unitPriceEth)
    item.subtotalEth = unitPrice.multiply(item.quantity).toDecimalString()
    this.saveState()
    return item
  }

  public removeCartItem(sessionId: string, itemId: string): void {
    const cart = this.getCart(sessionId)
    cart.items = cart.items.filter((i) => i.id !== itemId)
    this.saveState()
  }

  public applyCoupon(sessionId: string, code: string): { success: boolean; message: string } {
    const normalized = code.trim().toUpperCase()
    if (normalized === 'EXPIRADO') {
      return { success: false, message: 'Cupom expirado em 31/12/2024.' }
    }
    const coupon = COUPONS_FIXTURES[normalized]
    if (!coupon) {
      return { success: false, message: 'Código promocional inválido.' }
    }
    const cart = this.getCart(sessionId)
    cart.couponCode = normalized
    this.saveState()
    return { success: true, message: `Cupom ${coupon.label} aplicado com sucesso!` }
  }

  public removeCoupon(sessionId: string): void {
    const cart = this.getCart(sessionId)
    cart.couponCode = null
    this.saveState()
  }

  public calculateQuote(sessionId: string): CartQuote {
    const cart = this.getCart(sessionId)
    let subtotal = EthAmount.zero()
    let hasPriceChanges = false
    let hasAvailabilityIssues = false
    let warningMessage: string | undefined

    // Check with live catalog state
    for (const item of cart.items) {
      const liveNft = this.state.nfts.find((n) => n.id === item.nftId)
      if (liveNft) {
        if (liveNft.price !== item.unitPriceEth) {
          hasPriceChanges = true
          warningMessage = `O preço de ${item.name} foi atualizado de ${item.unitPriceEth} para ${liveNft.price} ETH.`
          item.unitPriceEth = liveNft.price
          item.subtotalEth = EthAmount.fromString(liveNft.price).multiply(item.quantity).toDecimalString()
        }
        if (item.quantity > liveNft.availableQuantity) {
          hasAvailabilityIssues = true
          warningMessage = `A disponibilidade de ${item.name} mudou para ${liveNft.availableQuantity} unidades.`
          item.quantity = Math.max(1, liveNft.availableQuantity)
          item.maxAvailable = liveNft.availableQuantity
          item.subtotalEth = EthAmount.fromString(item.unitPriceEth).multiply(item.quantity).toDecimalString()
        }
      }
      subtotal = subtotal.add(EthAmount.fromString(item.subtotalEth))
    }

    // Fixed network gas fee simulated: 0.016 ETH (exact Figma value)
    const networkFee = cart.items.length > 0 ? EthAmount.fromString('0.016') : EthAmount.zero()

    // Coupon discount calculation
    let discount = EthAmount.zero()
    const coupon = cart.couponCode ? COUPONS_FIXTURES[cart.couponCode] : null
    if (coupon) {
      discount = subtotal.percentageDiscount(coupon.discountPercent)
    }

    const total = subtotal.subtract(discount).add(networkFee)

    this.saveState()

    return {
      items: cart.items,
      subtotalEth: subtotal.toDecimalString(),
      discountEth: discount.toDecimalString(),
      networkFeeEth: networkFee.toDecimalString(),
      totalEth: total.toDecimalString(),
      appliedCoupon: coupon || null,
      quoteVersion: Date.now(),
      hasPriceChanges,
      hasAvailabilityIssues,
      warningMessage,
    }
  }

  // --- ORDERS & IDEMPOTENCY ---
  public createOrder(
    sessionId: string,
    payload: CreateOrderPayload
  ): { order?: OrderSnapshot; conflict?: boolean; error?: string } {
    const fingerprint = JSON.stringify({
      walletAddress: payload.walletAddress,
      network: payload.network,
      collectorEmail: payload.collectorEmail,
    })

    // Check idempotency store
    const existing = this.state.idempotencyStore[payload.idempotencyKey]
    if (existing) {
      if (existing.requestFingerprint === fingerprint) {
        // Idempotent recovery: Return existing order!
        const order = this.state.orders[existing.orderId]
        return { order }
      } else {
        // Reuse key with different payload: 409 Conflict!
        return {
          conflict: true,
          error: 'Chave de idempotência já utilizada com parâmetros diferentes.',
        }
      }
    }

    // Calculate quote
    const quote = this.calculateQuote(sessionId)
    if (quote.items.length === 0) {
      return { error: 'Carrinho vazio.' }
    }

    const orderId = `ord-${Date.now()}`
    const orderNumber = `KURIO-${Math.floor(100000 + Math.random() * 900000)}`
    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`

    const orderSnapshot: OrderSnapshot = {
      id: orderId,
      orderNumber,
      idempotencyKey: payload.idempotencyKey,
      status: 'confirmed',
      collectorName: payload.collectorName,
      collectorEmail: payload.collectorEmail,
      walletAddress: payload.walletAddress,
      network: payload.network,
      items: quote.items.map((i) => ({
        nftId: i.nftId,
        tokenId: i.tokenId,
        name: i.name,
        mediaUrl: i.mediaUrl,
        editionType: i.editionType,
        unitPriceEth: i.unitPriceEth,
        quantity: i.quantity,
        subtotalEth: i.subtotalEth,
      })),
      subtotalEth: quote.subtotalEth,
      discountEth: quote.discountEth,
      networkFeeEth: quote.networkFeeEth,
      totalEth: quote.totalEth,
      appliedCoupon: quote.appliedCoupon,
      transactionHash: txHash,
      blockExplorerUrl: `https://${payload.network === 'Ethereum' ? 'etherscan.io' : 'polygonscan.com'}/tx/${txHash}`,
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
    }

    // Persist order and idempotency record
    this.state.orders[orderId] = orderSnapshot
    this.state.idempotencyStore[payload.idempotencyKey] = {
      orderId,
      requestFingerprint: fingerprint,
    }

    // Decrement catalog quantities
    for (const item of quote.items) {
      const liveNft = this.state.nfts.find((n) => n.id === item.nftId)
      if (liveNft) {
        liveNft.availableQuantity = Math.max(0, liveNft.availableQuantity - item.quantity)
      }
    }

    // Clear purchased items from cart
    this.state.carts[sessionId] = {
      items: [],
      couponCode: null,
    }

    this.saveState()
    return { order: orderSnapshot }
  }

  public getOrder(orderId: string): OrderSnapshot | undefined {
    return this.state.orders[orderId]
  }

  // --- AUTH & SESSION ---
  public getSession(): Session | null {
    return this.state.activeSession
  }

  public login(email: string, pass?: string): { session?: Session; error?: string } {
    const cleanEmail = email.trim().toLowerCase()
    // Find matching user or fallback to demo user if default credentials are used
    let user = this.state.users.find(
      (u) =>
        (u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanEmail) &&
        (!pass || u.password === pass || pass === 'Password@123')
    )

    if (!user && (cleanEmail === 'contato@email.com' || cleanEmail === 'alexvance' || cleanEmail === 'demo')) {
      user = this.state.users[0]
    }

    if (!user) {
      return { error: 'E-mail ou usuário não encontrado.' }
    }

    const session: Session = {
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        ensName: user.ensName,
        walletNickname: user.walletNickname,
        createdAt: user.createdAt,
      },
      token: `jwt_mock_${user.username}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    }
    this.state.activeSession = session
    this.saveState()
    return { session }
  }

  public register(username: string, email: string, pass: string): { session?: Session; error?: string } {
    const existing = this.state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase()
    )
    if (existing) {
      return { error: 'Usuário ou e-mail já cadastrado.' }
    }

    const newUser: CollectorUser & { password: string } = {
      id: `user-${Date.now()}`,
      username,
      displayName: username,
      email,
      password: pass,
      avatarUrl: '/assets/nfts/hero-ape.png',
      createdAt: new Date().toISOString(),
    }
    this.state.users.push(newUser)

    const session: Session = {
      user: newUser,
      token: `jwt_mock_${newUser.username}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    }
    this.state.activeSession = session
    this.saveState()
    return { session }
  }

  public logout(): void {
    this.state.activeSession = null
    this.saveState()
  }

  public updateProfile(data: Partial<CollectorUser>): CollectorUser | null {
    if (!this.state.activeSession) return null
    const user = this.state.users.find((u) => u.id === this.state.activeSession?.user.id)
    if (!user) return null

    if (data.displayName) user.displayName = data.displayName
    if (data.email) user.email = data.email
    if (data.ensName !== undefined) user.ensName = data.ensName
    if (data.walletNickname !== undefined) user.walletNickname = data.walletNickname
    if (data.avatarUrl) user.avatarUrl = data.avatarUrl

    this.state.activeSession.user = { ...user }
    this.saveState()
    return this.state.activeSession.user
  }

  // --- WALLETS ---
  public getWallets(): ConnectedWallet[] {
    return this.state.wallets
  }

  public addWallet(payload: AddWalletPayload): ConnectedWallet {
    const newWallet: ConnectedWallet = {
      id: `w-${Date.now()}`,
      address: payload.address,
      nickname: payload.nickname,
      network: payload.network,
      provider: payload.provider,
      isPrimary: payload.isPrimary || this.state.wallets.length === 0,
      balanceEth: '10.00',
    }
    if (newWallet.isPrimary) {
      this.state.wallets.forEach((w) => (w.isPrimary = false))
    }
    this.state.wallets.push(newWallet)
    this.saveState()
    return newWallet
  }
}

export const mockDb = new MockDatabase()
