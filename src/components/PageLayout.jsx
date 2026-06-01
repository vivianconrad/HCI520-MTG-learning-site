import { usePageTitle } from '../hooks/usePageTitle.js'
import './PageLayout.css'

export default function PageLayout({ title, className, children }) {
  usePageTitle(title)

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div className={className}>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </>
  )
}
