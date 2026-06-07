# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: viewport-smoke.spec.cjs >> viewport smoke >> keyword guide trigger meets minimum touch target on mobile
- Location: e2e\viewport-smoke.spec.cjs:46:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /keyword guide/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /keyword guide/i })

```

```yaml
- text: The server is configured with a public base URL of /HCI520-MTG-learning-site/ - did you mean to visit
- link "/HCI520-MTG-learning-site/lesson/1":
  - /url: /HCI520-MTG-learning-site/lesson/1
- text: instead?
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test')
  2  | const { assertNoHorizontalOverflow, seedSession } = require('./helpers/session.cjs')
  3  | 
  4  | const LESSON_ROUTES = [
  5  |   { path: '/lesson/1', heading: /how to read a card/i },
  6  |   { path: '/lesson/2', heading: /seven card types/i },
  7  |   { path: '/lesson/3', heading: /how a turn works/i },
  8  | ]
  9  | 
  10 | test.describe('viewport smoke', () => {
  11 |   test('consent page loads without horizontal overflow', async ({ page }) => {
  12 |     await page.goto('/')
  13 |     await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  14 |     await assertNoHorizontalOverflow(page)
  15 |   })
  16 | 
  17 |   test('interactive lessons load and fit the viewport width', async ({ page }) => {
  18 |     await seedSession(page)
  19 | 
  20 |     for (const route of LESSON_ROUTES) {
  21 |       await page.goto(route.path)
  22 |       await expect(page.getByRole('heading', { name: route.heading })).toBeVisible()
  23 |       await assertNoHorizontalOverflow(page)
  24 |     }
  25 |   })
  26 | 
  27 |   test('card types overlay stays within the viewport on mobile', async ({ page, isMobile }) => {
  28 |     test.skip(!isMobile, 'Overlay layout check is mobile-specific')
  29 | 
  30 |     await seedSession(page)
  31 |     await page.goto('/lesson/2')
  32 |     await page.getByRole('button', { name: /see creature cards and examples/i }).click()
  33 |     await expect(page.getByRole('dialog')).toBeVisible()
  34 | 
  35 |     const dialogBox = await page.getByRole('dialog').boundingBox()
  36 |     const viewport = page.viewportSize()
  37 |     expect(dialogBox).not.toBeNull()
  38 |     expect(dialogBox.x).toBeGreaterThanOrEqual(-1)
  39 |     expect(dialogBox.y).toBeGreaterThanOrEqual(-1)
  40 |     expect(dialogBox.x + dialogBox.width).toBeLessThanOrEqual(viewport.width + 1)
  41 |     expect(dialogBox.y + dialogBox.height).toBeLessThanOrEqual(viewport.height + 1)
  42 | 
  43 |     await assertNoHorizontalOverflow(page)
  44 |   })
  45 | 
  46 |   test('keyword guide trigger meets minimum touch target on mobile', async ({ page, isMobile }) => {
  47 |     test.skip(!isMobile, 'Touch target check is mobile-specific')
  48 | 
  49 |     await seedSession(page)
  50 |     await page.goto('/lesson/1')
  51 | 
  52 |     const trigger = page.getByRole('button', { name: /keyword guide/i })
> 53 |     await expect(trigger).toBeVisible()
     |                           ^ Error: expect(locator).toBeVisible() failed
  54 | 
  55 |     const box = await trigger.boundingBox()
  56 |     expect(box).not.toBeNull()
  57 |     expect(box.height).toBeGreaterThanOrEqual(44)
  58 |   })
  59 | })
  60 | 
```