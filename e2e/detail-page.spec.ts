import { test, expect } from '@playwright/test'

test.describe('詳細ページ', () => {
  test('一覧から事例カードをクリックすると詳細ページに遷移する', async ({ page }) => {
    await page.goto('/privacy-incident-catalog/')

    // 最初の事例カードをクリック
    const firstCard = page.locator('a[href*="cases/"]').first()
    await expect(firstCard).toBeVisible()
    await firstCard.click()

    // URLが /cases/<id> に変わっている
    await expect(page).toHaveURL(/\/cases\//)
  })

  test('詳細ページにタイトル、概要、出典セクションが表示される', async ({ page }) => {
    await page.goto('/privacy-incident-catalog/')

    const firstCard = page.locator('a[href*="cases/"]').first()
    await expect(firstCard).toBeVisible()
    await firstCard.click()

    await expect(page).toHaveURL(/\/cases\//)

    // タイトル（h1）が存在する
    const title = page.locator('h1')
    await expect(title).toBeVisible()
    await expect(title).not.toBeEmpty()

    // 概要セクションが存在する
    const summaryHeading = page.locator('h2', { hasText: '概要' })
    await expect(summaryHeading).toBeVisible()

    // 出典セクションが存在する
    const sourceHeading = page.locator('h2', { hasText: '出典' })
    await expect(sourceHeading).toBeVisible()
  })

  test('「一覧に戻る」リンクで一覧に戻れる', async ({ page }) => {
    await page.goto('/privacy-incident-catalog/')

    const firstCard = page.locator('a[href*="cases/"]').first()
    await expect(firstCard).toBeVisible()
    await firstCard.click()

    await expect(page).toHaveURL(/\/cases\//)

    // 「一覧に戻る」リンクをクリック
    const backLink = page.locator('a', { hasText: '一覧に戻る' })
    await expect(backLink).toBeVisible()
    await backLink.click()

    // 一覧ページに戻る（URLがルートに戻る）
    await expect(page).toHaveURL(/\/privacy-incident-catalog\/?$/)
  })
})
