import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useSessionStore from './store/useSessionStore.js'
import ProgressDots, { PROGRESS } from './components/ProgressDots.jsx'
import Welcome from './screens/Welcome.jsx'
import Intro from './screens/Intro.jsx'
import PreTest from './screens/PreTest.jsx'
import CardAnatomy from './screens/CardAnatomy.jsx'
import CardTypes from './screens/CardTypes.jsx'
import TurnStructure from './screens/TurnStructure.jsx'
import PuttingItTogether from './screens/PuttingItTogether.jsx'
import LessonComplete from './screens/LessonComplete.jsx'
import './screens/Welcome.css'

function Placeholder({ label, session: _session }) {
  return <div>{label}</div>
}

function PostTestPlaceholder({ session }) {
  void session

  return (
    <div className="welcome">
      <div className="welcome__frame">
        <p>PostTest</p>
        <ProgressDots activeIndex={PROGRESS.POSTTEST} />
      </div>
    </div>
  )
}

function App() {
  const session = useSessionStore()

  return (
    <BrowserRouter basename="/HCI520-MTG-learning-site">
      <Routes>
        <Route path="/" element={<Welcome session={session} />} />
        <Route path="/intro" element={<Intro session={session} />} />
        <Route path="/pretest" element={<PreTest session={session} />} />
        <Route path="/lesson/1" element={<CardAnatomy session={session} />} />
        <Route path="/lesson/2" element={<CardTypes session={session} />} />
        <Route path="/lesson/3" element={<TurnStructure session={session} />} />
        <Route path="/lesson/4" element={<PuttingItTogether session={session} />} />
        <Route path="/lesson/complete" element={<LessonComplete session={session} />} />
        <Route path="/posttest" element={<PostTestPlaceholder session={session} />} />
        <Route path="/results" element={<Placeholder label="Results" session={session} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
