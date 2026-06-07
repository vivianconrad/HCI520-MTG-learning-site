const { test, expect } = require('@playwright/test')
const { expectNoAxeViolations } = require('./helpers/axe.cjs')
const { A11Y_PAGE_CHECKS, baseSession } = require('./helpers/a11ySession.cjs')
const { seedSession } = require('./helpers/session.cjs')

async function gotoCheckedPage(page, pageCheck) {
  await seedSession(page, pageCheck.session)
  await page.goto(pageCheck.path)
  await expect(page.getByRole(pageCheck.heading.role, pageCheck.heading)).toBeVisible({
    timeout: 15_000,
  })
}

test.describe('accessibility — axe WCAG scans', () => {
  for (const pageCheck of A11Y_PAGE_CHECKS) {
    test(`${pageCheck.name} has no axe violations`, async ({ page }) => {
      await gotoCheckedPage(page, pageCheck)
      await expectNoAxeViolations(page)
    })
  }
})

test.describe('accessibility — learner affordances', () => {
  test('skip link targets main content', async ({ page }) => {
    await page.goto('./')
    const skipLink = page.getByRole('link', { name: /skip to main content/i })
    await expect(skipLink).toHaveAttribute('href', '#main')
    await skipLink.focus()
    await expect(skipLink).toBeFocused()
  })

  test('route changes move focus to #main', async ({ page }) => {
    await seedSession(page, baseSession({ consentGiven: true }))
    await page.goto('welcome')
    await expect(page.getByRole('heading', { name: /learn to play/i })).toBeVisible({
      timeout: 15_000,
    })

    await page.getByRole('button', { name: /^start$/i }).click()
    await expect(page.getByRole('heading', { name: /before we begin/i })).toBeVisible({
      timeout: 15_000,
    })

    await expect(page.locator('#main')).toBeFocused()
  })

  test('lesson gate hint is an activatable button when explore is required', async ({ page }) => {
    await seedSession(page, baseSession({ pretestCompleted: true }))
    await page.goto('lesson/1')
    await expect(page.getByRole('heading', { name: /how to read a card/i })).toBeVisible()

    const gateHint = page.getByRole('button', {
      name: /explore all six numbered markers on the card before continuing/i,
    })
    await expect(gateHint).toBeVisible()
    await gateHint.click()
    await expect(page.locator('.card-anatomy__marker--missing').first()).toBeVisible()
  })

  test('progress dots mark the current lesson step', async ({ page }) => {
    await seedSession(page, baseSession({ pretestCompleted: true }))
    await page.goto('lesson/2')
    await expect(page.getByRole('heading', { name: /seven card types/i })).toBeVisible()

    const progressNav = page.getByRole('navigation', { name: /lesson progress/i })
    await expect(progressNav).toBeVisible()

    const currentStep = progressNav.getByRole('listitem', { name: /current step/i })
    await expect(currentStep).toHaveAttribute('aria-current', 'step')
  })

  test('pre-test question uses a radiogroup with keyboard-selectable options', async ({ page }) => {
    await seedSession(page, baseSession())
    await page.goto('pretest')
    await expect(page.getByRole('heading', { name: 'Pre-Test' })).toBeVisible()

    const radiogroup = page.getByRole('radiogroup').first()
    await expect(radiogroup).toBeVisible()

    const firstOption = radiogroup.getByRole('radio').first()
    await firstOption.focus()
    await page.keyboard.press('Space')
    await expect(firstOption).toBeChecked()
  })
})
