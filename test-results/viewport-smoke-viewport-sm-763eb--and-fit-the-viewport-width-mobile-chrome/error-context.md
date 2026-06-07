# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: viewport-smoke.spec.cjs >> viewport smoke >> interactive lessons load and fit the viewport width
- Location: e2e\viewport-smoke.spec.cjs:17:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to main content" [ref=e4] [cursor=pointer]:
    - /url: "#main"
  - main [ref=e6]:
    - generic [ref=e7]:
      - paragraph [ref=e8]: Lesson 03 · Turn Structure
      - heading "How a Turn Works" [level=1] [ref=e9]
      - separator [ref=e10]
      - paragraph [ref=e11]: Every Magic turn follows the same five phases in order. Click a phase on the timeline, or use Next phase to walk through a sample turn at your own pace.
      - paragraph [ref=e12]: Open all five phases before you continue.
      - tablist "Turn phases" [ref=e14]:
        - tab "Beginning Phase" [selected] [ref=e16] [cursor=pointer]
        - tab "First Main Phase" [ref=e19] [cursor=pointer]
        - tab "Combat Phase" [ref=e22] [cursor=pointer]
        - tab "Second Main Phase" [ref=e25] [cursor=pointer]
        - tab "End Phase" [ref=e28] [cursor=pointer]
      - paragraph [ref=e29]: Swipe the timeline to see all five phases.
      - paragraph [ref=e30]: Explored 1 of 5 phases
      - tabpanel "Beginning Phase" [ref=e31]:
        - heading "Beginning Phase" [level=2] [ref=e32]
        - img "Island land card" [ref=e33]
        - paragraph [ref=e34]:
          - generic [ref=e35]:
            - text: "The beginning phase has three parts, always in this order:"
            - button "untap" [ref=e37] [cursor=pointer]
            - text: ", upkeep, and draw."
        - list [ref=e38]:
          - listitem [ref=e39]:
            - generic [ref=e40]: ◆
            - generic [ref=e41]:
              - button "Untap" [ref=e43] [cursor=pointer]
              - text: ": You"
              - button "untap" [ref=e45] [cursor=pointer]
              - text: all of your
              - button "permanents" [ref=e47] [cursor=pointer]
              - text: . Turn every
              - button "tapped" [ref=e49] [cursor=pointer]
              - text: card upright so it can be used again.
              - button "Tapping" [ref=e51] [cursor=pointer]
              - text: means turning a card sideways to show it has been used;
              - button "untapping" [ref=e53] [cursor=pointer]
              - text: reverses that at the start of each of your turns.
          - listitem [ref=e54]:
            - generic [ref=e55]: ◆
            - generic [ref=e56]: "Upkeep: Triggered abilities that say 'at the beginning of your upkeep' happen here. Most turns nothing happens during upkeep."
          - listitem [ref=e57]:
            - generic [ref=e58]: ◆
            - generic [ref=e59]:
              - text: "Draw: You draw one card from the top of your"
              - button "library" [ref=e61] [cursor=pointer]
              - text: . The first player to go skips this on their very first turn.
      - generic [ref=e62]:
        - button "Previous phase" [disabled] [ref=e63]
        - button "Next phase" [ref=e64] [cursor=pointer]
      - complementary "Casting vs. playing" [ref=e65]:
        - heading "Casting vs. playing" [level=2] [ref=e66]
        - paragraph [ref=e67]:
          - generic [ref=e68]:
            - text: In Magic, playing
            - button "and casting" [ref=e70] [cursor=pointer]
            - text: are different actions. You
            - button "play lands" [ref=e72] [cursor=pointer]
            - text: ;
            - button "you cast" [ref=e74] [cursor=pointer]
            - text: everything else that is a
            - button "spell" [ref=e76] [cursor=pointer]
            - text: .
        - paragraph [ref=e77]:
          - generic [ref=e78]:
            - button "Playing a land" [ref=e80] [cursor=pointer]
            - text: puts it straight onto the battlefield with no
            - button "stack" [ref=e82] [cursor=pointer]
            - text: and no waiting for your opponent to
            - button "respond" [ref=e84] [cursor=pointer]
            - text: . Casting means paying mana and putting a
            - button "spell" [ref=e86] [cursor=pointer]
            - text: on the
            - button "stack" [ref=e88] [cursor=pointer]
            - text: first, where both players can
            - button "respond" [ref=e90] [cursor=pointer]
            - text: before it
            - button "resolves" [ref=e92] [cursor=pointer]
            - text: . On the
            - button "stack" [ref=e94] [cursor=pointer]
            - text: it is a
            - button "spell" [ref=e96] [cursor=pointer]
            - text: ; if it stays on the battlefield after
            - button "resolving" [ref=e98] [cursor=pointer]
            - text: ", it becomes a"
            - button "permanent" [ref=e100] [cursor=pointer]
            - text: .
        - paragraph [ref=e101]:
          - generic [ref=e102]:
            - button "Priority" [ref=e104] [cursor=pointer]
            - text: is your window to play cards,
            - button "activate" [ref=e106] [cursor=pointer]
            - text: abilities, or pass and let the game move on.
      - complementary "What does tap mean?" [ref=e107]:
        - heading "What does tap mean?" [level=2] [ref=e108]
        - 'img "The MTG tap symbol: a curved arrow pointing clockwise" [ref=e109]'
        - paragraph [ref=e110]:
          - generic [ref=e111]:
            - text: To
            - button "tap" [ref=e113] [cursor=pointer]
            - text: a card, turn it sideways. That marks it as used for now. Most
            - button "tapped" [ref=e115] [cursor=pointer]
            - text: cards cannot be used again until they
            - button "untap" [ref=e117] [cursor=pointer]
            - text: .
        - paragraph [ref=e118]:
          - generic [ref=e119]:
            - text: Lands
            - button "tap" [ref=e121] [cursor=pointer]
            - text: to produce mana. Creatures
            - button "tap" [ref=e123] [cursor=pointer]
            - text: when they attack. Many cards show a curved-arrow
            - button "tap" [ref=e125] [cursor=pointer]
            - text: symbol for abilities that require
            - button "tapping" [ref=e127] [cursor=pointer]
            - text: . At the start of your turn, the
            - button "untap step" [ref=e129] [cursor=pointer]
            - text: turns your
            - button "permanents" [ref=e131] [cursor=pointer]
            - text: upright again.
      - complementary "What is the stack?" [ref=e132]:
        - heading "What is the stack?" [level=2] [ref=e133]
        - paragraph [ref=e134]:
          - generic [ref=e135]:
            - text: When you
            - button "cast a spell" [ref=e137] [cursor=pointer]
            - text: (not a land), it goes on the
            - button "stack" [ref=e139] [cursor=pointer]
            - text: first. It is a waiting line where
            - button "spells" [ref=e141] [cursor=pointer]
            - text: and abilities sit before they happen.
        - paragraph [ref=e142]:
          - generic [ref=e143]:
            - text: If nothing is waiting, the
            - button "stack" [ref=e145] [cursor=pointer]
            - text: is empty. Sorceries and most other non-instant
            - button "spells" [ref=e147] [cursor=pointer]
            - button "can only be cast" [ref=e149] [cursor=pointer]
            - text: during your main phase when the
            - button "stack" [ref=e151] [cursor=pointer]
            - text: is empty. Instants
            - button "can be cast" [ref=e153] [cursor=pointer]
            - text: any time you have
            - button "priority" [ref=e155] [cursor=pointer]
            - text: ", even"
            - button "in response" [ref=e157] [cursor=pointer]
            - text: to something already on the
            - button "stack" [ref=e159] [cursor=pointer]
            - text: .
      - separator [ref=e160]
      - paragraph [ref=e161]:
        - generic [ref=e162]:
          - text: The two main phases are what trips most new players up. You get two windows
          - button "to cast" [ref=e164] [cursor=pointer]
          - button "spells" [ref=e166] [cursor=pointer]
          - text: (before and after combat), but only
          - button "one land per turn" [ref=e168] [cursor=pointer]
          - text: ", played in your first or second main phase, not one in each."
          - button "Lands are played" [ref=e170] [cursor=pointer]
          - text: ;
          - button "spells" [ref=e172] [cursor=pointer]
          - text: are cast.
          - button "Tapped" [ref=e174] [cursor=pointer]
          - text: cards
          - button "untap" [ref=e176] [cursor=pointer]
          - text: at the start of your turn. Sorceries need an empty
          - button "stack" [ref=e178] [cursor=pointer]
          - text: ; instants
          - button "can be cast" [ref=e180] [cursor=pointer]
          - text: any time you have
          - button "priority" [ref=e182] [cursor=pointer]
          - text: ", including"
          - button "in response" [ref=e184] [cursor=pointer]
          - text: to
          - button "spells" [ref=e186] [cursor=pointer]
          - text: on the
          - button "stack" [ref=e188] [cursor=pointer]
          - text: .
      - generic [ref=e189]:
        - button "Back to card types" [ref=e190] [cursor=pointer]
        - button "Continue to practice" [ref=e192] [cursor=pointer]
      - navigation "Lesson progress" [ref=e193]:
        - generic [ref=e194]: Step 10 of 15
  - complementary "Rules term help" [ref=e211]:
    - paragraph [ref=e212]:
      - text: Gold highlights mark official rules terms. Try
      - button "stack" [ref=e214] [cursor=pointer]
      - text: here, or tap any highlighted word in the lesson.
    - button "Dismiss rules term tip" [ref=e215] [cursor=pointer]: ×
  - button "Keyword guide" [active] [ref=e216] [cursor=pointer]
```

# Test source

```ts
  1  | const { expect } = require('@playwright/test')
  2  | 
  3  | const LESSON_READY_SESSION = {
  4  |   sessionId: 'E2ETESTSESSION1',
  5  |   sessionSecret: 'e2e-test-secret',
  6  |   participantId: null,
  7  |   participantRowReady: true,
  8  |   selectedQuestions: [],
  9  |   pretestAnswers: {},
  10 |   posttestAnswers: {},
  11 |   screenStartTimes: {},
  12 |   screenTimes: {},
  13 |   scenarioIdsAttempted: [],
  14 |   consentGiven: true,
  15 |   lessonsCompleted: false,
  16 |   pretestCompleted: true,
  17 |   posttestCompleted: false,
  18 |   curiosityFocus: null,
  19 |   posttestReadiness: null,
  20 | }
  21 | 
  22 | async function seedSession(page, session = LESSON_READY_SESSION) {
  23 |   await page.addInitScript((payload) => {
  24 |     sessionStorage.setItem('hci520-mtg-session', JSON.stringify(payload))
  25 |   }, session)
  26 | }
  27 | 
  28 | async function assertNoHorizontalOverflow(page) {
  29 |   const overflow = await page.evaluate(() => {
  30 |     const doc = document.documentElement
  31 |     return doc.scrollWidth > doc.clientWidth + 1
  32 |   })
> 33 |   expect(overflow).toBe(false)
     |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  34 | }
  35 | 
  36 | module.exports = {
  37 |   LESSON_READY_SESSION,
  38 |   seedSession,
  39 |   assertNoHorizontalOverflow,
  40 | }
  41 | 
```