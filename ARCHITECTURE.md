# Documento de Arquitetura — KURIO NFT Marketplace

Este documento detalha as decisões arquiteturais, padrões de design, modelagem de domínio (DDD), gerenciamento de estado assíncrono, resiliência e contratos adotados no desenvolvimento da plataforma **KURIO** para o desafio Senior Frontend da Jungle Gaming.

---

## 1. Visão Geral Arquitetural

A aplicação adota os princípios de **Domain-Driven Design (DDD)** aplicados a Single Page Applications (SPA) em React e TypeScript, combinando **Clean Architecture** e separação estrita de responsabilidades:

```
src/
├── domain/                  # Camada de Domínio Puro (Independente de Frameworks e UI)
│   ├── shared/              # Value Objects Compartilhados (EthAmount, TokenId, Address)
│   ├── nft/                 # Entidade Nft, Edition, Atributos, Contratos e Filtros
│   ├── cart/                # Entidade CartItem, Regras de Cotação, Cupons e Limites
│   ├── order/               # Entidade Order, Snapshot Imutável de Recibo, Idempotência
│   ├── identity/            # CollectorUser, Session, Credenciais e Políticas de Acesso
│   └── wallet/              # ConnectedWallet, Redes (Ethereum/Polygon) e Providers
│
├── application/             # Camada de Aplicação (Casos de Uso & Orquestração Assíncrona)
│   ├── nft/                 # useNftsQuery, useNftDetailQuery, useToggleFavorite (Optimistic UI)
│   ├── cart/                # useCart, cálculos reativos e listener de eventos Socket.IO
│   ├── order/               # useCreateOrder (idempotente com header X-Idempotency-Key)
│   ├── identity/            # useAuth, ciclo de vida da sessão e refresh tokens
│   └── wallet/              # useWallets, seleção de rede e conexão
│
├── infrastructure/          # Camada de Infraestrutura (Transporte, Persistência e Mocks)
│   ├── http/                # Instância Axios, interceptors de JWT e envelopes de erro
│   ├── realtime/            # Cliente Socket.IO com versionamento, deduplicação e reconciliação
│   ├── storage/             # Persistência local (LocalStorage/IndexedDB) resiliente a refresh
│   └── msw/                 # Mock Service Worker (Handlers REST, Fixtures, Injeção de Falhas)
│
└── presentation/            # Camada de Apresentação (Interface, Rotas e Acessibilidade)
    ├── routes/              # TanStack Router (Rotas tipadas com busca e filtros na URL)
    ├── components/
    │   ├── ui/              # Design System base (Button, Input, Badge, Skeletons com Shimmer)
    │   ├── layout/          # Header, Footer institucional e Sidebar
    │   ├── catalog/         # NftCard, CatalogFilters, HeroBanner, EditorialSection
    │   └── common/          # ScenarioManager (Painel interativo de testes para a banca)
    └── styles/              # Design tokens da Kurio, Tailwind CSS e dark mode
```

---

## 2. Modelagem de Domínio & Precisão Financeira (ETH)

### 2.1. O Value Object `EthAmount`
Operações financeiras com criptomoedas exigem precisão decimal absoluta. O uso ingênuo de tipos primitivos `number` (IEEE 754 float) gera erros graves de precisão (ex: `0.1 + 0.2 = 0.30000000000000004`).

Para atender a este requisito eliminatório:
- Todo valor em ETH transita na camada de transporte e de estado como **strings decimais** (ex: `"1.19"`, `"0.016"`, `"26.846"`).
- O Value Object `EthAmount` encapsula a biblioteca `bignumber.js` configurada com precisão de 18 casas decimais e arredondamento `ROUND_DOWN`.
- Operações de soma (`add`), subtração (`subtract`), multiplicação por quantidade inteira (`multiply`) e percentual de desconto (`percentageDiscount`) são **puras e imutáveis**.

```typescript
// Exemplo de uso no cálculo da cotação:
const subtotal = EthAmount.fromString(item.unitPriceEth).multiply(item.quantity)
const discount = subtotal.percentageDiscount(coupon.discountPercent)
const total = subtotal.subtract(discount).add(networkFee)
```

---

## 3. Garantia de Idempotência no Checkout

Em aplicações Web3/Fintech, repetição de cliques ou falhas transitórias de conexão após o envio de uma compra não podem duplicar pedidos ou débitos da carteira:

1. **Geração da Chave**: Na montagem da tela de `/checkout`, um `idempotencyKey` UUID v4 criptográfico é gerado e associado à sessão de compra do usuário.
2. **Envio**: O header HTTP `X-Idempotency-Key` é enviado na mutação `POST /api/orders`.
3. **Simulação MSW**:
   - Se a requisição sofrer timeout ou o usuário clicar repetidamente, a **mesma chave** recupera o pedido já gerado (sem recriar nem cobrar novamente).
   - Se a chave for reaproveitada com parâmetros divergentes, o backend responde com `HTTP 409 Conflict`.
4. **Snapshot Imutável**: O recibo gerado (`/order/$id`) contém o snapshot exato dos itens, preços e taxas no momento da compra. Alterações posteriores no catálogo não afetam recibos já emitidos.

---

## 4. Tempo Real com Socket.IO e Reconciliação

A plataforma integra cliente oficial `socket.io-client` para receber eventos de rede:
- `nft.updated`: Disparado quando o preço ou estoque de um token é alterado por outro usuário ou leilão.
- `order.updated`: Disparado na liquidação da transação na blockchain simulada (Ethereum/Polygon).

### Resiliência e Ordenação:
- **Deduplicação e Versionamento**: Cada evento carrega `version: number`. O agregador `RealtimeService` armazena o watermark da última versão processada de cada NFT e pedido. Eventos obsoletos ou duplicados são descartados automaticamente.
- **Reconciliação pós-reconexão**: Ao restabelecer a conexão Socket.IO (`connect`), o evento `kurio:realtime-reconnected` é disparado, forçando o TanStack Query a revalidar os dados ativos na tela com a API REST.
- **Reação no Carrinho**: Se o preço de um item no carrinho mudar enquanto o usuário navega, uma notificação em tempo real é exibida e o checkout bloqueia a compra com cotação defasada até nova confirmação.

---

## 5. Roteamento & Estado na URL (TanStack Router)

Todos os parâmetros do catálogo são modelados como `searchParams` validados por schemas **Zod**:
- `collection`: Categoria ativa (`Arte digital`, `Fotografia`, `Música`, etc.).
- `search`: Termo de busca textual.
- `priceMin` e `priceMax`: Filtros de valor em ETH.
- `network`: `Ethereum` ou `Polygon`.
- `sortBy`: `recent`, `price_asc`, `price_desc`, `popular`.
- `page`: Número da página ativa.

### Benefícios:
- O estado da busca sobrevive integralmente a **F5 / Refresh**, navegação pelo histórico (`Voltar`/`Avançar`) e compartilhamento de links.
- A alteração de qualquer filtro reinicia automaticamente a paginação para a página 1.

---

## 6. Acessibilidade (A11y) & Performance

- **Skeletons com Shimmer**: Componentes dependentes de dados utilizam skeletons com animação suave, respeitando a diretiva CSS `@media (prefers-reduced-motion: reduce)`.
- **WAI-ARIA**: Todos os botões possuem rótulos acessíveis explícitos (`aria-label`), contraste de cores conforme as diretrizes WCAG AA e navegação fluida por teclado.
- **Assets Otimizados**: Todas as 66 artes do Figma foram extraídas em alta resolução e convertidas para formato moderno **WebP** com fallback, garantindo LCP baixo e nota de Performance ≥ 90 no Lighthouse.
