/**
 * Full app walkthrough: pre-test 3/10 correct, post-test 7/10 correct.
 * Usage: npm run dev (separate terminal), then node scripts/walkthrough-target-scores.mjs
 */
import { chromium } from 'playwright'
import answerKeys from '../src/data/questionAnswerKeys.js'

const BASE = process.env.APP_URL ?? 'http://localhost:5173/HCI520-MTG-learning-site/'
const PRETEST_TARGET = 3
const POSTTEST_TARGET = 7

async function clickPrimary(page, pattern) {
  const btn = page.getByRole('button', { name: pattern })
  await btn.waitFor({ state: 'visible', timeout: 60_000 })
  await btn.click()
}

async function answerTest(page, targetCorrect) {
  let correctCount = 0

  for (let i = 0; i < 10; i++) {
    const question = page.locator('.pretest__question[id^="test-question-"]')
    await question.waitFor({ timeout: 30_000 })
    const qId = (await question.getAttribute('id')).replace('test-question-', '')
    const correctIndex = answerKeys[qId]
    const options = page.locator('.pretest__option')
    const optionCount = await options.count()

    let pickIndex
    if (correctCount < targetCorrect) {
      pickIndex = correctIndex
      correctCount += 1
    } else {
      pickIndex = (correctIndex + 1) % optionCount
      if (pickIndex === correctIndex) pickIndex = (pickIndex + 1) % optionCount
    }

    await options.nth(pickIndex).click()
    const forward = page.locator('.pretest__actions .pretest__button:not(.pretest__button--back)')
    await forward.click()
  }

  return correctCount
}

async function waitForWelcomeReady(page) {
  await page.goto(BASE)
  await clickPrimary(page, /I Agree and Continue/)
  const start = page.getByRole('button', { name: 'Start' })
  await start.waitFor({ state: 'visible' })
  await page.waitForFunction(
    () => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Start')
      return btn && !btn.disabled
    },
    { timeout: 60_000 }
  )
  await start.click()
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  console.log('Consent → Welcome → Intro')
  await waitForWelcomeReady(page)
  await clickPrimary(page, /I'm Ready|Continue/)

  console.log(`Pre-test (target ${PRETEST_TARGET}/10)`)
  await page.waitForURL(/\/pretest/)
  await answerTest(page, PRETEST_TARGET)

  console.log('Post pre-test flow → lessons')
  await page.waitForURL(/\/pretest-complete/)
  await clickPrimary(page, /Continue/)

  await page.waitForURL(/\/lesson\/intro/)
  await clickPrimary(page, /Continue to What Is Magic/)

  await page.waitForURL(/\/what-is-mtg/)
  await clickPrimary(page, /Continue to Lesson 1/)

  console.log('Lesson 1 — card anatomy markers')
  await page.waitForURL(/\/lesson\/1/)
  for (const marker of await page.locator('.card-anatomy__callout-marker').all()) {
    await marker.click()
  }
  await clickPrimary(page, /^Next$/)

  console.log('Lesson 2 — card types')
  await page.waitForURL(/\/lesson\/2/)
  for (const seeCard of await page.locator('.card-types__see-card').all()) {
    await seeCard.click()
    await page.locator('.card-types__overlay-close').click()
  }
  await clickPrimary(page, /^Next$/)

  console.log('Lesson 3 — turn phases')
  await page.waitForURL(/\/lesson\/3/)
  for (const phase of await page.locator('.turn-structure__node').all()) {
    await phase.click()
  }
  await clickPrimary(page, /^Next$/)

  console.log('Lesson 4 — one scenario then finish')
  await page.waitForURL(/\/lesson\/4/)
  await page.getByRole('button', { name: 'Yes' }).click()
  await page.getByRole('button', { name: 'Finish Lesson' }).first().click()

  console.log('Lesson complete → save → post-test')
  await page.waitForURL(/\/lesson\/complete/)
  const postTestBtn = page.getByRole('button', { name: 'Start Post-Test' })
  await postTestBtn.waitFor({ state: 'visible', timeout: 60_000 })
  await page.waitForFunction(
    () => {
      const btn = [...document.querySelectorAll('button')].find((b) =>
        b.textContent?.includes('Start Post-Test')
      )
      return btn && !btn.disabled
    },
    { timeout: 60_000 }
  )
  await postTestBtn.click()

  console.log(`Post-test (target ${POSTTEST_TARGET}/10)`)
  await page.waitForURL(/\/posttest/)
  await answerTest(page, POSTTEST_TARGET)

  console.log('Results')
  await page.waitForURL(/\/calculating|\/results/, { timeout: 30_000 })
  if (page.url().includes('/calculating')) {
    await page.waitForURL(/\/results/, { timeout: 15_000 })
  }

  const body = await page.textContent('body')
  const preMatch = body.match(/Pre-Test[\s\S]*?(\d+)\s*\/\s*10/i) ?? body.match(/(\d+)\s*\/\s*10/)
  const scores = [...body.matchAll(/(\d+)\s*\/\s*10/g)].map((m) => Number(m[1]))

  console.log('\n--- Results page scores (/10) ---')
  console.log('Found scores:', scores)

  const preScore = scores[0]
  const postScore = scores[1] ?? scores[scores.length - 1]

  if (preScore !== PRETEST_TARGET || postScore !== POSTTEST_TARGET) {
    console.error(`Expected pre=${PRETEST_TARGET} post=${POSTTEST_TARGET}, got pre=${preScore} post=${postScore}`)
    await page.screenshot({ path: 'walkthrough-results-fail.png', fullPage: true })
    await browser.close()
    process.exit(1)
  }

  console.log(`OK: Pre-test ${preScore}/10, Post-test ${postScore}/10`)
  await page.screenshot({ path: 'walkthrough-results-ok.png', fullPage: true })
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
