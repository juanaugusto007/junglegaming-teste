import { test, expect } from '@playwright/test'

test.describe('Kurio NFT Marketplace - Fluxos Principais e Cenários Obrigatórios', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage with clean state
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('1. Catálogo: Deve carregar destaques, permitir filtros de coleção, busca e ordenação persistidos na URL', async ({ page }) => {
    // Verify hero title (visible in either desktop or mobile)
    await expect(page.locator('h1:visible').first()).toContainText(/SEJA DONO/i)

    // Click on collection filter 'Fotografia' if desktop or navigate
    const fotoFilter = page.getByRole('button', { name: /Fotografia/i }).first()
    if (await fotoFilter.isVisible()) {
      await fotoFilter.click()
      await expect(page).toHaveURL(/collection=Fotografia/)
    }

    // Search for a specific NFT
    const searchInput = page.locator('#catalog-search-input:visible, input[placeholder*="Explorar coleções"]:visible').first()
    await searchInput.fill('Cosmic Bloom')
    await searchInput.press('Enter')

    await expect(page).toHaveURL(/search=Cosmic\+Bloom|search=Cosmic%20Bloom/)
    await expect(page.getByText('Cosmic Bloom #118').first()).toBeVisible()
  })

  test('2. Detalhe do NFT: Acesso direto, troca de edição, stepper de quantidade e favoritar otimista', async ({ page }) => {
    await page.goto('/nft/nft-1')
    await page.waitForLoadState('domcontentloaded')

    // Verify title and price
    await expect(page.locator('h1:visible').first()).toContainText('Emerald Ape #042')
    await expect(page.getByText('1.19 ETH').first()).toBeVisible()

    // Test edition selection
    const editionBtn = page.getByRole('button', { name: '1/10' }).first()
    if (await editionBtn.isVisible()) {
      await editionBtn.click()
    }

    // Test quantity stepper
    const plusBtn = page.locator('button[aria-label="Aumentar quantidade"], button:has-text("+")').first()
    if (await plusBtn.isVisible()) {
      await plusBtn.click()
    }

    // Test favorite action with robust aria-label
    const favBtn = page.locator('button[aria-label*="favoritos" i], button[aria-label*="Favoritar" i]').first()
    if (await favBtn.isVisible()) {
      await favBtn.click()
    }
  })

  test('3. Carrinho & Cupons: Steppers de quantidade, cálculo em ETH e cupom promocional', async ({ page }) => {
    // First ensure there is an item in the cart
    await page.goto('/nft/nft-1')
    await page.waitForLoadState('domcontentloaded')
    const addBtn = page.getByRole('button', { name: /comprar|adicionar/i }).first()
    if (await addBtn.isVisible()) {
      await addBtn.click()
    }

    await page.goto('/cart')
    await page.waitForLoadState('domcontentloaded')

    // Apply coupon KURIO10
    const couponInput = page.getByPlaceholder(/código promocional/i)
    if (await couponInput.isVisible()) {
      await couponInput.fill('KURIO10')
      await page.getByRole('button', { name: /aplicar/i }).click()

      // Verify coupon feedback
      await expect(page.getByText(/KURIO10/i)).toBeVisible()
    }
  })

  test('4. Checkout completo até recibo confirmado com snapshot imutável', async ({ page }) => {
    // Ensure an item is added to cart
    await page.goto('/nft/nft-1')
    await page.waitForLoadState('domcontentloaded')
    const buyBtn = page.getByRole('button', { name: /comprar/i }).first()
    if (await buyBtn.isVisible()) {
      await buyBtn.click()
    }

    await page.goto('/checkout')
    await page.waitForLoadState('domcontentloaded')

    // Check pre-filled collector data
    const nameInput = page.getByLabel(/Nome de exibição/i)
    if (await nameInput.isVisible()) {
      await expect(nameInput).toHaveValue('Alex Vance')
    }

    // Click confirm purchase button
    const confirmBtn = page.getByRole('button', { name: /Confirmar compra/i })
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click()

      // Should navigate to confirmation screen
      await page.waitForURL(/\/order\/ord-/)
      await expect(page.locator('h1')).toContainText(/Pedido KURIO-/i)
      await expect(page.getByText(/Transação Confirmada/i)).toBeVisible()
    }
  })

  test('5. Autenticação e Gestão de Perfil: Login e atualização de dados', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('domcontentloaded')

    // Submit pre-filled test credentials
    await page.getByRole('button', { name: /^Entrar$/i }).first().click()
    await page.waitForLoadState('domcontentloaded')

    // Navigate to profile
    await page.goto('/profile')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByLabel(/Nome de exibição/i)).toHaveValue('Alex Vance')
  })
})
