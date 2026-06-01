import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import './Calculating.css'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Calculating({ session: _session }) {
  const navigate = useNavigate()
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return undefined

    const timer = window.setTimeout(() => {
      navigate('/results')
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [navigate, reducedMotion])

  return (
    <PageLayout title="Calculating Results · Learn to Play MTG" className="calculating">
      <div className="calculating__frame">
        <h1 className="calculating__heading">Calculating your results...</h1>
        <hr className="calculating__rule" aria-hidden="true" />
        <div className="calculating__dots" aria-hidden="true">
          <span className="calculating__dot calculating__dot--1" />
          <span className="calculating__dot calculating__dot--2" />
          <span className="calculating__dot calculating__dot--3" />
        </div>
        {reducedMotion ? (
          <>
            <p className="calculating__subtext">
              Animations are reduced on your device. Continue when you are ready.
            </p>
            <button
              type="button"
              className="calculating__continue"
              onClick={() => navigate('/results')}
            >
              View results
            </button>
          </>
        ) : (
          <p className="calculating__subtext" aria-live="polite">
            You will be redirected automatically.
          </p>
        )}
        <ProgressDots activeIndex={PROGRESS.CALCULATING} />
      </div>
    </PageLayout>
  )
}
