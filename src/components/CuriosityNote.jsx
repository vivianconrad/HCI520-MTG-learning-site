import './CuriosityNote.css'

export default function CuriosityNote({ text }) {
  if (!text) return null

  return (
    <p className="curiosity-note" role="status">
      {text}
    </p>
  )
}
