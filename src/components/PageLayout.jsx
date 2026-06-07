import KeywordDictionary from './KeywordDictionary.jsx'
import KeywordInlineHint from './KeywordInlineHint.jsx'
import GateNotice from './GateNotice.jsx'
import { isLessonKeywordRoute, shouldShowKeywordDictionary } from '../lib/assessmentRoutes.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useLocation } from 'react-router-dom'
import './PageLayout.css'

export default function PageLayout({ title, className, children, showKeywordDictionary = false }) {
  usePageTitle(title)
  const { pathname } = useLocation()
  const showKeywords = shouldShowKeywordDictionary(pathname, showKeywordDictionary)
  const lessonKeywords = showKeywords && isLessonKeywordRoute(pathname)

  const rootClassName = [
    className,
    showKeywords ? 'page-layout--with-keywords' : '',
    lessonKeywords ? 'page-layout--lesson-keywords' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div className={rootClassName}>
        <main id="main" tabIndex={-1}>
          <GateNotice />
          {children}
        </main>
      </div>
      {showKeywords ? (
        <>
          <KeywordInlineHint />
          <KeywordDictionary />
        </>
      ) : null}
    </>
  )
}
