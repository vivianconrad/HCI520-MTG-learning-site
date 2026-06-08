# Test info

- Name: explore gate discoverability >> scrolls to a missing marker when the gate hint is activated
- Location: C:\Users\ConradV\source\repos\HCI520-MTG-learning-site\e2e\explore-gate.spec.cjs:31:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/HCI520-MTG-learning-site/lesson/1
Call log:
  - navigating to "http://127.0.0.1:4173/HCI520-MTG-learning-site/lesson/1", waiting until "load"

    at C:\Users\ConradV\source\repos\HCI520-MTG-learning-site\e2e\explore-gate.spec.cjs:9:16
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test')
   2 | const { seedSession, expectVisibleCardAnatomyMissingHighlight } = require('./helpers/session.cjs')
   3 |
   4 | const CARD_ANATOMY_GATE = /explore all six card parts before continuing/i
   5 |
   6 | test.describe('explore gate discoverability', () => {
   7 |   test.beforeEach(async ({ page }) => {
   8 |     await seedSession(page)
>  9 |     await page.goto('lesson/1')
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/HCI520-MTG-learning-site/lesson/1
  10 |     await expect(page.getByRole('heading', { name: /how to read a card/i })).toBeVisible({
  11 |       timeout: 15_000,
  12 |     })
  13 |   })
  14 |
  15 |   test('shows the gate hint before the learner clicks Next', async ({ page }) => {
  16 |     const gateHint = page.locator('.lesson-nav__gate-hint')
  17 |     await expect(gateHint).toBeVisible()
  18 |     await expect(gateHint).toHaveText(CARD_ANATOMY_GATE)
  19 |   })
  20 |
  21 |   test('disables Next until the explore gate is satisfied', async ({ page }) => {
  22 |     const gateHint = page.locator('.lesson-nav__gate-hint')
  23 |     const nextButton = page.getByRole('button', { name: /continue to card types/i })
  24 |
  25 |     await expect(nextButton).toBeDisabled()
  26 |     await expect(gateHint).toBeVisible()
  27 |     await expect(gateHint).toHaveText(CARD_ANATOMY_GATE)
  28 |     await expect(page).toHaveURL(/lesson\/1/)
  29 |   })
  30 |
  31 |   test('scrolls to a missing marker when the gate hint is activated', async ({ page }) => {
  32 |     const gateHint = page.locator('.lesson-nav__gate-hint')
  33 |     await gateHint.click()
  34 |     await expectVisibleCardAnatomyMissingHighlight(page)
  35 |   })
  36 |
  37 |   test('opens inline explanation from the parts list on mobile', async ({ page, isMobile }) => {
  38 |     test.skip(!isMobile, 'Parts list accordion is mobile-specific')
  39 |
  40 |     const firstPart = page
  41 |       .getByRole('navigation', { name: /card parts list/i })
  42 |       .getByRole('button', { name: /^name, part 1 of 6$/i })
  43 |     await firstPart.click()
  44 |     await expect(page.locator('#card-anatomy-detail-name')).toBeVisible()
  45 |     await expect(page.locator('#card-anatomy-detail-name')).toContainText(/card's name/i)
  46 |   })
  47 |
  48 |   test('shows a ready message after all markers are explored', async ({ page, isMobile }) => {
  49 |     const exploreTargets = isMobile
  50 |       ? page.locator('.card-anatomy__parts-button')
  51 |       : page.locator('.card-anatomy__callout-marker')
  52 |     await expect(exploreTargets).toHaveCount(6)
  53 |
  54 |     for (let index = 0; index < 6; index += 1) {
  55 |       await exploreTargets.nth(index).click()
  56 |     }
  57 |
  58 |     await expect(page.getByText('All six parts explored.')).toBeVisible()
  59 |
  60 |     const readyHint = page.locator('.lesson-nav__ready-hint')
  61 |     await expect(readyHint).toBeVisible()
  62 |     await expect(readyHint).toHaveText(/you've explored everything on this card/i)
  63 |     await expect(page.locator('.lesson-nav__gate-hint')).toHaveCount(0)
  64 |   })
  65 | })
  66 |
```