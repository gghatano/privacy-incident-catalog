import { test, expect } from '@playwright/test'

test.describe('ナビゲーション', () => {
  test('ヘッダーのナビリンクで各ページに遷移できる', async ({ page }) => {
    await page.goto('/')

    const nav = page.locator('header nav')

    // 統計ページへ遷移
    await nav.getByText('統計').click()
    await expect(page).toHaveURL(/\/stats/)
    await expect(page.locator('h1', { hasText: '統計' })).toBeVisible()

    // このサイトについてページへ遷移
    await nav.getByText('このサイトについて').click()
    await expect(page).toHaveURL(/\/about/)

    // 新規作成ページへ遷移
    await nav.getByText('新規作成').click()
    await expect(page).toHaveURL(/\/new/)

    // 事例一覧ページへ戻る
    await nav.getByText('事例一覧').click()
    await expect(page).toHaveURL(/\/privacy-incident-catalog\/?$/)
    // 事例カードが表示されている
    await expect(page.locator('a[href*="cases/"]').first()).toBeVisible()
  })
})
