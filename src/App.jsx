import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useSessionStore from './store/useSessionStore.js'
import Welcome from './screens/Welcome.jsx'
import Intro from './screens/Intro.jsx'
import PreTest from './screens/PreTest.jsx'
import LessonIntro from './screens/LessonIntro.jsx'
import CardAnatomy from './screens/CardAnatomy.jsx'
import CardTypes from './screens/CardTypes.jsx'
import TurnStructure from './screens/TurnStructure.jsx'
import PuttingItTogether from './screens/PuttingItTogether.jsx'
import LessonComplete from './screens/LessonComplete.jsx'
import PostTest from './screens/PostTest.jsx'
import Calculating from './screens/Calculating.jsx'
import Results from './screens/Results.jsx'
import InstructorDashboard from './screens/InstructorDashboard.jsx'

function App() {
  const session = useSessionStore()

  return (
    <BrowserRouter basename="/HCI520-MTG-learning-site">
      <Routes>
        <Route path="/" element={<Welcome session={session} />} />
        <Route path="/intro" element={<Intro session={session} />} />
        <Route path="/pretest" element={<PreTest session={session} />} />
        <Route path="/lesson/intro" element={<LessonIntro session={session} />} />
        <Route path="/lesson/1" element={<CardAnatomy session={session} />} />
        <Route path="/lesson/2" element={<CardTypes session={session} />} />
        <Route path="/lesson/3" element={<TurnStructure session={session} />} />
        <Route path="/lesson/4" element={<PuttingItTogether session={session} />} />
        <Route path="/lesson/complete" element={<LessonComplete session={session} />} />
        <Route path="/posttest" element={<PostTest session={session} />} />
        <Route path="/calculating" element={<Calculating session={session} />} />
        <Route path="/results" element={<Results session={session} />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
