import { useEffect } from 'react'

export default function useScreenTime(session, screenName) {
  const { recordScreenEnter, recordScreenExit } = session

  useEffect(() => {
    recordScreenEnter(screenName)
    return () => recordScreenExit(screenName)
  }, [screenName, recordScreenEnter, recordScreenExit])
}
