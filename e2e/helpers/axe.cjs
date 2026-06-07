const { expect } = require('@playwright/test')
const AxeBuilder = require('@axe-core/playwright').default

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa']

/**
 * Run axe-core on the current page and assert zero violations.
 * @param {import('@playwright/test').Page} page
 * @param {{ exclude?: string[] }} [options]
 */
async function expectNoAxeViolations(page, options = {}) {
  let builder = new AxeBuilder({ page }).withTags(AXE_TAGS)

  if (options.exclude?.length) {
    for (const selector of options.exclude) {
      builder = builder.exclude(selector)
    }
  }

  const results = await builder.analyze()
  const summary = results.violations.map((violation) => {
    const targets = violation.nodes
      .slice(0, 3)
      .map((node) => node.target.join(' '))
      .join('; ')
    return `${violation.id} (${violation.impact}): ${violation.help} — ${targets}`
  })

  expect(
    results.violations,
    summary.length ? `Axe violations:\n${summary.join('\n')}` : 'Axe violations'
  ).toEqual([])
}

module.exports = {
  AXE_TAGS,
  expectNoAxeViolations,
}
