import { getLessonsResumePath } from './sessionGate.js'

/**
 * Copy and actions for the Results screen when score data is missing.
 * @returns {{ heading: string, message: string, hint?: string, primary: object, secondary?: object }}
 */
export function getResultsEmptyContent(session) {
  const {
    selectedQuestions,
    pretestAnswers,
    posttestAnswers,
    pretestCompleted,
    lessonsCompleted,
    posttestCompleted,
    screenTimes,
  } = session

  const hasQuestions = Array.isArray(selectedQuestions) && selectedQuestions.length > 0
  const hasPretestAnswers = Object.keys(pretestAnswers ?? {}).length > 0
  const hasPosttestAnswers = Object.keys(posttestAnswers ?? {}).length > 0

  if (!pretestCompleted) {
    return {
      heading: 'Results not ready yet',
      message: 'Your score summary appears after the pre-test, four lessons, and post-test.',
      hint: 'Start from Welcome when you are ready — the pre-test comes before any teaching content.',
      primary: { label: 'Go to Welcome', path: '/welcome' },
    }
  }

  if (pretestCompleted && !lessonsCompleted) {
    const resumePath = getLessonsResumePath(screenTimes)
    return {
      heading: 'Keep going — you are not done yet',
      message: 'Finish all four lessons, then take the post-test to unlock your before-and-after scores.',
      hint:
        resumePath === '/lesson/intro'
          ? 'You have not opened the lessons yet — the overview is a good place to start.'
          : 'We can send you back to the lesson you visited most recently.',
      primary: { label: 'Resume lessons', path: resumePath },
      secondary: { label: 'Go to Welcome', path: '/welcome' },
    }
  }

  if (pretestCompleted && lessonsCompleted && !posttestCompleted) {
    return {
      heading: 'Post-test still to do',
      message: 'The same questions from the pre-test come back once more — your results compare the two.',
      hint: 'Take a breath on the prep screen, then submit the post-test when you are ready.',
      primary: { label: 'Prepare for post-test', path: '/posttest-prep' },
      secondary: { label: 'Go to Welcome', path: '/welcome' },
    }
  }

  if (!hasQuestions || !hasPretestAnswers || !hasPosttestAnswers) {
    return {
      heading: 'We could not load your results',
      message:
        'Your saved session looks incomplete — some test answers or questions are missing.',
      hint: 'Try Welcome first. If the problem continues, reset your session to start fresh with a new save code.',
      primary: { label: 'Go to Welcome', path: '/welcome' },
      secondary: { label: 'Reset session', action: 'reset' },
    }
  }

  return {
    heading: 'Results unavailable',
    message: 'Something unexpected happened while building your score summary.',
    hint: 'Return to Welcome to continue, or reset your session if you want a clean start.',
    primary: { label: 'Go to Welcome', path: '/welcome' },
    secondary: { label: 'Reset session', action: 'reset' },
  }
}
