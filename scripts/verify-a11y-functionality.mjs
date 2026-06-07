/**
 * Smoke-check that a11y refactors did not remove content or break interactions.
 */
import { chromium, devices } from 'playwright'

const BASE =
  process.argv[2]?.replace(/\/$/, '') ?? 'http://127.0.0.1:4173/HCI520-MTG-learning-site'
const STORAGE_KEY = 'hci520-mtg-session'

const MOCK_QUESTIONS = [
  {
    id: 'lo0_q1',
    lo: 'LO0',
    question: 'Sample assessment question?',
    options: ['Alpha', 'Beta', 'Gamma', 'Delta'],
  },
  {
    id: 'lo0_q2',
    lo: 'LO0',
    question: 'Second sample question?',
    options: ['One', 'Two', 'Three', 'Four'],
  },
]

function baseSession(overrides = {}) {
  return {
    sessionId: 'A11YAUDITSESSION',
    sessionSecret: 'a11yauditsecret0000000000000000',
    participantId: null,
    participantRowReady: true,
    selectedQuestions: MOCK_QUESTIONS,
    pretestAnswers: {},
    posttestAnswers: {},
    screenStartTimes: {},
    screenTimes: {},
    scenarioIdsAttempted: [],
    consentGiven: true,
    lessonsCompleted: false,
    pretestCompleted: false,
    posttestCompleted: false,
    curiosityFocus: null,
    posttestReadiness: null,
    ...overrides,
  }
}

const checks = []

function pass(name, detail) {
  checks.push({ name, ok: true, detail })
}

function fail(name, detail) {
  checks.push({ name, ok: false, detail })
}

async function seedSession(context, session) {
  await context.addInitScript(
    ({ key, data }) => {
      sessionStorage.setItem(key, JSON.stringify(data))
    },
    { key: STORAGE_KEY, data: session }
  )
}

async function main() {
  const browser = await chromium.launch({ headless: true })

  // Pre-test content + interaction
  {
    const context = await browser.newContext()
    await seedSession(context, baseSession())
    const page = await context.newPage()
    await page.goto(`${BASE}/pretest`, { waitUntil: 'networkidle' })
    await page.waitForSelector('h1.pretest__title', { timeout: 15000 })

    const h1 = await page.locator('h1.pretest__title').textContent()
    const h2 = await page.locator('h2.pretest__question').textContent()
    const intro = await page.locator('.pretest__frame .pretest__intro-note').textContent()
    const breadcrumb = await page.locator('.pretest__breadcrumb').textContent()
    const keyboardHint = await page.locator('.pretest__keyboard-hint').textContent()
    const optionCount = await page.locator('[role="radio"]').count()
    const nextDisabled = await page.locator('.pretest__button:not(.pretest__button--back)').isDisabled()

    if (h1?.trim() === 'Pre-Test') pass('pretest h1 label', h1)
    else fail('pretest h1 label', `Expected "Pre-Test", got "${h1}"`)

    if (h2?.includes('Sample assessment')) pass('pretest h2 question', h2.trim())
    else fail('pretest h2 question', h2)

    if (intro?.includes('not been taught')) pass('pretest intro note', 'present')
    else fail('pretest intro note', intro ?? 'missing')

    if (breadcrumb?.includes('Question 1 of 2')) pass('pretest progress text', breadcrumb.trim())
    else fail('pretest progress text', breadcrumb)

    if (keyboardHint?.includes('arrow keys')) pass('pretest keyboard hint', 'present')
    else fail('pretest keyboard hint', keyboardHint)

    if (optionCount === 4) pass('pretest options', '4 radios')
    else fail('pretest options', String(optionCount))

    if (nextDisabled) pass('pretest next disabled until selection', 'disabled')
    else fail('pretest next disabled until selection', 'enabled unexpectedly')

    await page.locator('[role="radio"]').first().click()
    if (await page.locator('.pretest__button:not(.pretest__button--back)').isEnabled()) {
      pass('pretest next enables after selection', 'enabled')
    } else {
      fail('pretest next enables after selection', 'still disabled')
    }

    await page.locator('.pretest__button:not(.pretest__button--back)').click()
    const breadcrumb2 = await page.locator('.pretest__breadcrumb').textContent()
    const backVisible = await page.locator('.pretest__button--back').isVisible()
    if (breadcrumb2?.includes('Question 2 of 2')) pass('pretest advances question', breadcrumb2.trim())
    else fail('pretest advances question', breadcrumb2)
    if (backVisible) pass('pretest back on later questions', 'visible')
    else fail('pretest back on later questions', 'missing')

    const progressDots = await page.locator('.progress-dots__label').textContent()
    if (progressDots?.includes('Step')) pass('progress dots label', progressDots.trim())
    else fail('progress dots label', progressDots)

    await context.close()
  }

  // Skip link keyboard behavior
  {
    const context = await browser.newContext()
    await seedSession(context, baseSession())
    const page = await context.newPage()
    await page.goto(`${BASE}/pretest`, { waitUntil: 'networkidle' })
    await page.waitForSelector('h1.pretest__title', { timeout: 15000 })
    await page.keyboard.press('Tab')
    const skipVisible = await page.evaluate(() => {
      const link = document.querySelector('.skip-link')
      if (!link) return false
      const style = getComputedStyle(link)
      return style.left !== '-9999px' && style.left !== '-9999'
    })
    if (skipVisible) pass('skip link on keyboard focus', 'visible')
    else fail('skip link on keyboard focus', 'still off-screen after Tab')

    await context.close()
  }

  // Turn structure mobile swipe hint + tabs
  {
    const context = await browser.newContext({ ...devices['iPhone 13'] })
    await seedSession(context, baseSession({ pretestCompleted: true }))
    const page = await context.newPage()
    await page.goto(`${BASE}/lesson/3`, { waitUntil: 'networkidle' })
    await page.waitForSelector('h1.turn-structure__heading', { timeout: 15000 })

    const hintVisible = await page.locator('#turn-structure-timeline-hint').isVisible()
    const hintText = await page.locator('#turn-structure-timeline-hint').textContent()
    const tabCount = await page.locator('[role="tab"]').count()
    const gateHint = await page.locator('.turn-structure__hint').textContent()
    const progress = await page.locator('.turn-structure__progress').textContent()

    if (hintVisible && hintText?.includes('Swipe')) {
      pass('turn structure mobile swipe hint', hintText.trim())
    } else {
      fail('turn structure mobile swipe hint', `visible=${hintVisible} text="${hintText}"`)
    }

    if (tabCount === 5) pass('turn structure phase tabs', '5 tabs')
    else fail('turn structure phase tabs', String(tabCount))

    if (gateHint?.includes('Open all five')) pass('turn structure gate hint', 'present')
    else fail('turn structure gate hint', gateHint)

    if (progress?.includes('Explored')) pass('turn structure progress', progress.trim())
    else fail('turn structure progress', progress)

    const nodeBox = await page.locator('.turn-structure__node').first().boundingBox()
    if (nodeBox && nodeBox.height >= 44) {
      pass('turn structure tab touch height', `${Math.round(nodeBox.height)}px`)
    } else {
      fail('turn structure tab touch height', nodeBox ? `${nodeBox.height}px` : 'no box')
    }

    await page.locator('[role="tab"]').nth(1).click()
    const panelTitle = await page.locator('.turn-structure__detail-title').textContent()
    if (panelTitle?.includes('First Main')) pass('turn structure tab panel updates', panelTitle.trim())
    else fail('turn structure tab panel updates', panelTitle)

    await context.close()
  }

  // Disabled button still blocks interaction
  {
    const context = await browser.newContext()
    await seedSession(context, baseSession())
    const page = await context.newPage()
    await page.goto(`${BASE}/pretest`, { waitUntil: 'networkidle' })
    const disabled = page.locator('.pretest__button:not(.pretest__button--back)')
    const opacity = await disabled.evaluate((el) => getComputedStyle(el).opacity)
    const color = await disabled.evaluate((el) => getComputedStyle(el).color)
    if (await disabled.isDisabled()) pass('disabled next is inert', 'disabled attribute')
    else fail('disabled next is inert', 'not disabled')
    if (opacity === '1') pass('disabled next keeps full opacity', opacity)
    else fail('disabled next keeps full opacity', opacity)
    if (color) pass('disabled next explicit text color', color)
    else fail('disabled next explicit text color', 'missing')
    await context.close()
  }

  await browser.close()

  const failed = checks.filter((c) => !c.ok)
  console.log('\nFunctionality verification\n')
  for (const check of checks) {
    console.log(`${check.ok ? 'PASS' : 'FAIL'}  ${check.name}${check.detail ? ` — ${check.detail}` : ''}`)
  }
  console.log(`\n${checks.length - failed.length}/${checks.length} passed`)
  process.exit(failed.length > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
