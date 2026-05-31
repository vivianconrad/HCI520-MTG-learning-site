import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useSessionStore from './store/useSessionStore.js'
import Welcome from './screens/Welcome.jsx'
import Intro from './screens/Intro.jsx'
import PreTest from './screens/PreTest.jsx'
import CardAnatomy from './screens/CardAnatomy.jsx'

function Placeholder({ label, session: _session }) {
  return <div>{label}</div>
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
        <Route path="/lesson/2" element={<Placeholder label="CardTypes" session={session} />} />
        <Route path="/lesson/3" element={<Placeholder label="TurnStructure" session={session} />} />
        <Route path="/lesson/4" element={<Placeholder label="PuttingItTogether" session={session} />} />
        <Route path="/posttest" element={<Placeholder label="PostTest" session={session} />} />
        <Route path="/results" element={<Placeholder label="Results" session={session} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
