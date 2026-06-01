export const LO_LABELS = {
  LO1: 'How to Read a Card',
  LO2: 'How a Turn Works',
  LO3: 'Turn Steps in Detail',
  LO4: 'Card Timing',
}

export const LO_LESSON_PATHS = {
  LO1: '/lesson/1',
  LO2: '/lesson/3',
  LO3: '/lesson/3',
  LO4: '/lesson/2',
}

export const LO_ORDER = ['LO1', 'LO2', 'LO3', 'LO4']

export function calculateScores(selectedQuestions, pretestAnswers, posttestAnswers) {
  let pretestCorrect = 0
  let posttestCorrect = 0
  const loScores = Object.fromEntries(
    LO_ORDER.map((lo) => [lo, { pre: 0, post: 0 }]),
  )

  for (const question of selectedQuestions) {
    const preIndex = pretestAnswers[question.id]
    const postIndex = posttestAnswers[question.id]

    if (preIndex === question.correctIndex) {
      pretestCorrect += 1
      loScores[question.lo].pre += 1
    }

    if (postIndex === question.correctIndex) {
      posttestCorrect += 1
      loScores[question.lo].post += 1
    }
  }

  return { pretestCorrect, posttestCorrect, loScores }
}

export function getLoTag(pre, post) {
  if (post > pre) return { label: 'Improved', className: 'results__lo-tag--improved' }
  if (post < pre) return { label: 'Review', className: 'results__lo-tag--declined' }
  return { label: 'Same', className: 'results__lo-tag--same' }
}

export function getImprovementMessage(pretestCorrect, posttestCorrect) {
  if (posttestCorrect > pretestCorrect) {
    const diff = posttestCorrect - pretestCorrect
    const unit = diff === 1 ? 'point' : 'points'
    return {
      text: `You improved by ${diff} ${unit}. Great work.`,
      className: 'results__improvement results__improvement--positive',
    }
  }

  if (posttestCorrect === pretestCorrect) {
    return {
      text: 'Your score stayed the same. Review the lessons below if you want another pass.',
      className: 'results__improvement results__improvement--neutral',
    }
  }

  return {
    text: 'Your score dropped on some questions. Use the review links below to revisit those topics.',
    className: 'results__improvement results__improvement--neutral',
  }
}

export function buildResultsSummary(sessionId, scores, selectedQuestions) {
  const lines = [
    `Session ID: ${sessionId}`,
    `Pre-Test: ${scores.pretestCorrect} / ${selectedQuestions.length}`,
    `Post-Test: ${scores.posttestCorrect} / ${selectedQuestions.length}`,
    '',
    'By learning objective:',
  ]

  for (const lo of LO_ORDER) {
    const { pre, post } = scores.loScores[lo]
    lines.push(`${LO_LABELS[lo]}: ${pre}/2 → ${post}/2`)
  }

  return lines.join('\n')
}

export function aggregateCohortStats(sessions) {
  if (!sessions.length) {
    return {
      count: 0,
      meanPretest: 0,
      meanPosttest: 0,
      meanGain: 0,
      loMeans: Object.fromEntries(LO_ORDER.map((lo) => [lo, { pre: 0, post: 0, gain: 0 }])),
    }
  }

  let sumPre = 0
  let sumPost = 0
  const loTotals = Object.fromEntries(
    LO_ORDER.map((lo) => [lo, { pre: 0, post: 0, gain: 0 }]),
  )

  for (const row of sessions) {
    sumPre += row.pretest_correct
    sumPost += row.posttest_correct
    for (const lo of LO_ORDER) {
      const loRow = row.lo_scores?.[lo]
      if (!loRow) continue
      loTotals[lo].pre += loRow.pre
      loTotals[lo].post += loRow.post
      loTotals[lo].gain += loRow.post - loRow.pre
    }
  }

  const count = sessions.length
  return {
    count,
    meanPretest: sumPre / count,
    meanPosttest: sumPost / count,
    meanGain: (sumPost - sumPre) / count,
    loMeans: Object.fromEntries(
      LO_ORDER.map((lo) => [
        lo,
        {
          pre: loTotals[lo].pre / count,
          post: loTotals[lo].post / count,
          gain: loTotals[lo].gain / count,
        },
      ]),
    ),
  }
}

export function sessionsToCsv(sessions) {
  const headers = [
    'session_id',
    'submitted_at',
    'pretest_correct',
    'posttest_correct',
    'gain',
    ...LO_ORDER.flatMap((lo) => [`${lo}_pre`, `${lo}_post`, `${lo}_gain`]),
    'question_ids',
  ]

  const rows = sessions.map((row) => {
    const gain = row.posttest_correct - row.pretest_correct
    const loParts = LO_ORDER.flatMap((lo) => {
      const loRow = row.lo_scores?.[lo] ?? { pre: 0, post: 0 }
      return [loRow.pre, loRow.post, loRow.post - loRow.pre]
    })
    return [
      row.session_id,
      row.submitted_at ?? row.created_at ?? '',
      row.pretest_correct,
      row.posttest_correct,
      gain,
      ...loParts,
      (row.question_ids ?? []).join(';'),
    ]
  })

  const escape = (value) => {
    const text = String(value ?? '')
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
    return text
  }

  return [headers, ...rows].map((line) => line.map(escape).join(',')).join('\n')
}
