/** Internal topic keys (not shown in the learner UI). */
export const TOPIC_ORDER = ['LO0', 'LO1', 'LO2', 'LO3', 'LO4']

export const QUESTIONS_PER_TOPIC = 2

export const DEFAULT_TEST_QUESTION_COUNT = TOPIC_ORDER.length * QUESTIONS_PER_TOPIC

export const TOPIC_LABELS = {
  LO0: 'MTG Basics',
  LO1: 'How to Read a Card',
  LO2: 'How a Turn Works',
  LO3: 'Turn Steps in Detail',
  LO4: 'Card Timing',
}

export const TOPIC_LESSON_PATHS = {
  LO0: '/what-is-mtg',
  LO1: '/lesson/1',
  LO2: '/lesson/3',
  LO3: '/lesson/3',
  LO4: '/lesson/4',
}

const CARD_TYPE_QUESTION_PREFIX = 'What type of card'

/** LO1 pool questions that identify card types are taught in Lesson 2. */
export function isCardTypeIdentificationQuestion(question) {
  return (
    question?.lo === 'LO1' &&
    typeof question.question === 'string' &&
    question.question.startsWith(CARD_TYPE_QUESTION_PREFIX)
  )
}

export function getReviewLessonPath(question) {
  if (question?.reviewLesson) return question.reviewLesson
  if (!question?.lo) return '/what-is-mtg'
  if (question.lo === 'LO4') return '/lesson/4'
  if (question.lo === 'LO0') return '/what-is-mtg'
  if (isCardTypeIdentificationQuestion(question)) return '/lesson/2'
  return TOPIC_LESSON_PATHS[question.lo] ?? '/what-is-mtg'
}

export function calculateScores(selectedQuestions, pretestAnswers, posttestAnswers, answerKeys) {
  let pretestCorrect = 0
  let posttestCorrect = 0
  const loScores = Object.fromEntries(TOPIC_ORDER.map((lo) => [lo, { pre: 0, post: 0 }]))

  const correctIndexFor = (question) => {
    if (answerKeys && answerKeys[question.id] !== undefined) {
      return answerKeys[question.id]
    }
    return question.correctIndex
  }

  for (const question of selectedQuestions) {
    const preIndex = pretestAnswers[question.id]
    const postIndex = posttestAnswers[question.id]
    const correctIndex = correctIndexFor(question)

    if (preIndex === correctIndex) {
      pretestCorrect += 1
      if (loScores[question.lo]) loScores[question.lo].pre += 1
    }

    if (postIndex === correctIndex) {
      posttestCorrect += 1
      if (loScores[question.lo]) loScores[question.lo].post += 1
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
      text: `You improved by ${diff} ${unit}.`,
      className: 'results__improvement results__improvement--positive',
    }
  }

  if (posttestCorrect === pretestCorrect) {
    return {
      text: 'Same score as the pre-test. Use the review links below if you want to revisit a topic.',
      className: 'results__improvement results__improvement--neutral',
    }
  }

  return {
    text: 'You missed more than on the pre-test. Use the review links below for the topics that tripped you up.',
    className: 'results__improvement results__improvement--neutral',
  }
}

export function buildResultsSummary(sessionId, scores, selectedQuestions) {
  const lines = [
    `Session ID: ${sessionId}`,
    `Pre-Test: ${scores.pretestCorrect} / ${selectedQuestions.length}`,
    `Post-Test: ${scores.posttestCorrect} / ${selectedQuestions.length}`,
    '',
    'By topic:',
  ]

  for (const lo of TOPIC_ORDER) {
    const { pre, post } = scores.loScores[lo]
    lines.push(`${TOPIC_LABELS[lo]}: ${pre}/2 → ${post}/2`)
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
      loMeans: Object.fromEntries(TOPIC_ORDER.map((lo) => [lo, { pre: 0, post: 0, gain: 0 }])),
    }
  }

  let sumPre = 0
  let sumPost = 0
  const loTotals = Object.fromEntries(TOPIC_ORDER.map((lo) => [lo, { pre: 0, post: 0, gain: 0 }]))

  for (const row of sessions) {
    const preScore = row.pretest_score ?? row.pretest_correct ?? 0
    const postScore = row.posttest_score ?? row.posttest_correct ?? 0
    sumPre += preScore
    sumPost += postScore

    let loScores = row.lo_scores
    if (!loScores && row.selected_questions && row.pretest_answers && row.posttest_answers) {
      loScores = calculateScores(
        row.selected_questions,
        row.pretest_answers,
        row.posttest_answers
      ).loScores
    }

    if (!loScores) continue

    for (const lo of TOPIC_ORDER) {
      const loRow = loScores[lo]
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
      TOPIC_ORDER.map((lo) => [
        lo,
        {
          pre: loTotals[lo].pre / count,
          post: loTotals[lo].post / count,
          gain: loTotals[lo].gain / count,
        },
      ])
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
    ...TOPIC_ORDER.flatMap((topicKey) => [
      `${topicKey}_pre`,
      `${topicKey}_post`,
      `${topicKey}_gain`,
    ]),
    'question_ids',
  ]

  const rows = sessions.map((row) => {
    const preScore = row.pretest_score ?? row.pretest_correct ?? 0
    const postScore = row.posttest_score ?? row.posttest_correct ?? 0
    const gain = postScore - preScore

    let loScores = row.lo_scores
    if (!loScores && row.selected_questions && row.pretest_answers && row.posttest_answers) {
      loScores = calculateScores(
        row.selected_questions,
        row.pretest_answers,
        row.posttest_answers
      ).loScores
    }

    const loParts = TOPIC_ORDER.flatMap((lo) => {
      const loRow = loScores?.[lo] ?? { pre: 0, post: 0 }
      return [loRow.pre, loRow.post, loRow.post - loRow.pre]
    })

    const questionIds = row.question_ids ?? row.selected_questions?.map((q) => q.id) ?? []

    return [
      row.session_id,
      row.completed_at ?? row.submitted_at ?? row.created_at ?? '',
      preScore,
      postScore,
      gain,
      ...loParts,
      questionIds.join(';'),
    ]
  })

  const escape = (value) => {
    const text = String(value ?? '')
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
    return text
  }

  return [headers, ...rows].map((line) => line.map(escape).join(',')).join('\n')
}
