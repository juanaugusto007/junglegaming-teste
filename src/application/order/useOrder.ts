import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../infrastructure/http/client'
import { OrderSnapshot, CreateOrderPayload } from '../../domain/order/types'
import { realtimeService, OrderUpdatedEvent } from '../../infrastructure/realtime/socket'
import { CART_QUERY_KEYS } from '../cart/useCart'

export const ORDER_QUERY_KEYS = {
  detail: (id: string) => ['orders', 'detail', id] as const,
}

export function useOrderDetail(orderId: string) {
  const queryClient = useQueryClient()
  const [realtimeOrderUpdate, setRealtimeOrderUpdate] = useState<OrderUpdatedEvent | null>(null)

  const query = useQuery<OrderSnapshot>({
    queryKey: ORDER_QUERY_KEYS.detail(orderId),
    queryFn: async () => {
      const res = await apiClient.get<OrderSnapshot>(`/orders/${orderId}`)
      return res.data
    },
    enabled: Boolean(orderId),
  })

  // Listen to order.updated realtime events
  useEffect(() => {
    if (!orderId) return

    const unsubscribe = realtimeService.subscribeOrderUpdates((evt: OrderUpdatedEvent) => {
      if (evt.orderId === orderId) {
        setRealtimeOrderUpdate(evt)
        queryClient.setQueryData<OrderSnapshot>(ORDER_QUERY_KEYS.detail(orderId), (old) => {
          if (!old) return old
          return {
            ...old,
            status: evt.status,
            transactionHash: evt.transactionHash || old.transactionHash,
          }
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [orderId, queryClient])

  return {
    ...query,
    realtimeOrderUpdate,
  }
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      idempotencyKey,
      payload,
    }: {
      idempotencyKey: string
      payload: Omit<CreateOrderPayload, 'idempotencyKey'>
    }) => {
      const res = await apiClient.post<OrderSnapshot>('/orders', payload, {
        headers: {
          'x-idempotency-key': idempotencyKey,
        },
      })
      return res.data
    },
    onSuccess: (order) => {
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(order.id), order)
      // Invalidate cart since items were bought
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.quote })
    },
  })
}
