import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfirmProvider } from './context/ConfirmContext.jsx'
import useSessionStore from './store/useSessionStore.js'
import Consent from './screens/Consent.jsx'
import Welcome from './screens/Welcome.jsx'
import Intro from './screens/Intro.jsx'
import PreTest from './screens/PreTest.jsx'
import PretestComplete from './screens/PretestComplete.jsx'
import LessonIntro from './screens/LessonIntro.jsx'
import CardAnatomy from './screens/CardAnatomy.jsx'
import CardTypes from './screens/CardTypes.jsx'
import TurnStructure from './screens/TurnStructure.jsx'
import PuttingItTogether from './screens/PuttingItTogether.jsx'
import LessonComplete from './screens/LessonComplete.jsx'
import PostTest from './screens/PostTest.jsx'
import WhatIsMtg from './screens/WhatIsMtg.jsx'
import Calculating from './screens/Calculating.jsx'
import Results from './screens/Results.jsx'

const InstructorDashboard = lazy(() => import('./screens/InstructorDashboard.jsx'))

function App() {
  const session = useSessionStore()

  return (
    <BrowserRouter basename="/HCI520-MTG-learning-site">
      <ConfirmProvider>
        <Routes>
          <Route path="/" element={<Consent />} />
          <Route path="/welcome" element={<Welcome session={session} />} />
          <Route path="/intro" element={<Intro session={session} />} />
          <Route path="/pretest" element={<PreTest session={session} />} />
          <Route path="/pretest-complete" element={<PretestComplete session={session} />} />
          <Route path="/what-is-mtg" element={<WhatIsMtg session={session} />} />
          <Route path="/lesson/intro" element={<LessonIntro session={session} />} />
          <Route path="/lesson/1" element={<CardAnatomy session={session} />} />
          <Route path="/lesson/2" element={<CardTypes session={session} />} />
          <Route path="/lesson/3" element={<TurnStructure session={session} />} />
          <Route path="/lesson/4" element={<PuttingItTogether session={session} />} />
          <Route path="/lesson/complete" element={<LessonComplete session={session} />} />
          <Route path="/posttest" element={<PostTest session={session} />} />
          <Route path="/calculating" element={<Calculating session={session} />} />
          <Route path="/results" element={<Results session={session} />} />
          <Route
            path="/instructor"
            element={
              <Suspense fallback={null}>
                <InstructorDashboard />
              </Suspense>
            }
          />
        </Routes>
      </ConfirmProvider>
    </BrowserRouter>
  )
}

export default App
