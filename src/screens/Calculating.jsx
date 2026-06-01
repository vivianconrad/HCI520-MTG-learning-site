import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Calculating.css'

export default function Calculating({ session }) {
  void session
  const navigate = useNavigate()
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowButton(true)
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="calculating">
      <div className="calculating__frame">
        <h1 className="calculating__heading">Calculating your results...</h1>
        <hr className="calculating__rule" aria-hidden="true" />
        <div className="calculating__dots" aria-hidden="true">
          <span className="calculating__dot calculating__dot--1" />
          <span className="calculating__dot calculating__dot--2" />
          <span className="calculating__dot calculating__dot--3" />
        </div>
        <button
          type="button"
          className={`calculating__button${showButton ? ' calculating__button--visible' : ''}`}
          disabled={!showButton}
          onClick={() => navigate('/results')}
        >
          See My Results →
        </button>
      </div>
    </div>
  )
}
