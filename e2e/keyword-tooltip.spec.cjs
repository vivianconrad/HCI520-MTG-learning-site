const { test, expect } = require('@playwright/test')
const { seedSession } = require('./helpers/session.cjs')

async function firstKeywordTrigger(page) {
  const trigger = page.locator('.keyword-tooltip__trigger').first()
  await expect(trigger).toBeVisible()
  return trigger
}

test.describe('keyword tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await seedSession(page)
    await page.goto('lesson/1')
    await expect(page.getByRole('heading', { name: /how to read a card/i })).toBeVisible({
      timeout: 15_000,
    })
  })

  test('opens and closes with tap on touch devices', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Tap-to-pin behavior is validated on mobile viewports')

    const trigger = await firstKeywordTrigger(page)
    const tooltip = page.locator('[role="tooltip"]').first()

    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toContainText(/tap again or press escape to close/i)

    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(tooltip).toBeHidden()
  })

  test('opens on hover for fine-pointer devices', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Hover behavior is validated on desktop viewports')

    const trigger = await firstKeywordTrigger(page)
    const tooltip = page.locator('[role="tooltip"]').first()

    await trigger.hover()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(tooltip).toBeVisible()

    await page.mouse.move(0, 0)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(tooltip).toBeHidden()
  })

  test('stays within the viewport when opened', async ({ page }) => {
    const trigger = await firstKeywordTrigger(page)
    await trigger.click()

    const tooltip = page.locator('[role="tooltip"]').first()
    await expect(tooltip).toBeVisible()

    const box = await tooltip.boundingBox()
    const viewport = page.viewportSize()
    expect(box).not.toBeNull()
    expect(box.x).toBeGreaterThanOrEqual(15)
    expect(box.y).toBeGreaterThanOrEqual(15)
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width - 15)
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height - 15)
  })
})
