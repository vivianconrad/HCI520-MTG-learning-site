import { describe, expect, it } from 'vitest'
import { buildParticipantExport } from './participantExport.js'

describe('buildParticipantExport', () => {
  it('includes session fields and omits scores when tests are incomplete', () => {
    const payload = buildParticipantExport({
      sessionId: 'ABC123',
      selectedQuestions: null,
      pretestAnswers: {},
      posttestAnswers: {},
      screenTimes: { welcome: 1000 },
      scenariosAttempted: 2,
      curiosityFocus: 'card-types',
      posttestReadiness: 'ready',
      lessonsCompleted: true,
      pretestCompleted: false,
      posttestCompleted: false,
    })

    expect(payload.sessionId).toBe('ABC123')
    expect(payload.exportVersion).toBe(1)
    expect(payload.scores).toBeNull()
    expect(payload.screenTimes).toEqual({ welcome: 1000 })
    expect(payload.curiosityFocus).toBe('card-types')
    expect(payload.progress.scenariosAttempted).toBe(2)
  })
})
