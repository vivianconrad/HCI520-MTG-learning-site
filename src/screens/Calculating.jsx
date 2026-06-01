import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Calculating.css'

export default function Calculating({ session: _session }) {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/results')
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <div className="calculating">
      <div className="calculating__frame">
        <h1 className="calculating__heading" aria-live="polite">
          Calculating your results...
        </h1>
        <hr className="calculating__rule" aria-hidden="true" />
        <div className="calculating__dots" aria-hidden="true">
          <span className="calculating__dot calculating__dot--1" />
          <span className="calculating__dot calculating__dot--2" />
          <span className="calculating__dot calculating__dot--3" />
        </div>
        <p className="calculating__subtext">You will be redirected automatically.</p>
      </div>
    </div>
  )
}
