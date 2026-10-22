import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../infrastructure/http/client'
import { CartQuote } from '../../domain/cart/types'
import { realtimeService, NftUpdatedEvent } from '../../infrastructure/realtime/socket'

export const CART_QUERY_KEYS = {
  quote: ['cart', 'quote'] as const,
}

export function useCart() {
  const queryClient = useQueryClient()
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null)

  const { data: quote, isLoading, isError, refetch } = useQuery<CartQuote>({
    queryKey: CART_QUERY_KEYS.quote,
    queryFn: async () => {
      const res = await apiClient.get<CartQuote>('/cart')
      return res.data
    },
    staleTime: 5000,
  })

  // Listen to realtime NFT updates and reconcile cart items
  useEffect(() => {
    const unsubscribe = realtimeService.subscribeNftUpdates((evt: NftUpdatedEvent) => {
      // Check if updated NFT exists in active cart
      const currentCart = queryClient.getQueryData<CartQuote>(CART_QUERY_KEYS.quote)
      const affectedItem = currentCart?.items.find((i) => i.nftId === evt.nftId)

      if (affectedItem) {
        setRealtimeNotice(
          `Atenção: O NFT "${affectedItem.name}" teve sua cotação/disponibilidade atualizada em tempo real.`
        )
        // Invalidate quote to force recalculation with live values
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.quote })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [queryClient])

  const addToCartMutation = useMutation({
    mutationFn: async ({ nftId, quantity }: { nftId: string; quantity: number }) => {
      const res = await apiClient.post<CartQuote>('/cart/items', { nftId, quantity })
      return res.data
    },
    onSuccess: (newQuote) => {
      queryClient.setQueryData(CART_QUERY_KEYS.quote, newQuote)
    },
  })

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const res = await apiClient.put<CartQuote>(`/cart/items/${itemId}`, { quantity })
      return res.data
    },
    onSuccess: (newQuote) => {
      queryClient.setQueryData(CART_QUERY_KEYS.quote, newQuote)
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: string }) => {
      const res = await apiClient.delete<CartQuote>(`/cart/items/${itemId}`)
      return res.data
    },
    onSuccess: (newQuote) => {
      queryClient.setQueryData(CART_QUERY_KEYS.quote, newQuote)
    },
  })

  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiClient.post<CartQuote & { message: string }>('/cart/coupon', { code })
      return res.data
    },
    onSuccess: (newQuote) => {
      queryClient.setQueryData(CART_QUERY_KEYS.quote, newQuote)
    },
  })

  const removeCouponMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.delete<CartQuote>('/cart/coupon')
      return res.data
    },
    onSuccess: (newQuote) => {
      queryClient.setQueryData(CART_QUERY_KEYS.quote, newQuote)
    },
  })

  return {
    quote,
    isLoading,
    isError,
    refetch,
    realtimeNotice,
    clearNotice: () => setRealtimeNotice(null),
    addToCart: addToCartMutation.mutateAsync,
    isAdding: addToCartMutation.isPending,
    updateQuantity: updateQuantityMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
    applyCoupon: applyCouponMutation.mutateAsync,
    isApplyingCoupon: applyCouponMutation.isPending,
    removeCoupon: removeCouponMutation.mutateAsync,
  }
}
