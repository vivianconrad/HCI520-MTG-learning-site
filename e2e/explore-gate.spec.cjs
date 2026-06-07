const { test, expect } = require('@playwright/test')
const { seedSession } = require('./helpers/session.cjs')

const CARD_ANATOMY_GATE =
  /explore all six numbered markers on the card before continuing/i

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

  test('keeps the gate hint visible after a blocked Next click', async ({ page }) => {
    const gateHint = page.locator('.lesson-nav__gate-hint')
    const nextButton = page.getByRole('button', { name: /continue to card types/i })

    await nextButton.click()
    await expect(gateHint).toBeVisible()
    await expect(gateHint).toHaveText(CARD_ANATOMY_GATE)
    await expect(page).toHaveURL(/lesson\/1/)
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
