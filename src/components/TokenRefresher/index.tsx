import { useEffect, useRef } from "react";
import { WEBLOGIN_URL } from "@/config";
import { useSessionStore } from "@/store/sessionStore";
import { useRefreshTokenMutation } from "@/query/mutations/useAuthMutations";

const REFRESH_EVERY_MS = 40 * 60 * 1000;

const TokenRefresher = () => {
  const token = useSessionStore((s) => s.token);
  const tokenType = useSessionStore((s) => s.tokenType);
  const user = useSessionStore((s) => s.user);
  const expiresAt = useSessionStore((s) => s.expiresAt);
  const setSession = useSessionStore((s) => s.setSession);
  const clearAppSession = useSessionStore((s) => s.clearAppSession);

  const refreshMutation = useRefreshTokenMutation();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!token) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = window.setInterval(async () => {
      try {
        const data = await refreshMutation.mutateAsync();

        if (data.refreshed === false) {
          setSession({
            token,
            tokenType: tokenType ?? "Bearer",
            expiresAt: data.expires_at ?? expiresAt ?? null,
            user,
          });
          return;
        }

        if (data.refreshed === true && data.access_token) {
          setSession({
            token: data.access_token,
            tokenType: data.token_type ?? "Bearer",
            expiresAt: data.expires_at ?? null,
            user,
          });
          return;
        }

        clearAppSession();
        window.location.href = WEBLOGIN_URL;
      } catch {
        clearAppSession();
        window.location.href = WEBLOGIN_URL;
      }
    }, REFRESH_EVERY_MS);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    token,
    tokenType,
    user,
    expiresAt,
    setSession,
    clearAppSession,
    refreshMutation,
  ]);

  return null;
};

export default TokenRefresher;