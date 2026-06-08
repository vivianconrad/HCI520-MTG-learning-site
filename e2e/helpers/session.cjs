const { expect } = require('@playwright/test')

const LESSON_READY_SESSION = {
  sessionId: 'E2ETESTSESSION1',
  sessionSecret: 'e2e-test-secret',
  participantId: null,
  participantRowReady: true,
  selectedQuestions: [],
  pretestAnswers: {},
  posttestAnswers: {},
  screenStartTimes: {},
  screenTimes: {},
  scenarioIdsAttempted: [],
  consentGiven: true,
  lessonsCompleted: false,
  pretestCompleted: true,
  posttestCompleted: false,
  curiosityFocus: null,
  posttestReadiness: null,
}

async function seedSession(page, session = LESSON_READY_SESSION) {
  await page.addInitScript((payload) => {
    sessionStorage.setItem('hci520-mtg-session', JSON.stringify(payload))
  }, session)
}

async function assertNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement
    return doc.scrollWidth > doc.clientWidth + 1
  })
  expect(overflow).toBe(false)
}

async function expectVisibleCardAnatomyMissingHighlight(page) {
  const partsMissing = page.locator('.card-anatomy__parts-button--missing')
  const markerMissing = page.locator('.card-anatomy__marker--missing')

  if ((await partsMissing.count()) > 0 && (await partsMissing.first().isVisible())) {
    await expect(partsMissing.first()).toBeVisible()
    return
  }

  await expect(markerMissing.first()).toBeVisible()
}

module.exports = {
  LESSON_READY_SESSION,
  seedSession,
  assertNoHorizontalOverflow,
  expectVisibleCardAnatomyMissingHighlight,
}
