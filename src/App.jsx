import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfirmProvider } from './context/ConfirmContext.jsx'
import RequireSessionStep from './components/RequireSessionStep.jsx'
import useSessionStore from './store/useSessionStore.js'
import Consent from './screens/Consent.jsx'

const Welcome = lazy(() => import('./screens/Welcome.jsx'))
const Intro = lazy(() => import('./screens/Intro.jsx'))
const PreTest = lazy(() => import('./screens/PreTest.jsx'))
const PretestComplete = lazy(() => import('./screens/PretestComplete.jsx'))
const WhatIsMtg = lazy(() => import('./screens/WhatIsMtg.jsx'))
const LessonIntro = lazy(() => import('./screens/LessonIntro.jsx'))
const CardAnatomy = lazy(() => import('./screens/CardAnatomy.jsx'))
const CardTypes = lazy(() => import('./screens/CardTypes.jsx'))
const TurnStructure = lazy(() => import('./screens/TurnStructure.jsx'))
const PuttingItTogether = lazy(() => import('./screens/PuttingItTogether.jsx'))
const LessonComplete = lazy(() => import('./screens/LessonComplete.jsx'))
const PostTest = lazy(() => import('./screens/PostTest.jsx'))
const Calculating = lazy(() => import('./screens/Calculating.jsx'))
const Results = lazy(() => import('./screens/Results.jsx'))
const InstructorDashboard = lazy(() => import('./screens/InstructorDashboard.jsx'))

function RouteFallback() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <main id="main" tabIndex={-1}>
        <p className="route-fallback" aria-live="polite">
          Loading…
        </p>
      </main>
    </>
  )
}

function GuardedRoute({
  session,
  require,
  redirectIfPretestComplete,
  redirectIfPosttestComplete,
  element,
}) {
  return (
    <RequireSessionStep
      session={session}
      require={require}
      redirectIfPretestComplete={redirectIfPretestComplete}
      redirectIfPosttestComplete={redirectIfPosttestComplete}
    >
      {element}
    </RequireSessionStep>
  )
}

function App() {
  const session = useSessionStore()

  return (
    <BrowserRouter basename="/HCI520-MTG-learning-site">
      <ConfirmProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Consent session={session} />} />
            <Route
              path="/welcome"
              element={
                <GuardedRoute
                  session={session}
                  require="consent"
                  element={<Welcome session={session} />}
                />
              }
            />
            <Route
              path="/intro"
              element={
                <GuardedRoute
                  session={session}
                  require="consent"
                  redirectIfPretestComplete
                  element={<Intro session={session} />}
                />
              }
            />
            <Route
              path="/pretest"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'questions', 'rowReady']}
                  redirectIfPretestComplete
                  element={<PreTest session={session} />}
                />
              }
            />
            <Route
              path="/pretest-complete"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'pretest']}
                  element={<PretestComplete session={session} />}
                />
              }
            />
            <Route
              path="/what-is-mtg"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'pretest']}
                  element={<WhatIsMtg session={session} />}
                />
              }
            />
            <Route
              path="/lesson/intro"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'pretest']}
                  element={<LessonIntro session={session} />}
                />
              }
            />
            <Route
              path="/lesson/1"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'pretest']}
                  element={<CardAnatomy session={session} />}
                />
              }
            />
            <Route
              path="/lesson/2"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'pretest']}
                  element={<CardTypes session={session} />}
                />
              }
            />
            <Route
              path="/lesson/3"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'pretest']}
                  element={<TurnStructure session={session} />}
                />
              }
            />
            <Route
              path="/lesson/4"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'pretest']}
                  element={<PuttingItTogether session={session} />}
                />
              }
            />
            <Route
              path="/lesson/complete"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'rowReady', 'pretest']}
                  redirectIfPosttestComplete
                  element={<LessonComplete session={session} />}
                />
              }
            />
            <Route
              path="/posttest"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'rowReady', 'lessons']}
                  redirectIfPosttestComplete
                  element={<PostTest session={session} />}
                />
              }
            />
            <Route
              path="/calculating"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'posttest']}
                  redirectIfPosttestComplete
                  element={<Calculating />}
                />
              }
            />
            <Route
              path="/results"
              element={
                <GuardedRoute
                  session={session}
                  require={['consent', 'posttest']}
                  element={<Results session={session} />}
                />
              }
            />
            <Route path="/instructor" element={<InstructorDashboard />} />
          </Routes>
        </Suspense>
      </ConfirmProvider>
    </BrowserRouter>
  )
}

export default App
