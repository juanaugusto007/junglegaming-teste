import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../infrastructure/http/client'
import { ConnectedWallet, AddWalletPayload } from '../../domain/wallet/types'

export const WALLET_QUERY_KEYS = {
  all: ['wallets'] as const,
}

export function useWallets() {
  const queryClient = useQueryClient()

  const { data: wallets = [], isLoading, refetch } = useQuery<ConnectedWallet[]>({
    queryKey: WALLET_QUERY_KEYS.all,
    queryFn: async () => {
      const res = await apiClient.get<ConnectedWallet[]>('/wallets')
      return res.data
    },
    staleTime: 60000,
  })

  const addWalletMutation = useMutation({
    mutationFn: async (payload: AddWalletPayload) => {
      const res = await apiClient.post<ConnectedWallet>('/wallets', payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.all })
    },
  })

  return {
    wallets,
    primaryWallet: wallets.find((w) => w.isPrimary) || wallets[0] || null,
    isLoading,
    refetch,
    addWallet: addWalletMutation.mutateAsync,
    isAdding: addWalletMutation.isPending,
  }
}
