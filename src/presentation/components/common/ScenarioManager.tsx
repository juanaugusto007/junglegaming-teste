import React, { useState } from 'react'
import { Settings, RefreshCw, Zap, WifiOff, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { apiClient } from '../../../infrastructure/http/client'
import { Button } from '../ui/Button'

export const ScenarioManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [delayVal, setDelayVal] = useState(150)
  const [simulatingFail, setSimulatingFail] = useState(false)

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleReset = async () => {
    try {
      await apiClient.post('/admin/reset')
      showFeedback('Banco de dados simulado restaurado com sucesso!')
      window.location.reload()
    } catch {
      showFeedback('Erro ao restaurar banco.')
    }
  }

  const handleUpdateDelay = async (ms: number) => {
    setDelayVal(ms)
    await apiClient.post('/admin/simulate-network', { delayMs: ms, shouldFail: false })
    showFeedback(`Latência simulada configurada para ${ms}ms.`)
  }

  const handleToggleFail = async (status: number) => {
    const nextState = !simulatingFail
    setSimulatingFail(nextState)
    await apiClient.post('/admin/simulate-network', {
      shouldFail: nextState,
      failureStatus: status,
      delayMs: delayVal,
    })
    showFeedback(nextState ? `Simulação de falha HTTP ${status} ativada.` : 'Falha desativada.')
  }

  const handleTriggerRealtimeNftUpdate = async () => {
    try {
      // Alter the price of Emerald Ape #042 to 1.45 ETH
      await apiClient.post('/admin/simulate-nft-update', {
        id: 'nft-1',
        price: '1.45',
        quantity: 8,
      })
      showFeedback('Evento realtime "nft.updated" disparado via Socket.IO!')
    } catch {
      showFeedback('Erro ao disparar evento realtime.')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir painel de simulação e avaliação técnica"
        className="flex items-center gap-2 px-3 py-2 bg-surface-elevated border border-brand text-brand hover:bg-brand hover:text-background transition-all shadow-xl rounded-sm"
      >
        <Settings className="w-4 h-4 animate-spin-slow" />
        <span className="font-bold">Cenários MSW / Testes</span>
      </button>

      {/* Control Panel Modal */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 bg-surface-card border border-surface-border shadow-2xl p-4 rounded-sm flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-surface-border pb-2">
            <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">
              Controle de Simulação MSW
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text-primary"
            >
              ✕
            </button>
          </div>

          {feedback && (
            <div className="p-2 bg-brand/10 border border-brand text-brand text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Latency Controls */}
          <div className="flex flex-col gap-2">
            <span className="text-text-secondary font-medium">Latência de Rede (Skeletons):</span>
            <div className="grid grid-cols-3 gap-1">
              <Button
                size="sm"
                variant={delayVal === 150 ? 'brand' : 'outline'}
                onClick={() => handleUpdateDelay(150)}
                className="text-[10px] h-7 px-1"
              >
                Normal (150ms)
              </Button>
              <Button
                size="sm"
                variant={delayVal === 1500 ? 'brand' : 'outline'}
                onClick={() => handleUpdateDelay(1500)}
                className="text-[10px] h-7 px-1"
              >
                Lenta (1.5s)
              </Button>
              <Button
                size="sm"
                variant={delayVal === 3000 ? 'brand' : 'outline'}
                onClick={() => handleUpdateDelay(3000)}
                className="text-[10px] h-7 px-1"
              >
                Alta (3s)
              </Button>
            </div>
          </div>

          {/* Realtime Event Trigger */}
          <div className="flex flex-col gap-2 border-t border-surface-border pt-3">
            <span className="text-text-secondary font-medium">Socket.IO Tempo Real:</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleTriggerRealtimeNftUpdate}
              className="gap-2 text-[11px] justify-start border-brand/50 text-brand"
            >
              <Zap className="w-3.5 h-3.5 text-brand" />
              <span>Atualizar Emerald Ape (Preço)</span>
            </Button>
          </div>

          {/* Network Failure Injection */}
          <div className="flex flex-col gap-2 border-t border-surface-border pt-3">
            <span className="text-text-secondary font-medium">Injeção de Falhas:</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={simulatingFail ? 'danger' : 'outline'}
                onClick={() => handleToggleFail(500)}
                className="flex-1 text-[10px] h-8 gap-1.5"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>{simulatingFail ? 'Parar Falha' : 'Simular 500'}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleToggleFail(401)}
                className="flex-1 text-[10px] h-8 gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simular 401</span>
              </Button>
            </div>
          </div>

          {/* Reset All */}
          <div className="border-t border-surface-border pt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="w-full gap-2 text-text-primary hover:text-brand"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Fixtures Padrão</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
