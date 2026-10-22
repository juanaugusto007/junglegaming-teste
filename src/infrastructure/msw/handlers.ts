import { http, HttpResponse, delay } from 'msw'
import { mockDb } from './db'
import { emitRealtimeEvent } from '../realtime/socket'

export const handlers = [
  // Network simulation middleware helper
  http.all('/api/*', async () => {
    const net = mockDb.getNetworkConfig()
    if (net.delayMs > 0) {
      await delay(net.delayMs)
    }
    if (net.shouldFail) {
      return HttpResponse.json(
        { message: 'Erro simulado de infraestrutura de rede.' },
        { status: net.failureStatus || 500 }
      )
    }
  }),

  // --- NFTS ---
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || undefined
    const collection = url.searchParams.get('collection') || undefined
    const priceMin = url.searchParams.get('priceMin') || undefined
    const priceMax = url.searchParams.get('priceMax') || undefined
    const network = url.searchParams.get('network') || undefined
    const sortBy = (url.searchParams.get('sortBy') as any) || undefined
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 8

    const session = mockDb.getSession()
    const result = mockDb.listNfts(
      { search, collection, priceMin, priceMax, network, sortBy, page, limit },
      session?.user?.id
    )

    return HttpResponse.json(result)
  }),

  http.get('/api/nfts/:id', ({ params }) => {
    const { id } = params
    const session = mockDb.getSession()
    const nft = mockDb.getNftById(id as string, session?.user?.id)
    if (!nft) {
      return HttpResponse.json({ message: 'NFT não encontrado.' }, { status: 404 })
    }
    return HttpResponse.json(nft)
  }),

  // --- FAVORITES ---
  http.post('/api/favorites/:id', ({ params }) => {
    const session = mockDb.getSession()
    if (!session) {
      return HttpResponse.json({ message: 'Acesso não autorizado. Faça login.' }, { status: 401 })
    }
    const { id } = params
    const isFavorite = mockDb.toggleFavorite(session.user.id, id as string)
    return HttpResponse.json({ isFavorite })
  }),

  // --- CART & QUOTE ---
  http.get('/api/cart', () => {
    const session = mockDb.getSession()
    const sessionId = session?.user?.id || 'visitor-session'
    const quote = mockDb.calculateQuote(sessionId)
    return HttpResponse.json(quote)
  }),

  http.post('/api/cart/items', async ({ request }) => {
    const body = (await request.json()) as { nftId: string; quantity: number }
    const session = mockDb.getSession()
    const sessionId = session?.user?.id || 'visitor-session'

    const nft = mockDb.getNftById(body.nftId)
    if (!nft) {
      return HttpResponse.json({ message: 'NFT inexistente.' }, { status: 404 })
    }
    if (nft.availableQuantity <= 0) {
      return HttpResponse.json({ message: 'Edição esgotada.' }, { status: 409 })
    }

    mockDb.addToCart(sessionId, nft, body.quantity || 1)
    const quote = mockDb.calculateQuote(sessionId)
    return HttpResponse.json(quote)
  }),

  http.put('/api/cart/items/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as { quantity: number }
    const session = mockDb.getSession()
    const sessionId = session?.user?.id || 'visitor-session'

    mockDb.updateCartItemQuantity(sessionId, id as string, body.quantity)
    const quote = mockDb.calculateQuote(sessionId)
    return HttpResponse.json(quote)
  }),

  http.delete('/api/cart/items/:id', ({ params }) => {
    const { id } = params
    const session = mockDb.getSession()
    const sessionId = session?.user?.id || 'visitor-session'

    mockDb.removeCartItem(sessionId, id as string)
    const quote = mockDb.calculateQuote(sessionId)
    return HttpResponse.json(quote)
  }),

  http.post('/api/cart/coupon', async ({ request }) => {
    const body = (await request.json()) as { code: string }
    const session = mockDb.getSession()
    const sessionId = session?.user?.id || 'visitor-session'

    const res = mockDb.applyCoupon(sessionId, body.code)
    if (!res.success) {
      return HttpResponse.json({ message: res.message }, { status: 400 })
    }
    const quote = mockDb.calculateQuote(sessionId)
    return HttpResponse.json({ ...quote, message: res.message })
  }),

  http.delete('/api/cart/coupon', () => {
    const session = mockDb.getSession()
    const sessionId = session?.user?.id || 'visitor-session'
    mockDb.removeCoupon(sessionId)
    const quote = mockDb.calculateQuote(sessionId)
    return HttpResponse.json(quote)
  }),

  http.get('/api/quote', () => {
    const session = mockDb.getSession()
    const sessionId = session?.user?.id || 'visitor-session'
    const quote = mockDb.calculateQuote(sessionId)
    return HttpResponse.json(quote)
  }),

  // --- ORDERS ---
  http.post('/api/orders', async ({ request }) => {
    const session = mockDb.getSession()
    if (!session) {
      return HttpResponse.json({ message: 'Autenticação necessária para finalizar a compra.' }, { status: 401 })
    }

    const idempotencyKey = request.headers.get('x-idempotency-key')
    if (!idempotencyKey) {
      return HttpResponse.json({ message: 'Cabeçalho X-Idempotency-Key obrigatório.' }, { status: 400 })
    }

    const body = (await request.json()) as any
    const sessionId = session.user.id

    const result = mockDb.createOrder(sessionId, {
      ...body,
      idempotencyKey,
    })

    if (result.conflict) {
      return HttpResponse.json({ message: result.error }, { status: 409 })
    }

    if (result.error || !result.order) {
      return HttpResponse.json({ message: result.error || 'Falha ao processar pedido.' }, { status: 400 })
    }

    // Emit order.updated realtime event to subscribers
    emitRealtimeEvent('order.updated', {
      orderId: result.order.id,
      orderNumber: result.order.orderNumber,
      status: result.order.status,
      transactionHash: result.order.transactionHash,
      totalEth: result.order.totalEth,
      version: 1,
    })

    return HttpResponse.json(result.order, { status: 201 })
  }),

  http.get('/api/orders/:id', ({ params }) => {
    const { id } = params
    const order = mockDb.getOrder(id as string)
    if (!order) {
      return HttpResponse.json({ message: 'Pedido não encontrado.' }, { status: 404 })
    }
    return HttpResponse.json(order)
  }),

  // --- AUTH & ACCOUNT ---
  http.get('/api/auth/session', () => {
    const session = mockDb.getSession()
    if (!session) {
      return HttpResponse.json({ message: 'Não autenticado.' }, { status: 401 })
    }
    return HttpResponse.json(session)
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }
    if (!body.email || !body.password) {
      return HttpResponse.json({ message: 'E-mail e senha são obrigatórios.' }, { status: 400 })
    }

    const res = mockDb.login(body.email, body.password)
    if (res.error || !res.session) {
      return HttpResponse.json({ message: res.error || 'Credenciais inválidas.' }, { status: 401 })
    }

    return HttpResponse.json(res.session)
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as { username?: string; email?: string; password?: string }
    if (!body.username || !body.email || !body.password) {
      return HttpResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 })
    }

    const res = mockDb.register(body.username, body.email, body.password)
    if (res.error || !res.session) {
      return HttpResponse.json({ message: res.error }, { status: 409 })
    }

    return HttpResponse.json(res.session, { status: 201 })
  }),

  http.post('/api/auth/logout', () => {
    mockDb.logout()
    return HttpResponse.json({ success: true })
  }),

  http.put('/api/profile', async ({ request }) => {
    const session = mockDb.getSession()
    if (!session) {
      return HttpResponse.json({ message: 'Não autenticado.' }, { status: 401 })
    }

    const body = (await request.json()) as any
    const updated = mockDb.updateProfile(body)
    return HttpResponse.json(updated)
  }),

  http.post('/api/profile/password', async ({ request }) => {
    const session = mockDb.getSession()
    if (!session) {
      return HttpResponse.json({ message: 'Não autenticado.' }, { status: 401 })
    }

    const body = (await request.json()) as { currentPassword?: string; newPassword?: string }
    if (!body.currentPassword || !body.newPassword) {
      return HttpResponse.json({ message: 'Campos incompletos.' }, { status: 400 })
    }

    return HttpResponse.json({ success: true, message: 'Senha atualizada com sucesso.' })
  }),

  // --- WALLETS ---
  http.get('/api/wallets', () => {
    return HttpResponse.json(mockDb.getWallets())
  }),

  http.post('/api/wallets', async ({ request }) => {
    const body = (await request.json()) as any
    if (!body.address || !body.network) {
      return HttpResponse.json({ message: 'Endereço e rede são obrigatórios.' }, { status: 400 })
    }
    const newWallet = mockDb.addWallet(body)
    return HttpResponse.json(newWallet, { status: 201 })
  }),

  // --- ADMIN & TEST SCENARIOS ---
  http.post('/api/admin/reset', () => {
    mockDb.reset()
    return HttpResponse.json({ message: 'Cenário restaurado com sucesso.' })
  }),

  http.post('/api/admin/simulate-network', async ({ request }) => {
    const body = (await request.json()) as any
    mockDb.setNetworkConfig(body)
    return HttpResponse.json(mockDb.getNetworkConfig())
  }),

  http.post('/api/admin/simulate-nft-update', async ({ request }) => {
    const body = (await request.json()) as { id: string; price: string; quantity?: number }
    const nft = mockDb.updateNftPrice(body.id, body.price, body.quantity)
    if (!nft) {
      return HttpResponse.json({ message: 'NFT não encontrado' }, { status: 404 })
    }

    // Emit realtime event nft.updated
    emitRealtimeEvent('nft.updated', {
      nftId: nft.id,
      tokenId: nft.tokenId,
      price: nft.price,
      availableQuantity: nft.availableQuantity,
      version: nft.version,
      updatedAt: nft.updatedAt,
    })

    return HttpResponse.json(nft)
  }),
]
