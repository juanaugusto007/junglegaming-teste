import { io, Socket } from 'socket.io-client'

export interface NftUpdatedEvent {
  nftId: string
  tokenId: string
  price: string
  availableQuantity: number
  version: number
  updatedAt: string
}

export interface OrderUpdatedEvent {
  orderId: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'rejected' | 'failed'
  transactionHash: string
  totalEth: string
  version: number
}

type EventCallback<T> = (data: T) => void

// Event bus bridge between MSW mock emitter and socket.io-client
class RealtimeService {
  private socket: Socket | null = null
  private eventVersions: Map<string, number> = new Map()
  private listeners: Map<string, Set<EventCallback<any>>> = new Map()
  private isConnected = false

  constructor() {
    this.initSocket()
  }

  private initSocket() {
    // Connect to mock Socket.IO endpoint
    this.socket = io(window.location.origin, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
    })

    this.socket.on('connect', () => {
      this.isConnected = true
      // Trigger reconciliation after reconnect
      window.dispatchEvent(new CustomEvent('kurio:realtime-reconnected'))
    })

    this.socket.on('disconnect', () => {
      this.isConnected = false
    })

    // Listen to official protocol events
    this.socket.on('nft.updated', (payload: NftUpdatedEvent) => {
      this.handleNftUpdated(payload)
    })

    this.socket.on('order.updated', (payload: OrderUpdatedEvent) => {
      this.handleOrderUpdated(payload)
    })
  }

  public getSocket(): Socket | null {
    return this.socket
  }

  public getStatus(): boolean {
    return this.isConnected
  }

  private handleNftUpdated(payload: NftUpdatedEvent) {
    const key = `nft:${payload.nftId}`
    const lastVersion = this.eventVersions.get(key) || 0
    // Reject duplicates or stale versions
    if (payload.version <= lastVersion) {
      return
    }
    this.eventVersions.set(key, payload.version)

    // Notify registered listeners
    const subs = this.listeners.get('nft.updated')
    if (subs) {
      subs.forEach((cb) => cb(payload))
    }
  }

  private handleOrderUpdated(payload: OrderUpdatedEvent) {
    const key = `order:${payload.orderId}`
    const lastVersion = this.eventVersions.get(key) || 0
    if (payload.version <= lastVersion) {
      return
    }
    this.eventVersions.set(key, payload.version)

    const subs = this.listeners.get('order.updated')
    if (subs) {
      subs.forEach((cb) => cb(payload))
    }
  }

  public subscribeNftUpdates(cb: EventCallback<NftUpdatedEvent>): () => void {
    if (!this.listeners.has('nft.updated')) {
      this.listeners.set('nft.updated', new Set())
    }
    this.listeners.get('nft.updated')!.add(cb)

    return () => {
      this.listeners.get('nft.updated')?.delete(cb)
    }
  }

  public subscribeOrderUpdates(cb: EventCallback<OrderUpdatedEvent>): () => void {
    if (!this.listeners.has('order.updated')) {
      this.listeners.set('order.updated', new Set())
    }
    this.listeners.get('order.updated')!.add(cb)

    return () => {
      this.listeners.get('order.updated')?.delete(cb)
    }
  }

  /**
   * Internal bridge for MSW to dispatch events through socket.io-client
   */
  public dispatchMockEvent(eventName: string, data: any) {
    if (this.socket) {
      // Dispatch on socket client directly as if received from server
      (this.socket as any).emit(eventName, data)
      // Also trigger incoming handler
      if (eventName === 'nft.updated') {
        this.handleNftUpdated(data)
      } else if (eventName === 'order.updated') {
        this.handleOrderUpdated(data)
      }
    }
  }
}

export const realtimeService = new RealtimeService()

export function emitRealtimeEvent(event: 'nft.updated' | 'order.updated', data: any) {
  realtimeService.dispatchMockEvent(event, data)
}
