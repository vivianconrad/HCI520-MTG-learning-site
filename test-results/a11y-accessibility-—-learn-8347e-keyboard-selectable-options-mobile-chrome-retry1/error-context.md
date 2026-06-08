# Test info

- Name: accessibility — learner affordances >> pre-test question uses a radiogroup with keyboard-selectable options
- Location: C:\Users\ConradV\source\repos\HCI520-MTG-learning-site\e2e\a11y.spec.cjs:72:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/HCI520-MTG-learning-site/pretest
Call log:
  - navigating to "http://127.0.0.1:4173/HCI520-MTG-learning-site/pretest", waiting until "load"

    at C:\Users\ConradV\source\repos\HCI520-MTG-learning-site\e2e\a11y.spec.cjs:74:16
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test')
   2 | const { expectNoAxeViolations } = require('./helpers/axe.cjs')
   3 | const { A11Y_PAGE_CHECKS, baseSession } = require('./helpers/a11ySession.cjs')
   4 | const { seedSession, expectVisibleCardAnatomyMissingHighlight } = require('./helpers/session.cjs')
   5 |
   6 | async function gotoCheckedPage(page, pageCheck) {
   7 |   await seedSession(page, pageCheck.session)
   8 |   await page.goto(pageCheck.path)
   9 |   await expect(page.getByRole(pageCheck.heading.role, pageCheck.heading)).toBeVisible({
  10 |     timeout: 15_000,
  11 |   })
  12 | }
  13 |
  14 | test.describe('accessibility — axe WCAG scans', () => {
  15 |   for (const pageCheck of A11Y_PAGE_CHECKS) {
  16 |     test(`${pageCheck.name} has no axe violations`, async ({ page }) => {
  17 |       await gotoCheckedPage(page, pageCheck)
  18 |       await expectNoAxeViolations(page)
  19 |     })
  20 |   }
  21 | })
  22 |
  23 | test.describe('accessibility — learner affordances', () => {
  24 |   test('skip link targets main content', async ({ page }) => {
  25 |     await page.goto('./')
  26 |     const skipLink = page.getByRole('link', { name: /skip to main content/i })
  27 |     await expect(skipLink).toHaveAttribute('href', '#main')
  28 |     await skipLink.focus()
  29 |     await expect(skipLink).toBeFocused()
  30 |   })
  31 |
  32 |   test('route changes move focus to #main', async ({ page }) => {
  33 |     await seedSession(page, baseSession({ consentGiven: true }))
  34 |     await page.goto('welcome')
  35 |     await expect(page.getByRole('heading', { name: /learn to play/i })).toBeVisible({
  36 |       timeout: 15_000,
  37 |     })
  38 |
  39 |     await page.getByRole('button', { name: /^start$/i }).click()
  40 |     await expect(page.getByRole('heading', { name: /before we begin/i })).toBeVisible({
  41 |       timeout: 15_000,
  42 |     })
  43 |
  44 |     await expect(page.locator('#main')).toBeFocused()
  45 |   })
  46 |
  47 |   test('lesson gate hint is an activatable button when explore is required', async ({ page }) => {
  48 |     await seedSession(page, baseSession({ pretestCompleted: true }))
  49 |     await page.goto('lesson/1')
  50 |     await expect(page.getByRole('heading', { name: /how to read a card/i })).toBeVisible()
  51 |
  52 |     const gateHint = page.getByRole('button', {
  53 |       name: /explore all six card parts before continuing/i,
  54 |     })
  55 |     await expect(gateHint).toBeVisible()
  56 |     await gateHint.click()
  57 |     await expectVisibleCardAnatomyMissingHighlight(page)
  58 |   })
  59 |
  60 |   test('progress dots mark the current lesson step', async ({ page }) => {
  61 |     await seedSession(page, baseSession({ pretestCompleted: true }))
  62 |     await page.goto('lesson/2')
  63 |     await expect(page.getByRole('heading', { name: /seven card types/i })).toBeVisible()
  64 |
  65 |     const progressNav = page.getByRole('navigation', { name: /lesson progress/i })
  66 |     await expect(progressNav).toBeVisible()
  67 |
  68 |     const currentStep = progressNav.getByRole('listitem', { name: /current step/i })
  69 |     await expect(currentStep).toHaveAttribute('aria-current', 'step')
  70 |   })
  71 |
  72 |   test('pre-test question uses a radiogroup with keyboard-selectable options', async ({ page }) => {
  73 |     await seedSession(page, baseSession())
> 74 |     await page.goto('pretest')
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/HCI520-MTG-learning-site/pretest
  75 |     await expect(page.getByRole('heading', { name: 'Pre-Test' })).toBeVisible()
  76 |
  77 |     const radiogroup = page.getByRole('radiogroup').first()
  78 |     await expect(radiogroup).toBeVisible()
  79 |
  80 |     const firstOption = radiogroup.getByRole('radio').first()
  81 |     await firstOption.focus()
  82 |     await page.keyboard.press('Space')
  83 |     await expect(firstOption).toBeChecked()
  84 |   })
  85 | })
  86 |
```