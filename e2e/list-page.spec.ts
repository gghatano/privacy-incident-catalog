import { test, expect } from '@playwright/test'

test.describe('一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/privacy-incident-catalog/')
  })

  test('一覧ページが表示され、事例カードが存在する', async ({ page }) => {
    // 事例カードのリンクが少なくとも1つ存在する
    const cards = page.locator('a[href*="cases/"]')
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('検索バーにキーワードを入力するとフィルタされる', async ({ page }) => {
    const searchInput = page.getByLabel('検索')
    await expect(searchInput).toBeVisible()

    // フィルタ前の件数を取得
    const countText = page.locator('text=/\\d+ 件の事例/')
    await expect(countText).toBeVisible()
    const beforeText = await countText.textContent()
    const beforeCount = parseInt(beforeText!.match(/(\d+)/)?.[1] ?? '0', 10)

    // 存在しないであろうキーワードで検索して件数が減ることを確認
    await searchInput.fill('zzzznotexist9999')
    // debounce 300ms を待つ
    await page.waitForTimeout(500)

    const afterText = await countText.textContent()
    const afterCount = parseInt(afterText!.match(/(\d+)/)?.[1] ?? '0', 10)
    expect(afterCount).toBeLessThan(beforeCount)
  })

  test('SummaryDashboardが表示されている（件数が表示）', async ({ page }) => {
    // 総件数の表示を確認
    const totalLabel = page.locator('text=総件数')
    await expect(totalLabel).toBeVisible()
  })
})
