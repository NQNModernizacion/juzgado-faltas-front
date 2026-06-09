import { useEffect, useRef } from 'react'
import { WEBLOGIN_URL } from '@/config'
import { useSessionStore } from '@/store/sessionStore'
import { useRefreshTokenMutation } from '@/query/mutations/useAuthMutations'
import { useQueryClient } from '@tanstack/react-query'

const CHECK_INTERVAL_MS = 1 * 60 * 1000
const REFRESH_THRESHOLD_SECONDS = 4 * 60 // El backend exige que falten < 5 min para aceptar el refresh.

const TokenRefresher = () => {
  const token = useSessionStore((s) => s.token)
  const tokenType = useSessionStore((s) => s.tokenType)
  const user = useSessionStore((s) => s.user)
  const expiresAt = useSessionStore((s) => s.expiresAt)
  const setSession = useSessionStore((s) => s.setSession)
  const clearAppSession = useSessionStore((s) => s.clearAppSession)

  const { mutateAsync: refreshToken } = useRefreshTokenMutation()
  const qc = useQueryClient()
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!token) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    intervalRef.current = window.setInterval(async () => {
      try {
        if (expiresAt) {
          // Normalize date string for Safari compatibility if it's not ISO
          const normalizedDate = expiresAt.replace(' ', 'T')
          const expiresTime = new Date(normalizedDate).getTime()
          const secondsLeftLocal = (expiresTime - Date.now()) / 1000

          if (secondsLeftLocal > REFRESH_THRESHOLD_SECONDS) {
            return
          }
        } else {
          // If there is no expiresAt, do not spam the refresh endpoint every minute.
          return
        }

        const data = await refreshToken()

        if (data.refreshed === false) {
          setSession({
            token,
            tokenType: tokenType ?? 'Bearer',
            expiresAt: data.expires_at ?? expiresAt ?? null,
            user,
          })
          return
        }

        if (data.refreshed === true && data.token) {
          setSession({
            token: data.token,
            tokenType: data.token_type ?? 'Bearer',
            expiresAt: data.expires_at ?? null,
            user,
          })
          qc.invalidateQueries({ queryKey: ['auth'] })
          return
        }

        clearAppSession()
        window.location.href = WEBLOGIN_URL
      } catch {
        clearAppSession()
        window.location.href = WEBLOGIN_URL
      }
    }, CHECK_INTERVAL_MS)

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [
    token,
    tokenType,
    user,
    expiresAt,
    setSession,
    clearAppSession,
    refreshToken,
    qc,
  ])

  return null
}

export default TokenRefresher
