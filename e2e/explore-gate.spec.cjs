const { test, expect } = require('@playwright/test')
const { seedSession } = require('./helpers/session.cjs')

const CARD_ANATOMY_GATE = /explore all six card parts before continuing/i

test.describe('explore gate discoverability', () => {
  test.beforeEach(async ({ page }) => {
    await seedSession(page)
    await page.goto('lesson/1')
    await expect(page.getByRole('heading', { name: /how to read a card/i })).toBeVisible({
      timeout: 15_000,
    })
  })

  test('shows the gate hint before the learner clicks Next', async ({ page }) => {
    const gateHint = page.locator('.lesson-nav__gate-hint')
    await expect(gateHint).toBeVisible()
    await expect(gateHint).toHaveText(CARD_ANATOMY_GATE)
  })

  test('disables Next until the explore gate is satisfied', async ({ page }) => {
    const gateHint = page.locator('.lesson-nav__gate-hint')
    const nextButton = page.getByRole('button', { name: /continue to card types/i })

    await expect(nextButton).toBeDisabled()
    await expect(gateHint).toBeVisible()
    await expect(gateHint).toHaveText(CARD_ANATOMY_GATE)
    await expect(page).toHaveURL(/lesson\/1/)
  })

  test('scrolls to a missing marker when the gate hint is activated', async ({ page }) => {
    const gateHint = page.locator('.lesson-nav__gate-hint')
    await gateHint.click()
    await expect(
      page.locator('.card-anatomy__marker--missing, .card-anatomy__parts-button--missing').first()
    ).toBeVisible()
  })

  test('opens inline explanation from the parts list on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Parts list accordion is mobile-specific')

    const firstPart = page.getByRole('button', { name: /^name, part 1 of 6$/i })
    await firstPart.click()
    await expect(page.locator('#card-anatomy-detail-name')).toBeVisible()
    await expect(page.locator('#card-anatomy-detail-name')).toContainText(/card's name/i)
  })

  test('shows a ready message after all markers are explored', async ({ page }) => {
    const markers = page.locator('.card-anatomy__callout-marker')
    await expect(markers).toHaveCount(6)

    for (let index = 0; index < 6; index += 1) {
      await markers.nth(index).click()
    }

    await expect(page.getByText('All six parts explored.')).toBeVisible()

    const readyHint = page.locator('.lesson-nav__ready-hint')
    await expect(readyHint).toBeVisible()
    await expect(readyHint).toHaveText(/you've explored everything on this card/i)
    await expect(page.locator('.lesson-nav__gate-hint')).toHaveCount(0)
  })
})
