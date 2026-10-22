import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../infrastructure/http/client'
import { Nft, NftFilterParams, NftListResult } from '../../domain/nft/types'

export const NFT_QUERY_KEYS = {
  all: ['nfts'] as const,
  list: (params: NftFilterParams) => ['nfts', 'list', params] as const,
  detail: (id: string) => ['nfts', 'detail', id] as const,
}

export function useNftsQuery(params: NftFilterParams) {
  return useQuery<NftListResult>({
    queryKey: NFT_QUERY_KEYS.list(params),
    queryFn: async () => {
      const res = await apiClient.get<NftListResult>('/nfts', { params })
      return res.data
    },
    staleTime: 30000,
  })
}

export function useNftDetailQuery(id: string) {
  return useQuery<Nft>({
    queryKey: NFT_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const res = await apiClient.get<Nft>(`/nfts/${id}`)
      return res.data
    },
    enabled: Boolean(id),
    staleTime: 30000,
  })
}

/**
 * Toggle favorite with Optimistic Update and rollback on error
 */
export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ nftId }: { nftId: string }) => {
      const res = await apiClient.post<{ isFavorite: boolean }>(`/favorites/${nftId}`)
      return res.data
    },
    onMutate: async ({ nftId }) => {
      // Cancel ongoing queries to prevent overwriting optimistic state
      await queryClient.cancelQueries({ queryKey: NFT_QUERY_KEYS.all })

      // Snapshot previous detail
      const previousNft = queryClient.getQueryData<Nft>(NFT_QUERY_KEYS.detail(nftId))

      // Optimistically update detail
      if (previousNft) {
        queryClient.setQueryData<Nft>(NFT_QUERY_KEYS.detail(nftId), {
          ...previousNft,
          isFavorite: !previousNft.isFavorite,
        })
      }

      // Optimistically update lists
      queryClient.setQueriesData<NftListResult>({ queryKey: NFT_QUERY_KEYS.all }, (old) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.map((item) =>
            item.id === nftId ? { ...item, isFavorite: !item.isFavorite } : item
          ),
        }
      })

      return { previousNft }
    },
    onError: (_err, { nftId }, context) => {
      // Rollback on failure
      if (context?.previousNft) {
        queryClient.setQueryData(NFT_QUERY_KEYS.detail(nftId), context.previousNft)
      }
      queryClient.invalidateQueries({ queryKey: NFT_QUERY_KEYS.all })
    },
    onSettled: (_data, _err, { nftId }) => {
      queryClient.invalidateQueries({ queryKey: NFT_QUERY_KEYS.detail(nftId) })
    },
  })
}
