import { describe, expect, it } from 'vitest'
import {
  getLessonsResumePath,
  getLessonProgressForwardPath,
  getRedirectInfo,
  getRedirectPath,
  getGateNotice,
  hasPosttestInProgress,
} from './sessionGate.js'

const baseSession = {
  consentGiven: false,
  selectedQuestions: null,
  participantRowReady: false,
  pretestCompleted: false,
  lessonsCompleted: false,
  posttestCompleted: false,
  screenTimes: {},
}

describe('getLessonsResumePath', () => {
  it('returns lesson intro when no lesson screens were visited', () => {
    expect(getLessonsResumePath({})).toBe('/lesson/intro')
  })

  it('returns the most recently visited lesson screen with dwell time', () => {
    expect(
      getLessonsResumePath({
        WhatIsMtg: 1000,
        CardAnatomy: 2000,
      })
    ).toBe('/lesson/1')
  })

  it('returns putting it together when that is the latest visited lesson', () => {
    expect(
      getLessonsResumePath({
        CardTypes: 500,
        PuttingItTogether: 1200,
      })
    ).toBe('/lesson/4')
  })
})

describe('getRedirectPath', () => {
  it('returns null when every required step is satisfied', () => {
    expect(
      getRedirectPath(['consent', 'questions', 'rowReady', 'pretest'], {
        ...baseSession,
        consentGiven: true,
        selectedQuestions: [],
        participantRowReady: true,
        pretestCompleted: true,
      })
    ).toBeNull()
  })

  it('redirects to consent before other requirements', () => {
    expect(getRedirectPath(['consent', 'pretest'], baseSession)).toBe('/')
  })

  it('redirects to welcome when questions are not drawn yet', () => {
    expect(
      getRedirectPath(['consent', 'questions'], {
        ...baseSession,
        consentGiven: true,
      })
    ).toBe('/welcome')
  })

  it('redirects to welcome when the participant row is not ready', () => {
    expect(
      getRedirectPath(['consent', 'questions', 'rowReady'], {
        ...baseSession,
        consentGiven: true,
        selectedQuestions: [{ id: 'q1' }],
      })
    ).toBe('/welcome')
  })

  it('redirects to pretest when lessons require a completed pre-test', () => {
    expect(
      getRedirectPath(['consent', 'pretest'], {
        ...baseSession,
        consentGiven: true,
      })
    ).toBe('/pretest')
  })

  it('redirects to lesson intro when lessons are incomplete and none were visited', () => {
    expect(
      getRedirectPath(['consent', 'pretest', 'lessons'], {
        ...baseSession,
        consentGiven: true,
        pretestCompleted: true,
      })
    ).toBe('/lesson/intro')
  })

  it('resumes the latest visited lesson when lessons are incomplete', () => {
    expect(
      getRedirectPath(['consent', 'pretest', 'lessons'], {
        ...baseSession,
        consentGiven: true,
        pretestCompleted: true,
        screenTimes: { TurnStructure: 3000 },
      })
    ).toBe('/lesson/3')
  })

  it('redirects to posttest when results require a finished post-test', () => {
    expect(
      getRedirectPath(['consent', 'pretest', 'lessons', 'posttest'], {
        ...baseSession,
        consentGiven: true,
        pretestCompleted: true,
        lessonsCompleted: true,
      })
    ).toBe('/posttest')
  })
})

describe('getRedirectInfo', () => {
  it('returns the failed gate key with the redirect path', () => {
    expect(
      getRedirectInfo(['consent', 'pretest'], {
        ...baseSession,
        consentGiven: true,
      })
    ).toEqual({ path: '/pretest', failedKey: 'pretest' })
  })
})

describe('getGateNotice', () => {
  it('returns learner-friendly copy for each gate', () => {
    expect(getGateNotice('pretest')).toMatch(/pre-test/i)
    expect(getGateNotice('pretest')).toMatch(/sent you/i)
    expect(getGateNotice('posttest')).toMatch(/post-test/i)
    expect(getGateNotice('lessons', '/lesson/3')).toMatch(/turn structure/i)
  })
})

describe('getLessonProgressForwardPath', () => {
  const inLessons = {
    ...baseSession,
    consentGiven: true,
    pretestCompleted: true,
    lessonsCompleted: false,
  }

  it('returns null before the pre-test is finished', () => {
    expect(getLessonProgressForwardPath('/welcome', baseSession)).toBeNull()
  })

  it('returns null when already on the resume path', () => {
    expect(
      getLessonProgressForwardPath('/lesson/3', {
        ...inLessons,
        screenTimes: { TurnStructure: 1000 },
      })
    ).toBeNull()
  })

  it('allows the first visit to pre-test complete after finishing the pre-test', () => {
    expect(getLessonProgressForwardPath('/pretest-complete', inLessons)).toBeNull()
  })

  it('forwards from onboarding routes to the last visited lesson', () => {
    expect(
      getLessonProgressForwardPath('/welcome', {
        ...inLessons,
        screenTimes: { CardAnatomy: 1000 },
      })
    ).toBe('/lesson/1')
  })

  it('forwards from an earlier lesson to the last visited lesson', () => {
    expect(
      getLessonProgressForwardPath('/lesson/1', {
        ...inLessons,
        screenTimes: { TurnStructure: 1000 },
      })
    ).toBe('/lesson/3')
  })

  it('does not forward when moving forward through the lesson flow', () => {
    expect(getLessonProgressForwardPath('/what-is-mtg', inLessons)).toBeNull()
  })

  it('forwards from pre-test complete once lesson content has started', () => {
    expect(
      getLessonProgressForwardPath('/pretest-complete', {
        ...inLessons,
        screenTimes: { WhatIsMtg: 500 },
      })
    ).toBe('/what-is-mtg')
  })

  it('forwards to post-test prep after lessons are complete', () => {
    expect(
      getLessonProgressForwardPath('/lesson/2', {
        ...baseSession,
        consentGiven: true,
        pretestCompleted: true,
        lessonsCompleted: true,
      })
    ).toBe('/posttest-prep')
  })

  it('returns null after the post-test is complete', () => {
    expect(
      getLessonProgressForwardPath('/lesson/1', {
        ...baseSession,
        pretestCompleted: true,
        lessonsCompleted: true,
        posttestCompleted: true,
      })
    ).toBeNull()
  })

  it('forwards to the post-test when it is already in progress', () => {
    const afterLessons = {
      ...baseSession,
      pretestCompleted: true,
      lessonsCompleted: true,
    }

    expect(
      getLessonProgressForwardPath('/posttest-prep', {
        ...afterLessons,
        screenTimes: { PostTest: 1000 },
      })
    ).toBe('/posttest')

    expect(
      getLessonProgressForwardPath('/posttest', {
        ...afterLessons,
        posttestAnswers: { q1: 0 },
      })
    ).toBeNull()
  })
})

describe('hasPosttestInProgress', () => {
  it('is false before the post-test starts', () => {
    expect(hasPosttestInProgress(baseSession)).toBe(false)
  })

  it('is true after visiting the post-test or saving an answer', () => {
    expect(hasPosttestInProgress({ ...baseSession, screenTimes: { PostTest: 1 } })).toBe(true)
    expect(hasPosttestInProgress({ ...baseSession, posttestAnswers: { q1: 2 } })).toBe(true)
  })
})
