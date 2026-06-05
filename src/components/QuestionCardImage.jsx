import { useEffect, useState } from 'react'

export default function QuestionCardImage({ src, alt = 'Magic card', layout = 'card' }) {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [src])

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
