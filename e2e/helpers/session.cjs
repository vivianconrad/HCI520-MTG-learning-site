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

module.exports = {
  LESSON_READY_SESSION,
  seedSession,
  assertNoHorizontalOverflow,
}
