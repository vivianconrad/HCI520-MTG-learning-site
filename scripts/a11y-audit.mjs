/**
 * Run axe-core WCAG checks on key learner flows (pre-test, turn structure).
 * Usage: node scripts/a11y-audit.mjs [baseUrl]
 * Default baseUrl: http://127.0.0.1:5173/HCI520-MTG-learning-site
 */
import { chromium, devices } from 'playwright'

const BASE =
  process.argv[2]?.replace(/\/$/, '') ?? 'http://127.0.0.1:5173/HCI520-MTG-learning-site'
const AXE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js'
const STORAGE_KEY = 'hci520-mtg-session'

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

const PAGES = [
  {
    name: 'Pre-test (desktop)',
    path: '/pretest',
    session: baseSession(),
    waitFor: 'h1.pretest__title',
  },
  {
    name: 'Pre-test (mobile)',
    path: '/pretest',
    session: baseSession(),
    waitFor: 'h1.pretest__title',
    device: devices['iPhone 13'],
  },
  {
    name: 'Turn structure (desktop)',
    path: '/lesson/3',
    session: baseSession({ pretestCompleted: true }),
    waitFor: 'h1.turn-structure__heading',
  },
  {
    name: 'Turn structure (mobile)',
    path: '/lesson/3',
    session: baseSession({ pretestCompleted: true }),
    waitFor: 'h1.turn-structure__heading',
    device: devices['iPhone 13'],
  },
]

async function runAxe(page) {
  await page.addScriptTag({ url: AXE_URL })
  return page.evaluate(async () => {
    return window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] },
    })
  })
}

function summarize(results) {
  const violations = results.violations ?? []
  const incomplete = results.incomplete ?? []
  return { violations, incomplete, passes: results.passes?.length ?? 0 }
}

function printReport(label, { violations, incomplete, passes }) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(label)
  console.log('='.repeat(60))
  console.log(`Passes: ${passes} rules`)
  console.log(`Violations: ${violations.length}`)
  console.log(`Incomplete: ${incomplete.length}`)

  if (violations.length === 0) {
    console.log('No WCAG violations detected.')
  } else {
    for (const v of violations) {
      console.log(`\n[${v.impact?.toUpperCase() ?? 'UNKNOWN'}] ${v.id}: ${v.help}`)
      console.log(`  ${v.description}`)
      for (const node of v.nodes.slice(0, 5)) {
        console.log(`  - ${node.target.join(' ')}`)
        console.log(`    ${node.failureSummary?.replace(/\n/g, ' ') ?? ''}`)
      }
      if (v.nodes.length > 5) {
        console.log(`  … and ${v.nodes.length - 5} more nodes`)
      }
    }
  }

  if (incomplete.length > 0) {
    console.log('\nIncomplete (manual review):')
    for (const item of incomplete.slice(0, 8)) {
      console.log(`  - ${item.id}: ${item.help} (${item.nodes.length} nodes)`)
    }
    if (incomplete.length > 8) {
      console.log(`  … and ${incomplete.length - 8} more`)
    }
  }
}

async function auditPage(browser, pageConfig) {
  const context = await browser.newContext(pageConfig.device ? { ...pageConfig.device } : {})
  await context.addInitScript(
    ({ key, data }) => {
      sessionStorage.setItem(key, JSON.stringify(data))
    },
    { key: STORAGE_KEY, data: pageConfig.session }
  )

  const page = await context.newPage()
  const url = `${BASE}${pageConfig.path}`

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector(pageConfig.waitFor, { timeout: 30000 })
    const results = await runAxe(page)
    const summary = summarize(results)
    printReport(`${pageConfig.name} — ${url}`, summary)
    return summary
  } finally {
    await context.close()
  }
}

async function main() {
  console.log(`Accessibility audit (axe-core 4.10.3)`)
  console.log(`Base URL: ${BASE}`)

  const browser = await chromium.launch({ headless: true })
  const summaries = []

  try {
    for (const pageConfig of PAGES) {
      summaries.push({ name: pageConfig.name, ...(await auditPage(browser, pageConfig)) })
    }
  } finally {
    await browser.close()
  }

  const totalViolations = summaries.reduce((n, s) => n + s.violations.length, 0)
  console.log(`\n${'='.repeat(60)}`)
  console.log(`TOTAL: ${totalViolations} violation(s) across ${summaries.length} page checks`)
  console.log('='.repeat(60))

  process.exit(totalViolations > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
