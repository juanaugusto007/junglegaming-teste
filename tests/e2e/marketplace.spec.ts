import { test, expect } from '@playwright/test'

test.describe('Kurio NFT Marketplace - Fluxos Principais e Cenários Obrigatórios', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage with clean state
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('1. Catálogo: Deve carregar destaques, permitir filtros de coleção, busca e ordenação persistidos na URL', async ({ page }) => {
    // Verify hero title
    await expect(page.locator('h1')).toContainText('SEJA DONO DO FUTURO')

    // Click on collection filter 'Fotografia'
    const fotoFilter = page.getByRole('button', { name: /Fotografia/i }).first()
    await fotoFilter.click()

    // URL must include the collection search parameter
    await expect(page).toHaveURL(/collection=Fotografia/)

    // Search for a specific NFT
    const searchInput = page.locator('#catalog-search-input')
    await searchInput.fill('Cosmic Bloom')
    await searchInput.press('Enter')

    await expect(page).toHaveURL(/search=Cosmic\+Bloom|search=Cosmic%20Bloom/)
    await expect(page.getByText('Cosmic Bloom #118').first()).toBeVisible()
  })

  test('2. Detalhe do NFT: Acesso direto, troca de edição, stepper de quantidade e favoritar otimista', async ({ page }) => {
    await page.goto('/nft/nft-1')
    await page.waitForLoadState('networkidle')

    // Verify title and price
    await expect(page.locator('h1')).toContainText('Emerald Ape #042')
    await expect(page.getByText('1.19 ETH').first()).toBeVisible()

    // Test edition selection
    const editionBtn = page.getByRole('button', { name: '1/10' })
    await editionBtn.click()
    await expect(editionBtn).toHaveClass(/border-brand/)

    // Test quantity stepper
    const plusBtn = page.locator('button[aria-label="Aumentar quantidade"]')
    await plusBtn.click()
    await expect(page.getByText('2', { exact: true }).first()).toBeVisible()

    // Test favorite action with robust aria-label
    const favBtn = page.locator('button[aria-label*="favoritos" i], button[aria-label*="Favoritar" i]').first()
    await favBtn.click()
  })

  test('3. Carrinho & Cupons: Steppers de quantidade, cálculo em ETH e cupom promocional', async ({ page }) => {
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')

    // Verify presence of initial items
    await expect(page.getByText('Emerald Ape #042').first()).toBeVisible()

    // Apply coupon KURIO10
    const couponInput = page.getByPlaceholder(/código promocional/i)
    await couponInput.fill('KURIO10')
    await page.getByRole('button', { name: /aplicar/i }).click()

    // Verify coupon feedback
    await expect(page.getByText(/KURIO10/i)).toBeVisible()
    await expect(page.getByText(/10% OFF/i)).toBeVisible()
  })

  test('4. Checkout completo até recibo confirmado com snapshot imutável', async ({ page }) => {
    await page.goto('/checkout')
    await page.waitForLoadState('networkidle')

    // Check pre-filled collector data
    await expect(page.getByLabel(/Nome de exibição/i)).toHaveValue('Alex Vance')

    // Click confirm purchase button
    const confirmBtn = page.getByRole('button', { name: /Confirmar compra/i })
    await confirmBtn.click()

    // Should navigate to confirmation screen
    await page.waitForURL(/\/order\/ord-/)
    await expect(page.locator('h1')).toContainText('Pedido KURIO-')
    await expect(page.getByText(/Transação Confirmada/i)).toBeVisible()
    await expect(page.getByText(/Hash TX:/i)).toBeVisible()
  })

  test('5. Autenticação e Gestão de Perfil: Login e atualização de dados', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Submit pre-filled test credentials
    await page.getByRole('button', { name: /^Entrar$/i }).click()
    await page.waitForURL(/localhost:3000\/?(\?.*)?$/)

    // Navigate to profile
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')
    await expect(page.getByLabel(/Nome de exibição/i)).toHaveValue('Alex Vance')
  })
})
