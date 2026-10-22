# KURIO — NFT Marketplace

Implementação da plataforma **KURIO** para o desafio Senior Frontend da **Jungle Gaming**, seguindo rigorosamente o layout do Figma em desktop e mobile, com arquitetura DDD, gerenciamento de estado assíncrono com TanStack Router e TanStack Query, precisão financeira em ETH, eventos em tempo real com Socket.IO e mocks completos em MSW.

---

## 🚀 Tecnologias Obrigatórias Utilizadas

| Responsabilidade | Tecnologia | Descrição no Projeto |
| :--- | :--- | :--- |
| **Interface** | React 19 | Componentes funcionais e hooks reativos |
| **Linguagem** | TypeScript | Tipagem estrita de contratos de domínio e DTOs |
| **Roteamento** | TanStack Router | File-based routing com search params tipados na URL |
| **Estado Remoto** | TanStack Query v5 | Cache inteligente, mutações e Optimistic Updates |
| **Cliente HTTP** | Axios | Interceptors de JWT, idempotência e tratamento de erro |
| **Tempo Real** | Socket.IO Client | Eventos `nft.updated` e `order.updated` com versionamento |
| **Estilização** | Tailwind CSS | Design tokens, paleta e tema dark extraídos do Figma |
| **Componentes** | shadcn/ui | Componentes acessíveis com variantes e WAI-ARIA |
| **Mocking** | MSW (Mock Service Worker) | Interceptação na camada de rede com persistência local |
| **Testes E2E** | Playwright | Suíte automatizada em Chromium Desktop e Mobile |

---

## 📦 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js 20+ ou 22+
- `pnpm` (recomendado) ou `npm`

### 1. Instalar dependências
```bash
pnpm install
```

### 2. Iniciar servidor de desenvolvimento
```bash
pnpm dev
```
Acesse `http://localhost:3000` no seu navegador. O **Mock Service Worker (MSW)** será inicializado automaticamente interceptando as chamadas REST em `/api/*`.

### 3. Executar o Build de Produção
```bash
pnpm build
pnpm preview
```

### 4. Executar os Testes Automatizados (Playwright)
```bash
pnpm test
```
Para visualizar o relatório gráfico dos testes:
```bash
pnpm exec playwright show-report
```

---

## 🔐 Credenciais Fictícias de Teste

| Usuário | E-mail | Senha | Carteira Primária |
| :--- | :--- | :--- | :--- |
| **Alex Vance** | `contato@email.com` | `Password@123` | `0xA91FE82C3D921898710B` (Ethereum) |
| **Elena Rostova** | `elena@kurio.art` | `Password@123` | `0x71F8C9B41D88A1239088` (Polygon) |

---

## 🎟️ Cupons Promocionais para Teste

- `KURIO10`: Aplica 10% de desconto sobre o subtotal.
- `JUNGLE20`: Aplica 20% de desconto sobre o subtotal.
- `EXPIRADO`: Simula rejeição de cupom com erro explicativo.

---

## ⚙️ Painel de Simulação MSW (Controle de Testes)

No canto inferior direito de qualquer tela, clique no botão flutuante **"Cenários MSW / Testes"** para:
1. **Configurar Latência de Rede**: 150ms (normal), 1.5s (lenta) ou 3s (alta) para testar os skeletons shimmer em qualquer conexão.
2. **Disparar Eventos em Tempo Real via Socket.IO**: Altera o preço do *Emerald Ape #042* e emite o evento `nft.updated`, atualizando o catálogo e disparando alerta caso o item esteja no carrinho.
3. **Injetar Falhas de Rede**: Simular erro HTTP 500 ou sessão expirada HTTP 401 com recuperação e feedback.
4. **Restaurar Fixtures Padrão**: Redefine o banco de dados simulado para o estado inicial do Figma.

---

## 🌐 Deploy na Vercel

A aplicação está configurada para deploy na Vercel com:
- O arquivo `vercel.json` configurando rewrites automáticos para o roteador SPA (`/(.*) -> /index.html`).
- O MSW ativado automaticamente para que qualquer avaliador consiga navegar, comprar, logar e testar todos os cenários sem depender de backend externo.

Para documentação completa da arquitetura DDD e decisões de engenharia, consulte o arquivo **[ARCHITECTURE.md](ARCHITECTURE.md)**.
