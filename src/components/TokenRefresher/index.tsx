import { useEffect, useRef } from "react";
import { WEBLOGIN_URL } from "@/config";
import { axios } from "@/utils/axios";
import { useSessionStore } from "@/store/sessionStore";

const REFRESH_EVERY_MS = 40 * 60 * 1000;

const TokenRefresher = () => {
  const token = useSessionStore((s) => s.token);
  const tokenType = useSessionStore((s) => s.tokenType);
  const user = useSessionStore((s) => s.user);
  const expiresAt = useSessionStore((s) => s.expiresAt);
  const setSession = useSessionStore((s) => s.setSession);
  const clearAppSession = useSessionStore((s) => s.clearAppSession);

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
        const response = await axios().post("refresh");
        const data = response.data ?? {};

        // no refrescó todavía, pero la sesión sigue válida
        if (data.refreshed === false) {
          setSession({
            token,
            tokenType: tokenType ?? "Bearer",
            expiresAt: data.expires_at ?? expiresAt ?? null,
            user,
          });
          return;
        }

        // refrescó y devolvió nuevo token
        if (data.refreshed === true && data.access_token) {
          setSession({
            token: data.access_token,
            tokenType: data.token_type ?? "Bearer",
            expiresAt: data.expires_at ?? null,
            user,
          });
          return;
        }

        // respuesta inesperada
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
  }, [token, tokenType, user, expiresAt, setSession, clearAppSession]);

  return null;
};

export default TokenRefresher;
//---------------------------------------------------------------------------

// import { WEBLOGIN_URL } from '@/config'
// import { UserContext } from '@/context/UserWrapper'
// import { axios } from '@/utils/axios'
// import { setStorage } from '@/utils/localStorage'
// import { useContext, useEffect } from 'react'

// const TokenRefresher = () => {
//   const { actions } = useContext(UserContext)

//   useEffect(() => {
//     if (actions.token() != null) {
//       const interval = setInterval(
//         async () => {
//           const response = await axios().post('auth', { type: 'refresh_token' })
//           const { data, error } = response.data

//           if (data && !error) {
//             actions.setStore(data)
//             setStorage(data)
//           }

//           if (error && !data) {
//             const KEY = window.location.origin as string
//             localStorage.removeItem(KEY)
//             window.location.href = WEBLOGIN_URL
//           }
//         },
//         40 * 60 * 1000
//       )

//       return () => clearInterval(interval)
//     }
//   }, [actions])

//   return null
// }

// export default TokenRefresher

//---------------------------------------------------------------------------

// import { WEBLOGIN_URL } from "@/config";
// import { UserContext } from "@/context/UserWrapper";
// import { axios } from "@/utils/axios";
// import { removeStore, setStorage } from "@/utils/localStorage";
// import { useContext, useEffect, useRef } from "react";

// const REFRESH_EVERY_MS = 40 * 60 * 1000;

// const TokenRefresher = () => {
//   const { actions } = useContext(UserContext);
//   const intervalRef = useRef<number | null>(null);

//   useEffect(() => {
//     const token = actions.token();
//     if (!token) return; // ✅ ACÁ

//     // evita duplicados
//     if (intervalRef.current) {
//       window.clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }

//     intervalRef.current = window.setInterval(async () => {
//       try {
//         const response = await axios().post("auth", { type: "refresh_token" });
//         const { data, error } = response.data ?? {};

//         if (data && !error) {
//           actions.setStore(data);
//           setStorage(data);
//           return;
//         }

//         if (error && !data) {
//           removeStore();
//           window.location.href = WEBLOGIN_URL;
//         }
//       } catch {
//         removeStore();
//         window.location.href = WEBLOGIN_URL;
//       }
//     }, REFRESH_EVERY_MS);

//     return () => {
//       if (intervalRef.current) {
//         window.clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     };
//   }, [actions]); // 

//   return null;
// };

// export default TokenRefresher;


