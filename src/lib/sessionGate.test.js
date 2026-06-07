import { describe, expect, it } from 'vitest'
import { getLessonsResumePath, getRedirectInfo, getRedirectPath, getGateNotice } from './sessionGate.js'

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
    expect(getGateNotice('posttest')).toMatch(/post-test/i)
  })
})
