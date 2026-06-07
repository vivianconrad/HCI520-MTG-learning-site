import { getLessonsResumePath } from './sessionGate.js'

/**
 * Copy and actions for the Results screen when score data is missing.
 * @returns {{ heading: string, message: string, primary: object, secondary?: object }}
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
      message: 'Finish the pre-test first, then work through the lessons and post-test.',
      primary: { label: 'Go to Welcome', path: '/welcome' },
    }
  }

  if (pretestCompleted && !lessonsCompleted) {
    return {
      heading: 'You still have lessons to finish',
      message: 'Complete all four lessons, then take the post-test to see your results.',
      primary: { label: 'Resume lessons', path: getLessonsResumePath(screenTimes) },
      secondary: { label: 'Go to Welcome', path: '/welcome' },
    }
  }

  if (pretestCompleted && lessonsCompleted && !posttestCompleted) {
    return {
      heading: 'Post-test still to do',
      message: 'Your results appear after you finish the post-test.',
      primary: { label: 'Prepare for post-test', path: '/posttest-prep' },
      secondary: { label: 'Go to Welcome', path: '/welcome' },
    }
  }

  if (!hasQuestions || !hasPretestAnswers || !hasPosttestAnswers) {
    return {
      heading: 'We could not load your results',
      message:
        'Your saved session looks incomplete. Go back to Welcome and try again, or reset your session to start fresh.',
      primary: { label: 'Go to Welcome', path: '/welcome' },
      secondary: { label: 'Reset session', action: 'reset' },
    }
  }

  return {
    heading: 'Results unavailable',
    message: 'Something unexpected happened. Return to Welcome to continue or reset your session.',
    primary: { label: 'Go to Welcome', path: '/welcome' },
    secondary: { label: 'Reset session', action: 'reset' },
  }
}
