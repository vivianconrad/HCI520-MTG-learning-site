const MOCK_QUESTIONS = [
  {
    id: 'lo0_q1',
    lo: 'LO0',
    question: 'Magic: The Gathering is best described as…',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
  },
  {
    id: 'lo0_q2',
    lo: 'LO0',
    question: 'Which deck size is typical for a Commander game?',
    options: ['40 cards', '60 cards', '100 cards', 'No limit'],
  },
]

const MOCK_PRETEST_ANSWERS = {
  lo0_q1: 0,
  lo0_q2: 2,
}

const MOCK_POSTTEST_ANSWERS = {
  lo0_q1: 1,
  lo0_q2: 2,
}

function baseSession(overrides = {}) {
  return {
    sessionId: 'A11YE2ESESSION0001',
    sessionSecret: 'a11y-e2e-test-secret',
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

const A11Y_PAGE_CHECKS = [
  {
    name: 'consent',
    path: './',
    session: baseSession({ consentGiven: false }),
    heading: { role: 'heading', level: 1 },
  },
  {
    name: 'welcome',
    path: 'welcome',
    session: baseSession({ consentGiven: true }),
    heading: { role: 'heading', name: /learn to play/i },
  },
  {
    name: 'pretest',
    path: 'pretest',
    session: baseSession(),
    heading: { role: 'heading', name: 'Pre-Test' },
  },
  {
    name: 'card anatomy lesson',
    path: 'lesson/1',
    session: baseSession({ pretestCompleted: true }),
    heading: { role: 'heading', name: /how to read a card/i },
  },
  {
    name: 'card types lesson',
    path: 'lesson/2',
    session: baseSession({ pretestCompleted: true }),
    heading: { role: 'heading', name: /seven card types/i },
  },
  {
    name: 'turn structure lesson',
    path: 'lesson/3',
    session: baseSession({ pretestCompleted: true }),
    heading: { role: 'heading', name: /how a turn works/i },
  },
  {
    name: 'putting it together lesson',
    path: 'lesson/4',
    session: baseSession({ pretestCompleted: true }),
    heading: { role: 'heading', name: /putting it together/i },
  },
  {
    name: 'results',
    path: 'results',
    session: baseSession({
      pretestCompleted: true,
      posttestCompleted: true,
      pretestAnswers: MOCK_PRETEST_ANSWERS,
      posttestAnswers: MOCK_POSTTEST_ANSWERS,
    }),
    heading: { role: 'heading', name: /your results/i },
  },
]

module.exports = {
  A11Y_PAGE_CHECKS,
  MOCK_POSTTEST_ANSWERS,
  MOCK_PRETEST_ANSWERS,
  MOCK_QUESTIONS,
  baseSession,
}
