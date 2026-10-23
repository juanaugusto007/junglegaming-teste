# KURIO — NFT Marketplace

Plataforma de marketplace de NFTs com interface responsiva, arquitetura orientada ao domínio (DDD), roteamento com tipagem estrita de busca na URL, gerenciamento de estado de servidor e simulação de rede com Mock Service Worker (MSW).

---

## 🛠️ Decisões Técnicas

### 1. Por que Vite?
A escolha do **Vite** como ferramenta de build e ambiente de desenvolvimento foi motivada por:
- **Velocidade de Inicialização e HMR**: O servidor de desenvolvimento utiliza ES Modules nativos do navegador (`esbuild`), eliminando a necessidade de reempacotar todo o código a cada alteração e proporcionando Hot Module Replacement instantâneo.
- **Build de Produção Otimizado com Rollup**: Geração de bundles eficientes com code-splitting automático por rota e tree-shaking agressivo de dependências.
- **Suporte Nativo a TypeScript e JSX**: Compilação rápida e suporte nativo a aliases de importação (`@/*`), sem necessidade de loaders complexos do Webpack.
- **Compatibilidade com Mock Service Worker**: Excelente integração com Service Workers em desenvolvimento e suporte a roteamento Single Page Application (SPA).

---

### 2. Arquitetura da Aplicação (DDD em Camadas)
A estrutura do projeto foi organizada em quatro camadas bem delimitadas, garantindo que as regras de negócio permaneçam isoladas da biblioteca de interface e dos detalhes de transporte:

```
src/
├── domain/                  # Regras de Negócio e Entidades Puras (Independente de UI)
│   ├── shared/              # Value Objects (EthAmount com bignumber.js para precisão decimal)
│   ├── nft/                 # Entidade Nft, edições, metadados e contratos de filtro
│   ├── cart/                # Entidade de carrinho, cálculo de cotação e cupons
│   ├── order/               # Entidade Order, recibos e controle de idempotência
│   ├── identity/            # Modelagem de usuário, sessão e autenticação
│   └── wallet/              # Modelagem de carteiras, redes (Ethereum/Polygon) e provedores
│
├── application/             # Casos de Uso e Orquestração Assíncrona
│   ├── nft/                 # Hooks de busca, detalhe e favoritos via TanStack Query
│   ├── cart/                # Gerenciamento de itens do carrinho e atualização de cotação
│   ├── order/               # Mutação de criação de pedidos com cabeçalho de idempotência
│   ├── identity/            # Controle de sessão, login, registro e atualização de perfil
│   └── wallet/              # Conexão e gerenciamento de carteiras cadastradas
│
├── infrastructure/          # Camada de Infraestrutura e Serviços Externos
│   ├── http/                # Instância Axios com interceptors de autenticação
│   ├── realtime/            # Cliente Socket.IO com versionamento e reconciliação
│   ├── storage/             # Armazenamento local (LocalStorage)
│   └── msw/                 # Mock Service Worker (banco em memória, fixtures e handlers REST)
│
└── presentation/            # Camada de Interface do Usuário
    ├── routes/              # TanStack Router (rotas baseadas em arquivos com tipagem estrita)
    ├── components/
    │   ├── ui/              # Componentes de interface base (Button, Input, Skeletons)
    │   ├── layout/          # Header, Footer institucional, BottomNav mobile e ProfileSidebar
    │   ├── catalog/         # NftCard, CatalogFilters, HeroBanner e seções editoriais
    │   ├── profile/         # Sidebar e formulários dedicados do perfil
    │   └── common/          # Painel de controle de testes MSW e modais
    └── styles/              # Design tokens e classes utilitárias do Tailwind CSS
```

#### Princípios Adotados:
- **Precisão Financeira em Criptoativos**: Valores em ETH nunca utilizam o tipo primitivo `number` (IEEE 754) para cálculos aritméticos. O Value Object `EthAmount` encapsula a biblioteca `bignumber.js` com precisão decimal fixa e arredondamento estrito, prevenindo falhas de arredondamento em subtotais, descontos e taxas de rede.
- **Idempotência no Checkout**: Toda finalização de compra gera um identificador único UUIDv4 (`X-Idempotency-Key`). Cliques repetidos ou instabilidades de conexão recuperam o pedido original em vez de gerar cobranças duplicadas.
- **Roteamento Tipado e Estado na URL**: Filtros de catálogo, paginação e ordenação são sincronizados na URL através do **TanStack Router**, garantindo que links compartilháveis preservem o estado exato da visualização.
- **Independência de Backend**: Com o **MSW**, a aplicação funciona de forma 100% autônoma, simulando latência de rede, persistência de dados em memória e eventos em tempo real.

---

## 📦 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js 20+ ou 22+
- Gerenciador de pacotes `pnpm` (recomendado) ou `npm`

### 1. Clonar o repositório
```bash
git clone https://github.com/juanaugusto007/junglegaming-teste.git
cd junglegaming-teste
```

### 2. Instalar dependências
```bash
pnpm install
# ou
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
pnpm dev
# ou
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`. O Mock Service Worker será carregado automaticamente no navegador interceptando as requisições em `/api/*`.

### 4. Executar verificação de tipos e build de produção
```bash
pnpm build
pnpm preview
```

### 5. Executar testes automatizados (Playwright)
```bash
pnpm test
```
Para visualizar o relatório gráfico dos testes:
```bash
pnpm exec playwright show-report
```

---

## 🔐 Credenciais de Teste Pré-cadastradas

Para testar o fluxo de autenticação e gerenciamento de perfil:

| Usuário | E-mail | Senha | Carteira Primária |
| :--- | :--- | :--- | :--- |
| **Alex Vance** | `contato@email.com` | `Password@123` | `0xA91FE82C3D921898710B` (Ethereum) |
| **Elena Rostova** | `elena@kurio.art` | `Password@123` | `0x71F8C9B41D88A1239088` (Polygon) |

*Dica: Na tela de login e no modal de autenticação há atalhos de "1-clique" para preenchimento imediato.*

---

## 🎟️ Cupons Promocionais de Teste

No carrinho ou checkout, utilize os códigos:
- `KURIO10`: 10% de desconto no subtotal.
- `JUNGLE20`: 20% de desconto no subtotal.
- `EXPIRADO`: Simula cupom expirado com mensagem de erro.

---

## ⚙️ Painel de Simulação MSW

No canto inferior direito da tela, há um botão flutuante **"Cenários MSW / Testes"** que permite:
1. **Ajustar latência de rede**: Simular conexões rápidas (150ms), médias (1.5s) ou lentas (3s) para validar estados de carregamento e skeletons.
2. **Disparar evento em tempo real**: Emite o evento `nft.updated` via Socket.IO, simulando alteração de preço concorrente no catálogo e no carrinho.
3. **Simular falhas de rede**: Injetar erros HTTP 500 ou expiração de sessão HTTP 401 para verificar a resiliência da interface.
4. **Restaurar estado inicial**: Reseta os dados simulados para as fixtures originais.

---

## 🌐 Deploy na Vercel

O projeto conta com o arquivo `vercel.json` configurado para rewrites SPA (`/(.*) -> /index.html`). O Mock Service Worker opera no build de produção para que qualquer pessoa possa testar o fluxo completo de compra e gerenciamento sem necessidade de subir um servidor dedicado.
