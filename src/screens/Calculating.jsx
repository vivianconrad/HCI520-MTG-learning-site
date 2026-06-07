import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BrowserBackNotice from '../components/BrowserBackNotice.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import { useBlockBrowserBack } from '../hooks/useBlockBrowserBack.js'
import './Calculating.css'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Calculating() {
  const navigate = useNavigate()
  const location = useLocation()
  const screenTimeWarning = location.state?.screenTimeWarning === true
  useBlockBrowserBack()
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
      navigate('/results', { replace: true })
    }, 900)

    return () => window.clearTimeout(timer)
  }, [navigate, reducedMotion])

  return (
    <PageLayout title="Calculating Results · Learn to Play MTG" className="calculating">
      <div className="calculating__frame">
        <BrowserBackNotice />
        <h1 className="calculating__heading">Calculating your results...</h1>
        <hr className="calculating__rule" aria-hidden="true" />
        {screenTimeWarning ? (
          <p className="calculating__subtext" role="status" aria-live="polite">
            Your timing data may not have saved. The results page will try again.
          </p>
        ) : null}
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
              onClick={() => navigate('/results', { replace: true })}
            >
              View results
            </button>
          </>
        ) : (
          <p className="calculating__subtext" aria-live="polite">
            Redirecting shortly.
          </p>
        )}
        <ProgressDots activeIndex={PROGRESS.CALCULATING} stepLabel="Calculating" />
      </div>
    </PageLayout>
  )
}
