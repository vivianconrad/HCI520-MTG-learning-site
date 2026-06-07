const { test, expect } = require('@playwright/test')
const { assertNoHorizontalOverflow, seedSession } = require('./helpers/session.cjs')

const LESSON_ROUTES = [
  { path: 'lesson/1', heading: /how to read a card/i },
  { path: 'lesson/2', heading: /seven card types/i },
  { path: 'lesson/3', heading: /how a turn works/i },
]

test.describe('viewport smoke', () => {
  test('consent page loads without horizontal overflow', async ({ page }) => {
    await page.goto('./')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await assertNoHorizontalOverflow(page)
  })

  test('interactive lessons load and fit the viewport width', async ({ page }) => {
    await seedSession(page)

    for (const route of LESSON_ROUTES) {
      await page.goto(route.path)
      await expect(page.getByRole('heading', { name: route.heading })).toBeVisible()
      await assertNoHorizontalOverflow(page)
    }
  })

  test('card types overlay stays within the viewport on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Overlay layout check is mobile-specific')

    await seedSession(page)
    await page.goto('lesson/2')
    await page.getByRole('button', { name: /see creature cards and examples/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    const dialogBox = await page.getByRole('dialog').boundingBox()
    const viewport = page.viewportSize()
    expect(dialogBox).not.toBeNull()
    expect(dialogBox.x).toBeGreaterThanOrEqual(-1)
    expect(dialogBox.y).toBeGreaterThanOrEqual(-1)
    expect(dialogBox.x + dialogBox.width).toBeLessThanOrEqual(viewport.width + 1)
    expect(dialogBox.y + dialogBox.height).toBeLessThanOrEqual(viewport.height + 1)

    await assertNoHorizontalOverflow(page)
  })

  test('keyword guide trigger meets minimum touch target on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Touch target check is mobile-specific')

    await seedSession(page)
    await page.goto('lesson/1')

    const trigger = page.getByRole('button', { name: /keyword guide/i })
    await expect(trigger).toBeVisible()

    const box = await trigger.boundingBox()
    expect(box).not.toBeNull()
    expect(box.height).toBeGreaterThanOrEqual(44)
  })
})
