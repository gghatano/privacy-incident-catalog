import { test, expect } from '@playwright/test'

test.describe('統計ページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/stats')
  })

  test('統計ページに総事例数が表示される', async ({ page }) => {
    // 「総事例数」ラベルが表示されている
    const label = page.locator('text=総事例数')
    await expect(label).toBeVisible()

    // 数値が表示されている（0以上の整数）
    const countEl = label.locator('..')
    const countText = await countEl.textContent()
    expect(countText).toMatch(/\d+/)
  })

  test('カテゴリ別のセクションが存在する', async ({ page }) => {
    const categorySection = page.locator('h2', { hasText: 'カテゴリ別' })
    await expect(categorySection).toBeVisible()
  })
})
