import { useEffect, useState } from 'react'

export default function QuestionCardImage({ src, alt = 'Magic card' }) {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [src])

  if (!src || error) {
    return <div className="pretest__image-slot">Card image</div>
  }

  return (
    <div className="pretest__image-slot">
      <img className="pretest__card-image" src={src} alt={alt} onError={() => setError(true)} />
    </div>
  )
}
