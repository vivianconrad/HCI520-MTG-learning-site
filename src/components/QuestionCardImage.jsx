import { useState } from 'react'

const CARD_DIMENSIONS = { width: 160, height: 224 }
const WIDE_DIMENSIONS = { width: 420, height: 263 }

function QuestionCardImageContent({ src, alt, layout }) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const isWide = layout === 'wide'
  const dimensions = isWide ? WIDE_DIMENSIONS : CARD_DIMENSIONS
  const slotClass = `pretest__image-slot${isWide ? ' pretest__image-slot--wide' : ''}`

  if (!src || error) {
    return (
      <div className={slotClass}>
        {alt || 'Card image unavailable'}
      </div>
    )
  }

  return (
    <div className={slotClass}>
      {!loaded && <span className="pretest__image-shimmer" aria-hidden="true" />}
      <img
        className={`pretest__card-image${isWide ? ' pretest__card-image--wide' : ''}${
          loaded ? '' : ' pretest__card-image--loading'
        }`}
        src={src}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}

export default function QuestionCardImage({ src, alt = 'Magic card', layout = 'card' }) {
  return <QuestionCardImageContent key={src} src={src} alt={alt} layout={layout} />
}
