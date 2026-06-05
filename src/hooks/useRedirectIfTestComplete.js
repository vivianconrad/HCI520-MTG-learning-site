import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useRedirectIfTestComplete(completed, redirectPath) {
  const navigate = useNavigate()

  useEffect(() => {
    if (completed) {
      navigate(redirectPath, { replace: true })
    }
  }, [completed, redirectPath, navigate])
}
