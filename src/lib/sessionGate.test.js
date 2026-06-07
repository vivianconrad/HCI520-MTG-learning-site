import { describe, expect, it } from 'vitest'
import { getRedirectPath } from './sessionGate.js'

const baseSession = {
  consentGiven: false,
  selectedQuestions: null,
  participantRowReady: false,
  pretestCompleted: false,
  lessonsCompleted: false,
  posttestCompleted: false,
}

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

  it('redirects to what-is-mtg when post-test requires completed lessons', () => {
    expect(
      getRedirectPath(['consent', 'pretest', 'lessons'], {
        ...baseSession,
        consentGiven: true,
        pretestCompleted: true,
      })
    ).toBe('/what-is-mtg')
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
