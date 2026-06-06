import KeywordDictionary from './KeywordDictionary.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import './PageLayout.css'

export default function PageLayout({ title, className, children, showKeywordDictionary = false }) {
  usePageTitle(title)

  const rootClassName = [className, showKeywordDictionary ? 'page-layout--with-keywords' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div className={rootClassName}>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </div>
      {showKeywordDictionary ? <KeywordDictionary /> : null}
    </>
  )
}
