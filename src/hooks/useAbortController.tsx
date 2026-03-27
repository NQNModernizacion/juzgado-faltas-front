import { useEffect, useRef } from 'react'

export const useAbortController = () => {
  const controllerRef = useRef(new AbortController())

  useEffect(() => {
    return () => {
      controllerRef.current.abort()
    }
  }, [])

  return controllerRef.current.signal
}
