import { useState } from 'react'

function QuestionCardImageContent({ src, alt, layout }) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div
        className={`pretest__image-slot${
          layout === 'wide' ? ' pretest__image-slot--wide' : ''
        }`}
      >
        Card image
      </div>
    )
  }

  return (
    <div
      className={`pretest__image-slot${
        layout === 'wide' ? ' pretest__image-slot--wide' : ''
      }`}
    >
      <img
        className={`pretest__card-image${
          layout === 'wide' ? ' pretest__card-image--wide' : ''
        }`}
        src={src}
        alt={alt}
        onError={() => setError(true)}
      />
    </div>
  )
}

export default function QuestionCardImage({ src, alt = 'Magic card', layout = 'card' }) {
  return <QuestionCardImageContent key={src} src={src} alt={alt} layout={layout} />
}
