const { test, expect } = require('@playwright/test')
const { seedSession } = require('./helpers/session.cjs')

test.describe('session route guards', () => {
  test('blocks pre-test until consent, questions, and row registration are ready', async ({
    page,
  }) => {
    await page.goto('pretest')
    await expect(page).toHaveURL(/\/HCI520-MTG-learning-site\/$/)

    await seedSession(page, {
      sessionId: 'E2E-GUARD-1',
      sessionSecret: 'e2e-guard-secret',
      participantId: null,
      participantRowReady: false,
      selectedQuestions: null,
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
    })

    await page.goto('pretest')
    await expect(page).toHaveURL(/\/HCI520-MTG-learning-site\/welcome$/)
  })

  test('redirects completed pre-test away from the assessment screen', async ({ page }) => {
    await seedSession(page, {
      sessionId: 'E2E-GUARD-2',
      sessionSecret: 'e2e-guard-secret',
      participantId: 'participant-1',
      participantRowReady: true,
      selectedQuestions: [{ id: 'q1' }, { id: 'q2' }],
      pretestAnswers: { q1: 0, q2: 1 },
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
    })

    await page.goto('pretest')
    await expect(page).toHaveURL(/\/HCI520-MTG-learning-site\/pretest-complete$/)
  })

  test('hides the keyword guide on the pre-test route', async ({ page }) => {
    await seedSession(page, {
      sessionId: 'E2E-GUARD-3',
      sessionSecret: 'e2e-guard-secret',
      participantId: 'participant-1',
      participantRowReady: true,
      selectedQuestions: [{ id: 'q1' }, { id: 'q2' }],
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
    })

    await page.goto('pretest')
    await expect(page.getByRole('button', { name: /keyword guide/i })).toHaveCount(0)
  })
})
